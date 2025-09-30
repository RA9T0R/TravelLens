from pydantic import BaseModel
from typing import List

class ImageResponse(BaseModel):
    label: str
    image_path: str

class SearchResult(BaseModel):
    results: List[ImageResponse]