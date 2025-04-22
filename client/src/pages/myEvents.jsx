import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventList'

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);

  const fetchMyEvents = async () => {
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      const res = await axios.get(`http://localhost:5000/api/events/organizer/${organizerId}`,{
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
      <h2 className="my-events-title">My Hosted Events</h2>

      {myEvents.length === 0 ? (
        <p className="no-events-text">You haven't hosted any events yet.</p>
      ) : (
        myEvents.map((event) => (
          <div key={event._id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-participants">Participants Registered: {event.participants.length}</p>

            <details className="participants-details">
              <summary>See Registered Users</summary>
              {event.participants.length === 0 ? (
                <p className="no-participants-text">No one registered yet.</p>
              ) : (
                <ul className="participants-list">
                  {event.participants.map((user) => (
                    <li key={user._id}>{user.name} – {user.email}</li>
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

export default MyEvents;
