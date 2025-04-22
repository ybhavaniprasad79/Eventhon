import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 👈 Import jwt-decode
import Logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Make sure 'role' is how it's stored in your JWT
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
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 30px',
      background: 'linear-gradient(62deg, #8EC5FC 0%, #e0c3fc 100%)',
      fontFamily: 'Poppins',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid gray'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={Logo} alt="Eventhon" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <h2 style={{ margin: 0 }}>Eventhon</h2>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/events" style={linkStyle}>Home</Link>

        {!token && (
          <>
            <Link to="/signup" style={linkStyle}>Register</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
          </>
        )}

        {token && (
          <>
            
            {userRole.includes('Organizer') && (
             <Link to="/host-event" style={linkStyle}>Host Event</Link>
            )}
            <Link to="/events" style={linkStyle}>View Events</Link>

            {/* 👇 Only show if role is Organizer */}
            {userRole.includes('Organizer') && (
              <Link to="/my-events" style={linkStyle}>My Events</Link>
            )}

            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

// Reusable styles
const linkStyle = {
  textDecoration: 'none',
  color: 'black',
  fontWeight: '500',
  fontSize: '16px'
};

const buttonStyle = {
  backgroundColor: '#000',
  color: '#fff',
  padding: '6px 14px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px'
};

export default Navbar;
