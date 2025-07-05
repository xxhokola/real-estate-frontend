import React, { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';

const SubmitPaymentForm = () => {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    lease_id: '',
    tenant_id: '',
    amount: '',
    due_date: '',
    payment_method: 'bank_transfer'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/leases').then(res => {
      setLeases(res.data);
    });
  }, []);

  useEffect(() => {
    if (form.lease_id) {
      axios.get(`/lease-tenants?lease_id=${form.lease_id}`).then(res => {
        setTenants(res.data);
      });
    }
  }, [form.lease_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/payments', {
        lease_id: form.lease_id,
        tenant_id: form.tenant_id,
        recipient_id: 1,
        amount: parseFloat(form.amount),
        due_date: form.due_date,
        payment_method: form.payment_method
      });
      setMessage('✅ Payment submitted successfully');
    } catch (err: any) {
      console.error('Payment error:', err.response?.data || err.message);
      setMessage('❌ Payment failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h3>Submit Rent Payment</h3>

      <select name="lease_id" onChange={handleChange} required>
        <option value="">Select Lease</option>
        {leases.map((lease: any) => (
          <option key={lease.lease_id} value={lease.lease_id}>
            Lease #{lease.lease_id} — Unit {lease.unit_id}
          </option>
        ))}
      </select>

      <select name="tenant_id" onChange={handleChange} required>
        <option value="">Select Tenant</option>
        {tenants.map((t: any) => (
          <option key={t.tenant_id} value={t.tenant_id}>
            Tenant #{t.tenant_id}
          </option>
        ))}
      </select>

      <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
      <input type="date" name="due_date" onChange={handleChange} required />

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

export default SubmitPaymentForm;