from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

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
@app.post("/predict/", response_model=schemas.SearchResult)
async def predict(file: UploadFile = File(...), top_k: int = 5, db: Session = Depends(get_db)):
    tmp_path = f"temp_{file.filename}"

    # Save uploaded file temporarily
    with open(tmp_path, "wb") as f:
        f.write(await file.read())

    # Generate embedding
    try:
        query_embedding = get_embedding(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get embedding: {e}")

    # Search similar images
    try:
        results = crud.search_similar(db, query_embedding.tolist(), k=top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB search failed: {e}")
    finally:
        os.remove(tmp_path)  # Clean up temporary file

    # Convert dict results to Pydantic models
    return {"results": [schemas.ImageResponse(**r) for r in results]}