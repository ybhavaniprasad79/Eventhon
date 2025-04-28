import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Logo from '../assets/logo.png';
import Search from '../assets/icon/search';
import Triangle from '../assets/icon/triangle';
import './Navbar.css';
import Person from '../assets/icon/person';

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
    <div className="navbar-container" style={{ zIndex: 1000, }}>
      <div className="navbar-top">
        <div style={{ display: 'flex', marginLeft: '100px', alignItems: "center" }}>

          <img src={Logo} alt="Eventhon" className="navbar-logo" />
          <h2 style={{ padding: '0px', margin: "0px", color: "black", fontFamily: "nunito", fontWeight: "bold" }}>Eventhon</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '500px' }}>
          <div className="navbar-search-container">
            <input style={{ backgroundColor: "transparent" }} placeholder="Search for Clash" />
            <Search />
          </div>

          {token && (
            <div className="navbar-profile-wrapper">
              <div
                className="navbar-profile-icon"
                style={{ display: 'flex', marginRight: '80px' }}
                onClick={() => setShowDropdown(prev => !prev)}
              >
                <Person />
              </div>
              <div
                ref={dropdownRef}
                className={`dropdown-anim-container ${showDropdown ? 'open' : ''}`}
              >
                <div className="navbar-dropdown">
                  <p className="navbar-dropdown-header">User Info</p>
                  <hr />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p className="navbar-dropdown-text">Name: {userName}</p>
                    <p className="navbar-dropdown-text">Email: {userEmail}</p>
                    <p className="navbar-dropdown-text">Role: {userRole && userRole[0]}</p>
                  </div>

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
        <Triangle rotate="scaleX(-1)" style={{ height: '40px', width: '40px', marginRight: '10px' }} />
        <div className="navbar-links" style={{ color: "black" }}>
          <Link to="/"><h3 style={{ color: "black" }}>Home</h3></Link>
          <Link to="/events"><h3 style={{ color: "black" }}>All Events</h3></Link>
          {
            token && (
              <Link to="/registered-events"><h3 style={{ color: "black" }}>Registered Events</h3></Link>
            )
          }

          {userRole && userRole.includes('Organizer') && (
            <>
              {/* <Link to="/host-event"><h3 style={{color: "black"}}>Host Event</h3></Link> */}
              <Link to="/my-events"><h3 style={{ color: "black" }}>My Events</h3></Link>
              {/* <Link to="/host-Scholarship"><h3 style={{color: "black"}}>Host Scholarship</h3></Link> */}
              <Link to="/my-Scholarship"><h3 style={{ color: "black", }}>My Scholarship</h3></Link>
            </>
          )}

          <Link to="/Scholarship"><h3 style={{ color: "black" }}>Scholarships</h3></Link>
          <Link to="/Contact"><h3 style={{ color: "black" }}>About us</h3></Link>

          {!token && <Link to="/signup"><h3 style={{ color: "black" }}>Signup</h3></Link>}
          {!token && <Link to="/login"><h3 style={{ color: "black" }}>Login</h3></Link>}
        </div>
        <Triangle rotate="scaleX(1)" />
      </div>
    </div>
  );
};

export default Navbar;
