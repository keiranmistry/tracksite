import React from 'react';
import './tracksite.css';
import './about.js';
import './Home.js';
import './login.js';
import {useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/App'); 
  };

  return (
      <header className="App-header">
        <div className="maintext">
          <p>Bookmarking your Favourite</p>
          <p>Apps and Sites made Effortless</p>
        </div>
        <div className="button-container">
          <button type="button" id="continueBtn" onClick={handleLoginClick}>
            Begin
          </button>
        </div>
      </header>
     
  );
  
};


export default Home;

