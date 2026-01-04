import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { Crown, Zap, ArrowUpRight, Lock, BarChart3, Palette, Star, Check } from 'lucide-react';
import './LimitReachedDialog.css';

const { Title, Text } = Typography;

interface LimitReachedDialogProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  limitData?: {
    success: boolean;
    message: string;
    upgradeRequired: boolean;
    currentPlan: string;
    currentCount: number;
    maxAllowed: number;
  };
}

const LimitReachedDialog: React.FC<LimitReachedDialogProps> = ({
  open,
  onClose,
  onNavigate,
  limitData
}) => {
  if (!limitData || !limitData.upgradeRequired) return null;

  const { currentPlan, currentCount, maxAllowed, message } = limitData;
  const usagePercentage = Math.min((currentCount / maxAllowed) * 100, 100);
  const isFreePlan = currentPlan === 'free';

  const handleUpgrade = () => {
    onClose();
    if (onNavigate) {
      onNavigate('/pricing');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      className="limit-reached-modal"
      maskClosable={false}
    >
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Lock className="w-6 h-6 text-white animate-pulse" />
          </div>
          <Title level={4} className="!mb-2 !text-gray-800 dark:!text-gray-100">
            QR Code Limit Reached! 🚫
          </Title>
          <Text className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            You've hit the limit on your <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{currentPlan}</span> plan. 
            Time to unlock more possibilities!
          </Text>
        </div>

        {/* Usage Visualization */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Text strong className="text-gray-800 dark:text-gray-200 text-sm">Current Usage</Text>
                  <div className="text-xs text-gray-500 dark:text-gray-400">QR Codes Created</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-500">
                  {currentCount}/{maxAllowed}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">100% Full</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 via-red-400 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${usagePercentage}%` }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent to-white opacity-30 rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              All {maxAllowed} slots used in your {currentPlan} plan
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-5">
          <div className="text-center mb-3">
            <Text strong className="text-base text-gray-800 dark:text-gray-200">
              🚀 Unlock Premium Features
            </Text>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  Create up to 200 QR codes
                </Text>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  Advanced analytics & tracking
                </Text>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  Remove watermarks
                </Text>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  50+ premium templates
                </Text>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Text className="text-gray-700 dark:text-gray-300 text-sm">
                  Password protection
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            type="primary"
            size="middle"
            onClick={handleUpgrade}
            className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-500 border-none hover:from-orange-600 hover:to-red-600 shadow-lg font-medium text-sm"
          >
            <div className="flex items-center justify-center gap-2">
               Upgrade Now - Starting ₹12/month
            </div>
          </Button>
          
          <Button
            size="middle"
            onClick={onClose}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-medium text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Maybe Later
          </Button>
        </div>

      
      </div>
    </Modal>
  );
};

export default LimitReachedDialog;

 