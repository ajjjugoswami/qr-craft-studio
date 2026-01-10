import React, { useState } from 'react';
import { Card, Typography, Switch, Input, message, Button, Tooltip, Alert } from 'antd';
import { Droplets, Save, HelpCircle, Crown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { authAPI } from '@/lib/api';

const { Title, Text } = Typography;

const WatermarkSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { subscription, hasFeatureAccess } = usePayment();
  const [loading, setLoading] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(user?.removeWatermark || false);
  const [watermarkText, setWatermarkText] = useState(user?.watermarkText || 'QR Studio');

  // Check if user has access to watermark features
  const canRemoveWatermark = hasFeatureAccess('removeWatermark');

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', user?.name || '');
      formData.append('removeWatermark', String(removeWatermark));
      formData.append('watermarkText', watermarkText);

      const response = await authAPI.updateProfile(formData);

      if (response.success) {
        updateUser({
          ...response.user,
          removeWatermark,
          watermarkText,
        });
        message.success('Watermark settings saved successfully');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      {/* Premium Feature Alert for Free Users */}
      {!canRemoveWatermark && (
        <Alert
          type="info"
          showIcon
          icon={<Crown size={16} />}
          message="Premium Feature"
          description={
            <div className="flex items-center justify-between">
              <span>Upgrade to Pro to remove watermarks and customize your QR codes</span>
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
          className="mb-6"
        />
      )}

      <div className="flex items-center justify-between mb-6">{' '}
        <Title level={4} className="mb-0 flex items-center gap-2">
          <Droplets size={18} />
          Watermark Settings
          <Tooltip 
            title="Watermarks are small text or logos added to your QR code designs. They help with branding but can be removed for a cleaner look."
            color="white"
            overlayInnerStyle={{ color: '#333' }}
          >
            <HelpCircle size={16} className="text-muted-foreground hover:text-foreground transition-colors cursor-help" />
          </Tooltip>
        </Title>
        <Button
          type="primary"
          icon={<Save size={window.innerWidth < 640 ? 14 : 16} />}
          onClick={handleSave}
          loading={loading}
          disabled={!canRemoveWatermark}
          size={window.innerWidth < 640 ? "small" : "middle"}
          className="text-xs sm:text-sm"
        >
          {window.innerWidth < 640 ? "Save" : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Remove Watermark Toggle */}
        <div className={`flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg border border-border ${!canRemoveWatermark ? 'opacity-50' : ''}`}>
          <div className="flex-1 min-w-0">
            <Text strong className="block text-sm sm:text-base">Remove Watermark from All QR Codes</Text>
            <Text type="secondary" className="text-xs sm:text-sm">
              When enabled, watermarks will not be added to any of your QR codes
              {!canRemoveWatermark && ' (Premium Feature)'}
            </Text>
          </div>
          <Switch
            checked={removeWatermark && canRemoveWatermark}
            onChange={setRemoveWatermark}
            checkedChildren="ON"
            unCheckedChildren="OFF"
            disabled={!canRemoveWatermark}
            size={window.innerWidth < 640 ? "small" : "default"}
          />
        </div>

        {/* Custom Watermark Text */}
        <div className={removeWatermark && canRemoveWatermark ? 'opacity-50 pointer-events-none' : ''}>
          <Text strong className="block mb-2 text-sm sm:text-base">Custom Watermark Text</Text>
          <Text type="secondary" className="text-xs sm:text-sm block mb-3">
            Enter your custom watermark text (e.g., your brand name or website)
          </Text>
          <Input
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Enter watermark text"
            maxLength={30}
            disabled={(removeWatermark && canRemoveWatermark) || !canRemoveWatermark}
            suffix={<Text type="secondary" className="text-xs">{watermarkText.length}/30</Text>}
            size={window.innerWidth < 640 ? "small" : "middle"}
          />
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <Text strong className="block mb-3">Preview</Text>
          <div className="relative inline-block bg-white p-4 rounded-lg border">
            <div className="w-24 h-24 bg-muted/50 rounded flex items-center justify-center">
              <div className="w-16 h-16 bg-foreground/10 rounded" />
            </div>
            {!removeWatermark && watermarkText && (
              <div className="absolute bottom-1 right-1 text-[8px] text-muted-foreground opacity-60">
                {watermarkText}
              </div>
            )}
          </div>
          <Text type="secondary" className="block mt-2 text-xs">
            {!canRemoveWatermark 
              ? 'Upgrade to Pro to remove watermarks and customize your QR codes'
              : removeWatermark 
                ? 'Watermark is disabled - your QR codes will be clean'
                : `Watermark "${watermarkText}" will appear on your QR codes`
            }
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default WatermarkSettings;
