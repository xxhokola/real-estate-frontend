import React, { useState } from 'react';
import axios from 'axios';

const CreateLeaseForm = () => {
  const [form, setForm] = useState({
    unit_id: '',
    landlord_id: '',
    start_date: '',
    end_date: '',
    rent_amount: '',
    due_day: '1',
    payment_frequency: 'monthly',
    late_fee: 0,
    late_fee_percent: 0,
    grace_period_days: 0,
    security_deposit: 0,
    tenant_ids: [''], // array of tenant user IDs
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'tenant_ids' ? [value] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leaseRes = await axios.post('http://localhost:3000/leases', {
        unit_id: form.unit_id,
        landlord_id: form.landlord_id,
        start_date: form.start_date,
        end_date: form.end_date,
        rent_amount: form.rent_amount,
        due_day: Number(form.due_day),
        payment_frequency: form.payment_frequency,
        late_fee: form.late_fee,
        late_fee_percent: form.late_fee_percent,
        grace_period_days: form.grace_period_days,
        security_deposit: form.security_deposit,
      });

      const lease_id = leaseRes.data.lease_id;

      for (const tenant_id of form.tenant_ids) {
        await axios.post('http://localhost:3000/lease-tenants', {
          lease_id,
          tenant_id,
          is_primary: true, // or false depending on logic
        });
      }

      setMessage(`✅ Lease created and linked to tenants.`);
    } catch (err: any) {
      console.error('Create lease error:', err.response?.data || err.message);
      setMessage('❌ Error creating lease: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 600 }}>
      <h2>Create Lease</h2>
      <input name="unit_id" placeholder="Unit ID" onChange={handleChange} required />
      <input name="landlord_id" placeholder="Landlord ID" onChange={handleChange} required />
      <input name="start_date" type="date" onChange={handleChange} required />
      <input name="end_date" type="date" onChange={handleChange} required />
      <input name="rent_amount" type="number" placeholder="Rent Amount" onChange={handleChange} required />
      <input name="due_day" type="number" placeholder="Due Day (1–31)" onChange={handleChange} required />
      <select name="payment_frequency" value={form.payment_frequency} onChange={handleChange}>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>
      <input name="late_fee" type="number" placeholder="Flat Late Fee" onChange={handleChange} />
      <input name="late_fee_percent" type="number" placeholder="Late Fee %" onChange={handleChange} />
      <input name="grace_period_days" type="number" placeholder="Grace Period (days)" onChange={handleChange} />
      <input name="security_deposit" type="number" placeholder="Security Deposit" onChange={handleChange} />
      <input name="tenant_ids" placeholder="Tenant ID(s)" onChange={handleChange} required />
      <button type="submit">Create Lease</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateLeaseForm;