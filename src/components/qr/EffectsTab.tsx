import React from 'react';
import { Typography, Slider, Segmented, Switch } from 'antd';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface EffectsTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const EffectsTab: React.FC<EffectsTabProps> = ({ styling, onStyleChange }) => {
  const shadowOptions = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  return (
    <div className="pt-4 space-y-6">
      {/* Background Opacity */}
      <div>
        <Text strong className="block mb-3">
          Background Opacity: {styling.bgOpacity !== undefined ? styling.bgOpacity : 100}%
        </Text>
        <Slider
          min={0}
          max={100}
          value={styling.bgOpacity !== undefined ? styling.bgOpacity : 100}
          onChange={(value) => onStyleChange({ ...styling, bgOpacity: value })}
        />
        <Text type="secondary" className="text-xs">
          Set to 0 for a transparent background
        </Text>
      </div>

      {/* QR Code Rotation */}
      <div>
        <Text strong className="block mb-3">
          Rotation: {styling.rotation || 0}°
        </Text>
        <Slider
          min={0}
          max={360}
          step={15}
          value={styling.rotation || 0}
          onChange={(value) => onStyleChange({ ...styling, rotation: value })}
          marks={{
            0: '0°',
            90: '90°',
            180: '180°',
            270: '270°',
            360: '360°',
          }}
        />
      </div>

      {/* Shadow */}
      <div>
        <Text strong className="block mb-3">Shadow</Text>
        <Segmented
          options={shadowOptions}
          value={styling.shadow || 'none'}
          onChange={(value) => onStyleChange({ ...styling, shadow: value as 'none' | 'sm' | 'md' | 'lg' })}
          block
        />
      </div>

      {/* Gradient Rotation (if gradient is enabled) */}
      {(styling.dotsGradient || styling.backgroundGradient) && (
        <div>
          <Text strong className="block mb-3">
            Gradient Angle: {styling.gradientRotation || styling.dotsGradient?.rotation || 45}°
          </Text>
          <Slider
            min={0}
            max={360}
            step={15}
            value={styling.gradientRotation || styling.dotsGradient?.rotation || 45}
            onChange={(value) => {
              const updates: Partial<QRStyling> = { gradientRotation: value };
              if (styling.dotsGradient) {
                updates.dotsGradient = { ...styling.dotsGradient, rotation: value };
              }
              if (styling.backgroundGradient) {
                updates.backgroundGradient = { ...styling.backgroundGradient, rotation: value };
              }
              onStyleChange({ ...styling, ...updates });
            }}
          />
        </div>
      )}

      {/* Margin Size */}
      <div>
        <Text strong className="block mb-3">
          Margin Size: {styling.marginSize !== undefined ? styling.marginSize : 4}px
        </Text>
        <Slider
          min={0}
          max={20}
          value={styling.marginSize !== undefined ? styling.marginSize : 4}
          onChange={(value) => onStyleChange({ ...styling, marginSize: value })}
          disabled={!styling.includeMargin}
        />
        <div className="flex items-center justify-between mt-2">
          <Text type="secondary" className="text-xs">
            Enable margin to adjust size
          </Text>
          <Switch
            size="small"
            checked={styling.includeMargin}
            onChange={(checked) => onStyleChange({ ...styling, includeMargin: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsTab;
