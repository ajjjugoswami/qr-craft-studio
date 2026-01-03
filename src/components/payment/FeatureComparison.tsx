import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Plans } from '@/types/payment';
import { cn } from '@/lib/utils';

interface FeatureComparisonProps {
  plans: Plans;
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({ plans }) => {
  const formatFeatureValue = (value: any) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-primary mx-auto" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
      );
    }
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  const formatFreeValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-primary mx-auto" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
      );
    }
    return value;
  };

  const features = [
    { label: 'QR Codes', free: '5', key: 'maxQRCodes' },
    { label: 'Scans per QR', free: '100', key: 'maxScansPerQR' },
    { label: 'Advanced Analytics', free: false, key: 'analytics' },
    { label: 'White Label', free: false, key: 'whiteLabel' },
    { label: 'Remove Watermark', free: false, key: 'removeWatermark' },
    { label: 'Password Protection', free: false, key: 'passwordProtection' },
    { label: 'Expiration Date', free: false, key: 'expirationDate' },
    { label: 'Custom Scan Limit', free: false, key: 'customScanLimit' }
  ];

  return (
    <Card className="mt-8 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold">Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-6 font-medium text-foreground">Features</th>
                <th className="text-center py-4 px-4 font-medium text-foreground">Free</th>
                {Object.entries(plans).map(([planType, plan]) => (
                  <th key={planType} className="text-center py-4 px-4 font-medium text-foreground">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr 
                  key={feature.label} 
                  className={cn(
                    "border-b border-border last:border-0",
                    index % 2 === 0 ? 'bg-muted/20' : 'bg-background'
                  )}
                >
                  <td className="py-4 px-6 font-medium text-foreground">{feature.label}</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">
                    {formatFreeValue(feature.free)}
                  </td>
                  {Object.values(plans).map((plan, planIndex) => (
                    <td key={planIndex} className="text-center py-4 px-4 text-foreground">
                      {formatFeatureValue(plan.features[feature.key as keyof typeof plan.features])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureComparison;
