import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmailModal.css';

function EmailModal({ eventUrl, onClose }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
      if (response.data.success) {
        setMessage('OTP sent! Please check your email.');
        setStep('otp');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
        eventUrl
      });

      if (response.data.success) {
        setMessage('OTP verified! Redirecting...');

        // Use a direct window.location.href for external URLs
        if (response.data.redirectUrl) {
          setTimeout(() => {
            window.location.href = response.data.redirectUrl;
          }, 1000);
        } else {
          setTimeout(() => {
            navigate('/redirect', { state: { eventUrl } });
          }, 1000);
        }
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
      if (response.data.success) {
        setMessage('OTP resent! Please check your email.');
      }
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="email-modal">
        <button className="close-icon" onClick={onClose}>×</button>
        <h2>{step === 'email' ? 'Enter Your Email' : 'Enter OTP'}</h2>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <div className="modal-buttons">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
              <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify}>
            <p className="email-info">OTP sent to: {email}</p>
            <input
              type="text"
              value={otp}
              placeholder="Enter 6-digit OTP"
              onChange={e => setOtp(e.target.value)}
              disabled={isLoading}
              maxLength={6}
              required
            />
            <div className="modal-buttons">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button type="button" className="back-btn" onClick={() => setStep('email')} disabled={isLoading}>
                Back
              </button>
            </div>
            <p className="resend-link">
              Didn't receive the code?{' '}
              <button type="button" className="text-button" onClick={handleResendOtp} disabled={isLoading}>
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmailModal;
