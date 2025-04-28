import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListScholarship.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ListScholarship = () => {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [change,setChange]=useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // Make sure 'role' is in your JWT payload
      } catch (err) {
        console.error("Invalid token");
      }
    }

    fetchEvents();
  }, [change]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://eventhon.onrender.com/api/events/Scholarship', {
        withCredentials: true
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleRegister = async (ScholarshipId) => {
    const token = localStorage.getItem('token');
    if (!token) {
          navigate('/signup');
          return;
        }
    
        let userId;
        try {
          const decoded = jwtDecode(token);
          userId = decoded.id;
        } catch (err) {
          alert('Invalid token');
          return;
        }

    try {
      await axios.post(`https://eventhon.onrender.com/api/events/register_Scholarship/${ScholarshipId}`, { userId }, {
        withCredentials: true
      });
      // alert('Registered successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleDelete = async (ScholarshipId) => {
    try {
      // console.log(ScholarshipId)
      await axios.delete(`https://eventhon.onrender.com/api/events/Sch/${ScholarshipId}`,{
        withCredentials: true
      });
      // alert('Delete successfully!');
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">Available Scholarship</h2>
      {events.length === 0 ? (
        <p className="event-list-empty">No Scholarship found.</p>
      ) : (
        events.map((event) => (
          <div key={event._id} className="event-list-card">
            <h3 className="event-card-title"><span style={{fontWeight: "bold"}}>Title: </span> {event.title}</h3>
            <p className="event-card-degrees"><span style={{fontWeight: "bold"}}>Degrees: </span> {event.degrees}</p>
            <p className="event-card-courses"><span style={{fontWeight: "bold"}}>Courses: </span> {event.courses}</p>
            <p className="event-card-nationalities"><span style={{fontWeight: "bold"}}>Nationalities: </span> {event.nationalities}</p>
            <p className="event-card-funding"><span style={{fontWeight: "bold"}}>Funding: </span> {event.funding}</p>
            <p className="event-card-deadline">📅 deadline: {new Date(event.deadline).toLocaleDateString()}</p>
            {userRole && userRole.includes('admin') ? (
                <button className="event-card-button2" onClick={() => handleDelete(event._id)}>Delete</button>
              ) : (
                <button className="event-card-button" onClick={() => handleRegister(event._id)}>Register</button>
              )
            }
          </div>
        ))
      )}
    </div>
  );
};

export default ListScholarship;
