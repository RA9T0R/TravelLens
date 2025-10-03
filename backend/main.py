from fastapi import FastAPI, UploadFile, File,Form, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

import models, schemas, crud
from database import engine, SessionLocal
from embeddings import get_embedding
import os

app = FastAPI(title="TravelLens Backend")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Database =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine)

# ===== Predict Endpoint =====
@app.post("/predict/")
async def predict(
    file: UploadFile = File(...), 
    top_k: int = Form(...),
    db: Session = Depends(get_db)
):
    tmp_path = f"temp_{file.filename}"

    # Save uploaded file temporarily
    with open(tmp_path, "wb") as f:
        f.write(await file.read())

    # Generate embedding
    try:
        query_embedding = get_embedding(tmp_path)
    except Exception as e:
        os.remove(tmp_path)
        raise HTTPException(status_code=500, detail=f"Failed to get embedding: {e}")

    # Search similar images
    try:
        results = crud.search_similar(db, query_embedding.tolist(), k=top_k)
    except Exception as e:
        os.remove(tmp_path)
        raise HTTPException(status_code=500, detail=f"DB search failed: {e}")
    finally:
        os.remove(tmp_path)  # Clean up temporary file

    # === Group results by label ===
    grouped = defaultdict(list)
    for r in results:
        grouped[r["label"]].append(r["image_path"])

    # Format response
    grouped_results = [{"label": label, "images": paths} for label, paths in grouped.items()]

    return {"results": grouped_results}

@app.post("/upload/")
async def upload(
    files: list[UploadFile] = File(...),   # multiple files
    label: str = Form(...),                # one label for all
    db: Session = Depends(get_db)
):
    image_urls = []

    for file in files:
        tmp_path = f"temp_{file.filename}"
        
        # Save temporarily
        with open(tmp_path, "wb") as f:
            f.write(await file.read())

        # Generate embedding
        try:
            embedding = get_embedding(tmp_path)
        except Exception as e:
            os.remove(tmp_path)
            raise HTTPException(status_code=500, detail=f"Embedding failed: {e}")

        # Upload to Supabase
        try:
            image_url = crud.upload_image_to_supabase(tmp_path, folder=label)
        except Exception as e:
            os.remove(tmp_path)
            raise HTTPException(status_code=500, detail=f"Upload failed: {e}")

        # Insert into DB
        try:
            crud.insert_image(db, label=label, image_path=image_url, embedding=embedding)
        except Exception as e:
            os.remove(tmp_path)
            raise HTTPException(status_code=500, detail=f"DB insert failed: {e}")
        finally:
            os.remove(tmp_path)

        # Collect image URL
        image_urls.append(image_url)

    return {"label": label, "images_path": image_urls}


@app.get("/AllImages/")
def get_all_images(db: db_dependency):
    images = db.query(models.Images).all()

    grouped = defaultdict(list)
    for img in images:
        grouped[img.label].append(img.image_path)

    return grouped