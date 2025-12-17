/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Typography, Segmented, Radio } from 'antd';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface ShapeTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const ShapeTab: React.FC<ShapeTabProps> = ({ styling, onStyleChange }) => {
  const dotTypes = [
    { label: 'Square', value: 'square' },
    { label: 'Dots', value: 'dots' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Extra Rounded', value: 'extra-rounded' },
    { label: 'Classy', value: 'classy' },
    { label: 'Classy Rounded', value: 'classy-rounded' },
  ];

  return (
    <div className="pt-4">
      <div className="mb-6">
        <Text strong className="block mb-3">QR Code Shape</Text>
        <Radio.Group
          value={styling.shape}
          onChange={(e) => onStyleChange({ ...styling, shape: e.target.value })}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="square">Square</Radio.Button>
          <Radio.Button value="circle">Circle</Radio.Button>
        </Radio.Group>
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Dot Style</Text>
        <Segmented
          options={dotTypes}
          value={styling.dotsType}
          onChange={(value) => onStyleChange({ ...styling, dotsType: value as any })}
          block
        />
      </div>
    </div>
  );
};

export default ShapeTab;