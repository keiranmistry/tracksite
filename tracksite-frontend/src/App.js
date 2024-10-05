
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './about.js';
import Home from './Home.js';
import Login from './login.js';
import logo from './tracksitelogo.png';
import App from './tracksite.js';

function Track() {
  return (
    <Router>
      <div className="App">
        <header className="Top">
          <div className="wrapper">
            <Link to="/" className="logo-link">
              <img src={logo} alt="Logo" className="logo" />
              <span>Tracksite</span> 
            </Link>

 
            <nav className="nav-links">
              <Link to="/App" className="nav-link">Folders</Link>
              <div className="empty-container"></div>
              <Link to="/about" className="nav-link">About</Link>
              <div className="empty-container"></div>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/App" element={<App />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Track;