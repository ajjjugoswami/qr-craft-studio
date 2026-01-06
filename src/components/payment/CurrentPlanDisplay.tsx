import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface CurrentPlanDisplayProps {
  subscription: {
    planType: string;
    status: string;
    endDate?: string;
    trialEndDate?: string;
    isTrialSubscription?: boolean;
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
    <Card className="mb-8 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Title level={5} className="!mb-1 !text-gray-800 dark:!text-gray-100">
            {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)} Plan
          </Title>
          <div className="flex items-center gap-3">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">Status:</Text>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                subscription.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <Text className="text-gray-700 dark:text-gray-300 text-sm capitalize">
                {subscription.status}
              </Text>
            </div>
          </div>
          {/* Show trial end date for trial plans, regular end date for others */}
          {subscription.planType === 'trial' && subscription.trialEndDate ? (
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Trial ends: {new Date(subscription.trialEndDate).toLocaleDateString()}
            </Text>
          ) : subscription.endDate ? (
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Valid until: {new Date(subscription.endDate).toLocaleDateString()}
            </Text>
          ) : null}
        </div>
        <span className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
          Current Plan
        </span>
      </div>
    </Card>
  );
};

export default CurrentPlanDisplay;
