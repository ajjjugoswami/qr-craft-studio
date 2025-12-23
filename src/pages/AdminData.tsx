import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDataComponent from '@/components/admin/AdminData';

const AdminDataPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-4 md:space-y-6">
        <AdminDataComponent />
      </div>
    </DashboardLayout>
  );
};

export default AdminDataPage;