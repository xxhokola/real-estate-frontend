import React, { useState } from 'react';
import axios from 'axios';

const CreatePropertyForm = () => {
  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'apartment',
    num_units: 1,
    owner_id: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'num_units' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/properties', form);
      setMessage(`✅ Property created: ${res.data.address}`);
    } catch (err: any) {
      console.error('Create property error:', err.response?.data || err.message);
      setMessage('❌ Error creating property: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <input
        name="num_units"
        type="number"
        placeholder="Number of Units"
        onChange={handleChange}
        value={form.num_units}
      />
      <input name="owner_id" placeholder="Owner ID" onChange={handleChange} required />
      <button type="submit">Create Property</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreatePropertyForm;