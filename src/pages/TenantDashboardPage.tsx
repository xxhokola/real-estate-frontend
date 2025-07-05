import React from 'react';
import { Link } from 'react-router-dom';

const TenantDashboardPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏠 Tenant Dashboard</h2>
      <p>Welcome! What would you like to do?</p>
      <ul>
        <li><Link to="/tenant/payment">Submit Rent Payment</Link></li>
        <li><Link to="/lease-info">View Lease Info (coming soon)</Link></li>
      </ul>
    </div>
  );
};

export default TenantDashboardPage;