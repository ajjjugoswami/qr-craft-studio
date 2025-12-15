import React from 'react';
import { Typography, Slider, Radio, ColorPicker, Switch, Row, Col, Tabs, Segmented } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Title, Text } = Typography;

interface QRStyleEditorProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const QRStyleEditor: React.FC<QRStyleEditorProps> = ({
  styling,
  onStyleChange,
}) => {
  const handleColorChange = (key: 'fgColor' | 'bgColor', color: Color) => {
    onStyleChange({
      ...styling,
      [key]: color.toHexString(),
    });
  };

  const tabItems = [
    {
      key: 'colors',
      label: 'Colors',
      children: (
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
      ),
    },
    {
      key: 'settings',
      label: 'Settings',
      children: (
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
                Add white space around the QR code
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
      ),
    },
    {
      key: 'shape',
      label: 'Shape',
      children: (
        <div className="pt-4">
          <Text type="secondary">Shape customization coming soon...</Text>
        </div>
      ),
    },
    {
      key: 'logo',
      label: 'Logo',
      children: (
        <div className="pt-4">
          <Text type="secondary">Logo upload coming soon...</Text>
        </div>
      ),
    },
    {
      key: 'frame',
      label: 'Frame',
      children: (
        <div className="pt-4">
          <Text type="secondary">Frame customization coming soon...</Text>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4} className="!mb-1">Customize Design</Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
};

export default QRStyleEditor;
