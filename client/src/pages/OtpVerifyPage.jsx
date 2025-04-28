import { useState } from 'react';
import axios from 'axios';
import './OtpVerifyPage.css'; // import the CSS file
import { useNavigate } from 'react-router-dom';

const OtpVerifyPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://eventhon.onrender.com/api/auth/opt-verfy', { email, otp }, { withCredentials: true });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <form className="otp-form" onSubmit={handleVerify}>
        <h2>OTP Verification</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default OtpVerifyPage;
