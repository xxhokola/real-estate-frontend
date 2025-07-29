import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axiosInstance';
import UploadSignature from '../components/leases/UploadSignature';
import ChargeStatusPanel from '../components/leases/ChargeStatusPanel';
import SignatureStatusPanel from '../components/leases/SignatureStatusPanel';
import { io, Socket } from 'socket.io-client';

const LeaseApprovalPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [showSignatureUI, setShowSignatureUI] = useState(false);
  const [chargesPaid, setChargesPaid] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);

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

        const authToken = localStorage.getItem('token');
        if (!authToken) {
          navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
          return;
        }

        const meRes = await axios.get('/auth/me');
        const loggedInEmail = meRes.data?.email?.toLowerCase().trim();

        if (!invitedEmail || !loggedInEmail || invitedEmail !== loggedInEmail) {
          setError('❌ You are not authorized to approve this lease.');
          setIsAuth(false);
          return;
        }

        setIsAuth(true);

        const leaseRes = await axios.get(`/lease-approval/details?token=${token}`);
        const leaseData = leaseRes.data;
        setLease(leaseData);
        setTokenValid(true);

        const chargeRes = await axios.get(`/leases/${leaseData.lease_id}/charges`);
        const unpaid = chargeRes.data.filter((c: any) =>
          ['First Month Rent', 'Security Deposit'].includes(c.description) && !c.paid
        );
        setChargesPaid(unpaid.length === 0);

        // ✅ Setup socket connection
        const socketClient = io('http://localhost:3000');
        socketClient.emit('joinLeaseRoom', leaseData.lease_id);
        socketClient.on('signature:updated', () => {
          console.log('🔄 Signature updated via WebSocket');
          window.location.reload();
        });
        setSocket(socketClient);
      } catch (err: any) {
        console.error('❌ Auth or lease fetch failed:', err);
        localStorage.removeItem('token');
        navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
      }
    };

    checkAuthAndToken();
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleApprove = () => {
    setShowSignatureUI(true);
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

      {lease && <SignatureStatusPanel leaseId={lease.lease_id} />}

      {!chargesPaid && (
        <div style={{ marginBottom: '1rem', color: 'darkorange' }}>
          ⚠️ You must pay the Security Deposit and First Month's Rent before you can sign this lease.
        </div>
      )}

      {lease && !showSignatureUI && (
        <ChargeStatusPanel leaseId={lease.lease_id} onPaidUpdate={setChargesPaid} />
      )}

      {tokenValid && !message && !showSignatureUI && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleApprove} disabled={submitting || !chargesPaid}>
            {submitting ? 'Processing...' : 'Approve Lease'}
          </button>
          <button onClick={handleDecline} disabled={submitting}>
            Decline
          </button>
        </div>
      )}

      {showSignatureUI && lease?.template_snapshot && (
        <UploadSignature
          leaseId={lease.lease_id}
          templateHtml={lease.template_snapshot}
          onSigned={() => setMessage('✅ Lease signed and submitted.')}
        />
      )}

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default LeaseApprovalPage;