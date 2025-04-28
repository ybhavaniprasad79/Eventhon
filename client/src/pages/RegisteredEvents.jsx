import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisteredEvents.css';
import { FaSearch, FaFilter, FaMoneyBillWave, FaTags } from 'react-icons/fa';
import { debounce } from 'lodash';
import { PulseLoader } from 'react-spinners';

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [rawSearch, setRawSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentType, setPaymentType] = useState('All');
  const [load,setLoad] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const handler = debounce(() => {
      setSearch(rawSearch);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [rawSearch]);

  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    setLoading(true);
    try {
      const res = await axios.get(`https://eventhon.onrender.com/api/events/registered/${userId}`);
      setRegisteredEvents(res.data);
    } catch (err) {
      console.error('Error fetching registered events:', err);
    } finally {
      setLoading(false)
    }
  };

  const handleCancelRegistration = async (eventId) => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    setLoad(true);
    try {
      await axios.put(`https://eventhon.onrender.com/api/events/cancel-registration/${eventId}`, {
        userId,
      });

      setRegisteredEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error cancelling registration:', err);
    } finally {
      setLoad(false)
    }
  };

  const filtered = registeredEvents.filter(event => {
    return (
      (category === 'All' || event.category?.toLowerCase() === category.toLowerCase()) &&
      (paymentType === 'All' || event.paymentType?.toLowerCase() === paymentType.toLowerCase()) &&
      event.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  return (
    <div className="registered-events-container">
      {loading && <PulseLoader
        color="chocolate"
        loading={loading}
        // cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}
      />}

      <h2 className="registered-events-title">My Registered Events</h2>

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
          <FaTags className="filter-icon" />
          {['All', 'Technical', 'Non-Technical'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="payment-buttons">
          <FaMoneyBillWave className="filter-icon" />
          {['All', 'Free', 'Paid'].map((type) => (
            <button
              key={type}
              className={`filter-btn ${paymentType === type ? 'active' : ''}`}
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
            <div className="event-details">
              <div className="event-detail-item">
                <span className="detail-label">Organizer</span>
                <span className="detail-value">{event.organizer?.name || 'N/A'}</span>
              </div>
              <div className="event-detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="event-detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{event.location}</span>
              </div>
              <div className="event-detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">{event.category}</span>
              </div>
              <div className="event-detail-item">
                <span className="detail-label">Payment Type</span>
                <span className="detail-value">{event.paymentType}</span>
              </div>
            </div>
            {load && <PulseLoader
              color="chocolate"
              loading={load}
              // cssOverride={override}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}
            />}
            <button
              onClick={() => handleCancelRegistration(event._id)}
              className="cancel-button"
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
