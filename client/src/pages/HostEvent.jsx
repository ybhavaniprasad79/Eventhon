import React, { useState } from 'react';
import axios from 'axios';
import './HostEvent.css'; // ⬅️ Link to CSS

const HostEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      await axios.post('http://localhost:5000/api/events/create', {
        title,
        description,
        date,
        location,
        maxParticipants,
        organizerId,
      }, {
        withCredentials: true
      });
      alert('Event created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="host-event-form">
      <h2 className="host-event-title">Host an Event</h2>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Max Participants"
        value={maxParticipants}
        onChange={(e) => setMaxParticipants(e.target.value)}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default HostEvent;
