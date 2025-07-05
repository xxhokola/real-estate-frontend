import React, { useState } from 'react';
import axios from '../lib/axiosInstance';

interface CreateLeaseFormProps {
  unitId: number;
  onSuccess: () => void;
}

const CreateLeaseForm: React.FC<CreateLeaseFormProps> = ({ unitId, onSuccess }) => {
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    rent_amount: '',
    due_day: 1,
    payment_frequency: 'monthly',
    late_fee: 50,
    late_fee_percent: 5,
    grace_period_days: 3,
    security_deposit: 0
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['due_day', 'late_fee', 'grace_period_days', 'late_fee_percent', 'security_deposit'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const landlord_id = payload?.user_id;

      await axios.post('/leases', {
        ...form,
        unit_id: unitId,
        landlord_id
      });

      setMessage('✅ Lease created!');
      onSuccess();
    } catch (err: any) {
      console.error('Lease error:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>Start Date <input type="date" name="start_date" onChange={handleChange} required /></label>
      <label>End Date <input type="date" name="end_date" onChange={handleChange} required /></label>
      <label>Rent Amount <input name="rent_amount" type="number" onChange={handleChange} required /></label>
      <label>Due Day <input name="due_day" type="number" min={1} max={31} onChange={handleChange} value={form.due_day} /></label>
      <label>Frequency
        <select name="payment_frequency" value={form.payment_frequency} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>
      <label>Late Fee <input name="late_fee" type="number" onChange={handleChange} value={form.late_fee} /></label>
      <label>Late Fee % <input name="late_fee_percent" type="number" onChange={handleChange} value={form.late_fee_percent} /></label>
      <label>Grace Period (days) <input name="grace_period_days" type="number" onChange={handleChange} value={form.grace_period_days} /></label>
      <label>Security Deposit <input name="security_deposit" type="number" onChange={handleChange} value={form.security_deposit} /></label>

      <button type="submit">Save Lease</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateLeaseForm;