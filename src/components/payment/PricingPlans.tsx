import React, { useState } from 'react';
import { Row, Col, Typography } from 'antd';
import { usePayment } from '@/hooks/usePayment';
import type { Plans } from '@/types/payment';
import DurationToggle from './DurationToggle';
import CurrentPlanDisplay from './CurrentPlanDisplay';
import PlanCard from './PlanCard';
import FeatureComparison from './FeatureComparison';
import LogoLoader from '@/components/common/LogoLoader';

const { Text } = Typography;

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

  const isCurrentPlan = (planType: string) => {
    return subscription?.planType === planType;
  };

  const canUpgrade = (planType: string) => {
    if (!subscription) return true;
    const currentPlan = subscription.planType;
    
    // Trial users can upgrade to any paid plan to secure their subscription
    if (currentPlan === 'trial') return true;
    
    const planOrder = { free: 0, basic: 1, pro: 2, enterprise: 3, trial: 4 };
    return planOrder[currentPlan as keyof typeof planOrder] < planOrder[planType as keyof typeof planOrder];
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LogoLoader size="sm" />
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="text-center py-16">
        <Text className="text-gray-500 dark:text-gray-400">Unable to load pricing plans</Text>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <CurrentPlanDisplay 
        subscription={subscription} 
        showCurrentPlan={showCurrentPlan} 
      />

      <DurationToggle 
        selectedDuration={selectedDuration}
        onDurationChange={setSelectedDuration}
      />

      {/* Plans Grid */}
      <Row gutter={[20, 20]} className="mb-8">
        {/* Free Plan */}
        <Col xs={24} md={12} lg={6}>
          <PlanCard
            planType="free"
            selectedDuration={selectedDuration}
            isCurrentPlan={isCurrentPlan('free')}
            processingPlan={processingPlan}
            onSelectPlan={handleSelectPlan}
            canUpgrade={canUpgrade('free')}
            subscription={subscription}
          />
        </Col>

        {/* Paid Plans - exclude trial since it's auto-granted */}
        {Object.entries(plans)
          .filter(([planType]) => planType !== 'trial')
          .map(([planType, plan]) => {
            const isPopular = planType === 'pro';
            
            return (
              <Col xs={24} md={12} lg={6} key={planType}>
                <PlanCard
                  planType={planType}
                  plan={plan}
                  selectedDuration={selectedDuration}
                  isCurrentPlan={isCurrentPlan(planType)}
                  isPopular={isPopular}
                  processingPlan={processingPlan}
                  onSelectPlan={handleSelectPlan}
                  canUpgrade={canUpgrade(planType)}
                  subscription={subscription}
                />
              </Col>
            );
          })}
      </Row>

      <FeatureComparison plans={plans} />
    </div>
  );
};

export default PricingPlans;
