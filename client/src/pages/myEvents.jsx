import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './myEvents.css';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentType, setPaymentType] = useState('All');
  const [participantSearch, setParticipantSearch] = useState({});

  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      const res = await axios.get(`http://localhost:5000/api/events/organizer_events/${organizerId}`,{
        withCredentials: true
      });
      setMyEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${eventId}`, {
        data: { organizerId }
      },{
        withCredentials: true
      });
      setMyEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleUpdateEvent = (eventId) => {
    navigate(`/update-event/${eventId}`);
  };

  const handleRemoveParticipant = async (eventId, userId) => {
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      await axios.put(`http://localhost:5000/api/events/cancel-registration/${eventId}`, {
        userId,
        organizerId
      },{
        withCredentials: true
      });

      setMyEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? { ...event, participants: event.participants.filter(p => p._id !== userId) }
            : event
        )
      );
    } catch (err) {
      console.error('Error removing participant:', err);
    }
  };

  const filtered = myEvents.filter(event => {
    return (
      (category === 'All' || event.category && event.category.toLowerCase() === category.toLowerCase()) &&
      (paymentType === 'All' || event.paymentType && event.paymentType.toLowerCase() === paymentType.toLowerCase()) &&
      event.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div className="my-events-container">
      <h2 className="my-events-title">My Hosted Events</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <div className="category-buttons">
          {/* <button onClick={() => setCategory('All')}>All</button> */}
          <button onClick={() => setCategory('Technical')}>Technical</button>
          <button onClick={() => setCategory('Non-Technical')}>Non-Technical</button>
        </div>

        <div className="payment-buttons">
          <button onClick={() => {setPaymentType('All'),setCategory('All')}}>All</button>
          <button onClick={() => setPaymentType('Free')}>Free</button>
          <button onClick={() => setPaymentType('Paid')}>Paid</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="no-events-text">You haven't hosted any events yet.</p>
      ) : (
        filtered.map((event) => (
          <div key={event._id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-category">Category: {event.category}</p>
            <p className="event-payment">Payment: {event.paymentType}</p>
            <p className="event-participants">Participants Registered: {event.participants.length}</p>

            <details className="participants-details">
              <summary>See Registered Users</summary>

              <input
                type="text"
                placeholder="Search participant..."
                className="search-bar"
                value={participantSearch[event._id] || ''}
                onChange={(e) =>
                  setParticipantSearch(prev => ({
                    ...prev,
                    [event._id]: e.target.value
                  }))
                }
              />

              {event.participants.length === 0 ? (
                <p className="no-participants-text">No one registered yet.</p>
              ) : (
                <ul className="participants-list">
                  {event.participants
                    .filter(user =>
                      user.name.toLowerCase().includes((participantSearch[event._id] || '').toLowerCase())
                    )
                    .map((user) => (
                          <li key={user._id}>
                            <span className="participant-name">{user.name}</span> – <a  href={`mailto:${user.email}`}>{user.email}</a>
                            <button
                              className="remove-user-button"
                              onClick={() => handleRemoveParticipant(event._id, user._id)}
                            >
                              Remove
                            </button>
                          </li>
                    ))}
                </ul>
              )}
            </details>

            <div className="event-actions">
              <button onClick={() => handleUpdateEvent(event._id)} className="update-button">Update</button>
              <button onClick={() => handleDeleteEvent(event._id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyEvents;
