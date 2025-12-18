import React from 'react';
import { Card, Typography, Avatar, Button, Radio, Space, message, Tabs } from 'antd';
import { User, Palette, Save, Settings, BarChart3 } from 'lucide-react';
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

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center gap-2">
          <User size={16} />
          Account
        </span>
      ),
      children: (
        <div className="space-y-6">
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

          {/* Account Statistics Card */}
          <Card className="shadow-sm">
            <Title level={4} className="mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              Account Statistics
            </Title>
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
            <Title level={4} className="mb-4 flex items-center gap-2">
              <Settings size={18} />
              Account Actions
            </Title>
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
      ),
    },
    {
      key: 'theme',
      label: (
        <span className="flex items-center gap-2">
          <Palette size={16} />
          Theme
        </span>
      ),
      children: (
        <div className="space-y-6">
          {/* Theme Selection Card */}
          <Card className="shadow-sm">
            <div className="flex items-center mb-4">
              <Palette className="mr-3 text-primary" size={24} />
              <Title level={4} className="mb-0">Theme Preferences</Title>
            </div>

            <Text type="secondary" className="mb-6 block">
              Choose your preferred color theme. Your selection will be saved automatically.
            </Text>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(themes).map(([key, theme]) => {
                const isGradient = key.startsWith('gradient_');
                const isSelected = currentTheme === key;

                return (
                  <div
                    key={key}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-primary shadow-lg ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{
                      background: isGradient
                        ? `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`
                        : `hsl(${theme.colors.primaryLight})`,
                    }}
                    onClick={() => handleThemeChange(key)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className="flex justify-center space-x-1 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: `hsl(${theme.colors.sidebarPrimary})` }}
                        />
                      </div>

                      <Text
                        strong
                        className={`text-sm ${isGradient ? 'text-white' : ''}`}
                        style={{ color: isGradient ? 'white' : `hsl(${theme.colors.primary})` }}
                      >
                        {theme.label}
                      </Text>

                      {isGradient && (
                        <div className="mt-1">
                          <Text className="text-xs text-white/80">Gradient</Text>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">Settings</Title>
          <Text type="secondary">Manage your account details and preferences</Text>
        </div>

        <Tabs
          defaultActiveKey="profile"
          items={tabItems}
          size="large"
          className="profile-tabs"
        />
      </div>
    </DashboardLayout>
  );
};

export default Profile;