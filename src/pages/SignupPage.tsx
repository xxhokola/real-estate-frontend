import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users', form);
      setMessage(res.data.message || '✅ Signup successful. Check your email to verify.');

      // ⏳ Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setMessage('❌ Signup error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Create Account</button>

        <p style={{ fontSize: '0.9rem' }}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;