import React, { memo, useEffect, useState } from "react";
import { Typography, Tabs } from "antd";
import { Users, CreditCard, RefreshCw, DollarSign } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminUsersTab from "./AdminUsersTab";
import AdminSubscriptions from "./AdminSubscriptions";
import AdminAuditLogsTab from "./AdminAuditLogsTab";
import AdminPlanPricingTab from "./AdminPlanPricingTab";

const { Title } = Typography;

// ----- Component -----
const AdminData: React.FC = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/users') {
      setActiveKey('1');
    } else if (path === '/admin/subscriptions') {
      setActiveKey('2');
    } else if (path === '/admin/audit-logs') {
      setActiveKey('3');
    } else if (path === '/admin/plan-pricing') {
      setActiveKey('4');
    }
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    if (key === '1') {
      navigate('/admin/users');
    } else if (key === '2') {
      navigate('/admin/subscriptions');
    } else if (key === '3') {
      navigate('/admin/audit-logs');
    } else if (key === '4') {
      navigate('/admin/plan-pricing');
    }
  };
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Users size={16} />
          Users & QR Codes
        </span>
      ),
      children: <AdminUsersTab />,
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <CreditCard size={16} />
          Subscriptions & Payments
        </span>
      ),
      children: <AdminSubscriptions />,
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <RefreshCw size={16} />
          Audit Logs
        </span>
      ),
      children: <AdminAuditLogsTab />,
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <DollarSign size={16} />
          Plan Pricing
        </span>
      ),
      children: <AdminPlanPricingTab />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={3}>Admin Dashboard</Title>
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        items={tabItems}
        size={isMobile ? 'small' : 'large'}
        tabBarGutter={isMobile ? 8 : 24}
        className="admin-tabs"
      />
    </div>
  );
});

AdminData.displayName = 'AdminData';

export default AdminData;
