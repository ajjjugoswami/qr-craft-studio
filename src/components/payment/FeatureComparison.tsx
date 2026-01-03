import React from 'react';
import { Card } from 'antd';
import type { Plans } from '@/types/payment';

interface FeatureComparisonProps {
  plans: Plans;
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({ plans }) => {
  const formatFeatureValue = (value: any) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  const features = [
    { label: 'QR Codes', free: '5', key: 'maxQRCodes' },
    { label: 'Scans per QR', free: '20', key: 'maxScansPerQR' },
    { label: 'Advanced Analytics', free: false, key: 'analytics' },
    { label: 'White Label', free: false, key: 'whiteLabel' },
    { label: 'Remove Watermark', free: false, key: 'removeWatermark' },
    { label: 'Password Protection', free: false, key: 'passwordProtection' },
    { label: 'Expiration Date', free: false, key: 'expirationDate' },
    { label: 'Custom Scan Limit', free: false, key: 'customScanLimit' }
  ];

  return (
    <Card title="Feature Comparison" className="mt-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Features</th>
              <th className="text-center py-3 px-4">Free</th>
              {Object.entries(plans).map(([planType, plan]) => (
                <th key={planType} className="text-center py-3 px-4">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={feature.label} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                <td className="py-3 px-4 font-medium">{feature.label}</td>
                <td className="text-center py-3 px-4">
                  {formatFeatureValue(feature.free)}
                </td>
                {Object.values(plans).map((plan, planIndex) => (
                  <td key={planIndex} className="text-center py-3 px-4">
                    {formatFeatureValue(plan.features[feature.key as keyof typeof plan.features])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FeatureComparison;