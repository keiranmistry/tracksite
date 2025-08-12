-- Tracksite Database Setup Script
-- Run this script in your MySQL client to set up the database

-- Create the database
CREATE DATABASE IF NOT EXISTS tracksite_db;
USE tracksite_db;

-- Create the folders table
CREATE TABLE IF NOT EXISTS folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    folder_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_folders_name ON folders(name);
CREATE INDEX idx_bookmarks_url ON bookmarks(url);
CREATE INDEX idx_bookmarks_folder ON bookmarks(folder_id);

-- Insert some sample data (optional)
INSERT INTO folders (name) VALUES 
    ('Work'),
    ('Personal'),
    ('Learning'),
    ('Entertainment')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO bookmarks (title, url, folder_id) VALUES 
    ('GitHub', 'https://github.com', 1),
    ('Stack Overflow', 'https://stackoverflow.com', 1),
    ('YouTube', 'https://youtube.com', 4),
    ('React Documentation', 'https://react.dev', 3)
ON DUPLICATE KEY UPDATE title = title;

-- Show the created tables
SHOW TABLES;

-- Show sample data
SELECT 'Folders:' as info;
SELECT * FROM folders;

SELECT 'Bookmarks:' as info;
SELECT b.*, f.name as folder_name 
FROM bookmarks b 
LEFT JOIN folders f ON b.folder_id = f.id;
