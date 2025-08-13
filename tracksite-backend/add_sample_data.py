#!/usr/bin/env python3
"""
Script to add sample data to the database for screenshots and demonstration
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models
import crud
import schemas
import uuid

def add_sample_data():
    """Add sample folders, bookmarks, and file/app uploads to the database"""
    
    db = SessionLocal()
    
    try:
        print("Adding sample data to database...")
        
        # Create sample folders
        folders_data = [
            "Work Projects",
            "Personal Documents", 
            "Development Tools",
            "Reference Materials"
        ]
        
        created_folders = []
        for folder_name in folders_data:
            folder = crud.get_folder_by_name(db, folder_name)
            if not folder:
                folder = crud.create_folder(db, schemas.FolderCreate(name=folder_name))
                print(f"Created folder: {folder.name}")
            created_folders.append(folder)
        
        # Create sample URL bookmarks
        url_bookmarks = [
            {"title": "GitHub", "url": "https://github.com", "folder_id": created_folders[2].id},
            {"title": "Stack Overflow", "url": "https://stackoverflow.com", "folder_id": created_folders[2].id},
            {"title": "MDN Web Docs", "url": "https://developer.mozilla.org", "folder_id": created_folders[3].id},
            {"title": "Google Drive", "url": "https://drive.google.com", "folder_id": created_folders[1].id},
            {"title": "Notion", "url": "https://notion.so", "folder_id": created_folders[0].id},
            {"title": "Figma", "url": "https://figma.com", "folder_id": created_folders[0].id},
            {"title": "Slack", "url": "https://slack.com", "folder_id": created_folders[0].id},
            {"title": "Trello", "url": "https://trello.com", "folder_id": created_folders[0].id}
        ]
        
        for bookmark_data in url_bookmarks:
            bookmark = crud.create_bookmark(db, schemas.BookmarkCreate(**bookmark_data))
            print(f"Created URL bookmark: {bookmark.title}")
        
        # Create sample file bookmarks
        files_dir = Path("uploads/files")
        if files_dir.exists():
            sample_files = [
                "sample_document.pdf",
                "sample_spreadsheet.xlsx", 
                "sample_presentation.pptx"
            ]
            
            for filename in sample_files:
                file_path = files_dir / filename
                if file_path.exists():
                    # Create unique filename for database
                    unique_filename = f"{uuid.uuid4()}_{filename}"
                    file_url = f"file://{file_path.absolute()}"
                    
                    # Determine folder based on file type
                    if "document" in filename:
                        folder_id = created_folders[1].id
                    elif "spreadsheet" in filename:
                        folder_id = created_folders[0].id
                    else:
                        folder_id = created_folders[0].id
                    
                    bookmark_data = schemas.BookmarkCreate(
                        title=filename.replace("sample_", "").replace(".", " ").title(),
                        url=file_url,
                        folder_id=folder_id
                    )
                    
                    bookmark = crud.create_bookmark(db, bookmark_data)
                    print(f"Created file bookmark: {bookmark.title}")
        
        # Create sample application bookmarks
        apps_dir = Path("uploads/applications")
        if apps_dir.exists():
            sample_apps = [
                "sample_app.sh",
                "utility_tool.sh"
            ]
            
            for filename in sample_apps:
                app_path = apps_dir / filename
                if app_path.exists():
                    # Create unique filename for database
                    unique_filename = f"{uuid.uuid4()}_{filename}"
                    app_url = f"app://{app_path.absolute()}"
                    
                    bookmark_data = schemas.BookmarkCreate(
                        title=filename.replace("_", " ").replace(".sh", "").title(),
                        url=app_url,
                        folder_id=created_folders[2].id
                    )
                    
                    bookmark = crud.create_bookmark(db, bookmark_data)
                    print(f"Created app bookmark: {bookmark.title}")
        
        # Create some unassigned bookmarks for variety
        unassigned_bookmarks = [
            {"title": "Quick Notes", "url": "https://notes.google.com"},
            {"title": "Weather", "url": "https://weather.com"},
            {"title": "News", "url": "https://news.ycombinator.com"}
        ]
        
        for bookmark_data in unassigned_bookmarks:
            bookmark = crud.create_bookmark(db, schemas.BookmarkCreate(**bookmark_data))
            print(f"Created unassigned bookmark: {bookmark.title}")
        
        print("\n✅ Sample data added successfully!")
        print(f"Created {len(created_folders)} folders")
        print(f"Created {len(url_bookmarks)} URL bookmarks")
        print(f"Created file and app bookmarks")
        print(f"Created {len(unassigned_bookmarks)} unassigned bookmarks")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_data()
