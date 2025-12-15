import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import {
  QrcodeOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <QrcodeOutlined />,
      label: 'My QR Codes',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/faqs',
      icon: <QuestionCircleOutlined />,
      label: 'FAQs',
    },
    {
      key: '/contact',
      icon: <MailOutlined />,
      label: 'Contact Us',
    },
    {
      key: '/submissions',
      icon: <MessageOutlined />,
      label: 'Contact Submissions',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        collapsedWidth={80}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center gap-3 border-b border-border">
            <Avatar
              style={{ backgroundColor: 'hsl(var(--primary))' }}
              size={collapsed ? 32 : 40}
            >
              A
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <Text strong className="text-sm">
                  User
                </Text>
                <Text type="secondary" className="text-xs">
                  Premium User
                </Text>
              </div>
            )}
          </div>

          {/* Collapse Button */}
          <div
            className="p-2 flex justify-end cursor-pointer hover:bg-muted mx-2 mt-2 rounded-lg"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="flex-1 mt-2"
          />

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <div
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border border-destructive text-destructive hover:bg-destructive/5 transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogoutOutlined />
              {!collapsed && <span>Logout</span>}
            </div>
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: 'margin-left 0.2s',
        }}
      >
        <Content className="p-6 min-h-screen">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
