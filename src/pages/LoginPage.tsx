// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showResend, setShowResend] = useState(false);

  const params = new URLSearchParams(location.search);
  const inviteToken = params.get('invite');
  const leaseToken = params.get('lease');
  const redirect = params.get('redirect') || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowResend(false);

    try {
      const res = await axios.post('/auth/login', form);
      const token = res.data.token;
      localStorage.setItem('token', token);

      // 📦 Redirect after login
      if (leaseToken) {
        navigate(`/approve-lease?token=${leaseToken}`, { replace: true });
      } else {
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setMessage('⚠️ ' + err.response.data.error);
        setShowResend(true);
      } else {
        setMessage('❌ Login error: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('/resend-verification', { email: form.email });
      setMessage('✅ Verification email resent. Please check your inbox.');
      setShowResend(false);
    } catch (err: any) {
      setMessage('❌ Failed to resend: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      {showResend && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.9rem' }}>
            Didn’t get the email?{' '}
            <a href="#" onClick={handleResend}>
              Resend verification
            </a>
          </p>
        </div>
      )}

      <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
        Don’t have an account?{' '}
        <a href={`/signup${inviteToken ? `?invite=${inviteToken}&lease=${leaseToken}` : ''}`}>
          Create one here
        </a>
      </p>
    </div>
  );
};

export default LoginPage;