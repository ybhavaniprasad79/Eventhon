import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the enhanced styles

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(['user']);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, password, role };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData,{
        withCredentials: true
      });
      console.log(res.data);
      setName('');
      setEmail('');
      setPassword('');
      setRole(['user']);
      navigate('/otp-verfy');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="signup-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create Password"
          required
          className="signup-input"
        />

        <label>
          <input
            type="checkbox"
            checked={role.includes("Organizer")}
            onChange={(e) => {
              if (e.target.checked) {
                setRole(["Organizer", "user"]);
              } else {
                setRole(["user"]);
              }

            }}
          />
          Check if you want to host events on our platform
        </label>

        <button type="submit" className="signup-button">Register</button>
        <div className="login-footer">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login here</span>
          </div>
        {message && <p className="signup-message">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
