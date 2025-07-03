import React, { useState } from 'react';
import axios from '../lib/axiosInstance';

const CreateUnitForm = () => {
  const [form, setForm] = useState({
    property_id: '',
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 500,
    rent_amount: 1000,
    is_occupied: false
  });

  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : ['bedrooms', 'bathrooms', 'sqft', 'rent_amount'].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/units', form);
      setMessage('✅ Unit created successfully!');
    } catch (err: any) {
      console.error('Create unit error:', err.response?.data || err.message);
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: 500,
      }}
    >
      <h3>Create a New Unit</h3>

      <label>
        Property ID
        <input
          name="property_id"
          placeholder="e.g. 1"
          value={form.property_id}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Unit Number / Label
        <input
          name="unit_number"
          placeholder="e.g. 2A or Apt 203"
          value={form.unit_number}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Bedrooms
        <input
          name="bedrooms"
          type="number"
          min={0}
          value={form.bedrooms}
          onChange={handleChange}
        />
      </label>

      <label>
        Bathrooms
        <input
          name="bathrooms"
          type="number"
          min={0}
          step="0.5"
          value={form.bathrooms}
          onChange={handleChange}
        />
      </label>

      <label>
        Square Feet
        <input
          name="sqft"
          type="number"
          min={0}
          value={form.sqft}
          onChange={handleChange}
        />
      </label>

      <label>
        Rent Amount (USD)
        <input
          name="rent_amount"
          type="number"
          min={0}
          step="50"
          value={form.rent_amount}
          onChange={handleChange}
        />
      </label>

      <label>
        <input
          type="checkbox"
          name="is_occupied"
          checked={form.is_occupied}
          onChange={handleChange}
        />
        This unit is currently occupied
      </label>

      <button type="submit">Create Unit</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateUnitForm;