import React from 'react';
import { Alert, Progress, Button, Space, Typography } from 'antd';
import { Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';

const { Text } = Typography;

interface SubscriptionLimitAlertProps {
  currentQRCount: number;
  onUpgrade?: () => void;
}

const SubscriptionLimitAlert: React.FC<SubscriptionLimitAlertProps> = ({
  currentQRCount,
  onUpgrade
}) => {
  const navigate = useNavigate();
  const { subscription, getRemainingQRCodes, isUpgradeRequired } = usePayment();

  if (!subscription) return null;

  const remaining = getRemainingQRCodes(currentQRCount);
  const upgradeRequired = isUpgradeRequired(currentQRCount);
  const isFreePlan = subscription.planType === 'free';
  const maxQRCodes = subscription.features.maxQRCodes;

  // Calculate usage percentage
  const usagePercentage = maxQRCodes === -1 ? 0 : Math.min((currentQRCount / maxQRCodes) * 100, 100);

  // Show warning only when we actually exceed the limit (not just when upgrade is "required")
  const showWarning = maxQRCodes !== -1 && currentQRCount >= maxQRCodes;

  if (!showWarning) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/pricing');
    }
  };

  return (
    <Alert
      message={
        <div>
          <Space align="center" className="w-full justify-between">
            <div className="flex-1">
              <Text strong>
                QR Code Limit Reached!
              </Text>
              <div className="mt-2">
                <Text type="secondary" className="text-sm">
                  {maxQRCodes === -1 ? (
                    'Unlimited QR codes available'
                  ) : (
                    `${currentQRCount} of ${maxQRCodes} QR codes used`
                  )}
                </Text>
                {maxQRCodes !== -1 && (
                  <Progress
                    percent={usagePercentage}
                    size="small"
                    status={usagePercentage >= 100 ? 'exception' : usagePercentage > 80 ? 'active' : 'normal'}
                    className="mt-1"
                    showInfo={false}
                  />
                )}
              </div>
            </div>
            
            <Button
              type="primary"
              icon={isFreePlan ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              onClick={handleUpgrade}
            >
              {isFreePlan ? 'Upgrade Now' : 'View Plans'}
            </Button>
          </Space>
        </div>
      }
      type="error"
      showIcon
      className="mb-4"
    />
  );
};

export default SubscriptionLimitAlert;