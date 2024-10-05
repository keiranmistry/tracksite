# main.py

from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/folders/", response_model=schemas.Folder)
def create_folder(folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    db_folder = crud.get_folder_by_name(db, name=folder.name)
    if db_folder:
        raise HTTPException(status_code=400, detail="Folder already exists")
    return crud.create_folder(db=db, folder=folder)

@app.get("/folders/", response_model=List[schemas.Folder])
def read_folders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    folders = crud.get_folders(db, skip=skip, limit=limit)
    return folders

@app.delete("/folders/{folder_id}", response_model=schemas.Folder)
def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    db_folder = crud.delete_folder(db, folder_id)
    if db_folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return db_folder


@app.get("/bookmarks/", response_model=List[schemas.Bookmark])
def read_bookmarks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bookmarks = crud.get_bookmarks(db, skip=skip, limit=limit)
    return bookmarks

@app.get("/folders/{folder_id}/bookmarks/", response_model=List[schemas.Bookmark])
def read_bookmarks_by_folder(folder_id: int, db: Session = Depends(get_db)):
    bookmarks = crud.get_bookmarks_by_folder(db, folder_id=folder_id)
    return bookmarks

@app.post("/bookmarks/", response_model=schemas.Bookmark)
def create_bookmark(bookmark: schemas.BookmarkCreate, db: Session = Depends(get_db)):
    
    if bookmark.folder_id:
        folder = crud.get_folder(db, folder_id=bookmark.folder_id)
        if folder is None:
            raise HTTPException(status_code=400, detail="Folder not found")
    db_bookmark = crud.create_bookmark(db=db, bookmark=bookmark)
    return db_bookmark

@app.delete("/bookmarks/{bookmark_id}", response_model=schemas.Bookmark)
def delete_bookmark(bookmark_id: int, db: Session = Depends(get_db)):
    db_bookmark = crud.delete_bookmark(db, bookmark_id)
    if db_bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return db_bookmark
