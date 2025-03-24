
import React from 'react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

const Dashboard = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <UserDashboard />
    </div>
  );
};

export default Dashboard;
