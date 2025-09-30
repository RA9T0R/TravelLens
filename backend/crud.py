from sqlalchemy.orm import Session
from sqlalchemy import text
from models import Images

# Insert new image record
def insert_image(db, label: str, image_path: str, embedding):
    if hasattr(embedding, "tolist"):
        embedding = embedding.tolist()
    if len(embedding) != 2048:
        raise ValueError(f"Embedding must be length 2048, got {len(embedding)}")

    db_image = Images(label=label, image_path=image_path, embedding=embedding)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def search_similar(db: Session, query_embedding: list, k: int = 5):
    query_vector_str = "[" + ",".join(map(str, query_embedding)) + "]"

    sql = text(f"""
    SELECT label, image_path
    FROM images
    ORDER BY embedding <-> '{query_vector_str}'::vector
    LIMIT :k
    """)

    result = db.execute(sql, {"k": k}).fetchall()
    return [{"label": r[0], "image_path": r[1]} for r in result]


