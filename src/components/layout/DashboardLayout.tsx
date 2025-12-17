import React from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import {
  QrCode,
  BarChart3,
  HelpCircle,
  Mail,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
  ];

  // Show submissions only for admin users
  if (user?.isAdmin) {
    menuItems.push({
      key: '/submissions',
      icon: <MessageSquare size={18} />,
      label: 'Submissions',
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={230}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        className="shadow-sm"
      >
        <div className="flex flex-col h-full pr-3">
          {/* Logo & Brand */}
          <div className="p-2 flex items-center gap-3 border-b border-border">
            
              <img src="/logo.png" alt="QR Studio" className="w-16 h-16 object-contain" />
             <div className="flex flex-col">
              <Text strong className="text-lg leading-tight">
                QR Studio
              </Text>
              <Text type="secondary" className="text-xs">
                Pro Dashboard
              </Text>
            </div>
          </div>

 

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname === '/' ? '/dashboard' : location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="flex-1 border-none mt-2"
          />

          {/* User Section */}
          <div className="p-3 border-t border-border">
            <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer`}>
            <Avatar
              style={{ backgroundColor: 'hsl(var(--primary))' }}
              size={36}
            >
              {/** Show first char of name if available */}
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <Text strong className="text-sm truncate">{user?.name ?? 'User'}</Text>
                <Text type="secondary" className="text-xs truncate">{user?.email ?? ''}</Text>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <div
              role="button"
              onClick={() => signout()}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors`}
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </div>
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: 230,
        }}
      >
        <Content className="p-6 min-h-screen bg-background">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;