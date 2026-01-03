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
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              title: (
                <span 
                  className="flex items-center gap-2 cursor-pointer hover:text-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home size={16} />
                  Dashboard
                </span>
              )
            },
            {
              title: (
                <span className="flex items-center gap-2">
                  <CreditCard size={16} />
                  Pricing
                </span>
              )
            }
          ]}
        />

        {/* Page Header */}
        <div className="text-center mb-8">
          <Title level={1}>Choose Your Plan</Title>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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