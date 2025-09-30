# load_dataset.py
import os
import numpy as np
from supabase import create_client
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal

import crud
from database import SessionLocal
from embeddings import get_embedding

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

bucket_name = "Images"

dataset_path = "../models/Google_Images/train"

db: Session = SessionLocal()

for folder in os.listdir(dataset_path):
    folder_path = os.path.join(dataset_path, folder)
    if not os.path.isdir(folder_path):
        continue

    print(f"Processing folder: {folder}")
    for fname in os.listdir(folder_path):
        fpath = os.path.join(folder_path, fname)
        if not fname.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        # ---- Upload to Supabase bucket ----
        remote_path = f"{folder}/{fname}"  # path inside bucket
        try:
            with open(fpath, "rb") as f:
                supabase.storage.from_(bucket_name).upload(remote_path, f, {"upsert": "true"})
        except Exception as e:
            print(f"Failed to upload {fpath}: {e}")
            continue

        # ---- Get public URL ----
        public_url = supabase.storage.from_(bucket_name).get_public_url(remote_path)
        url = public_url['publicUrl'] if isinstance(public_url, dict) else public_url

        # ---- Generate embedding ----
        try:
            embedding = get_embedding(fpath)
        except Exception as e:
            print(f"Failed to get embedding for {fpath}: {e}")
            continue

        # ---- Insert into DB ----
        try:
            crud.insert_image(db, label=folder, image_path=url, embedding=embedding.tolist())
        except Exception as e:
            print(f"Failed to insert into DB: {e}")
            continue

        print(f"Inserted: {folder}/{fname}")

db.close()
print("All images processed!")