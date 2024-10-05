
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './tracksite.css';


function App() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [bookmarkData, setBookmarkData] = useState({ title: '', url: '', folder_id: null });

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
      const response = await axios.get('http://localhost:8000/folders/');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchAllBookmarks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/bookmarks/');
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const fetchBookmarks = async (folder_id) => {
    try {
      const response = await axios.get(`http://localhost:8000/folders/${folder_id}/bookmarks/`);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/folders/', { name: folderName });
      setFolderName('');
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleBookmarkSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/bookmarks/${id}`);
      if (selectedFolder) {
        fetchBookmarks(selectedFolder.id);
      } else {
        fetchAllBookmarks();
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/folders/${id}`);
      if (selectedFolder && selectedFolder.id === id) {
        setSelectedFolder(null);
      }
      fetchFolders();
      fetchAllBookmarks();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  return (
   <header className="App-header">
  <h2>Bookmark Manager with Folders</h2>
  <div className="App">
    <div className="folders-section">
      <h2>Folders</h2>
      <form onSubmit={handleFolderSubmit}>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          required
        />
        <button type="submit">Create Folder</button>
      </form>
      <ul>
        <li
          onClick={() => setSelectedFolder(null)}
          style={{ fontWeight: selectedFolder === null ? 600 : 'normal', cursor: 'pointer', fontSize: '20px' }}
        >
          All Bookmarks
        </li>
        {folders.map((folder) => (
          <li
            key={folder.id}
            onClick={() => setSelectedFolder(folder)}
            style={{
              fontWeight: selectedFolder && selectedFolder.id === folder.id ? 'bold' : 'normal',
              cursor: 'pointer', fontSize: '18px',
            }}
          >
            {folder.name}
            <button className="delete" onClick={() => handleDeleteFolder(folder.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>

    <div className="bookmarks-section">
      <h2>{selectedFolder ? `Bookmarks in "${selectedFolder.name}"` : 'All Bookmarks'}</h2>
      <form onSubmit={handleBookmarkSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={bookmarkData.title}
          onChange={(e) => setBookmarkData({ ...bookmarkData, title: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={bookmarkData.url}
          onChange={(e) => setBookmarkData({ ...bookmarkData, url: e.target.value })}
          required
        />
        <button type="submit">Add Bookmark</button>
      </form>
      <ul>
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                {bookmark.title}
              </a>
              <button className="delete" onClick={() => handleDeleteBookmark(bookmark.id)}>Delete</button>
            </li>
          ))
        ) : (
          <div className="empty-state">No bookmarks found. Start by adding one!</div>
        )}
      </ul>
    </div>
  </div>
</header>

  );
}

export default App;
