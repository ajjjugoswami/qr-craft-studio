import React from 'react';
import { Typography, Tabs } from 'antd';
import { User, Palette, Shield, Droplets, Tag, CreditCard, Crown } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileInfo from './settings/ProfileInfo';
import ThemeSettings from './settings/ThemeSettings';
import SecuritySettings from './settings/SecuritySettings';
import WatermarkSettings from '@/components/settings/WatermarkSettings';
import WhiteLabelSettings from '@/components/settings/WhiteLabelSettings';
import SubscriptionManagement from '@/components/payment/SubscriptionManagement';
import { usePayment } from '@/hooks/usePayment';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { subscription, hasFeatureAccess } = usePayment();
  
  // Check if user has premium features
  const canRemoveWatermark = hasFeatureAccess('removeWatermark');
  const canUseWhiteLabel = hasFeatureAccess('whiteLabel');
  
  const tabItems = [
    {
      key: 'profile',
      label: (
        <span className="flex items-center gap-2">
          <User size={16} />
          Account
        </span>
      ),
      children: <ProfileInfo />,
    },
    {
      key: 'theme',
      label: (
        <span className="flex items-center gap-2">
          <Palette size={16} />
          Theme
        </span>
      ),
      children: <ThemeSettings />,
    },
    {
      key: 'watermark',
      label: (
        <span className="flex items-center gap-2">
          <Droplets size={16} />
          Watermark
          {!canRemoveWatermark && <Crown size={12} className="text-amber-500" />}
        </span>
      ),
      children: <WatermarkSettings />,
    },
    {
      key: 'whitelabel',
      label: (
        <span className="flex items-center gap-2">
          <Tag size={16} />
          White-Label
          {!canUseWhiteLabel && <Crown size={12} className="text-amber-500" />}
        </span>
      ),
      children: <WhiteLabelSettings />,
    },
    {
      key: 'subscription',
      label: (
        <span className="flex items-center gap-2">
          <CreditCard size={16} />
          Subscription
        </span>
      ),
      children: <SubscriptionManagement />,
    },
    {
      key: 'security',
      label: (
        <span className="flex items-center gap-2">
          <Shield size={16} />
          Security
        </span>
      ),
      children: <SecuritySettings />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
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