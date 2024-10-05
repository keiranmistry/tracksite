// components/BookmarkList.js
import React, { useState, useEffect } from 'react';
import axios from '../api';

function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const response = await axios.get('/bookmarks/');
    setBookmarks(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/bookmarks/${id}`);
    fetchBookmarks();
  };

  return (
    <ul>
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            {bookmark.title}
          </a>
          <button onClick={() => handleDelete(bookmark.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default BookmarkList;
