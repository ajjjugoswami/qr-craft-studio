import React, { useEffect, useState } from 'react';
import { Typography, Tabs } from 'antd';
import { User, Palette, Shield, Droplets, Tag, CreditCard, Crown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileInfo from './settings/ProfileInfo';
import ThemeSettings from './settings/ThemeSettings';
import SecuritySettings from './settings/SecuritySettings';
import WatermarkSettings from '@/components/settings/WatermarkSettings';
import WhiteLabelSettings from '@/components/settings/WhiteLabelSettings';
import SubscriptionManagement from '@/components/payment/SubscriptionManagement';
import { MobileSettingsNavigation, MobileSettingsActionBar } from '@/components/mobile/settings';
import { usePayment } from '@/hooks/usePayment';
import { useIsMobile } from '@/hooks/use-mobile';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { subscription, hasFeatureAccess } = usePayment();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeKey, setActiveKey] = useState('profile');
  
  // Check if user has premium features
  const canRemoveWatermark = hasFeatureAccess('removeWatermark');
  const canUseWhiteLabel = hasFeatureAccess('whiteLabel');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/settings' || path === '/settings/profile') {
      setActiveKey('profile');
    } else if (path === '/settings/theme') {
      setActiveKey('theme');
    } else if (path === '/settings/watermark') {
      setActiveKey('watermark');
    } else if (path === '/settings/whitelabel') {
      setActiveKey('whitelabel');
    } else if (path === '/settings/subscription') {
      setActiveKey('subscription');
    } else if (path === '/settings/security') {
      setActiveKey('security');
    }
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    navigate(`/settings/${key}`);
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

  const mobileSettingsItems = [
    {
      key: 'profile',
      title: 'Account',
      description: 'Manage your personal information.',
      icon: <User size={20} />,
    },
    {
      key: 'theme',
      title: 'Theme',
      description: 'Customize your app appearance',
      icon: <Palette size={20} />,
    },
    {
      key: 'watermark',
      title: 'Watermark',
      description: 'Configure QR code branding',
      icon: <Droplets size={20} />,
      premium: !canRemoveWatermark,
    },
    {
      key: 'whitelabel',
      title: 'White-Label',
      description: 'Custom branding options',
      icon: <Tag size={20} />,
      premium: !canUseWhiteLabel,
    },
    {
      key: 'subscription',
      title: 'Subscription',
      description: 'Manage your plan and billing',
      icon: <CreditCard size={20} />,
    },
    {
      key: 'security',
      title: 'Security',
      description: 'Password and authentication settings',
      icon: <Shield size={20} />,
    },
  ];

  // Mobile: Show navigation and content
  if (isMobile) {
    const activeIndex = mobileSettingsItems.findIndex(item => item.key === activeKey);

    const handlePrevious = () => {
      if (activeIndex > 0) {
        const prevItem = mobileSettingsItems[activeIndex - 1];
        handleTabChange(prevItem.key);
      }
    };

    const handleNext = () => {
      if (activeIndex < mobileSettingsItems.length - 1) {
        const nextItem = mobileSettingsItems[activeIndex + 1];
        handleTabChange(nextItem.key);
      }
    };

    const activeItem = tabItems.find(item => item.key === activeKey);

    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto  pb-24">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <Title level={window.innerWidth < 640 ? 3 : 2} className="mb-1 sm:mb-2">Settings</Title>
          </div>

          {/* Settings Navigation */}
          <MobileSettingsNavigation
            items={mobileSettingsItems}
            activeKey={activeKey}
            onItemClick={handleTabChange}
          />

          {/* Active Settings Content */}
          <div className="mt-6">
            {activeItem?.children}
          </div>
        </div>

        {/* Mobile Action Bar */}
        <MobileSettingsActionBar
          currentIndex={activeIndex}
          totalItems={mobileSettingsItems.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={activeIndex > 0}
          canGoNext={activeIndex < mobileSettingsItems.length - 1}
        />
      </DashboardLayout>
    );
  }

  // Desktop: Use tabs
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Title level={2} className="mb-2">Settings</Title>
          <Text type="secondary">Manage your account details and preferences</Text>
        </div>

        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
          tabBarGutter={24}
          className="profile-tabs"
        />
      </div>
    </DashboardLayout>
  );
};

export default Profile;