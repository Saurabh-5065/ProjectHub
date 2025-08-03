// src/pages/DashboardPage.tsx

import React from 'react';
//import { Sidebar } from '../components/layouts/Sidebar'; // Adjusted path
import { DashboardOverview } from '../components/dashboard/DashboardOverview'; // Adjusted path

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardOverview />
    </div>
  );
};

// No default export needed if you prefer named exports for pages
// export default DashboardPage;