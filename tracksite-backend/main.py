# main.py

from typing import List
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import models
import schemas
import crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from pathlib import Path
from pydantic import BaseModel
import uuid

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tracksite API", version="1.0.0")

# Create upload directories
UPLOAD_DIR = Path("uploads")
FILES_DIR = UPLOAD_DIR / "files"
APPLICATIONS_DIR = UPLOAD_DIR / "applications"

# Ensure directories exist
UPLOAD_DIR.mkdir(exist_ok=True)
FILES_DIR.mkdir(exist_ok=True)
APPLICATIONS_DIR.mkdir(exist_ok=True)

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Tracksite API"}

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

@app.get("/folders/{folder_id}", response_model=schemas.Folder)
def read_folder(folder_id: int, db: Session = Depends(get_db)):
    folder = crud.get_folder(db, folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder

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

@app.get("/bookmarks/{bookmark_id}", response_model=schemas.Bookmark)
def read_bookmark(bookmark_id: int, db: Session = Depends(get_db)):
    bookmark = crud.get_bookmark(db, bookmark_id)
    if bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return bookmark

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

@app.put("/bookmarks/{bookmark_id}", response_model=schemas.Bookmark)
def update_bookmark(bookmark_id: int, bookmark: schemas.BookmarkCreate, db: Session = Depends(get_db)):
    db_bookmark = crud.update_bookmark(db, bookmark_id, bookmark)
    if db_bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return db_bookmark

@app.delete("/bookmarks/{bookmark_id}", response_model=schemas.Bookmark)
def delete_bookmark(bookmark_id: int, db: Session = Depends(get_db)):
    db_bookmark = crud.delete_bookmark(db, bookmark_id)
    if db_bookmark is None:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return db_bookmark

# File upload endpoints
@app.post("/upload/file/")
async def upload_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    folder_id: int = Form(None)
):
    """Upload a file and create a bookmark for it"""
    try:
        # Generate unique filename to avoid conflicts
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        
        # Save file
        file_path = FILES_DIR / unique_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create bookmark with file:// URL
        file_url = f"file://{file_path.absolute()}"
        
        # Create bookmark in database
        bookmark_data = schemas.BookmarkCreate(
            title=title,
            url=file_url,
            folder_id=folder_id
        )
        
        db = next(get_db())
        db_bookmark = crud.create_bookmark(db=db, bookmark=bookmark_data)
        
        return {
            "message": "File uploaded successfully",
            "bookmark": db_bookmark,
            "file_path": str(file_path),
            "original_filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.post("/upload/application/")
async def upload_application(
    app_file: UploadFile = File(...),
    title: str = Form(...),
    folder_id: int = Form(None)
):
    """Upload an application and create a bookmark for it"""
    try:
        # Generate unique filename to avoid conflicts
        file_extension = Path(app_file.filename).suffix
        unique_filename = f"{uuid.uuid4()}_{app_file.filename}"
        
        # Save application
        app_path = APPLICATIONS_DIR / unique_filename
        with open(app_path, "wb") as buffer:
            shutil.copyfileobj(app_file.file, buffer)
        
        # Make executable on Unix systems
        os.chmod(app_path, 0o755)
        
        # Create bookmark with app:// URL
        app_url = f"app://{app_path.absolute()}"
        
        # Create bookmark in database
        bookmark_data = schemas.BookmarkCreate(
            title=title,
            url=app_url,
            folder_id=folder_id
        )
        
        db = next(get_db())
        db_bookmark = crud.create_bookmark(db=db, bookmark=bookmark_data)
        
        return {
            "message": "Application uploaded successfully",
            "bookmark": db_bookmark,
            "app_path": str(app_path),
            "original_filename": app_file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application upload failed: {str(e)}")

@app.get("/files/{filename}")
async def download_file(filename: str):
    """Download a file"""
    file_path = FILES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Extract original filename from the stored filename
    original_filename = filename.split('_', 1)[1] if '_' in filename else filename
    
    return FileResponse(file_path, filename=original_filename)

@app.get("/applications/{filename}")
async def download_application(filename: str):
    """Download an application"""
    app_path = APPLICATIONS_DIR / filename
    if not app_path.exists():
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Extract original filename from the stored filename
    original_filename = filename.split('_', 1)[1] if '_' in filename else filename
    
    return FileResponse(app_path, filename=original_filename)

@app.post("/open/file/{filename}")
async def open_file(filename: str):
    """Open a file with the system default application"""
    file_path = FILES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Open file with system default application
        if os.name == 'nt':  # Windows
            os.startfile(str(file_path))
        else:  # macOS/Linux
            os.system(f'open "{file_path}"')
        return {"success": True, "message": f"Opening file: {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to open file: {str(e)}")

@app.post("/open/application/{filename}")
async def open_application(filename: str):
    """Execute an application"""
    app_path = APPLICATIONS_DIR / filename
    if not app_path.exists():
        raise HTTPException(status_code=404, detail="Application not found")
    
    try:
        # Execute application
        if os.name == 'nt':  # Windows
            os.startfile(str(app_path))
        else:  # macOS/Linux
            os.system(f'"{app_path}" &')
        return {"success": True, "message": f"Launching application: {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to launch application: {str(e)}")

class FilePathRequest(BaseModel):
    file_path: str

class AppPathRequest(BaseModel):
    app_path: str

@app.post("/open/file-by-path/")
async def open_file_by_path(request: FilePathRequest):
    """Open a file by its full path with the system default application"""
    try:
        file_path = request.file_path
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Open file with system default application
        if os.name == 'nt':  # Windows
            os.startfile(file_path)
        else:  # macOS/Linux
            os.system(f'open "{file_path}"')
        return {"success": True, "message": f"Opening file: {file_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to open file: {str(e)}")

@app.post("/open/application-by-path/")
async def open_application_by_path(request: AppPathRequest):
    """Execute an application by its full path"""
    try:
        app_path = request.app_path
        if not os.path.exists(app_path):
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Execute application
        if os.name == 'nt':  # Windows
            os.startfile(app_path)
        else:  # macOS/Linux
            os.system(f'"{app_path}" &')
        return {"success": True, "message": f"Launching application: {app_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to launch application: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
