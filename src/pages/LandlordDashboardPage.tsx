import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';
import axios from '@/lib/axiosInstance';

interface LeaseStat {
  property_id: string;
  address: string;
  totalleases: number;
  activeleases: number;
  pendingleases: number;
}

interface PaymentStat {
  property_id: string;
  address: string;
  totaloutstanding: number;
  unpaidcount: number;
  overduecount: number;
}

export default function LandlordDashboardPage() {
  const [leaseStats, setLeaseStats] = useState<LeaseStat[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStat[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const loadDashboard = async () => {
    try {
      const res = await axios.get('/dashboard');
      setLeaseStats(res.data.leaseStats);
      setPaymentStats(res.data.paymentStats);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  useEffect(() => {
    loadDashboard();
    const s = io('http://localhost:3000');
    setSocket(s);

    s.on('lease:changed', () => {
      console.log('📡 Lease update detected');
      loadDashboard();
    });

    s.on('payment:changed', () => {
      console.log('📡 Payment update detected');
      loadDashboard();
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏢 Landlord Dashboard</h2>

      <div className="mb-6">
        <Link to="/my-properties" className="inline-block mb-4 text-blue-600 underline">
          ➕ Create or View Properties
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">📄 Lease Overview</h3>
        {leaseStats.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          leaseStats.map((stat) => (
            <div key={stat.property_id} className="border p-4 mb-2 rounded shadow-sm">
              <h4 className="font-semibold">{stat.address}</h4>
              <p>Total Leases: {stat.totalleases}</p>
              <p>Active: {stat.activeleases}</p>
              <p>Pending: {stat.pendingleases}</p>
              {stat.totalleases === 0 && (
                <p className="text-yellow-600 font-medium mt-1">⚠️ No leases yet for this property</p>
              )}
            </div>
          ))
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">💸 Payment Overview</h3>
        {paymentStats.map((stat) => (
          <div key={stat.property_id} className="border p-4 mb-2 rounded shadow-sm">
            <h4 className="font-semibold">{stat.address}</h4>
            <p>Total Outstanding: ${stat.totaloutstanding}</p>
            <p>Unpaid Charges: {stat.unpaidcount}</p>
            <p className={stat.overduecount > 0 ? 'text-red-600 font-semibold' : ''}>
              Overdue (3+ days): {stat.overduecount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}