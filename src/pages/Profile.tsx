import React from 'react';
import { Card, Typography, Avatar, Button, Radio, Space, message } from 'antd';
import { User, Palette, Save } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { themes, ThemeName } from '../context/themeTypes';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = (themeName: string) => {
    const theme = themeName as ThemeName;
    setTheme(theme);
    message.success(`Theme changed to ${themes[theme].label}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">Profile Settings</Title>
          <Text type="secondary">Manage your account details and preferences</Text>
        </div>

        {/* User Info Card */}
        <Card className="shadow-sm">
          <div className="flex items-center space-x-6">
            <Avatar
              size={80}
              className="bg-primary text-primary-foreground text-xl font-semibold"
              icon={<User size={32} />}
            >
              {user?.name ? getInitials(user.name) : 'U'}
            </Avatar>

            <div className="flex-1">
              <Title level={3} className="mb-1">{user?.name || 'User'}</Title>
              <Text type="secondary" className="text-base">{user?.email}</Text>
              <div className="mt-2">
                <Text type="secondary" className="text-sm">
                  Member since {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                {user?.isAdmin ? 'Admin' : 'User'}
              </div>
            </div>
          </div>
        </Card>

        {/* Theme Selection Card */}
        <Card className="shadow-sm">
          <div className="flex items-center mb-4">
            <Palette className="mr-3 text-primary" size={24} />
            <Title level={4} className="mb-0">Theme Preferences</Title>
          </div>

          <Text type="secondary" className="mb-6 block">
            Choose your preferred color theme. Your selection will be saved automatically.
          </Text>

          <Radio.Group
            value={currentTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div>
                      <Text strong>{theme.label}</Text>
                      <div className="flex space-x-2 mt-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.colors.sidebarPrimary})` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Radio value={key} />
                </div>
              ))}
            </Space>
          </Radio.Group>
        </Card>

        {/* Account Statistics Card */}
        <Card className="shadow-sm">
          <Title level={4} className="mb-4">Account Statistics</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <Text type="secondary">QR Codes Created</Text>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <Text type="secondary">Total Scans</Text>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <Text type="secondary">Active QR Codes</Text>
            </div>
          </div>
        </Card>

        {/* Account Actions Card */}
        <Card className="shadow-sm">
          <Title level={4} className="mb-4">Account Actions</Title>
          <Space direction="vertical" className="w-full">
            <Button type="default" className="w-full justify-start">
              Change Password
            </Button>
            <Button type="default" className="w-full justify-start">
              Download Account Data
            </Button>
            <Button type="default" danger className="w-full justify-start">
              Delete Account
            </Button>
          </Space>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;