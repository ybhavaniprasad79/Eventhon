import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Logo from '../assets/logo.png';
import Search from '../assets/icons/search';
import Triangle from '../assets/icons/triangle';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  let userRole = '';
  let userEmail = '';
  let userName = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.name;
      userRole = decoded.role;
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  return (
    <div className="navbar-container">
                <div className="navbar-top">
            <div style={{ display: 'flex',marginLeft:'100px' }}>
              <img src={Logo} alt="Eventhon" className="navbar-logo" />
              <h2 className="navbar-title">Eventhon</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '500px' }}>
              <div className="navbar-search-container">
                <input placeholder="Search for Clash" />
                <Search />
              </div>

              {token && (
                <div className="navbar-profile-wrapper">
                  <div
                    className="navbar-profile-icon"
                    style={{ display: 'flex',marginRight:'200px' }}
                    onClick={() => setShowDropdown(prev => !prev)}
                  >
                    👤
                  </div>
                  <div
                    ref={dropdownRef}
                    className={`dropdown-anim-container ${showDropdown ? 'open' : ''}`}
                  >
                    <div className="navbar-dropdown">
                      <p className="navbar-dropdown-header">User Info</p>
                      <p className="navbar-dropdown-text">Name: {userName}</p>
                      <p className="navbar-dropdown-text">Email: {userEmail}</p>
                      <p className="navbar-dropdown-text">Role: {userRole && userRole[0]}</p>
                      <button onClick={handleLogout} className="navbar-logout-button">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


      <div className="navbar-bottom">
        <Triangle rotate="scaleX(-1)" />
        <div className="navbar-links">
          <Link to="/"><h3>Home</h3></Link>
          <Link to="/events"><h3>All Events</h3></Link>
          {
            token && (
              <Link to="/registered-events"><h3>Registered Events</h3></Link>
            )
          }

          {userRole && userRole.includes('Organizer') && (
            <>
              <Link to="/host-event"><h3>Host Event</h3></Link>
              <Link to="/my-events"><h3>My Events</h3></Link>
              <Link to="/host-Scholarship"><h3>Host Scholarship</h3></Link>
              <Link to="/my-Scholarship"><h3>My Scholarship</h3></Link>
            </>
          )}

          <Link to="/Scholarship"><h3>All Scholarship</h3></Link>
          <Link to="/Contact"><h3>About us</h3></Link>

          {!token && <Link to="/signup"><h3>Signup</h3></Link>}
          {!token && <Link to="/login"><h3>Login</h3></Link>}
        </div>
        <Triangle rotate="scaleX(1)" />
      </div>
    </div>
  );
};

export default Navbar;
