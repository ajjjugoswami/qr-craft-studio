import React from 'react';
import { Card, Button, Badge, Typography, List } from 'antd';
import { Check, Crown, Zap, Gift, Shield, Rocket } from 'lucide-react';

const { Title, Text } = Typography;

interface PlanCardProps {
  planType: string;
  plan?: {
    name: string;
    price: number;
    features: {
      maxQRCodes: number;
      maxScansPerQR: number;
      analytics: boolean;
      whiteLabel: boolean;
      removeWatermark: boolean;
    };
  };
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
  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'free': return <Gift className="w-6 h-6" />;
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'pro': return <Crown className="w-6 h-6" />;
      case 'enterprise': return <Rocket className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'free': return '#8c8c8c';
      case 'basic': return '#52c41a';
      case 'pro': return '#1890ff';
      case 'enterprise': return '#722ed1';
      default: return '#d9d9d9';
    }
  };

  const getPlanBorderColor = (type: string) => {
    switch (type) {
      case 'free': return 'border-gray-400';
      case 'basic': return 'border-green-500';
      case 'pro': return 'border-blue-500';
      case 'enterprise': return 'border-purple-500';
      default: return 'border-gray-300';
    }
  };

  const getDiscountedPrice = (price: number, duration: number) => {
    if (duration === 12) {
      return Math.round(price * 12 * 0.8); // 20% discount for yearly
    }
    return price;
  };

  const formatFeatureValue = (value: any) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  // Free Plan
  if (planType === 'free') {
    return (
      <Card
        className={`h-full transition-all duration-300 ${
          isCurrentPlan 
            ? `${getPlanBorderColor('free')} border-2 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100` 
            : 'border-gray-200 hover:shadow-md'
        }`}
        bodyStyle={{ padding: '32px 24px' }}
      >
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
            style={{ backgroundColor: `${getPlanColor('free')}20` }}
          >
            <div style={{ color: getPlanColor('free') }}>
              {getPlanIcon('free')}
            </div>
          </div>
          <Title level={3}>Free</Title>
          <div className="mb-4">
            <span className="text-4xl font-bold">₹0</span>
            <Text type="secondary">/month</Text>
          </div>
          <Text type="secondary">Perfect for trying out QR Studio</Text>
        </div>

        <List
          size="small"
          dataSource={[
            'Up to 5 QR codes',
            'Up to 100 scans per QR',
            'Basic templates',
            'Standard support',
            'Watermark included'
          ]}
          renderItem={(item) => (
            <List.Item className="justify-start">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <Text>{item}</Text>
              </div>
            </List.Item>
          )}
        />

        <div className="mt-6">
          {isCurrentPlan ? (
            <Button block size="large" disabled>
              Current Plan
            </Button>
          ) : (
            <Button block size="large" type="default" disabled>
              Current Plan
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Paid Plans
  if (!plan) return null;

  const price = getDiscountedPrice(plan.price, selectedDuration);
  const monthlyPrice = selectedDuration === 12 ? Math.round(price / 12) : price;

  return (
    <Card
      className={`h-full relative transition-all duration-300 ${
        isCurrentPlan 
          ? `${getPlanBorderColor(planType)} border-2 shadow-xl` 
          : isPopular 
            ? 'border-blue-300 border-2 shadow-lg hover:shadow-xl' 
            : 'border-gray-200 hover:shadow-md'
      } ${
        isCurrentPlan 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-100' 
          : ''
      }`}
      bodyStyle={{ padding: '32px 24px' }}
    >
      {isPopular && (
        <Badge.Ribbon 
          text="Most Popular" 
          color="blue" 
          style={{ 
            top: '-6px',
            right: '-32px',
            zIndex: 1
          }}
        />
      )}
      
      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
          style={{ backgroundColor: `${getPlanColor(planType)}20` }}
        >
          <div style={{ color: getPlanColor(planType) }}>
            {getPlanIcon(planType)}
          </div>
        </div>
        
        <Title level={3}>{plan.name}</Title>
        
        <div className="mb-4">
          <span className="text-4xl font-bold">₹{monthlyPrice}</span>
          <Text type="secondary">/month</Text>
          {selectedDuration === 12 && (
            <div>
              <Text delete type="secondary">₹{plan.price}/month</Text>
              <Text type="success" className="ml-2">Save 20%</Text>
            </div>
          )}
        </div>
        
        <Text type="secondary">
          {planType === 'basic' && 'Great for small businesses'}
          {planType === 'pro' && 'Perfect for growing businesses'}
          {planType === 'enterprise' && 'Unlimited power for enterprises'}
        </Text>
      </div>

      <List
        size="small"
        dataSource={[
          `${formatFeatureValue(plan.features.maxQRCodes)} QR codes`,
          `${formatFeatureValue(plan.features.maxScansPerQR)} scans per QR`,
          `Advanced analytics: ${formatFeatureValue(plan.features.analytics)}`,
          `White label: ${formatFeatureValue(plan.features.whiteLabel)}`,
          `Remove watermark: ${formatFeatureValue(plan.features.removeWatermark)}`
        ]}
        renderItem={(item) => (
          <List.Item className="justify-start">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <Text>{item}</Text>
            </div>
          </List.Item>
        )}
      />

      <div className="mt-6">
        {isCurrentPlan ? (
          <Button block size="large" disabled>
            Current Plan
          </Button>
        ) : !canUpgrade ? (
          <Button block size="large" type="default" disabled>
            Downgrade Not Available
          </Button>
        ) : (
          <Button
            block
            size="large"
            type={isPopular ? 'primary' : 'default'}
            loading={processingPlan === planType}
            onClick={() => onSelectPlan(planType)}
            style={isPopular ? undefined : { borderColor: getPlanColor(planType), color: getPlanColor(planType) }}
          >
            {subscription?.planType === 'free' ? 'Upgrade Now' : 'Switch Plan'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PlanCard;