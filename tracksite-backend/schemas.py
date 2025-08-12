# schemas.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BookmarkBase(BaseModel):
    title: str
    url: str

class BookmarkCreate(BookmarkBase):
    folder_id: Optional[int] = None

class Bookmark(BookmarkBase):
    id: int
    folder_id: Optional[int]
    created_at: datetime

    class Config:
         from_attributes = True

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: int
    created_at: datetime
    bookmarks: List[Bookmark] = []

    class Config:
        from_attributes = True
