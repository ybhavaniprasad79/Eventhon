import { useState, useEffect } from 'react';
import axios from 'axios';
import './OtpVerifyPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerifyPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      setMessage('No email found. Please go back to the signup page.');
    }
  }, [email]);

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(-1); // allow only one digit

    setOtp(newOtp);

    if (e.target.value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // Check if all digits are filled
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpValue) => {
    if (!email) {
      setMessage('Email is missing');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://eventhon.onrender.com/api/auth/opt-verfy',
        { email, otp: otpValue },
        { withCredentials: true }
      );
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
      <form className="otp-form" onSubmit={(e) => e.preventDefault()}>
        <h2>OTP Verification</h2>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength="1"
              required
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* You can hide this button or keep it just in case */}
        {/* <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button> */}

        {loading && <p>Verifying...</p>}
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default OtpVerifyPage;
