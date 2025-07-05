import React, { useState } from 'react';
import axios from '../lib/axiosInstance';

const AssignTenantForm = ({ leaseId, onAssigned }: { leaseId: number; onAssigned?: () => void }) => {
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaseId || !email.trim()) {
      setMessage('❌ lease ID and email are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('📤 Assigning:', { leaseId, email });

      // Assign tenant
      const res1 = await axios.post('/lease-tenants', {
        lease_id: leaseId,
        tenant_email: email,
        is_primary: isPrimary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Assigned tenant:', res1.data);

      // Send lease invite email
      const res2 = await axios.post('/lease-invites/send', {
        lease_id: leaseId,
        tenant_email: email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Sent invite email:', res2.data);

      setMessage('✅ Tenant assigned and invite sent');
      setEmail('');
      if (onAssigned) onAssigned();
    } catch (err: any) {
      console.error('❌ Error:', err.response?.data || err.message);
      setMessage('❌ ' + (err.response?.data?.error || 'Failed to assign tenant'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label>
        Tenant Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
        />
        Set as Primary Tenant
      </label>
      <button type="submit">Assign Tenant</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AssignTenantForm;