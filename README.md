# Tracksite - Modern Bookmark Manager

A beautiful, modern bookmark management application built with FastAPI backend and React frontend. Organize your bookmarks into folders with an intuitive and responsive interface.

## ✨ Features

- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **Folder Organization**: Create and manage bookmark folders
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and loading states
- **Error Handling**: Comprehensive error handling and user feedback
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL database

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd tracksite-backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database:**
   - Create a database named `tracksite_db`
   - Create a user `tracksite_user` with password `123`
   - Or update the connection string in `database.py`

5. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd tracksite-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation
- **MySQL**: Database backend
- **CORS**: Cross-origin resource sharing

### Frontend (React)
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Modern styling with gradients and animations

## 📁 API Endpoints

### Folders
- `GET /folders/` - List all folders
- `POST /folders/` - Create a new folder
- `GET /folders/{id}` - Get folder details
- `DELETE /folders/{id}` - Delete a folder

### Bookmarks
- `GET /bookmarks/` - List all bookmarks
- `POST /bookmarks/` - Create a new bookmark
- `GET /bookmarks/{id}` - Get bookmark details
- `PUT /bookmarks/{id}` - Update a bookmark
- `DELETE /bookmarks/{id}` - Delete a bookmark
- `GET /folders/{id}/bookmarks/` - Get bookmarks in a folder

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach
- **Modern Typography**: Inter font family for readability
- **Icon Integration**: Emoji icons for visual appeal

## 🔧 Configuration

### Database Configuration
Update the database connection in `tracksite-backend/database.py`:

```python
DATABASE_URL = "mysql+pymysql://username:password@localhost/database_name"
```

### CORS Configuration
Update allowed origins in `tracksite-backend/main.py` if needed:

```python
origins = [
    "http://localhost:3000",
    "http://yourdomain.com"
]
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile interface

## 🚀 Deployment

### Backend Deployment
1. Set up a production MySQL database
2. Update database connection string
3. Use a production ASGI server like Gunicorn
4. Set up environment variables for sensitive data

### Frontend Deployment
1. Build the production version: `npm run build`
2. Serve the `build` folder with a web server
3. Update API endpoints for production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that both backend and frontend are running

## 🔮 Future Enhancements

- User authentication and accounts
- Bookmark tags and search
- Import/export functionality
- Browser extension integration
- Dark/light theme toggle
- Bookmark sharing
- Analytics and insights
