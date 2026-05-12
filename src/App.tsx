/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/guest/LandingPage';
import InventoryPage from './pages/admin/InventoryPage';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types/auth';

export default function App() {
  // Mock authentication for demonstration
  // In a real app, this would be fetched from an Auth Context or Global State
  const [currentUser, setCurrentUser] = useState({
    loggedIn: true,
    role: UserRole.GUEST // Change this to TEST roles: ADMIN, SUPER_ADMIN, GUEST
  });

  return (
    <BrowserRouter>
      {/* Role Switcher for Demo Purposes */}
      <div className="fixed bottom-6 right-6 z-[100] bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-gray-200 shadow-2xl flex items-center gap-1">
        {Object.values(UserRole).map(role => (
          <button
            key={role}
            onClick={() => setCurrentUser({ ...currentUser, role })}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentUser.role === role 
                ? 'bg-black text-white shadow-lg scale-105' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {role.replace('_', ' ')}
          </button>
        ))}
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage userRole={currentUser.role} />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} userRole={currentUser.role} />}>
          <Route path="/admin" element={<InventoryPage />} />
        </Route>

        {/* Super Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} userRole={currentUser.role} />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
