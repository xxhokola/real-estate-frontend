import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axiosInstance';

const RoleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const res = await axios.get('/auth/me'); // safer than decoding token
        const role = res.data?.role;

        if (role === 'tenant') {
          navigate('/tenant/dashboard');
        } else if (['landlord', 'manager'].includes(role)) {
          navigate('/landlord/dashboard');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('❌ Redirect failed:', err);
        navigate('/login');
      }
    };

    redirectUser();
  }, [navigate]);

  return <p style={{ padding: '2rem' }}>Loading dashboard...</p>;
};

export default RoleRedirect;