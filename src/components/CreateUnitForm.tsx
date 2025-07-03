import React, { useState } from 'react';
import axios from 'axios';

const CreateUnitForm = () => {
  const [form, setForm] = useState({
    property_id: '',
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 500,
    rent_amount: 1000,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'bedrooms' || name === 'bathrooms' || name === 'sqft' || name === 'rent_amount'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/units', form);
      setMessage(`✅ Unit created: ${res.data.unit_number}`);
    } catch (err: any) {
      console.error('Create unit error:', err.response?.data || err.message);
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 500 }}>
      <h2>Create Unit</h2>
      <input name="property_id" placeholder="Property ID" onChange={handleChange} required />
      <input name="unit_number" placeholder="Unit Number" onChange={handleChange} required />
      <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} value={form.bedrooms} />
      <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} value={form.bathrooms} />
      <input name="sqft" type="number" placeholder="Square Feet" onChange={handleChange} value={form.sqft} />
      <input name="rent_amount" type="number" placeholder="Rent Amount" onChange={handleChange} value={form.rent_amount} />
      <button type="submit">Create Unit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateUnitForm;