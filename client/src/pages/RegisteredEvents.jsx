import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisteredEvents.css';
import { FaSearch, FaFilter, FaMoneyBillWave, FaTags } from 'react-icons/fa';
import { debounce } from 'lodash';

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [rawSearch, setRawSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentType, setPaymentType] = useState('All');

  useEffect(() => {
    const handler = debounce(() => {
      setSearch(rawSearch);
    }, 300);

    handler();
    return () => handler.cancel();
  }, [rawSearch]);

  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      const res = await axios.get(`http://localhost:5000/api/events/registered/${userId}`);
      setRegisteredEvents(res.data);
    } catch (err) {
      console.error('Error fetching registered events:', err);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      await axios.put(`http://localhost:5000/api/events/cancel-registration/${eventId}`, {
        userId,
      });

      setRegisteredEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error cancelling registration:', err);
    }
  };

  const filtered = registeredEvents.filter(event => {
    return (
      (category === 'All' || event.category && event.category.toLowerCase() === category.toLowerCase()) &&
      (paymentType === 'All' || event.paymentType && event.paymentType.toLowerCase() === paymentType.toLowerCase()) &&
      event.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  return (
    <div className="registered-events-container">
      <h2 className="registered-events-title">🎟️ My Registered Events</h2>

      <div className="filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="category-buttons">
          <FaTags />
          {['All', 'Technical', 'Non-Technical'].map((cat) => (
            <button
              key={cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="payment-buttons">
          <FaMoneyBillWave />
          {['All', 'Free', 'Paid'].map((type) => (
            <button
              key={type}
              className={paymentType === type ? 'active' : ''}
              onClick={() => setPaymentType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <p className="results-count">{filtered.length} event(s) found</p>

      {filtered.length === 0 ? (
        <p className="no-registered-events">You're not registered for any events yet.</p>
      ) : (
        filtered.map((event) => (
          <div key={event._id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className="event-organizer">Organized by: {event.organizer?.name || "N/A"}</p>
            <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="event-location">Location: {event.location}</p>
            <p className="event-category">Category: {event.category}</p>
            <p className="event-payment">Payment Type: {event.paymentType}</p>

            <button
              onClick={() => handleCancelRegistration(event._id)}
              className="cancel-registration-button"
            >
              Cancel Registration
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default RegisteredEvents;
