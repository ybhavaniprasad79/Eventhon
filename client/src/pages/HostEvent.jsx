import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './HostEvent.css'; // ✅ Link to the CSS below
import { useNavigate, useParams } from 'react-router-dom';

const HostEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [category, setCategory] = useState('Technical');
  const [paymentType, setPaymentType] = useState('Free');

  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      axios.get(`http://localhost:5000/api/events/${eventId}`,{
        withCredentials: true
      })
        .then((res) => {
          const event = res.data;
          setTitle(event.title);
          setDescription(event.description);
          setDate(event.date.slice(0, 10)); // format date for input
          setLocation(event.location);
          setMaxParticipants(event.maxParticipants);
          setCategory(event.category);
          setPaymentType(event.paymentType);
        })
        .catch(err => {
          alert('Failed to load event details');
          console.error(err);
        });
    }
  }, [eventId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Please select a future date for the event.');
      return;
    }

    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;

    const eventData = {
      title,
      description,
      date,
      location,
      maxParticipants,
      organizerId,
      category,
      paymentType
    };

    try {
      // console.log(eventData)1
      if (eventId) {
        await axios.put(`http://localhost:5000/api/events/update/${eventId}`, eventData,{
          withCredentials: true
        });
        // alert('Event updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/events/create', eventData,{
          withCredentials: true
        });
        // alert('Event created successfully!');
      }

      navigate('/my-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="host-event-form">
      <h2 className="host-event-title">{eventId ? 'Update Event' : 'Host an Event'}</h2>

      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="number" placeholder="Max Participants" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} required />

      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="Technical">Technical</option>
        <option value="Non-Technical">Non-Technical</option>
      </select>

      <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required>
        <option value="Free">Free</option>
        <option value="Paid">Paid</option>
      </select>

      <button type="submit">{eventId ? 'Update Event' : 'Create Event'}</button>
    </form>
  );
};

export default HostEvent;
