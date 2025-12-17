/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Typography, Segmented, ColorPicker, Switch } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface FrameTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const FrameTab: React.FC<FrameTabProps> = ({ styling, onStyleChange }) => {
  const [squareGradientEnabled, setSquareGradientEnabled] = useState(!!styling.cornersSquareOptions?.gradient);
  const [dotGradientEnabled, setDotGradientEnabled] = useState(!!styling.cornersDotOptions?.gradient);
  const [squareGradientColor2, setSquareGradientColor2] = useState(styling.cornersSquareOptions?.gradient?.colorStops[1]?.color || '#000000');
  const [dotGradientColor2, setDotGradientColor2] = useState(styling.cornersDotOptions?.gradient?.colorStops[1]?.color || '#000000');

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

  const handleGradientToggle = (target: 'square' | 'dot', enabled: boolean) => {
    if (target === 'square') {
      setSquareGradientEnabled(enabled);
      if (enabled) {
        onStyleChange({
          ...styling,
          cornersSquareOptions: {
            ...styling.cornersSquareOptions!,
            gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: styling.cornersSquareOptions!.color },
                { offset: 1, color: squareGradientColor2 }
              ]
            }
          }
        });
      } else {
        onStyleChange({
          ...styling,
          cornersSquareOptions: {
            ...styling.cornersSquareOptions!,
            gradient: undefined
          }
        });
      }
    } else {
      setDotGradientEnabled(enabled);
      if (enabled) {
        onStyleChange({
          ...styling,
          cornersDotOptions: {
            ...styling.cornersDotOptions!,
            gradient: {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: styling.cornersDotOptions!.color },
                { offset: 1, color: dotGradientColor2 }
              ]
            }
          }
        });
      } else {
        onStyleChange({
          ...styling,
          cornersDotOptions: {
            ...styling.cornersDotOptions!,
            gradient: undefined
          }
        });
      }
    }
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
        <div className="mb-3">
          <Text className="block mb-2">Color</Text>
          <div className="flex items-center gap-3 mb-2">
            <ColorPicker
              value={styling.cornersSquareOptions?.color}
              onChange={(color) => handleCornerColorChange('cornersSquareOptions', color)}
              showText
              size="large"
            />
            <Text type="secondary">{styling.cornersSquareOptions?.color}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text>Gradient</Text>
            <Switch
              checked={squareGradientEnabled}
              onChange={(checked) => handleGradientToggle('square', checked)}
            />
          </div>
          {squareGradientEnabled && (
            <div className="flex items-center gap-3 mt-2">
              <ColorPicker
                value={squareGradientColor2}
                onChange={(color) => {
                  setSquareGradientColor2(color.toHexString());
                  handleGradientToggle('square', true);
                }}
                showText
                size="large"
              />
              <Text type="secondary">{squareGradientColor2}</Text>
            </div>
          )}
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
          <div className="flex items-center gap-3 mb-2">
            <ColorPicker
              value={styling.cornersDotOptions?.color}
              onChange={(color) => handleCornerColorChange('cornersDotOptions', color)}
              showText
              size="large"
            />
            <Text type="secondary">{styling.cornersDotOptions?.color}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text>Gradient</Text>
            <Switch
              checked={dotGradientEnabled}
              onChange={(checked) => handleGradientToggle('dot', checked)}
            />
          </div>
          {dotGradientEnabled && (
            <div className="flex items-center gap-3 mt-2">
              <ColorPicker
                value={dotGradientColor2}
                onChange={(color) => {
                  setDotGradientColor2(color.toHexString());
                  handleGradientToggle('dot', true);
                }}
                showText
                size="large"
              />
              <Text type="secondary">{dotGradientColor2}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameTab;