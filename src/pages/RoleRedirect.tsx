import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'tenant') navigate('/tenant/dashboard');
      else if (['landlord', 'manager'].includes(payload.role)) navigate('/landlord/dashboard');
      else navigate('/login');
    } catch (err) {
      console.error('Invalid token:', err);
      navigate('/login');
    }
  }, [navigate]);

  return <p style={{ padding: '2rem' }}>Loading dashboard...</p>;
};

export default RoleRedirect;