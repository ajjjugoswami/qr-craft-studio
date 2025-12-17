/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Typography, Segmented, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface FrameTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const FrameTab: React.FC<FrameTabProps> = ({ styling, onStyleChange }) => {
  const cornerTypes = [
    { label: 'Dot', value: 'dot' },
    { label: 'Square', value: 'square' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Extra Rounded', value: 'extra-rounded' },
    { label: 'Dots', value: 'dots' },
    { label: 'Classy', value: 'classy' },
    { label: 'Classy Rounded', value: 'classy-rounded' },
  ];

  const handleCornerColorChange = (key: 'cornersSquareOptions' | 'cornersDotOptions', color: Color) => {
    onStyleChange({
      ...styling,
      [key]: {
        ...styling[key]!,
        color: color.toHexString(),
      },
    });
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <Text strong className="block mb-3">Corner Squares</Text>
        <div className="mb-3">
          <Text className="block mb-2">Type</Text>
          <Segmented
            options={cornerTypes}
            value={styling.cornersSquareOptions?.type}
            onChange={(value) =>
              onStyleChange({
                ...styling,
                cornersSquareOptions: { ...styling.cornersSquareOptions!, type: value as any },
              })
            }
            block
          />
        </div>
        <div>
          <Text className="block mb-2">Color</Text>
          <div className="flex items-center gap-3">
            <ColorPicker
              value={styling.cornersSquareOptions?.color}
              onChange={(color) => handleCornerColorChange('cornersSquareOptions', color)}
              showText
              size="large"
            />
            <Text type="secondary">{styling.cornersSquareOptions?.color}</Text>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Corner Dots</Text>
        <div className="mb-3">
          <Text className="block mb-2">Type</Text>
          <Segmented
            options={cornerTypes}
            value={styling.cornersDotOptions?.type}
            onChange={(value) =>
              onStyleChange({
                ...styling,
                cornersDotOptions: { ...styling.cornersDotOptions!, type: value as any },
              })
            }
            block
          />
        </div>
        <div>
          <Text className="block mb-2">Color</Text>
          <div className="flex items-center gap-3">
            <ColorPicker
              value={styling.cornersDotOptions?.color}
              onChange={(color) => handleCornerColorChange('cornersDotOptions', color)}
              showText
              size="large"
            />
            <Text type="secondary">{styling.cornersDotOptions?.color}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameTab;