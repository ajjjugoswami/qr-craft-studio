import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ArrowRight, BarChart3, Check, ShieldCheck } from 'lucide-react';
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

  const { currentPlan, currentCount, maxAllowed } = limitData;
  const usagePercentage = Math.min((currentCount / maxAllowed) * 100, 100);

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
      width={420}
      className="limit-reached-modal"
      maskClosable={false}
      destroyOnHidden
    >
      <div className="p-5">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-muted border border-border flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-muted-foreground" />
          </div>
          <Title level={4} className="!mb-2 !text-foreground !font-semibold">
            QR Code Limit Reached
          </Title>
          <Text className="text-muted-foreground text-sm">
            You've reached the limit on your <span className="font-medium text-foreground capitalize">{currentPlan}</span> plan.
          </Text>
        </div>

        {/* Usage Card */}
        <div className="mb-6">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <Text className="text-foreground text-sm font-medium block">Usage</Text>
                  <Text className="text-muted-foreground text-xs">QR Codes Created</Text>
                </div>
              </div>
              <div className="text-right">
                <Text className="text-lg font-semibold text-foreground">
                  {currentCount}/{maxAllowed}
                </Text>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-destructive h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <Text className="text-muted-foreground text-xs mt-2 block text-center">
              All slots used in your {currentPlan} plan
            </Text>
          </div>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <Text className="text-foreground text-sm font-medium block mb-3">
            Upgrade to unlock:
          </Text>
          
          <div className="space-y-2.5">
            {[
              'Create up to 200 QR codes',
              'Advanced analytics & tracking',
              'Remove watermarks',
              'Premium templates',
              'Password protection'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </div>
                <Text className="text-muted-foreground text-sm">{feature}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            type="primary"
            size="large"
            onClick={handleUpgrade}
            className="w-full h-11 !bg-foreground hover:!bg-foreground/90 !border-none !text-background font-medium"
          >
            <span className="flex items-center justify-center gap-2">
              View Plans
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          
          <Button
            size="large"
            onClick={onClose}
            className="w-full h-11 !border-border hover:!border-muted-foreground !text-muted-foreground hover:!text-foreground !bg-transparent"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LimitReachedDialog;