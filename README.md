Download and create change the sql to fit yours
SQL:
CREATE DATABASE tracksite_db;
SHOW DATABASES;
CREATE USER 'tracksite_user'@'localhost' IDENTIFIED BY 123;
GRANT ALL PRIVILEGES ON tracksite_db.* TO 'tracksite_user'@'localhost';
FLUSH PRIVILEGES;

USE tracksite_db;

CREATE TABLE folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    type VARCHAR(50) DEFAULT 'url',
    folder_id INT,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

![image alt] (https://github.com/joeyhlu/tracksite/blob/main/Screenshot%202024-10-05%20at%204.42.15%20PM.png?raw=true)
