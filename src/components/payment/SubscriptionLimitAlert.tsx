import React from 'react';
import { Button } from 'antd';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';

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
  const maxQRCodes = subscription.features.maxQRCodes;
  const showWarning = maxQRCodes !== -1 && currentQRCount >= maxQRCodes;

  if (!showWarning) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/pricing');
    }
  };

  const usagePercentage = Math.min((currentQRCount / maxQRCodes) * 100, 100);

  return (
    <div className="mb-4 p-4 rounded-lg border border-border bg-muted/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">
            QR Code Limit Reached
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {currentQRCount} of {maxQRCodes} QR codes used
          </p>
          <div className="w-full bg-border rounded-full h-1 overflow-hidden">
            <div 
              className="bg-destructive h-1 rounded-full transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
        
        <Button
          type="primary"
          size="small"
          onClick={handleUpgrade}
          className="!bg-foreground hover:!bg-foreground/90 !border-none !text-background flex-shrink-0"
        >
          <span className="flex items-center gap-1.5">
            Upgrade
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionLimitAlert;