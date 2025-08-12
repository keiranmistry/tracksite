# crud.py

from sqlalchemy.orm import Session
import models, schemas

def get_folder(db: Session, folder_id: int):
    return db.query(models.Folder).filter(models.Folder.id == folder_id).first()

def get_folder_by_name(db: Session, name: str):
    return db.query(models.Folder).filter(models.Folder.name == name).first()

def get_folders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Folder).offset(skip).limit(limit).all()

def create_folder(db: Session, folder: schemas.FolderCreate):
    db_folder = models.Folder(name=folder.name)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

def delete_folder(db: Session, folder_id: int):
    db_folder = get_folder(db, folder_id)
    if db_folder:
        db.delete(db_folder)
        db.commit()
    return db_folder

# Bookmark operations
def get_bookmark(db: Session, bookmark_id: int):
    return db.query(models.Bookmark).filter(models.Bookmark.id == bookmark_id).first()

def get_bookmarks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Bookmark).offset(skip).limit(limit).all()

def create_bookmark(db: Session, bookmark: schemas.BookmarkCreate):
    db_bookmark = models.Bookmark(title=bookmark.title, url=bookmark.url, folder_id=bookmark.folder_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

def update_bookmark(db: Session, bookmark_id: int, bookmark: schemas.BookmarkCreate):
    db_bookmark = get_bookmark(db, bookmark_id)
    if db_bookmark:
        db_bookmark.title = bookmark.title
        db_bookmark.url = bookmark.url
        db_bookmark.folder_id = bookmark.folder_id
        db.commit()
        db.refresh(db_bookmark)
    return db_bookmark

def delete_bookmark(db: Session, bookmark_id: int):
    db_bookmark = get_bookmark(db, bookmark_id)
    if db_bookmark:
        db.delete(db_bookmark)
        db.commit()
    return db_bookmark

def get_bookmarks_by_folder(db: Session, folder_id: int):
    return db.query(models.Bookmark).filter(models.Bookmark.folder_id == folder_id).all()
