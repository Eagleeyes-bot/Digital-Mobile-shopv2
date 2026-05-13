/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/guest/LandingPage';
import InventoryPage from './pages/admin/InventoryPage';
import SuperAdminDashboard from './pages/super-admin/Dashboard';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<InventoryPage />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
