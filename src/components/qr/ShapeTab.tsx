/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Typography, Segmented, Radio, Collapse } from 'antd';
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

  const cornerSquareTypes = [
    { label: 'Square', value: 'square' },
    { label: 'Dot', value: 'dot' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Extra Rounded', value: 'extra-rounded' },
    { label: 'Classy', value: 'classy' },
    { label: 'Classy Rounded', value: 'classy-rounded' },
  ];

  const cornerDotTypes = [
    { label: 'Square', value: 'square' },
    { label: 'Dot', value: 'dot' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Classy', value: 'classy' },
    { label: 'Classy Rounded', value: 'classy-rounded' },
  ];

  const collapseItems = [
    {
      key: 'cornerSquare',
      label: 'Corner Square Style',
      children: (
        <Segmented
          options={cornerSquareTypes}
          value={styling.cornersSquareOptions?.type || 'square'}
          onChange={(value) =>
            onStyleChange({
              ...styling,
              cornersSquareOptions: {
                ...styling.cornersSquareOptions!,
                type: value as any,
              },
            })
          }
          block
        />
      ),
    },
    {
      key: 'cornerDot',
      label: 'Corner Dot Style',
      children: (
        <Segmented
          options={cornerDotTypes}
          value={styling.cornersDotOptions?.type || 'square'}
          onChange={(value) =>
            onStyleChange({
              ...styling,
              cornersDotOptions: {
                ...styling.cornersDotOptions!,
                type: value as any,
              },
            })
          }
          block
        />
      ),
    },
  ];

  return (
    <div className="pt-4 space-y-6">
      {/* QR Code Shape */}
      <div>
        <Text strong className="block mb-3">QR Code Shape</Text>
        <Radio.Group
          value={styling.shape || 'square'}
          onChange={(e) => onStyleChange({ ...styling, shape: e.target.value })}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="square">Square</Radio.Button>
          <Radio.Button value="circle">Circle</Radio.Button>
        </Radio.Group>
      </div>

      {/* Dot Style */}
      <div>
        <Text strong className="block mb-3">Dot Style</Text>
        <Segmented
          options={dotTypes}
          value={styling.dotsType}
          onChange={(value) => onStyleChange({ ...styling, dotsType: value as any })}
          block
        />
      </div>

      {/* Advanced Corner Options */}
      <div>
        <Text strong className="block mb-3">Advanced Corner Options</Text>
        <Collapse items={collapseItems} size="small" />
      </div>
    </div>
  );
};

export default ShapeTab;