import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SemiCard } from '../components/semicard/semicard';
import { jwtDecode } from 'jwt-decode';
import { CompetitionCard } from '../components/competitioncard/competitioncard';
import { PulseLoader } from 'react-spinners';

export default function Competition() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);


  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/events/event', {
        withCredentials: true
      });
      setEvents(res.data);
      if (res.data.length > 0) setSelectedEvent(res.data[0]);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // Ensure 'role' is part of JWT
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    return (
      (filterPayment === 'All' || event.paymentType === filterPayment) &&
      (filterCategory === 'All' || event.category === filterCategory) &&
      (search.trim() === '' || event.title.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const uniqueCategories = [...new Set(events.map(e => e.category))];

  return (
    <div style={{ padding: '10px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {/* Filters & Search */}
      <div style={{
        display: 'flex',
        gap: '10px',
        fontFamily: 'poppins',
        position: "sticky",
        top: "145px",
        zIndex: 1,
        backgroundColor: "#f4f6f8",
        paddingBottom: "10px",
        paddingTop: "10px",
      }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={selectStyle}>
          <option value="All">All Payment Types</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selectStyle}>
          <option value="All">All Categories</option>
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <PulseLoader
        color="chocolate"
        loading={loading}
        // cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      />}

      <div style={{ display: 'flex', gap: '30px', marginLeft: "30px" }}>
        {/* Left: SemiCards */}
        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredEvents.map((event) => (
            <SemiCard
              key={event._id}
              title={event.title}
              collegeName={event.organizer?.name || 'Unknown College'}
              location={event.location}
              eventType={`${event.category} - ${event.paymentType}`}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </div>

        {/* Right: CompetitionCard */}
        <div style={{ width: '65%' }}>
          <CompetitionCard event={selectedEvent} Role={userRole} />
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  fontSize: '16px',
  fontFamily: 'poppins',
};

const inputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  fontSize: '16px',
  fontFamily: 'poppins',
  minWidth: '200px'
};
