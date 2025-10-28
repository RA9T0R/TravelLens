import numpy as np
import certifi 
import os
from numpy.linalg import norm
from sqlalchemy.orm import Session
from sqlalchemy import text
from models import Images
from supabase import create_client

from dotenv import load_dotenv
load_dotenv()

# ===== Supabase config =====
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ===== Fix SSL issue on Windows =====
os.environ["SSL_CERT_FILE"] = certifi.where()

# ===== Supabase client =====
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
BUCKET_NAME = "Images"

# ===== Insert new image record into DB =====
def insert_image(db: Session, label: str, image_path: str, embedding):
    existing = db.query(Images).filter_by(image_path=image_path).first()
    if existing:
        print(f"Image already exists in DB: {image_path}")
        return existing

    if hasattr(embedding, "tolist"):
        embedding = embedding.tolist()
    if len(embedding) != 2048:
        raise ValueError(f"Embedding must be length 2048, got {len(embedding)}")

    db_image = Images(label=label, image_path=image_path, embedding=embedding)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


# ===== Search similar images in DB =====
def search_similar(db: Session, query_embedding: list, k: int = 5):
    query_embedding = np.array(query_embedding)
    query_embedding = query_embedding / norm(query_embedding)
    query_vector_str = "[" + ",".join(map(str, query_embedding)) + "]"
    sql = text(f"""
        SELECT label, image_path
        FROM images
        ORDER BY embedding <-> '{query_vector_str}'::vector
        LIMIT :k
    """)
    result = db.execute(sql, {"k": k}).fetchall()
    return [{"label": r[0], "image_path": r[1]} for r in result]

# ===== Upload file to Supabase bucket =====
def upload_image_to_supabase(local_path: str, folder: str):
    fname = os.path.basename(local_path)
    remote_path = f"{folder}/{fname}"
    try:
        with open(local_path, "rb") as f:
            supabase.storage.from_(BUCKET_NAME).upload(remote_path, f, {"upsert": "true"})
    except Exception as e:
        raise RuntimeError(f"Failed to upload {local_path} to Supabase: {e}")

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(remote_path)
    url = public_url['publicUrl'] if isinstance(public_url, dict) else public_url
    return url
