import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';

const LeaseApprovalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const checkAuthAndToken = async () => {
      if (!token) {
        setError('❌ Missing or invalid lease token.');
        setIsAuth(false);
        return;
      }

      const redirectUrl = `/approve-lease?token=${encodeURIComponent(token)}`;

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const invitedEmail = decoded.tenantEmail?.toLowerCase().trim();
        console.log('📩 Invited tenant email from token:', invitedEmail);

        const authToken = localStorage.getItem('token');
        if (!authToken) {
          console.warn('🔐 No login token. Redirecting...');
          navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
          return;
        }

        const meRes = await axios.get('/auth/me');
        const loggedInEmail = meRes.data?.email?.toLowerCase().trim();
        console.log('👤 Logged in as:', loggedInEmail, invitedEmail);

        if (!invitedEmail || !loggedInEmail || invitedEmail !== loggedInEmail) {
          setError('❌ You are not authorized to approve this lease.');
          setIsAuth(false);
          return;
        }

        setIsAuth(true);

        const leaseRes = await axios.get(`/lease-approval/details?token=${token}`);
        setLease(leaseRes.data);
        setTokenValid(true);
      } catch (err: any) {
        console.error('❌ Auth or lease fetch failed:', err);

        if (err.response?.status === 401) {
          console.warn('🔁 Invalid token. Clearing and redirecting...');
          localStorage.removeItem('token');
          navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
        } else {
          setError('❌ ' + (err.response?.data?.error || err.message));
          setIsAuth(false);
        }
      }
    };

    checkAuthAndToken();
  }, [token, navigate]);

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

  const handleDecline = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post('/lease-approval/decline', { token });
      setMessage(res.data.message || '🚫 Lease declined.');
    } catch (err: any) {
      setMessage('❌ Decline failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuth === null) {
    return <div style={{ padding: '2rem' }}>🔄 Checking login status...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lease Approval</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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

export default LeaseApprovalPage;