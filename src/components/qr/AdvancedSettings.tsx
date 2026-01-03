import React from 'react';
import { Card, Input, DatePicker, InputNumber, Typography, Alert, Button } from 'antd';
import { Crown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import moment from 'moment';

const { Text } = Typography;

interface AdvancedSettingsProps {
  password?: string | null;
  onPasswordChange: (v: string | null) => void;
  expirationDate?: string | null;
  onExpirationChange: (v: string | null) => void;
  scanLimit?: number | null;
  onScanLimitChange: (v: number | null) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  password,
  onPasswordChange,
  expirationDate,
  onExpirationChange,
  scanLimit,
  onScanLimitChange,
}) => {
  const navigate = useNavigate();
  const { subscription, hasFeatureAccess } = usePayment();
  
  // Check if user has access to advanced settings (not free plan)
  const canUseAdvancedSettings = subscription?.planType !== 'free' && subscription?.planType;
  
  return (
    <div className="space-y-4">
      <Card size="small" title="Configure advanced settings">
        {/* Premium Feature Alert for Free Users */}
        {!canUseAdvancedSettings && (
          <Alert
            type="info"
            showIcon
            icon={<Crown size={16} />}
            message="Premium Feature"
            description={
              <div className="flex items-center justify-between">
                <span>Upgrade to access password protection, expiration dates, and custom scan limits</span>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<ArrowUpRight size={14} />}
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade Now
                </Button>
              </div>
            }
            className="mb-4"
          />
        )}
        
        <div className={`space-y-4 ${!canUseAdvancedSettings ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Text strong>Password Protection</Text>
              {!canUseAdvancedSettings && <Crown size={12} className="text-amber-500" />}
            </div>
            <div className="mt-2">
              <Input.Password
                placeholder="Leave empty for no password"
                value={password || ''}
                onChange={(e) => onPasswordChange(e.target.value || null)}
                disabled={!canUseAdvancedSettings}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Text strong>Expiration Date</Text>
              {!canUseAdvancedSettings && <Crown size={12} className="text-amber-500" />}
            </div>
            <div className="mt-2">
              <DatePicker
                showTime
                style={{ width: '100%' }}
                value={expirationDate ? moment(expirationDate) : null}
                onChange={(dt) => onExpirationChange(dt ? dt.toISOString() : null)}
                placeholder="Select expiration"
                disabled={!canUseAdvancedSettings}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Text strong>Scan Limit</Text>
              {!canUseAdvancedSettings && <Crown size={12} className="text-amber-500" />}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <InputNumber
                min={1}
                placeholder="Set maximum number of scans"
                value={scanLimit || undefined}
                onChange={(v) => onScanLimitChange(v ? Number(v) : null)}
                disabled={!canUseAdvancedSettings}
              />
              <span className="text-sm text-muted-foreground">
                {!canUseAdvancedSettings ? 'Free plan limited to 20 scans' : 'Leave empty for unlimited'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedSettings;

