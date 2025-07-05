import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('');
      setError('❌ Invalid verification link.');
      return;
    }

    axios.get(`/verify-email?token=${token}`)
      .then(() => {
        setMessage('✅ Your email has been verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err) => {
        setMessage('');
        setError('❌ Verification failed: ' + (err.response?.data?.error || err.message));
      });
  }, []);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/resend-verification', { email });
      setResendSuccess(true);
    } catch (err: any) {
      setError('❌ Resend failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Email Verification</h2>
      {message && <p>{message}</p>}
      {error && (
        <>
          <p>{error}</p>
          {!resendSuccess ? (
            <form onSubmit={handleResend} style={{ marginTop: '1rem', maxWidth: 300 }}>
              <label>
                Enter your email to resend verification:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
              </label>
              <button type="submit" style={{ marginTop: '0.5rem' }}>
                Resend Email
              </button>
            </form>
          ) : (
            <p>✅ Verification email sent. Please check your inbox.</p>
          )}
        </>
      )}
    </div>
  );
};

export default EmailVerificationPage;