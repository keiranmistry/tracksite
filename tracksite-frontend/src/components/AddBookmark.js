// components/AddBookmark.js
import React, { useState } from 'react';
import axios from '../api';

function AddBookmark() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    await axios.post('/bookmarks/', { url, title });
    setUrl('');
    setTitle('');
  };

  return (
    <form onSubmit={handleAddBookmark}>
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add Bookmark</button>
    </form>
  );
}

export default AddBookmark;
