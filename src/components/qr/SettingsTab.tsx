import React from 'react';
import { Typography, Slider, Radio, Switch } from 'antd';
import { QRStyling } from '../../types/qrcode';

const { Title, Text } = Typography;

interface SettingsTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ styling, onStyleChange }) => {
  return (
    <div className="pt-4">
      <div className="mb-6">
        <Text strong className="block mb-3">
          Size: {styling.size}px
        </Text>
        <Slider
          min={100}
          max={400}
          value={styling.size}
          onChange={(value) => onStyleChange({ ...styling, size: value })}
        />
        <Text type="secondary" className="block mt-2 text-xs">
          Changes are reflected in the live preview. Larger sizes provide better scannability.
        </Text>
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Error Correction Level</Text>
        <Radio.Group
          value={styling.level}
          onChange={(e) => onStyleChange({ ...styling, level: e.target.value })}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="L">Low (7%)</Radio.Button>
          <Radio.Button value="M">Medium (15%)</Radio.Button>
          <Radio.Button value="Q">Quartile (25%)</Radio.Button>
          <Radio.Button value="H">High (30%)</Radio.Button>
        </Radio.Group>
        <Text type="secondary" className="block mt-2 text-xs">
          Higher levels allow more damage but result in denser QR codes
        </Text>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div>
          <Text strong>Include Margin</Text>
          <Text type="secondary" className="block text-xs">
            Add white space around the QR code for better scanning
          </Text>
        </div>
        <Switch
          checked={styling.includeMargin}
          onChange={(checked) =>
            onStyleChange({ ...styling, includeMargin: checked })
          }
        />
      </div>
    </div>
  );
};

export default SettingsTab;