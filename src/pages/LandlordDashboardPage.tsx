import React from 'react';
import { Link } from 'react-router-dom';

const LandlordDashboardPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏢 Landlord/Manager Dashboard</h2>
      <p>Your tools:</p>
      <ul>
        <li><Link to="/my-properties">View & Create Properties</Link></li>
        <li><Link to="/leases">Manage Leases (coming soon)</Link></li>
        <li><Link to="/invite-tenant">Invite Tenant (coming soon)</Link></li>
      </ul>
    </div>
  );
};

export default LandlordDashboardPage;