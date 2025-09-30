from database import Base
from sqlalchemy import Column, Integer, String
from pgvector.sqlalchemy import Vector

class Images(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, index=True, nullable=False)
    image_path = Column(String, unique=True, index=True, nullable=False)
    embedding = Column(Vector(2048), nullable=False)