import React, { useState } from 'react';
import './tracksite.css';

const Login = () => {
   
        const [files, setFiles] = useState([]);
        const [fileURLs, setFileURLs] = useState([]);
      
      
        const handleFileChange = (event) => {
          const selectedFiles = [...event.target.files];
          setFiles(selectedFiles);
      
        
          const fileUrls = selectedFiles.map(file => URL.createObjectURL(file));
          setFileURLs(fileUrls);
        };
      
        
        const handleDrop = (event) => {
          event.preventDefault();
          const droppedFiles = [...event.dataTransfer.files];
          setFiles(droppedFiles);
      
          
          const fileUrls = droppedFiles.map(file => URL.createObjectURL(file));
          setFileURLs(fileUrls);
        };
      
       
        const handleDragOver = (event) => {
          event.preventDefault();
        };
      
       
        const renderFilePreview = (file, fileUrl) => {
          const fileType = file.type;
      
         
          if (fileType.startsWith('image/')) {
            return <img src={fileUrl} alt={file.name} style={{ maxWidth: '300px', margin: '10px' }} />;
          }
      
         
          if (fileType === 'application/pdf') {
            return (
              <iframe
                src={fileUrl}
                title={file.name}
                style={{ width: '100%', height: '500px', margin: '10px' }}
              />
            );
          }
      
          if (fileType === 'text/plain') {
            return (
              <iframe
                src={fileUrl}
                title={file.name}
                style={{ width: '100%', height: '500px', margin: '10px' }}
              />
            );
          }
      
       
          return <p>Cannot preview {file.name}</p>;
        };
      
        return (
          <div>
            <header className="login-header">
            <h1>Upload Files</h1>
      
            
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: '20px' }}
            />
      
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                width: '300px',
                height: '200px',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <p>Drag & Drop Files Here</p>
            </div>
      
           
            <div>
              <h3>Selected Files:</h3>
              <ul>
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))
                ) : (
                  <p>No files selected</p>
                )}
              </ul>
            </div>
      
          
            <div>
              <h3>File Preview:</h3>
              {fileURLs.map((fileUrl, index) => (
                <div key={index}>
                  {renderFilePreview(files[index], fileUrl)}
                </div>
              ))}
            </div>
            </header>
          </div>
          
      );
      };
    
    export default Login;
    