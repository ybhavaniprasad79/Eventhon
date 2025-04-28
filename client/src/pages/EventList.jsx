import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      const res = await axios.get(`https://eventhon.onrender.com/api/events/organizer_events/${organizerId}`, {
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
      await axios.delete(`https://eventhon.onrender.com/api/events/delete/${eventId}`, {
        data: { organizerId },
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
      await axios.put(`https://eventhon.onrender.com/api/events/cancel-registration/${eventId}`, {
        userId,
        organizerId
      }, {
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
      (category === 'All' || (event.category && event.category.toLowerCase() === category.toLowerCase())) &&
      (paymentType === 'All' || (event.paymentType && event.paymentType.toLowerCase() === paymentType.toLowerCase())) &&
      event.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f5f8ff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>My Hosted Events</h2>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px',
            minWidth: '200px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        {['All', 'Technical', 'Non-Technical'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '10px',
              backgroundColor: category === cat ? '#4c8ef7' : '#e1e8f0',
              color: category === cat ? '#fff' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
        {['All', 'Free', 'Paid'].map(type => (
          <button
            key={type}
            onClick={() => {
              setPaymentType(type);
              if (type === 'All') setCategory('All');
            }}
            style={{
              padding: '10px',
              backgroundColor: paymentType === type ? '#28a745' : '#e1e8f0',
              color: paymentType === type ? '#fff' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>You haven't hosted any events yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map(event => (
            <div
              key={event._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ color: '#222' }}>{event.title}</h3>
                <p style={{ marginBottom: '10px', color: '#555' }}>{event.description}</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: '#dfefff',
                    color: '#2c6ed5',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {event.category}
                  </span>
                  <span style={{
                    backgroundColor: event.paymentType === 'Free' ? '#dbf7e0' : '#ffe2e2',
                    color: event.paymentType === 'Free' ? '#218838' : '#dc3545',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {event.paymentType}
                  </span>
                </div>

                <details>
                  <summary style={{ cursor: 'pointer', color: '#007bff', marginBottom: '5px' }}>
                    {event.participants.length} Participant{event.participants.length !== 1 && 's'}
                  </summary>
                  <input
                    type="text"
                    placeholder="Search participant..."
                    style={{
                      padding: '6px',
                      marginTop: '10px',
                      marginBottom: '10px',
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '6px'
                    }}
                    value={participantSearch[event._id] || ''}
                    onChange={(e) =>
                      setParticipantSearch(prev => ({
                        ...prev,
                        [event._id]: e.target.value
                      }))
                    }
                  />
                  {event.participants.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '14px' }}>No one registered yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                      {event.participants
                        .filter(user =>
                          user.name.toLowerCase().includes((participantSearch[event._id] || '').toLowerCase())
                        )
                        .map(user => (
                          <li key={user._id} style={{ marginBottom: '8px' }}>
                            <span style={{ fontWeight: '500' }}>{user.name}</span> – <a href={`mailto:${user.email}`}>{user.email}</a>
                            <button
                              onClick={() => handleRemoveParticipant(event._id, user._id)}
                              style={{
                                marginLeft: '8px',
                                padding: '4px 8px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </details>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleUpdateEvent(event._id)}
                  style={{
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;