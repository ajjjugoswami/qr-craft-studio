import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import { Home, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PricingPlans from '@/components/payment/PricingPlans';

const { Title, Paragraph } = Typography;

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              title: (
                <span 
                  className="flex items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home size={16} />
                  Dashboard
                </span>
              )
            },
            {
              title: (
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CreditCard size={16} />
                  Pricing
                </span>
              )
            }
          ]}
        />

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Title level={2} className="!text-gray-900 dark:!text-white !mb-3">
            Choose Your Plan
          </Title>
          <Paragraph className="text-gray-500 dark:text-gray-400 text-base">
            Upgrade your QR code experience with advanced features, unlimited scans, 
            and powerful analytics. Choose the plan that fits your needs.
          </Paragraph>
        </div>

        {/* Pricing Plans */}
        <PricingPlans />
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;
