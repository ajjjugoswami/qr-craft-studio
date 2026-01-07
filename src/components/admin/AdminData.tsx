import React, { memo, useEffect, useState } from "react";
import { Typography, Tabs } from "antd";
import { Users, CreditCard, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminUsersTab from "./AdminUsersTab";
import AdminSubscriptions from "./AdminSubscriptions";
import AdminAuditLogsTab from "./AdminAuditLogsTab";

const { Title } = Typography;

// ----- Component -----
const AdminData: React.FC = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/users') {
      setActiveKey('1');
    } else if (path === '/admin/subscriptions') {
      setActiveKey('2');
    } else if (path === '/admin/audit-logs') {
      setActiveKey('3');
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
        size="large"
        className="admin-tabs"
      />
    </div>
  );
});

AdminData.displayName = 'AdminData';

export default AdminData;
