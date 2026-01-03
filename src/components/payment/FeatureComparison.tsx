import React from 'react';
import { Card, Typography } from 'antd';
import { Check, X } from 'lucide-react';
import type { Plans } from '@/types/payment';

const { Title } = Typography;

interface FeatureComparisonProps {
  plans: Plans;
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({ plans }) => {
  const formatFeatureValue = (value: any) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-500 mx-auto" />
      ) : (
        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
      );
    }
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  const formatFreeValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-500 mx-auto" />
      ) : (
        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
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
    <Card 
      className="mt-8 border border-gray-200 dark:border-gray-700"
      styles={{ body: { padding: 0 } }}
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <Title level={5} className="!mb-0 !text-gray-800 dark:!text-gray-100">Feature Comparison</Title>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">Features</th>
              <th className="text-center py-4 px-4 font-medium text-gray-700 dark:text-gray-300">Free</th>
              {Object.entries(plans).map(([planType, plan]) => (
                <th key={planType} className="text-center py-4 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr 
                key={feature.label} 
                className={`border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${
                  index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-transparent'
                }`}
              >
                <td className="py-4 px-6 font-medium text-gray-700 dark:text-gray-300">{feature.label}</td>
                <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">
                  {formatFreeValue(feature.free)}
                </td>
                {Object.values(plans).map((plan, planIndex) => (
                  <td key={planIndex} className="text-center py-4 px-4 text-gray-700 dark:text-gray-300">
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
