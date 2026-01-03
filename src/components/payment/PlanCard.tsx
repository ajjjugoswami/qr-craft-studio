import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const getDiscountedPrice = (price: number, duration: number) => {
    if (duration === 12) {
      return Math.round(price * 12 * 0.8);
    }
    return price;
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
        <Check className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
      )}
      <span className={cn(
        "text-sm",
        included ? "text-foreground" : "text-muted-foreground"
      )}>
        {text}
      </span>
    </div>
  );

  // Free Plan
  if (planType === 'free') {
    return (
      <Card className={cn(
        "h-full transition-all duration-200",
        isCurrentPlan 
          ? "border-primary ring-1 ring-primary/20" 
          : "border-border hover:border-muted-foreground/30"
      )}>
        <CardHeader className="text-center pb-2">
          <h3 className="text-xl font-semibold text-foreground">Free</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-foreground">₹0</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Perfect for trying out QR Studio
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-1 border-t border-border pt-4">
            <FeatureItem text="Up to 5 QR codes" />
            <FeatureItem text="Up to 100 scans per QR" />
            <FeatureItem text="Basic templates" />
            <FeatureItem text="Standard support" />
            <FeatureItem text="Watermark included" />
          </div>

          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled
            >
              {isCurrentPlan ? 'Current Plan' : 'Free Forever'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Paid Plans
  if (!plan) return null;

  const price = getDiscountedPrice(plan.price, selectedDuration);
  const monthlyPrice = selectedDuration === 12 ? Math.round(price / 12) : price;

  return (
    <Card className={cn(
      "h-full relative transition-all duration-200",
      isCurrentPlan 
        ? "border-primary ring-1 ring-primary/20" 
        : isPopular 
          ? "border-primary/50 ring-1 ring-primary/10" 
          : "border-border hover:border-muted-foreground/30"
    )}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-2 pt-6">
        <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
        
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">₹{monthlyPrice}</span>
          <span className="text-muted-foreground text-sm">/month</span>
          {selectedDuration === 12 && (
            <div className="mt-1">
              <span className="text-muted-foreground text-sm line-through">₹{plan.price}/month</span>
              <span className="text-primary text-sm ml-2 font-medium">Save 20%</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mt-2">
          {planType === 'basic' && 'Great for small businesses'}
          {planType === 'pro' && 'Perfect for growing businesses'}
          {planType === 'enterprise' && 'Unlimited power for enterprises'}
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-1 border-t border-border pt-4">
          <FeatureItem text={`${formatFeatureValue(plan.features.maxQRCodes)} QR codes`} />
          <FeatureItem text={`${formatFeatureValue(plan.features.maxScansPerQR)} scans per QR`} />
          <FeatureItem 
            text="Advanced analytics" 
            included={plan.features.analytics} 
          />
          <FeatureItem 
            text="White label" 
            included={plan.features.whiteLabel} 
          />
          <FeatureItem 
            text="Remove watermark" 
            included={plan.features.removeWatermark} 
          />
        </div>

        <div className="mt-6">
          {isCurrentPlan ? (
            <Button variant="secondary" className="w-full" disabled>
              Current Plan
            </Button>
          ) : !canUpgrade ? (
            <Button variant="outline" className="w-full" disabled>
              Downgrade Not Available
            </Button>
          ) : (
            <Button
              variant={isPopular ? "default" : "outline"}
              className="w-full"
              disabled={processingPlan === planType}
              onClick={() => onSelectPlan(planType)}
            >
              {processingPlan === planType 
                ? 'Processing...' 
                : subscription?.planType === 'free' 
                  ? 'Upgrade Now' 
                  : 'Switch Plan'
              }
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
