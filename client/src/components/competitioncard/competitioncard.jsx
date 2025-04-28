// competitioncard/SuperCompetitionCard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, DollarSign, Info, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // ✅ Import axios
import { PulseLoader } from 'react-spinners';

export const CompetitionCard = ({ event,Role}) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [load,setLoad] = useState(false);
  // const [userRole, setUserRole] = useState('');

  if (!event) {
    return (
      <div style={styles.cardContainer}>
        <p style={styles.noEvent}>🔍 Select an event to view details.</p>
      </div>
    );
  }

  const handleRegister = async (eventId) => {
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
    setLoad(true);
    try {
      await axios.post(`https://eventhon.onrender.com/api/events/register_event/${eventId}`, { userId }, {
        withCredentials: true
      });
      navigate('/registered-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoad(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`https://eventhon.onrender.com/api/events/eve/${eventId}`, {
        withCredentials: true
      });
      alert('Deleted successfully!');
      // Note: If you want to reflect this deletion in the parent, use a callback prop.
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setUserRole(decoded.role); // Ensure 'role' exists in JWT
  //     } catch (err) {
  //       console.error("Invalid token");
  //     }
  //   }
  // }, []);

  return (
    <div
      style={{
        ...styles.cardContainer,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 12px 24px rgba(0,0,0,0.15)'
          : '0 6px 16px rgba(0,0,0,0.07)',
        position: "sticky",
        top: "230px"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {event.imageUrl && (
        <div style={styles.imageWrapper}>
          <img src={event.imageUrl} alt={event.title} style={styles.image} />
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>{event.title}</h2>
        <span style={styles.pill}>{event.category}</span>
      </div>

      <div style={styles.detailRow}>
        <div style={styles.iconCircle}><User size={16} color="#6366F1" /></div>
        <span style={styles.detailText}>{event.organizer?.name || 'Unknown'}</span>
      </div>
      <div style={styles.detailRow}>
        <div style={styles.iconCircle}><CalendarDays size={16} color="#6366F1" /></div>
        <span style={styles.detailText}>{new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div style={styles.detailRow}>
        <div style={styles.iconCircle}><MapPin size={16} color="#6366F1" /></div>
        <span style={styles.detailText}>{event.location}</span>
      </div>
      <div style={styles.detailRow}>
        <div style={styles.iconCircle}><DollarSign size={16} color="#6366F1" /></div>
        <span style={styles.detailText}>{event.paymentType}</span>
      </div>

      <div style={styles.descriptionBox}>
        <Info size={20} color="#6366F1" />
        <p style={styles.description}>{event.description}</p>
      </div>

            {event.evaluationMarkers && event.evaluationMarkers.length > 0 && (
        <div style={styles.evaluationBox}>
          <h4 style={styles.evaluationTitle}>Evaluation Markers</h4>
          <ul style={styles.evaluationList}>
            {event.evaluationMarkers.map((marker, index) => (
              <li key={index} style={styles.evaluationItem}>
                <span style={styles.markerName}>{marker.name}</span>
                {marker.weight !== undefined && (
                  <span style={styles.markerWeight}> - {marker.weight}%</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}


      {load && <PulseLoader
        color="chocolate"
        loading={load}
        // cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
        style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}
      />}

      {Role.includes('admin') ? (
        <button onClick={() => handleDelete(event._id)} style={styles.button}>
          Delete
        </button>
      ) : (
        <button onClick={() => handleRegister(event._id)} style={styles.button}>
          Register Now
        </button>
      )}
    </div>
  );
};

const styles = {
  cardContainer: {
    background: '#fff',
    borderRadius: '16px',
    borderLeft: '4px solid #6366F1',
    padding: '24px',
    marginBottom: '24px',
    transition: 'all 0.2s ease',
    fontFamily: 'Poppins, sans-serif',
    maxWidth: '500px',
  },
  imageWrapper: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },
  pill: {
    background: 'linear-gradient(90deg, #6366F1, #818CF8)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  iconCircle: {
    backgroundColor: '#EEF2FF',
    padding: '6px',
    borderRadius: '50%',
  },
  detailText: {
    fontSize: '14px',
    color: '#4B5563',
  },
  descriptionBox: {
    display: 'flex',
    gap: '10px',
    backgroundColor: '#F3F4F6',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '12px',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#4B5563',
    lineHeight: 1.5,
  },
  button: {
    marginTop: '20px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(90deg, #6366F1, #818CF8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  evaluationBox: {
    backgroundColor: '#F9FAFB',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '16px',
  },
  evaluationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151',
  },
  evaluationList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    margin: 0,
  },
  evaluationItem: {
    fontSize: '14px',
    color: '#4B5563',
    marginBottom: '4px',
  },
  markerName: {
    fontWeight: 500,
  },
  markerWeight: {
    color: '#9CA3AF',
    marginLeft: '4px',
  },
  
};
