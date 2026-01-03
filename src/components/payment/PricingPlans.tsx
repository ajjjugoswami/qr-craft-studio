import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { Plans } from '@/types/payment';
import DurationToggle from './DurationToggle';
import CurrentPlanDisplay from './CurrentPlanDisplay';
import PlanCard from './PlanCard';
import FeatureComparison from './FeatureComparison';

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
    const planOrder = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    return planOrder[subscription.planType as keyof typeof planOrder] < planOrder[planType as keyof typeof planOrder];
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Unable to load pricing plans</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Free Plan */}
        <PlanCard
          planType="free"
          selectedDuration={selectedDuration}
          isCurrentPlan={isCurrentPlan('free')}
          processingPlan={processingPlan}
          onSelectPlan={handleSelectPlan}
          canUpgrade={canUpgrade('free')}
          subscription={subscription}
        />

        {/* Paid Plans */}
        {Object.entries(plans).map(([planType, plan]) => {
          const isPopular = planType === 'pro';
          
          return (
            <PlanCard
              key={planType}
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
          );
        })}
      </div>

      <FeatureComparison plans={plans} />
    </div>
  );
};

export default PricingPlans;
