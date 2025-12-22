import React from 'react';
import { Card, Input, DatePicker, Checkbox, InputNumber, Upload, Button, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QRTemplate } from '../../types/qrcode';

const { Text } = Typography;

interface AdvancedSettingsProps {
  password?: string | null;
  onPasswordChange: (v: string | null) => void;
  expirationDate?: string | null;
  onExpirationChange: (v: string | null) => void;
  scanLimit?: number | null;
  onScanLimitChange: (v: number | null) => void;
  previewImage?: string | null;
  onPreviewImageChange: (v: string | null) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  password,
  onPasswordChange,
  expirationDate,
  onExpirationChange,
  scanLimit,
  onScanLimitChange,
  previewImage,
  onPreviewImageChange,
}) => {
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onPreviewImageChange(dataUrl);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div className="space-y-4">
      <Card size="small" title="Configure advanced settings">
        <div className="space-y-4">
          <div>
            <Text strong>Password Protection</Text>
            <div className="mt-2">
              <Input.Password
                placeholder="Leave empty for no password"
                value={password || ''}
                onChange={(e) => onPasswordChange(e.target.value || null)}
              />
            </div>
          </div>

          <div>
            <Text strong>Expiration Date</Text>
            <div className="mt-2">
              <DatePicker
                showTime
                style={{ width: '100%' }}
                value={expirationDate ? moment(expirationDate) : null}
                onChange={(dt) => onExpirationChange(dt ? dt.toISOString() : null)}
                placeholder="Select expiration"
              />
            </div>
          </div>

          <div>
            <Text strong>Scan Limit</Text>
            <div className="mt-2 flex items-center gap-3">
              <InputNumber
                min={1}
                placeholder="Set maximum number of scans"
                value={scanLimit || undefined}
                onChange={(v) => onScanLimitChange(v ? Number(v) : null)}
              />
              <span className="text-sm text-muted-foreground">Leave empty for unlimited</span>
            </div>
          </div>

          <div>
            <Text strong>Preview Image</Text>
            <div className="mt-2 space-y-2">
              <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <Button icon={<UploadOutlined />}>Upload preview image</Button>
              </Upload>
              <Input
                placeholder="Or enter image URL"
                value={previewImage || ''}
                onChange={(e) => onPreviewImageChange(e.target.value || null)}
              />
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
