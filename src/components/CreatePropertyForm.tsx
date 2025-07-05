import React, { useState } from 'react';
import axios from 'axios';

const CreatePropertyForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'apartment',
    num_units: 1
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'num_units' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return setMessage('Missing auth token');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const owner_id = payload.user_id;

    try {
      await axios.post('http://localhost:3000/properties', { ...form, owner_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Property created!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Create property error:', err.response?.data || err.message);
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="city" placeholder="City" onChange={handleChange} required />
      <input name="state" placeholder="State" onChange={handleChange} required />
      <input name="zip_code" placeholder="ZIP Code" onChange={handleChange} required />
      <select name="property_type" value={form.property_type} onChange={handleChange}>
        <option value="apartment">Apartment</option>
        <option value="condo">Condo</option>
        <option value="house">House</option>
        <option value="commercial">Commercial</option>
      </select>
      <input name="num_units" type="number" min={1} value={form.num_units} onChange={handleChange} />
      <button type="submit">Create Property</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreatePropertyForm;