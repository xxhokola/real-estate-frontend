// src/pages/LeaseApprovalPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const LeaseApprovalPage = () => {
  const [searchParams] = useSearchParams();
  const [lease, setLease] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('❌ Invalid or missing lease approval token.');
      return;
    }

    axios
      .get(`/lease-approval/details?token=${token}`)
      .then((res) => {
        setLease(res.data);
        setTokenValid(true);
      })
      .catch((err) => {
        setError('❌ Failed to load lease: ' + (err.response?.data?.error || err.message));
      });
  }, [token]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post('/lease-approval/approve', { token });
      setMessage(res.data.message || '✅ Lease approved!');
    } catch (err: any) {
      setMessage('❌ Approval failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = () => {
    alert('⚠️ Lease declined (logic to be implemented).');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lease Approval</h2>
      {error && <p>{error}</p>}
      {lease && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p><strong>Property:</strong> {lease.property_address}</p>
          <p><strong>Unit:</strong> {lease.unit_number}</p>
          <p><strong>Rent:</strong> ${lease.rent_amount} / month</p>
          <p><strong>Lease Dates:</strong> {lease.start_date} → {lease.end_date}</p>
        </div>
      )}

      {tokenValid && !message && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleApprove} disabled={submitting}>
            {submitting ? 'Approving...' : 'Approve Lease'}
          </button>
          <button onClick={handleDecline} disabled={submitting}>
            Decline
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

const downloadSignedLease = async (leaseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/leases/${leaseId}/signed-pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Download failed');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease_${leaseId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('❌ Could not download signed lease.');
    console.error(err);
  }
};

export default LeaseApprovalPage;