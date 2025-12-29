import React, { useState } from 'react';
import { Card, Typography, Switch, Input, message, Button, Alert, Space } from 'antd';
import { Droplets, Save, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';

const { Title, Text } = Typography;

const WatermarkSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(user?.removeWatermark || false);
  const [watermarkText, setWatermarkText] = useState(user?.watermarkText || 'QR Studio');

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
      <div className="flex items-center justify-between mb-6">
        <Title level={4} className="mb-0 flex items-center gap-2">
          <Droplets size={18} />
          Watermark Settings
        </Title>
        <Button
          type="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>

      <Alert
        message="About Watermarks"
        description="Watermarks are small text or logos added to your QR code designs. They help with branding but can be removed for a cleaner look."
        type="info"
        icon={<Info size={16} />}
        className="mb-6"
        showIcon
      />

      <div className="space-y-6">
        {/* Remove Watermark Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
          <div>
            <Text strong className="block">Remove Watermark from All QR Codes</Text>
            <Text type="secondary" className="text-sm">
              When enabled, watermarks will not be added to any of your QR codes
            </Text>
          </div>
          <Switch
            checked={removeWatermark}
            onChange={setRemoveWatermark}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </div>

        {/* Custom Watermark Text */}
        <div className={removeWatermark ? 'opacity-50 pointer-events-none' : ''}>
          <Text strong className="block mb-2">Custom Watermark Text</Text>
          <Text type="secondary" className="text-sm block mb-3">
            Enter your custom watermark text (e.g., your brand name or website)
          </Text>
          <Input
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Enter watermark text"
            maxLength={30}
            disabled={removeWatermark}
            suffix={<Text type="secondary" className="text-xs">{watermarkText.length}/30</Text>}
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
            {removeWatermark 
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
