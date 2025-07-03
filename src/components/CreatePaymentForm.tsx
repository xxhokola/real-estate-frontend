import React, { useState } from 'react';
import axios from 'axios';

const CreatePaymentForm = () => {
  const [form, setForm] = useState({
    lease_id: '',
    tenant_id: '',
    recipient_id: '',
    amount: '',
    due_date: '',
    payment_method: 'bank_transfer',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/payments', {
        lease_id: form.lease_id,
        tenant_id: form.tenant_id,
        recipient_id: form.recipient_id,
        amount: parseFloat(form.amount),
        due_date: form.due_date,
        payment_method: form.payment_method,
      });
      setMessage(`✅ Payment logged for $${form.amount}`);
    } catch (err: any) {
      console.error('Create payment error:', err.response?.data || err.message);
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 600 }}>
      <h2>Log Rent Payment</h2>
      <input name="lease_id" placeholder="Lease ID" onChange={handleChange} required />
      <input name="tenant_id" placeholder="Tenant ID (payer)" onChange={handleChange} required />
      <input name="recipient_id" placeholder="Recipient ID (landlord/manager)" onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" onChange={handleChange} required />
      <input name="due_date" type="date" onChange={handleChange} required />
      <select name="payment_method" value={form.payment_method} onChange={handleChange}>
        <option value="bank_transfer">Bank Transfer</option>
        <option value="credit_card">Credit Card</option>
        <option value="cash">Cash</option>
        <option value="check">Check</option>
      </select>
      <button type="submit">Submit Payment</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreatePaymentForm;