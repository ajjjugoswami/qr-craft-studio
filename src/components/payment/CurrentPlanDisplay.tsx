import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="mb-8 border-border bg-muted/30">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)} Plan
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Status: 
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  subscription.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-foreground capitalize">{subscription.status}</span>
              </div>
            </div>
            {subscription.endDate && (
              <p className="text-sm text-muted-foreground">
                Valid until: {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Current Plan
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanDisplay;
