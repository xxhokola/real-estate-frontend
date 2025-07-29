import React, { useEffect, useState } from 'react';
import axios from '@/lib/axiosInstance';

interface Charge {
  charge_id: number;
  description: string;
  amount: number;
  due_date: string;
  paid: boolean;
  paid_at: string | null;
}

interface Props {
  leaseId: number;
  onPaidUpdate?: (allPaid: boolean) => void;
}

export default function ChargeStatusPanel({ leaseId, onPaidUpdate }: Props) {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [toast, setToast] = useState<string>('');

  const fetchCharges = async () => {
    try {
      const { data } = await axios.get(`/leases/${leaseId}/charges`);
      setCharges(data);
      const unpaid = data.filter(
        c => !c.paid && ['First Month Rent', 'Security Deposit'].includes(c.description)
      );
      onPaidUpdate?.(unpaid.length === 0);
    } catch (err) {
      console.error('Error fetching charges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, [leaseId]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(fetchCharges, 15000);
    return () => clearInterval(interval);
  }, [polling]);

  const handlePay = async (chargeId: number) => {
    try {
      setPolling(true);
      const { data } = await axios.post(`/charges/${chargeId}/pay`);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setToast('❌ Could not start payment.');
    }
  };

  const requiredCharges = charges.filter(c => ['First Month Rent', 'Security Deposit'].includes(c.description));

  if (loading) return <p>Loading charges...</p>;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {toast && <div style={{ backgroundColor: '#fee2e2', padding: '0.5rem', marginBottom: '0.5rem' }}>{toast}</div>}
      <h4>Required Charges</h4>
      <ul>
        {requiredCharges.map(charge => (
          <li key={charge.charge_id} style={{ marginBottom: '0.5rem' }}>
            💰 <strong>{charge.description}</strong>: ${charge.amount.toFixed(2)} — due {new Date(charge.due_date).toLocaleDateString()}
            <br />
            Status: {charge.paid ? '✅ Paid' : '❌ Unpaid'}
            {charge.paid && charge.paid_at && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.85em' }}>
                (Paid on {new Date(charge.paid_at).toLocaleDateString()})
              </span>
            )}
            {!charge.paid && (
              <div style={{ marginTop: '0.3rem' }}>
                <button
                  onClick={() => handlePay(charge.charge_id)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
                >
                  Pay Now
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
