// src/pages/SignupPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const inviteToken = searchParams.get('invite');
  const leaseToken = searchParams.get('lease');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Optional: pre-fill from backend in the future
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...form };
      if (inviteToken) payload.invite_token = inviteToken;

      // Register
      await axios.post('/users', payload);

      // Auto-login
      const loginRes = await axios.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('token', loginRes.data.token);

      // Redirect to lease or dashboard
      if (leaseToken) {
        navigate(`/approve-lease?token=${leaseToken}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setMessage('❌ Signup error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{inviteToken ? 'Complete Your Account' : 'Create Your Account'}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}
      >
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={!!inviteToken}
        />
        <input
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {!inviteToken && (
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
            <option value="manager">Manager</option>
          </select>
        )}

        <button type="submit">Create Account</button>

        <p style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <a href={`/login${inviteToken ? `?invite=${inviteToken}&lease=${leaseToken}` : ''}`}>
            Login here
          </a>
        </p>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;