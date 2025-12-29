// src/pages/DashboardPage.tsx

import React from 'react';
//import { Sidebar } from '../components/layouts/Sidebar'; // Adjusted path
import Dashboard from '@/components/dashboard/Dashboard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Dashboard />
    </div>
  );
};

// No default export needed if you prefer named exports for pages
// export default DashboardPage;