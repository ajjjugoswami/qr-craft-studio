import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Tooltip } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import {
  QrCode,
  BarChart3,
  HelpCircle,
  Mail,
  MessageSquare,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Plus,
} from 'lucide-react';
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
  const { user, signout } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <QrCode size={18} />,
      label: 'My QR Codes',
    },
    {
      key: '/analytics',
      icon: <BarChart3 size={18} />,
      label: 'Analytics',
    },
    {
      key: '/faqs',
      icon: <HelpCircle size={18} />,
      label: 'FAQs',
    },
    {
      key: '/contact',
      icon: <Mail size={18} />,
      label: 'Contact Us',
    },
    {
      key: '/submissions',
      icon: <MessageSquare size={18} />,
      label: 'Submissions',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        className="shadow-sm"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className="p-4 flex items-center gap-3 border-b border-border">
            <div 
              className={`rounded-xl bg-primary flex items-center justify-center transition-all ${collapsed ? 'w-10 h-10' : 'w-11 h-11'}`}
            >
              <QrCode size={collapsed ? 20 : 24} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <Text strong className="text-lg leading-tight">
                  QR Studio
                </Text>
                <Text type="secondary" className="text-xs">
                  Pro Dashboard
                </Text>
              </div>
            )}
          </div>

          {/* Create Button */}
          <div className="px-3 py-4">
            <Tooltip title={collapsed ? 'Create QR' : ''} placement="right">
              <button
                onClick={() => navigate('/create')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors ${collapsed ? 'justify-center' : ''}`}
              >
                <Plus size={20} />
                {!collapsed && <span>Create New</span>}
              </button>
            </Tooltip>
          </div>

          {/* Collapse Button */}
          <div
            className="px-3 pb-2 flex justify-end cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <div className="p-2 rounded-lg hover:bg-muted transition-colors">
              {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </div>
          </div>

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname === '/' ? '/dashboard' : location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="flex-1 border-none"
          />

          {/* User Section */}
          <div className="p-3 border-t border-border">
            <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
            <Avatar
              style={{ backgroundColor: 'hsl(var(--primary))' }}
              size={36}
            >
              {/** Show first char of name if available */}
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <Text strong className="text-sm truncate">{user?.name ?? 'User'}</Text>
                <Text type="secondary" className="text-xs truncate">{user?.email ?? ''}</Text>
              </div>
            )}
          </div>
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <div
              role="button"
              onClick={() => signout()}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={18} />
              {!collapsed && <span className="font-medium">Logout</span>}
            </div>
          </Tooltip>
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s',
        }}
      >
        <Content className="p-6 min-h-screen bg-background">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;