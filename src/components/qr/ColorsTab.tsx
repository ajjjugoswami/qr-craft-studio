import React, { useState } from 'react';
import { Typography, ColorPicker, Segmented, Slider } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface ColorsTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const ColorsTab: React.FC<ColorsTabProps> = ({ styling, onStyleChange }) => {
  const [fgGradientType, setFgGradientType] = useState<'solid' | 'linear' | 'radial'>('solid');
  const [bgGradientType, setBgGradientType] = useState<'solid' | 'linear' | 'radial'>('solid');
  const [fgGradientColor2, setFgGradientColor2] = useState('#000000');
  const [bgGradientColor2, setBgGradientColor2] = useState('#ffffff');

  const handleColorChange = (key: 'fgColor' | 'bgColor', color: Color) => {
    onStyleChange({
      ...styling,
      [key]: color.toHexString(),
    });
  };

  const handleGradientChange = (target: 'fg' | 'bg', type: 'solid' | 'linear' | 'radial') => {
    if (target === 'fg') {
      setFgGradientType(type);
      if (type === 'solid') {
        onStyleChange({
          ...styling,
          dotsGradient: undefined,
        });
      } else {
        onStyleChange({
          ...styling,
          dotsGradient: {
            type,
            rotation: type === 'linear' ? 45 : 0,
            colorStops: [
              { offset: 0, color: styling.fgColor },
              { offset: 1, color: fgGradientColor2 }
            ]
          }
        });
      }
    } else {
      setBgGradientType(type);
      if (type === 'solid') {
        onStyleChange({
          ...styling,
          backgroundGradient: undefined,
        });
      } else {
        onStyleChange({
          ...styling,
          backgroundGradient: {
            type,
            rotation: type === 'linear' ? 45 : 0,
            colorStops: [
              { offset: 0, color: styling.bgColor },
              { offset: 1, color: bgGradientColor2 }
            ]
          }
        });
      }
    }
  };

  return (
    <div className="pt-4 space-y-6">
      {/* QR Code Color Section */}
      <div>
        <Text strong className="block mb-3">QR Code Color Type</Text>
        <Segmented
          options={['Solid', 'Linear', 'Radial']}
          value={fgGradientType === 'solid' ? 'Solid' : fgGradientType === 'linear' ? 'Linear' : 'Radial'}
          onChange={(value) => handleGradientChange('fg', value === 'Solid' ? 'solid' : value === 'Linear' ? 'linear' : 'radial')}
          block
          className="mb-4"
        />
      </div>

      <div>
        <Text strong className="block mb-3">QR Code Color</Text>
        <div className="flex items-center gap-3 mb-3">
          <ColorPicker
            value={styling.fgColor}
            onChange={(color) => handleColorChange('fgColor', color)}
            showText
            size="large"
          />
          <Text type="secondary">{styling.fgColor}</Text>
        </div>
        {fgGradientType !== 'solid' && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <ColorPicker
                value={fgGradientColor2}
                onChange={(color) => {
                  setFgGradientColor2(color.toHexString());
                  handleGradientChange('fg', fgGradientType);
                }}
                showText
                size="large"
              />
              <Text type="secondary">{fgGradientColor2}</Text>
            </div>
            <div>
              <Text className="block mb-2 text-sm">Gradient Angle: {styling.dotsGradient?.rotation || 45}°</Text>
              <Slider
                min={0}
                max={360}
                step={15}
                value={styling.dotsGradient?.rotation || 45}
                onChange={(value) => {
                  if (styling.dotsGradient) {
                    onStyleChange({
                      ...styling,
                      dotsGradient: { ...styling.dotsGradient, rotation: value },
                    });
                  }
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Background Color Section */}
      <div>
        <Text strong className="block mb-3">Background Type</Text>
        <Segmented
          options={['Solid', 'Linear', 'Radial']}
          value={bgGradientType === 'solid' ? 'Solid' : bgGradientType === 'linear' ? 'Linear' : 'Radial'}
          onChange={(value) => handleGradientChange('bg', value === 'Solid' ? 'solid' : value === 'Linear' ? 'linear' : 'radial')}
          block
          className="mb-4"
        />
      </div>

      <div>
        <Text strong className="block mb-3">Background Color</Text>
        <div className="flex items-center gap-3 mb-3">
          <ColorPicker
            value={styling.bgColor}
            onChange={(color) => handleColorChange('bgColor', color)}
            showText
            size="large"
          />
          <Text type="secondary">{styling.bgColor}</Text>
        </div>
        {bgGradientType !== 'solid' && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <ColorPicker
                value={bgGradientColor2}
                onChange={(color) => {
                  setBgGradientColor2(color.toHexString());
                  handleGradientChange('bg', bgGradientType);
                }}
                showText
                size="large"
              />
              <Text type="secondary">{bgGradientColor2}</Text>
            </div>
            <div>
              <Text className="block mb-2 text-sm">Gradient Angle: {styling.backgroundGradient?.rotation || 45}°</Text>
              <Slider
                min={0}
                max={360}
                step={15}
                value={styling.backgroundGradient?.rotation || 45}
                onChange={(value) => {
                  if (styling.backgroundGradient) {
                    onStyleChange({
                      ...styling,
                      backgroundGradient: { ...styling.backgroundGradient, rotation: value },
                    });
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ColorsTab;