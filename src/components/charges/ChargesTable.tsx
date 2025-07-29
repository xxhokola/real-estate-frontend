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
}

export default function ChargesTable({ leaseId }: Props) {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const { data } = await axios.get(`/leases/${leaseId}/charges`);
        setCharges(data);
      } catch (err) {
        console.error('Error fetching charges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, [leaseId]);

  const handlePay = async (chargeId: number) => {
    try {
      const { data } = await axios.post(`/charges/${chargeId}/pay`);
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Error initiating Stripe payment:', err);
      alert('❌ Payment could not be started.');
    }
  };

  if (loading) return <p>🔄 Loading charges...</p>;
  if (!charges.length) return <p>No charges found.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Lease Charges</h2>
      <table className="w-full table-auto border border-gray-200">
        <thead className="bg-gray-100 text-sm text-left">
          <tr>
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {charges.map(charge => (
            <tr key={charge.charge_id} className="border-t">
              <td className="p-2">{charge.description}</td>
              <td className="p-2">${charge.amount.toFixed(2)}</td>
              <td className="p-2">{new Date(charge.due_date).toLocaleDateString()}</td>
              <td className="p-2">
                {charge.paid ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-yellow-600">Unpaid</span>
                )}
              </td>
              <td className="p-2">
                {!charge.paid && (
                  <button
                    onClick={() => handlePay(charge.charge_id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Pay Now
                  </button>
                )}
                {charge.paid && charge.paid_at && (
                  <span className="text-xs text-gray-500">
                    {new Date(charge.paid_at).toLocaleDateString()}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}