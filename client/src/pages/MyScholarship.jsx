import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyScholarship.css'; // Make sure this is the correct path

const MyScholarship = () => {
  const [myEvents, setMyEvents] = useState([]);

  const fetchMyEvents = async () => {
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      const res = await axios.get(`http://localhost:5000/api/events/organizer_Scholarship/${organizerId}`, {
        withCredentials: true
      });
      setMyEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div className="my-events-container">
      <h2 className="my-events-title">🌟 My Hosted Scholarship</h2>

      {myEvents.length === 0 ? (
        <p className="no-events-text">You haven't hosted any Scholarship yet.</p>
      ) : (
        myEvents.map((event) => (
          <div key={event._id} className="event-card glass-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.courses}</p>
            <p className="event-participants">👥 Participants: {event.participants.length}</p>

            <details className="participants-details">
              <summary>📋 View Registered Users</summary>
              {event.participants.length === 0 ? (
                <p className="no-participants-text">No one registered yet.</p>
              ) : (
                <ul className="participants-list">
                  {event.participants.map((user) => (
                    <li key={user._id}>🔹 {user.name} – <a href={`mailto:${user.email}`}>{user.email}</a></li>
                  ))}
                </ul>
              )}
            </details>
          </div>
        ))
      )}
    </div>
  );
};

export default MyScholarship;
