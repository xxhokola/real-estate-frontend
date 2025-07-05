import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import TenantPaymentPage from '../pages/TenantPaymentPage';
import MyPropertiesPage from '../pages/MyPropertiesPage';
import RoleRedirect from '../pages/RoleRedirect';
import TenantDashboardPage from '../pages/TenantDashboardPage';
import LandlordDashboardPage from '../pages/LandlordDashboardPage';
import PropertyDetailPage from '../pages/PropertyDetailPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import LeaseApprovalPage from '../pages/LeaseApprovalPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/tenant/dashboard" element={<TenantDashboardPage />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboardPage />} />
        <Route path="/tenant/payment" element={<TenantPaymentPage />} />
        <Route path="/my-properties" element={<MyPropertiesPage />} />
        <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/approve-lease" element={<LeaseApprovalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;