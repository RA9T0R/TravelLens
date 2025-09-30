# load_dataset.py
import os
from sqlalchemy.orm import Session
from database import SessionLocal
from embeddings import get_embedding
import crud

# ===== Dataset path =====
dataset_path = "../models/Google_Images/train"

# ===== Start DB session =====
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
        try:
            url = crud.upload_image_to_supabase(fpath, folder)
        except Exception as e:
            print(f"Failed to upload {fpath}: {e}")
            continue

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