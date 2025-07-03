import React, { useState } from 'react';
import axios from '../lib/axiosInstance';

const ScopedUnitForm = ({ propertyId, onSuccess }: { propertyId: string; onSuccess: () => void }) => {
  const [form, setForm] = useState({
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 500,
    rent_amount: 1000,
    is_occupied: false
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'rent_amount' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/units', { ...form, property_id: propertyId });
      setMessage('✅ Unit created');
      setForm({
        unit_number: '',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 500,
        rent_amount: 1000,
        is_occupied: false
      });
      onSuccess();
    } catch (err: any) {
      console.error('Create unit error:', err.response?.data || err.message);
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h4>Add New Unit</h4>
      <input name="unit_number" placeholder="Unit #" onChange={handleChange} value={form.unit_number} required />
      <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} />
      <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} />
      <input name="sqft" type="number" placeholder="Sqft" value={form.sqft} onChange={handleChange} />
      <input name="rent_amount" type="number" placeholder="Rent" value={form.rent_amount} onChange={handleChange} />
      <label>
        <input type="checkbox" name="is_occupied" checked={form.is_occupied} onChange={handleChange} />
        Unit is currently occupied
      </label>
      <button type="submit">Add Unit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ScopedUnitForm;