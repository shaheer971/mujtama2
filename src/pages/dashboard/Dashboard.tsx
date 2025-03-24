
import React from 'react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import UserWallet from '@/components/dashboard/UserWallet';

const Dashboard = () => {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserDashboard />
        </div>
        
        <div>
          <UserWallet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
