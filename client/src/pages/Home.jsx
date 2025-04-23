import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // New CSS file we'll create

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to EventThon 🎉</h1>
        <p className="home-description">
          Discover, host, and participate in amazing tech and non-tech events around the country. <br />
          Whether you're a coder, designer, innovator, or enthusiast — there's something for everyone.
        </p>
        <button className="home-button" onClick={() => navigate('/events')}>
          Find Events
        </button>
      </div>
    </div>
  );
};

export default Home;
