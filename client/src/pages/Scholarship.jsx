import React, { useState } from 'react';
import axios from 'axios';
import './Scholarship.css';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const HostScholarship = () => {
  const [title, setTitle] = useState('');
  const [degrees, setDegrees] = useState('');
  const [courses, setCourses] = useState('');
  const [nationalities, setNationalities] = useState('');
  const [funding, setFunding] = useState('');
  const [deadline, setDeadline] = useState('');
  const Navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const organizerId = JSON.parse(atob(token.split('.')[1])).id;
    setLoad(true)
    try {
      await axios.post('https://eventhon.onrender.com/api/events/createScholarship', {
        title,
        degrees,
        courses,
        nationalities,
        funding,
        deadline,
        organizerId,
      }, {
        withCredentials: true
      });
      // alert('Scholarship created successfully!');
      Navigate("/scholarship")
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create scholarship');
    } finally {
      setLoad(false);
    }

    // console.log({title,
    //   degrees,
    //   courses,
    //   nationalities,
    //   funding,
    //   deadline,
    //   organizerId})
  };

  return (
    <form onSubmit={handleSubmit} className="host-scholarship-form">
      <h2 className="host-scholarship-title">Host a Scholarship</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Degrees"
        value={degrees}
        onChange={(e) => setDegrees(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Courses"
        value={courses}
        onChange={(e) => setCourses(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nationalities"
        value={nationalities}
        onChange={(e) => setNationalities(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Funding"
        value={funding}
        onChange={(e) => setFunding(e.target.value)}
        required
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      {load && <PulseLoader
        color="chocolate"
        loading={load}
        // cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      />}
      <button type="submit">Create Scholarship</button>
    </form>
  );
};

export default HostScholarship;
