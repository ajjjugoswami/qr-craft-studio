import React from 'react';
import { Card, Button, Typography, List } from 'antd';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '@/types/payment';

const { Title, Text } = Typography;

interface PlanCardProps {
  planType: string;
  plan?: Plan;
  selectedDuration: 1 | 12;
  isCurrentPlan: boolean;
  isPopular?: boolean;
  processingPlan: string | null;
  onSelectPlan: (planType: string) => void;
  canUpgrade: boolean;
  subscription?: {
    planType: string;
  };
}

const PlanCard: React.FC<PlanCardProps> = ({
  planType,
  plan,
  selectedDuration,
  isCurrentPlan,
  isPopular = false,
  processingPlan,
  onSelectPlan,
  canUpgrade,
  subscription
}) => {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    navigate('/contact');
  };
  const getPrice = (plan: Plan, duration: number) => {
    if (duration === 12) {
      return plan.yearlyPrice;
    } else {
      return plan.monthlyPrice;
    }
  };

  const formatFeatureValue = (value: any) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  const FeatureItem = ({ text, included = true }: { text: string; included?: boolean }) => (
    <div className="flex items-center gap-3 py-2">
      {included ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}>
        {text}
      </span>
    </div>
  );

  // Free Plan
  if (planType === 'free') {
    return (
      <Card
        className={`h-full transition-all duration-200 ${
          isCurrentPlan 
            ? 'border-2 border-gray-400 dark:border-gray-500' 
            : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        styles={{ body: { padding: '28px 24px' } }}
      >
        <div className="text-center mb-6">
          <Title level={4} className="!mb-4 !text-gray-800 dark:!text-gray-100">Free</Title>
          <div className="mb-3">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹0</span>
            <Text className="text-gray-500 dark:text-gray-400">/month</Text>
          </div>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Perfect for trying out QR Studio
          </Text>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <FeatureItem text="Up to 5 QR codes" />
          <FeatureItem text="Up to 100 scans per QR" />
          <FeatureItem text="Basic templates" />
          <FeatureItem text="Standard support" />
          <FeatureItem text="Watermark included" />
        </div>

        <div className="mt-6">
          <Button 
            block 
            size="large" 
            disabled
            className="!bg-gray-100 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !text-gray-500 dark:!text-gray-400"
          >
            {isCurrentPlan ? 'Current Plan' : 'Free Forever'}
          </Button>
        </div>
      </Card>
    );
  }

  // Paid Plans
  if (!plan) return null;

  // Special case for Enterprise plan
  if (planType === 'enterprise') {
    return (
      <Card
        className={`h-full relative transition-all duration-200 ${
          isCurrentPlan 
            ? 'border-2 border-gray-500 dark:border-gray-400' 
            : isPopular 
              ? 'border-2 border-gray-400 dark:border-gray-500' 
              : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        styles={{ body: { padding: '28px 24px' } }}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-1 rounded-full text-xs font-medium">
              Most Popular
            </span>
          </div>
        )}
        
        <div className={`text-center mb-6 ${isPopular ? 'pt-2' : ''}`}>
          <Title level={4} className="!mb-4 !text-gray-800 dark:!text-gray-100">{plan.name}</Title>
          
          <div className="mb-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Unlimited power for enterprises
            </Text>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <FeatureItem text={`${formatFeatureValue(plan.features.maxQRCodes)} QR codes`} />
          <FeatureItem text={`${formatFeatureValue(plan.features.maxScansPerQR)} scans per QR`} />
          <FeatureItem text="Advanced analytics" included={plan.features.analytics} />
          <FeatureItem text="White label" included={plan.features.whiteLabel} />
          <FeatureItem text="Remove watermark" included={plan.features.removeWatermark} />
        </div>

        <div className="mt-6">
          <Button 
            block 
            size="large" 
            type="primary"
            onClick={handleContactSupport}
            className="!bg-purple-600 hover:!bg-purple-700 !border-purple-600 hover:!border-purple-700"
          >
            Contact Support
          </Button>
        </div>
      </Card>
    );
  }

  const price = getPrice(plan, selectedDuration);
  const monthlyPrice = selectedDuration === 12 ? Math.round(price / 12) : price;

  return (
    <Card
      className={`h-full relative transition-all duration-200 ${
        isCurrentPlan 
          ? 'border-2 border-gray-500 dark:border-gray-400' 
          : isPopular 
            ? 'border-2 border-gray-400 dark:border-gray-500' 
            : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      styles={{ body: { padding: '28px 24px' } }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className={`text-center mb-6 ${isPopular ? 'pt-2' : ''}`}>
        <Title level={4} className="!mb-4 !text-gray-800 dark:!text-gray-100">{plan.name}</Title>
        
        {planType !== 'enterprise' && (
          <div className="mb-3">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{monthlyPrice}</span>
            <Text className="text-gray-500 dark:text-gray-400">/month</Text>
            {selectedDuration === 12 && (
              <div className="mt-1">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">Billed ₹{price} annually</Text>
                {price < plan.monthlyPrice * 12 && (
                  <Text className="text-green-600 dark:text-green-500 text-sm ml-2 font-medium">
                    Save ₹{plan.monthlyPrice * 12 - price}
                  </Text>
                )}
              </div>
            )}
          </div>
        )}
        
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          {planType === 'basic' && 'Great for small businesses'}
          {planType === 'pro' && 'Perfect for growing businesses'}
          {planType === 'enterprise' && 'Unlimited power for enterprises'}
        </Text>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <FeatureItem text={`${formatFeatureValue(plan.features.maxQRCodes)} QR codes`} />
        <FeatureItem text={`${formatFeatureValue(plan.features.maxScansPerQR)} scans per QR`} />
        <FeatureItem text="Advanced analytics" included={plan.features.analytics} />
        <FeatureItem text="White label" included={plan.features.whiteLabel} />
        <FeatureItem text="Remove watermark" included={plan.features.removeWatermark} />
      </div>

      <div className="mt-6">
        {/* Show Contact Support for Enterprise plans */}
        {planType === 'enterprise' ? (
          <Button 
            block 
            size="large" 
            type="primary"
            onClick={handleContactSupport}
            className="!bg-purple-600 hover:!bg-purple-700 !border-purple-600 hover:!border-purple-700"
          >
            Contact Support
          </Button>
        ) : subscription?.planType === 'enterprise' ? (
          <Button 
            block 
            size="large" 
            type="primary"
            onClick={handleContactSupport}
            className="!bg-purple-600 hover:!bg-purple-700 !border-purple-600 hover:!border-purple-700"
          >
            Contact Support
          </Button>
        ) : isCurrentPlan ? (
          <Button 
            block 
            size="large" 
            disabled
            className="!bg-gray-100 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !text-gray-500 dark:!text-gray-400"
          >
            Current Plan
          </Button>
        ) : !canUpgrade ? (
          <Button 
            block 
            size="large" 
            disabled
            className="!bg-gray-100 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !text-gray-500 dark:!text-gray-400"
          >
            {subscription?.planType === 'trial' ? 'Included in Trial' : 'Downgrade Not Available'}
          </Button>
        ) : (
          <Button
            block
            size="large"
            type={isPopular ? 'primary' : 'default'}
            loading={processingPlan === planType}
            onClick={() => onSelectPlan(planType)}
            className={isPopular 
              ? '!bg-gray-900 dark:!bg-white !border-gray-900 dark:!border-white !text-white dark:!text-gray-900 hover:!bg-gray-800 dark:hover:!bg-gray-100' 
              : '!border-gray-300 dark:!border-gray-600 !text-gray-700 dark:!text-gray-300 hover:!border-gray-400 dark:hover:!border-gray-500'
            }
          >
            {subscription?.planType === 'free' ? 'Upgrade Now' : 'Switch Plan'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PlanCard;
