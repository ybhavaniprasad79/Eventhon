import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // ⬅️ Add this line to include your styles

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState([])
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, password,role };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration successful!');
      console.log(res.data);
      setName('');
      setEmail('');
      setPassword('');
      setRole(' ');
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
          placeholder="Name"
          required
          className="signup-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="signup-input"
        />

        <label>
          <input
            type="checkbox"
            checked={role.includes("Organizer")}
            onChange={(e) => {
              if (e.target.checked) {
                setRole(["Organizer","user"]);
              } else {
                setRole(["user"]);
              }
            }}
          />
          cleck if you want to host events on our site
        </label>


        <button type="submit" className="signup-button">Register</button>
        {message && <p className="signup-message">{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
