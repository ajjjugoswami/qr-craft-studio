import React from 'react';
import { Typography, ColorPicker, Segmented } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface ColorsTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ styling, onStyleChange }) => {
  const handleColorChange = (key: 'fgColor' | 'bgColor', color: Color) => {
    onStyleChange({
      ...styling,
      [key]: color.toHexString(),
    });
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <Text strong className="block mb-3">QR Code Color Type</Text>
        <Segmented
          options={['Solid', 'Linear', 'Radial']}
          defaultValue="Solid"
          block
          className="mb-4"
        />
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">QR Code Color</Text>
        <div className="flex items-center gap-3">
          <ColorPicker
            value={styling.fgColor}
            onChange={(color) => handleColorChange('fgColor', color)}
            showText
            size="large"
          />
          <Text type="secondary">{styling.fgColor}</Text>
        </div>
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Background Type</Text>
        <Segmented
          options={['Solid', 'Linear', 'Radial']}
          defaultValue="Solid"
          block
          className="mb-4"
        />
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Background Color</Text>
        <div className="flex items-center gap-3">
          <ColorPicker
            value={styling.bgColor}
            onChange={(color) => handleColorChange('bgColor', color)}
            showText
            size="large"
          />
          <Text type="secondary">{styling.bgColor}</Text>
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;