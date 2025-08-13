# models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Folder(Base):
    __tablename__ = 'folders'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    bookmarks = relationship("Bookmark", back_populates="folder", cascade="all, delete")

class Bookmark(Base):
    __tablename__ = 'bookmarks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    url = Column(String(255), index=True)  # Removed unique constraint
    folder_id = Column(Integer, ForeignKey('folders.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    folder = relationship("Folder", back_populates="bookmarks")
