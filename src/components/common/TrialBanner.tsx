import React from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import { ClockCircleOutlined, CrownOutlined } from '@ant-design/icons';
import { useSubscription } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const TrialBanner: React.FC = () => {
  const { isOnTrial, getTrialDaysRemaining, getPlanDisplayName } = useSubscription();
  const navigate = useNavigate();

  // Don't show banner if not on trial
  if (!isOnTrial()) {
    return null;
  }

  const daysRemaining = getTrialDaysRemaining();
  const planName = getPlanDisplayName();

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  // Show different alerts based on days remaining
  if (daysRemaining === null) {
    return null;
  }

  let alertType: 'success' | 'warning' | 'error' = 'success';
  let message = '';
  let description = '';

  if (daysRemaining <= 3) {
    alertType = 'error';
    message = `Trial expires ${daysRemaining === 0 ? 'today' : `in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`}!`;
    description = 'Your pro features and QR codes will be deactivated. Upgrade now to continue enjoying all features.';
  } else if (daysRemaining <= 7) {
    alertType = 'warning';
    message = `${daysRemaining} days left in your ${planName}`;
    description = 'Don\'t lose access to your pro features. Upgrade to continue creating unlimited QR codes.';
  } else {
    alertType = 'success';
    message = `You're enjoying ${planName} features!`;
    description = `${daysRemaining} days remaining in your free trial. Upgrade anytime to continue after trial ends.`;
  }

  return (
    <Alert
      type={alertType}
      showIcon
      icon={daysRemaining <= 3 ? <ClockCircleOutlined /> : <CrownOutlined />}
      message={message}
      description={
        <Space direction="vertical" size={8}>
          <Text>{description}</Text>
          <Button 
            type="primary" 
            size="small" 
            onClick={handleUpgradeClick}
            ghost={alertType === 'success'}
          >
            Upgrade Now
          </Button>
        </Space>
      }
      style={{ 
        marginBottom: 16,
        borderRadius: 8,
      }}
      closable={alertType === 'success' && daysRemaining > 7}
    />
  );
};

export default TrialBanner;