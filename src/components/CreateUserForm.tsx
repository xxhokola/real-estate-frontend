import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users', form);
      setMessage(`User created: ${res.data.name}`);
    } catch (err: any) {
      setMessage('Error creating user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
        <option value="manager">Manager</option>
      </select>
      <button type="submit">Create</button>
      <p>{message}</p>
    </form>
  );
};

export default CreateUserForm;