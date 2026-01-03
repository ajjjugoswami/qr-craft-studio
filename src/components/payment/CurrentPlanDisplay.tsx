import React from 'react';
import { Card, Badge, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface CurrentPlanDisplayProps {
  subscription: {
    planType: string;
    status: string;
    endDate?: string;
  };
  showCurrentPlan: boolean;
}

const CurrentPlanDisplay: React.FC<CurrentPlanDisplayProps> = ({
  subscription,
  showCurrentPlan
}) => {
  if (!showCurrentPlan || !subscription || subscription.planType === 'free') {
    return null;
  }

  return (
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
  );
};

export default CurrentPlanDisplay;