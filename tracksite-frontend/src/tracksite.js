
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './tracksite.css';

function App() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [bookmarkData, setBookmarkData] = useState({ title: '', url: '', folder_id: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadType, setUploadType] = useState('url'); // 'url', 'file', 'application'
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [filePath, setFilePath] = useState('');
  const [appPath, setAppPath] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchBookmarks(selectedFolder.id);
    } else {
      fetchAllBookmarks();
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/folders/');
      setFolders(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError('Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/bookmarks/');
      setBookmarks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async (folder_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/folders/${folder_id}/bookmarks/`);
      setBookmarks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/folders/', { name: folderName.trim() });
      setFolderName('');
      fetchFolders();
      setError('');
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkSubmit = async (e) => {
    e.preventDefault();
    if (!bookmarkData.title.trim() || !bookmarkData.url.trim()) return;
    
    try {
      setLoading(true);
      const data = {
        ...bookmarkData,
        folder_id: selectedFolder ? selectedFolder.id : null,
      };
      await axios.post('http://localhost:8000/bookmarks/', data);
      setBookmarkData({ title: '', url: '', folder_id: null });
      if (selectedFolder) {
        fetchBookmarks(selectedFolder.id);
      } else {
        fetchAllBookmarks();
      }
      setError('');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      setError('Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    
    try {
      setLoading(true);
      let bookmarkData;
      
      if (uploadType === 'file') {
        if (uploadFile) {
          // File upload
          const formData = new FormData();
          formData.append('file', uploadFile);
          formData.append('title', uploadTitle.trim());
          if (selectedFolder) {
            formData.append('folder_id', selectedFolder.id);
          }
          
          await axios.post('http://localhost:8000/upload/file/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else if (filePath.trim()) {
          // File path input
          bookmarkData = {
            title: uploadTitle.trim(),
            url: `file://${filePath.trim()}`,
            folder_id: selectedFolder ? selectedFolder.id : null,
          };
          await axios.post('http://localhost:8000/bookmarks/', bookmarkData);
        } else {
          setError('Please either upload a file or enter a file path');
          setLoading(false);
          return;
        }
      } else if (uploadType === 'application') {
        if (uploadFile) {
          // Application upload
          const formData = new FormData();
          formData.append('app_file', uploadFile);
          formData.append('title', uploadTitle.trim());
          if (selectedFolder) {
            formData.append('folder_id', selectedFolder.id);
          }
          
          await axios.post('http://localhost:8000/upload/application/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else if (appPath.trim()) {
          // Application path input
          bookmarkData = {
            title: uploadTitle.trim(),
            url: `app://${appPath.trim()}`,
            folder_id: selectedFolder ? selectedFolder.id : null,
          };
          await axios.post('http://localhost:8000/bookmarks/', bookmarkData);
        } else {
          setError('Please either upload an application or enter an application path');
          setLoading(false);
          return;
        }
      }
      
      setUploadTitle('');
      setUploadFile(null);
      setFilePath('');
      setAppPath('');
      setUploadType('url');
      
      if (selectedFolder) {
        fetchBookmarks(selectedFolder.id);
      } else {
        fetchAllBookmarks();
      }
      setError('');
    } catch (error) {
      console.error('Error uploading:', error);
      setError('Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBookmark = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/bookmarks/${id}`);
      if (selectedFolder) {
        fetchBookmarks(selectedFolder.id);
      } else {
        fetchAllBookmarks();
      }
      setError('');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      setError('Failed to delete bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this folder? All bookmarks in it will also be deleted.')) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/folders/${id}`);
      if (selectedFolder && selectedFolder.id === id) {
        setSelectedFolder(null);
      }
      fetchFolders();
      fetchAllBookmarks();
      setError('');
    } catch (error) {
      console.error('Error deleting folder:', error);
      setError('Failed to delete folder');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkClick = async (bookmark) => {
    try {
      if (bookmark.url.startsWith('file://')) {
        // Extract filename from file:// URL
        const filename = bookmark.url.split('/').pop();
        await axios.post(`http://localhost:8000/open/file/${filename}`);
      } else if (bookmark.url.startsWith('app://')) {
        // Extract filename from app:// URL
        const filename = bookmark.url.split('/').pop();
        await axios.post(`http://localhost:8000/open/application/${filename}`);
      } else {
        // Regular URL - open in new tab
        window.open(bookmark.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening bookmark:', error);
      setError('Failed to open bookmark');
    }
  };

  const isSelected = (folder) => {
    if (!selectedFolder && !folder) return true;
    if (selectedFolder && folder && selectedFolder.id === folder.id) return true;
    return false;
  };

  const getBookmarkIcon = (bookmark) => {
    if (bookmark.url.startsWith('file://')) {
      return '📄';
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
      return 'URL';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Edit Bookmarks & Folders</h2>
      </header>
      
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      <div className="folders-section">
        <h2>Folders</h2>
        <form onSubmit={handleFolderSubmit}>
          <input
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Folder'}
          </button>
        </form>
        
        <ul>
          <li
            className={`all-bookmarks ${isSelected(null) ? 'selected' : ''}`}
            onClick={() => setSelectedFolder(null)}
          >
            📚 All Bookmarks
          </li>
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={isSelected(folder) ? 'selected' : ''}
              onClick={() => setSelectedFolder(folder)}
            >
              📁 {folder.name}
              <button 
                className="delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.id);
                }}
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bookmarks-section">
        <h2>
          {selectedFolder ? `Bookmarks in "${selectedFolder.name}"` : 'All Bookmarks'}
        </h2>
        
        <div className="upload-type-selector">
          <label>
            <input
              type="radio"
              name="uploadType"
              value="url"
              checked={uploadType === 'url'}
              onChange={(e) => setUploadType(e.target.value)}
            />
            Website URL
          </label>
          <label>
            <input
              type="radio"
              name="uploadType"
              value="file"
              checked={uploadType === 'file'}
              onChange={(e) => setUploadType(e.target.value)}
            />
            File
          </label>
          <label>
            <input
              type="radio"
              name="uploadType"
              value="application"
              checked={uploadType === 'application'}
              onChange={(e) => setUploadType(e.target.value)}
            />
            Application
          </label>
        </div>

        <input
          type="text"
          placeholder="Enter bookmark title"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          required
          disabled={loading}
        />

        {uploadType === 'url' && (
          <input
            type="url"
            placeholder="Enter website URL"
            value={bookmarkData.url}
            onChange={(e) => setBookmarkData({ ...bookmarkData, url: e.target.value })}
            required
          />
        )}

        {uploadType === 'file' && (
          <div className="file-input-group">
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files[0])}
              accept="*/*"
            />
            <p className="or-divider">OR</p>
            <input
              type="text"
              placeholder="Enter file path (e.g., /path/to/file.pdf)"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
            />
          </div>
        )}

        {uploadType === 'application' && (
          <div className="file-input-group">
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files[0])}
              accept="*/*"
            />
            <p className="or-divider">OR</p>
            <input
              type="text"
              placeholder="Enter application path (e.g., /Applications/App.app)"
              value={appPath}
              onChange={(e) => setAppPath(e.target.value)}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading...
          </div>
        ) : bookmarks.length > 0 ? (
          <ul>
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id} onClick={() => handleBookmarkClick(bookmark)}>
                <div className="bookmark-content">
                  <span className="bookmark-icon">{getBookmarkIcon(bookmark)}</span>
                  <div className="bookmark-info">
                    <div className="bookmark-title">
                      {bookmark.title}
                    </div>
                    <div className="bookmark-type">
                      {getBookmarkType(bookmark)}
                    </div>
                  </div>
                </div>
                <button 
                  className="delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBookmark(bookmark.id);
                  }}
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            No bookmarks found. Start by adding one!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
