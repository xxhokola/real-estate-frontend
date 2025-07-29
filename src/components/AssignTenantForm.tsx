// src/components/AssignTenantForm.tsx
import React, { useState } from 'react';
import axios from '../lib/axiosInstance';

interface Props {
  leaseId: number;
  onAssigned: () => void;
}

const AssignTenantForm: React.FC<Props> = ({ leaseId, onAssigned }) => {
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('/lease-tenants', {
        lease_id: leaseId,
        tenant_email: email,
        is_primary: isPrimary
      });

      setMessage(res.data.message || '✅ Tenant assigned!');
      setEmail('');
      setIsPrimary(false);
      onAssigned(); // Refresh parent view
    } catch (err: any) {
      const error = err.response?.data?.error || err.message;
      setMessage(`❌ Error: ${error}`);
      console.error('❌ Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h4>➕ Assign Tenant</h4>
      <input
        type="email"
        placeholder="Tenant email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: '0.5rem', width: '100%' }}
      />
      <label>
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
          style={{ marginRight: '0.5rem' }}
        />
        Mark as primary tenant
      </label>
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Assigning...' : 'Assign Tenant'}
      </button>
      {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
    </form>
  );
};

export default AssignTenantForm;