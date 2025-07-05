import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.email, role: payload.role });
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎉 Welcome, {user.email}</h1>
      <p>Your role: <strong>{user.role}</strong></p>

      {user.role === 'tenant' && (
        <div>
          <p>👉 <Link to="/tenant/payment">Submit a Rent Payment</Link></p>
        </div>
      )}

      {['landlord', 'manager'].includes(user.role) && (
        <div>
          <p>👉 <Link to="/my-properties">Manage My Properties</Link></p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;