// src/router/AppRouter.tsx
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
import CreateLeaseTemplatePage from '../pages/CreateLeaseTemplatePage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Handles both normal and invite-based signup (/signup?invite=...) */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        {/* Dashboard redirects based on role */}
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/tenant/dashboard" element={<TenantDashboardPage />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboardPage />} />

        {/* Functional pages */}
        <Route path="/tenant/payment" element={<TenantPaymentPage />} />
        <Route path="/my-properties" element={<MyPropertiesPage />} />
        <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route path="/lease-templates/create" element={<CreateLeaseTemplatePage />} />

        {/* Public lease approval flow */}
        <Route path="/approve-lease" element={<LeaseApprovalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;