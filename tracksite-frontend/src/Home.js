import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [folders, setFolders] = useState([]);
  const [allBookmarks, setAllBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foldersResponse, bookmarksResponse] = await Promise.all([
        axios.get('http://localhost:8000/folders/'),
        axios.get('http://localhost:8000/bookmarks/')
      ]);
      
      setFolders(foldersResponse.data);
      setAllBookmarks(bookmarksResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkClick = async (bookmark) => {
    if (bookmark.url.startsWith('file://')) {
      // For file bookmarks, open the file by path
      try {
        const filePath = bookmark.url.replace('file://', '');
        const response = await axios.post('http://localhost:8000/open/file-by-path/', {
          file_path: filePath
        });
        if (response.data.success) {
          console.log('File opened successfully');
        }
      } catch (error) {
        console.error('Error opening file:', error);
        alert('Failed to open file');
      }
    } else if (bookmark.url.startsWith('app://')) {
      // For application bookmarks, open the application by path
      try {
        const appPath = bookmark.url.replace('app://', '');
        const response = await axios.post('http://localhost:8000/open/application-by-path/', {
          app_path: appPath
        });
        if (response.data.success) {
          console.log('Application opened successfully');
        }
      } catch (error) {
        console.error('Error opening application:', error);
        alert('Failed to open application');
      }
    } else {
      // For regular URLs, open in new tab
      window.open(bookmark.url, '_blank');
    }
  };

  const getBookmarkIcon = (bookmark) => {
    if (bookmark.url.startsWith('file://')) {
      return '📁';
    } else if (bookmark.url.startsWith('app://')) {
      return '⚙️';
    } else {
      return '🔗';
    }
  };

  const getBookmarkType = (bookmark) => {
    if (bookmark.url.startsWith('file://')) {
      return 'File';
    } else if (bookmark.url.startsWith('app://')) {
      return 'Application';
    } else {
      return 'Website';
    }
  };

  const getBookmarksInFolder = (folderId) => {
    return allBookmarks.filter(bookmark => bookmark.folder_id === folderId);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to Tracksite</h1>
        <p>Your personal bookmark manager</p>
      </div>
      
      <div className="folders-showcase">
        <h2>Folders & Bookmarks</h2>
        
        {folders.length === 0 ? (
          <div className="empty-state">
            <p>No folders yet. Go to the Edit tab to create some!</p>
          </div>
        ) : (
          <div className="folders-grid">
            {folders.map((folder) => {
              const folderBookmarks = getBookmarksInFolder(folder.id);
              return (
                <div key={folder.id} className="folder-card">
                  <div className="folder-header">
                    <h3 className="folder-title">📁 {folder.name}</h3>
                    <span className="bookmark-count">{folderBookmarks.length} bookmark{folderBookmarks.length !== 1 ? 's' : ''}</span>
                  </div>
                  
                  {folderBookmarks.length > 0 ? (
                    <div className="bookmarks-list">
                      {folderBookmarks.map((bookmark) => (
                        <div 
                          key={bookmark.id} 
                          className="bookmark-item"
                          onClick={() => handleBookmarkClick(bookmark)}
                        >
                          <div className="bookmark-icon">
                            {getBookmarkIcon(bookmark)}
                          </div>
                          <div className="bookmark-info">
                            <h4 className="bookmark-title">{bookmark.title}</h4>
                            <p className="bookmark-type">{getBookmarkType(bookmark)}</p>
                            {bookmark.url.startsWith('file://') || bookmark.url.startsWith('app://') ? (
                              <p className="bookmark-path">{bookmark.url.replace('file://', '').replace('app://', '')}</p>
                            ) : (
                              <p className="bookmark-url">{bookmark.url}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-folder">
                      <p>No bookmarks in this folder</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Show bookmarks not in any folder */}
        {(() => {
          const unassignedBookmarks = allBookmarks.filter(bookmark => !bookmark.folder_id);
          if (unassignedBookmarks.length > 0) {
            return (
              <div className="unassigned-section">
                <h3>Unassigned Bookmarks</h3>
                <div className="bookmarks-grid">
                  {unassignedBookmarks.map((bookmark) => (
                    <div 
                      key={bookmark.id} 
                      className="bookmark-card"
                      onClick={() => handleBookmarkClick(bookmark)}
                    >
                      <div className="bookmark-icon">
                        {getBookmarkIcon(bookmark)}
                      </div>
                      <div className="bookmark-info">
                        <h3 className="bookmark-title">{bookmark.title}</h3>
                        <p className="bookmark-type">{getBookmarkType(bookmark)}</p>
                        {bookmark.url.startsWith('file://') || bookmark.url.startsWith('app://') ? (
                          <p className="bookmark-path">{bookmark.url.replace('file://', '').replace('app://', '')}</p>
                        ) : (
                          <p className="bookmark-url">{bookmark.url}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}

export default Home;

