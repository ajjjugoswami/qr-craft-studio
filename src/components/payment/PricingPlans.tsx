import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col, Typography, Spin, Switch, List, Divider } from 'antd';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { Plans } from '@/types/payment';

const { Title, Text, Paragraph } = Typography;

interface PricingProps {
  onSelectPlan?: (planType: string, duration: number) => void;
  showCurrentPlan?: boolean;
}

const PricingPlans: React.FC<PricingProps> = ({ 
  onSelectPlan, 
  showCurrentPlan = true 
}) => {
  const { 
    plans, 
    subscription, 
    plansLoading, 
    subscriptionLoading, 
    processPayment, 
    loading 
  } = usePayment();
  
  const [selectedDuration, setSelectedDuration] = useState<1 | 12>(1);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planType: string) => {
    if (onSelectPlan) {
      onSelectPlan(planType, selectedDuration);
      return;
    }

    setProcessingPlan(planType);
    const success = await processPayment(planType, selectedDuration);
    setProcessingPlan(null);

    if (success) {
      // Payment successful, subscription will be updated via the hook
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'pro': return <Crown className="w-6 h-6" />;
      case 'enterprise': return <Star className="w-6 h-6" />;
      default: return null;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'basic': return '#52c41a';
      case 'pro': return '#1890ff';
      case 'enterprise': return '#722ed1';
      default: return '#d9d9d9';
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

  const isCurrentPlan = (planType: string) => {
    return subscription?.planType === planType;
  };

  const canUpgrade = (planType: string) => {
    if (!subscription) return true;
    const planOrder = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    return planOrder[subscription.planType as keyof typeof planOrder] < planOrder[planType as keyof typeof planOrder];
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="text-center py-12">
        <Text type="secondary">Unable to load pricing plans</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Current Plan Display */}
      {showCurrentPlan && subscription && subscription.planType !== 'free' && (
        <Card className="mb-8 border-primary/20">
          <div className="text-center">
            <Badge.Ribbon text="Current Plan" color="blue">
              <Title level={4}>
                {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)} Plan
              </Title>
            </Badge.Ribbon>
            <Paragraph className="mt-4">
              Status: <Badge 
                status={subscription.status === 'active' ? 'success' : 'error'} 
                text={subscription.status}
              />
            </Paragraph>
            {subscription.endDate && (
              <Text type="secondary">
                Valid until: {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            )}
          </div>
        </Card>
      )}

      {/* Duration Toggle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <span className={selectedDuration === 1 ? 'font-semibold' : 'text-gray-500'}>
            Monthly
          </span>
          <Switch
            checked={selectedDuration === 12}
            onChange={(checked) => setSelectedDuration(checked ? 12 : 1)}
          />
          <span className={selectedDuration === 12 ? 'font-semibold' : 'text-gray-500'}>
            Yearly
            <Badge count="20% OFF" className="ml-2" style={{ backgroundColor: '#52c41a' }} />
          </span>
        </div>
      </div>

      {/* Free Plan */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} lg={6}>
          <Card
            className={`h-full ${isCurrentPlan('free') ? 'border-primary shadow-lg' : ''}`}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
                <Check className="w-6 h-6 text-gray-600" />
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
                <List.Item>
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <Text>{item}</Text>
                </List.Item>
              )}
            />

            <div className="mt-6">
              {isCurrentPlan('free') ? (
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
        </Col>

        {/* Paid Plans */}
        {Object.entries(plans).map(([planType, plan]) => {
          const isPopular = planType === 'pro';
          const price = getDiscountedPrice(plan.price, selectedDuration);
          const monthlyPrice = selectedDuration === 12 ? Math.round(price / 12) : price;
          
          return (
            <Col xs={24} lg={6} key={planType}>
              <Card
                className={`h-full relative ${
                  isCurrentPlan(planType) ? 'border-primary shadow-lg' : ''
                } ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}
                bodyStyle={{ padding: '32px 24px' }}
              >
                {isPopular && (
                  <Badge.Ribbon text="Most Popular" color="blue" />
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
                    <List.Item>
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />

                <div className="mt-6">
                  {isCurrentPlan(planType) ? (
                    <Button block size="large" disabled>
                      Current Plan
                    </Button>
                  ) : !canUpgrade(planType) ? (
                    <Button block size="large" type="default" disabled>
                      Downgrade Not Available
                    </Button>
                  ) : (
                    <Button
                      block
                      size="large"
                      type={isPopular ? 'primary' : 'default'}
                      loading={processingPlan === planType}
                      onClick={() => handleSelectPlan(planType)}
                      style={isPopular ? undefined : { borderColor: getPlanColor(planType), color: getPlanColor(planType) }}
                    >
                      {subscription?.planType === 'free' ? 'Upgrade Now' : 'Switch Plan'}
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Features Comparison */}
      <Card title="Feature Comparison" className="mt-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Features</th>
                <th className="text-center py-3 px-4">Free</th>
                {Object.entries(plans).map(([planType, plan]) => (
                  <th key={planType} className="text-center py-3 px-4">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'QR Codes', free: '5', key: 'maxQRCodes' },
                { label: 'Scans per QR', free: '100', key: 'maxScansPerQR' },
                { label: 'Advanced Analytics', free: false, key: 'analytics' },
                { label: 'White Label', free: false, key: 'whiteLabel' },
                { label: 'Remove Watermark', free: false, key: 'removeWatermark' }
              ].map((feature, index) => (
                <tr key={feature.label} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                  <td className="py-3 px-4 font-medium">{feature.label}</td>
                  <td className="text-center py-3 px-4">
                    {formatFeatureValue(feature.free)}
                  </td>
                  {Object.values(plans).map((plan, planIndex) => (
                    <td key={planIndex} className="text-center py-3 px-4">
                      {formatFeatureValue(plan.features[feature.key as keyof typeof plan.features])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PricingPlans;