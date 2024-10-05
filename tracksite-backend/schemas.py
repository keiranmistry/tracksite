# schemas.py

from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class BookmarkBase(BaseModel):
    title: str
    url: HttpUrl

class BookmarkCreate(BookmarkBase):
    folder_id: Optional[int] = None

class Bookmark(BookmarkBase):
    id: int
    folder_id: Optional[int]

    class Config:
         from_attributes = True

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: int
    bookmarks: List[Bookmark] = []

    class Config:
        from_attributes = True
