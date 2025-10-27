from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from typing import Annotated, List
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

import models, schemas, crud
from database import engine, SessionLocal
from embeddings import get_embedding
import os
import time

# --- Configuration ---
app = FastAPI(title="TravelLens Backend")

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"  
]

production_origin = os.getenv("FRONTEND_URL")

if production_origin:
    DEFAULT_ALLOWED_ORIGINS.append(production_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Database Dependency =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

MAX_DB_RETRIES = 5
RETRY_DELAY = 5 

for attempt in range(MAX_DB_RETRIES):
    try:
        print("Attempting to connect to database and create tables...")
        models.Base.metadata.create_all(bind=engine)
        print("Database connection and table check successful.")
        break  # Exit loop on success
    except Exception as e:
        if attempt < MAX_DB_RETRIES - 1:
            print(f"Database connection failed (Attempt {attempt + 1}/{MAX_DB_RETRIES}). Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY)
        else:
            print("Database connection failed after all retries. Exiting.")
            raise e 

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

    query_embedding = None
    try:
        query_embedding = get_embedding(tmp_path)
        results = crud.search_similar(db, query_embedding.tolist(), k=top_k)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed (Embedding or DB search): {e}")
    
    finally:
        # Clean up temporary file regardless of success or failure
        if os.path.exists(tmp_path):
            os.remove(tmp_path) 

    # === Group results by label for clean frontend display ===
    grouped = defaultdict(list)
    for r in results:
        # Only take the image_path and distance for the final output
        grouped[r["label"]].append({"path": r["image_path"], "distance": r.get("distance", None)})

    # Format response: [{"label": "Landmark", "images": [{"path": url, "distance": val}, ...]}, ...]
    grouped_results = [{"label": label, "images": paths} for label, paths in grouped.items()]

    return {"results": grouped_results}


# ===== Upload Endpoint =====
@app.post("/upload/")
async def upload(
    files: List[UploadFile] = File(...), 
    label: str = Form(...), 
    db: Session = Depends(get_db)
):
    image_urls = []
    
    for file in files:
        tmp_path = f"temp_{file.filename}"
        
        # Save temporarily
        try:
            with open(tmp_path, "wb") as f:
                f.write(await file.read())
            
            # 1. Generate embedding
            embedding = get_embedding(tmp_path)

            # 2. Upload to Supabase Storage (Assumes crud.upload_image_to_supabase handles this)
            image_url = crud.upload_image_to_supabase(tmp_path, folder=label)

            # 3. Insert into PostgreSQL DB
            crud.insert_image(db, label=label, image_path=image_url, embedding=embedding)
            
            # 4. Collect URL
            image_urls.append(image_url)

        except Exception as e:
            # Reraise a clean HTTPException if any step fails
            raise HTTPException(status_code=500, detail=f"Upload processing failed for {file.filename}: {e}")
        
        finally:
            # Clean up the temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path) 

    return {"label": label, "uploaded_count": len(image_urls), "images_path": image_urls}


# ===== Retrieval Endpoints (Read Only) =====

@app.get("/AllImages/")
def get_all_images(db: db_dependency):
    images = db.query(models.Images).all()

    grouped = defaultdict(list)
    for img in images:
        grouped[img.label].append(img.image_path)

    result = [{"label": label, "images": imgs} for label, imgs in grouped.items()]
    return result

@app.get("/LabelsSummary/")
def get_labels_summary(db: db_dependency):
    images = db.query(models.Images).all()

    label_counts = defaultdict(int)
    for img in images:
        label_counts[img.label] += 1

    result = [
        {"label": label, "count": count}
        for label, count in label_counts.items()
    ]

    result.sort(key=lambda x: x["label"])
    return {"total_labels": len(result), "summary": result}