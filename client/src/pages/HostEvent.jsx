import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HostEvent.css';
import { useNavigate, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const HostEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [category, setCategory] = useState('Technical');
  const [paymentType, setPaymentType] = useState('Free');
  const [evaluationMarkers, setEvaluationMarkers] = useState([{ name: '', weight: '' }]);
  const [load, setLoad] = useState(false);

  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      axios.get(`https://eventhon.onrender.com/api/events/${eventId}`, {
        withCredentials: true
      })
        .then((res) => {
          const event = res.data;
          setTitle(event.title);
          setDescription(event.description);
          setDate(event.date.slice(0, 10));
          setLocation(event.location);
          setMaxParticipants(event.maxParticipants);
          setCategory(event.category);
          setPaymentType(event.paymentType);
          setEvaluationMarkers(event.evaluationMarkers?.length ? event.evaluationMarkers : [{ name: '', weight: '' }]);
        })
        .catch(err => {
          alert('Failed to load event details');
          console.error(err);
        });
    }
  }, [eventId]);

  const handleMarkerChange = (index, field, value) => {
    const newMarkers = [...evaluationMarkers];
    newMarkers[index][field] = value;
    setEvaluationMarkers(newMarkers);
  };

  const addMarkerField = () => {
    setEvaluationMarkers([...evaluationMarkers, { name: '', weight: '' }]);
  };

  const removeMarkerField = (index) => {
    const newMarkers = [...evaluationMarkers];
    newMarkers.splice(index, 1);
    setEvaluationMarkers(newMarkers);
  };

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
      paymentType,
      evaluationMarkers: evaluationMarkers.filter(m => m.name.trim() !== '')
    };

    setLoad(true);
    try {
      if (eventId) {
        await axios.put(`https://eventhon.onrender.com/api/events/update/${eventId}`, eventData, {
          withCredentials: true
        });
      } else {
        await axios.post('https://eventhon.onrender.com/api/events/create', eventData, {
          withCredentials: true
        });
      }

      navigate('/my-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoad(false);
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

      <div className="eval-section">
        <h4>Evaluation Markers</h4>
        {evaluationMarkers.map((marker, index) => (
          <div key={index} className="eval-marker-row">
            <input
              type="text"
              placeholder="Marker Name"
              value={marker.name}
              onChange={(e) => handleMarkerChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Weight"
              value={marker.weight}
              onChange={(e) => handleMarkerChange(index, 'weight', e.target.value)}
            />
            {evaluationMarkers.length > 1 && (
              <button type="button" onClick={() => removeMarkerField(index)}>❌</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addMarkerField}>➕ Add Marker</button>
      </div>

      {load && (
        <PulseLoader
          color="chocolate"
          loading={load}
          size={15}
          aria-label="Loading Spinner"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}
        />
      )}
      <div style={{display: "flex", gap: "20px", marginRight: "50px", marginLeft: "100px"}}>
        <button onClick={() => navigate("/my-events")}>Cancel</button>
        <button type="submit">{eventId ? 'Update Event' : 'Create Event'}</button>

      </div>
      {/* <button type="submit">{eventId ? 'Update Event' : 'Create Event'}</button> */}
    </form>
  );
};

export default HostEvent;
