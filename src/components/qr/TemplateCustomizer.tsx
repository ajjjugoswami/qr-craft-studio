import React from 'react';
import { Typography, Input, ColorPicker, Slider, Select, Switch, Tabs, Segmented, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
  AlignLeftOutlined, 
  AlignCenterOutlined, 
  AlignRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { QRTemplate } from '../../types/qrcode';

const { Title, Text } = Typography;

interface TemplateCustomizerProps {
  template: QRTemplate;
  onTemplateChange: (template: QRTemplate) => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  onTemplateChange,
}) => {
  const handleColorChange = (key: 'backgroundColor' | 'textColor' | 'gradientColor', color: Color) => {
    onTemplateChange({
      ...template,
      [key]: color.toHexString(),
    });
  };

  const tabItems = [
    {
      key: 'text',
      label: 'Text',
      children: (
        <div className="pt-4 space-y-6">
          <div>
            <Text strong className="block mb-2">Card Title</Text>
            <Input
              value={template.title}
              onChange={(e) => onTemplateChange({ ...template, title: e.target.value })}
              placeholder="Enter title"
              size="large"
            />
          </div>

          <div>
            <Text strong className="block mb-2">Subtitle</Text>
            <Input
              value={template.subtitle}
              onChange={(e) => onTemplateChange({ ...template, subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Text strong className="block mb-2">Title Size: {template.titleFontSize || 24}px</Text>
              <Slider
                min={14}
                max={36}
                value={template.titleFontSize || 24}
                onChange={(value) => onTemplateChange({ ...template, titleFontSize: value })}
              />
            </Col>
            <Col span={12}>
              <Text strong className="block mb-2">Subtitle Size: {template.subtitleFontSize || 14}px</Text>
              <Slider
                min={10}
                max={20}
                value={template.subtitleFontSize || 14}
                onChange={(value) => onTemplateChange({ ...template, subtitleFontSize: value })}
              />
            </Col>
          </Row>

          <div>
            <Text strong className="block mb-2">Title Weight</Text>
            <Select
              value={template.titleFontWeight || 'bold'}
              onChange={(value) => onTemplateChange({ ...template, titleFontWeight: value })}
              className="w-full"
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'medium', label: 'Medium' },
                { value: 'semibold', label: 'Semi Bold' },
                { value: 'bold', label: 'Bold' },
              ]}
            />
          </div>

          <div>
            <Text strong className="block mb-2">Text Alignment</Text>
            <Segmented
              value={template.textAlign || 'center'}
              onChange={(value) => onTemplateChange({ ...template, textAlign: value as 'left' | 'center' | 'right' })}
              options={[
                { value: 'left', icon: <AlignLeftOutlined /> },
                { value: 'center', icon: <AlignCenterOutlined /> },
                { value: 'right', icon: <AlignRightOutlined /> },
              ]}
              block
            />
          </div>
        </div>
      ),
    },
    {
      key: 'colors',
      label: 'Colors',
      children: (
        <div className="pt-4 space-y-6">
          <div>
            <Text strong className="block mb-2">Background Color</Text>
            <div className="flex items-center gap-3">
              <ColorPicker
                value={template.backgroundColor}
                onChange={(color) => handleColorChange('backgroundColor', color)}
                showText
                size="large"
              />
            </div>
          </div>

          <div>
            <Text strong className="block mb-2">Text Color</Text>
            <div className="flex items-center gap-3">
              <ColorPicker
                value={template.textColor}
                onChange={(color) => handleColorChange('textColor', color)}
                showText
                size="large"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Text strong>Enable Gradient</Text>
              <Text type="secondary" className="block text-xs">
                Add a subtle gradient effect
              </Text>
            </div>
            <Switch
              checked={template.showGradient || false}
              onChange={(checked) => onTemplateChange({ ...template, showGradient: checked })}
            />
          </div>

          {template.showGradient && (
            <div>
              <Text strong className="block mb-2">Gradient Color</Text>
              <div className="flex items-center gap-3">
                <ColorPicker
                  value={template.gradientColor || template.backgroundColor}
                  onChange={(color) => handleColorChange('gradientColor', color)}
                  showText
                  size="large"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-6 gap-2">
            {['#1a1a2e', '#1e40af', '#065f46', '#5b21b6', '#c2410c', '#be185d', '#0f766e', '#991b1b', '#334155', '#000000'].map((color) => (
              <div
                key={color}
                className="w-full aspect-square rounded-lg cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                style={{ backgroundColor: color }}
                onClick={() => onTemplateChange({ ...template, backgroundColor: color })}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'layout',
      label: 'Layout',
      children: (
        <div className="pt-4 space-y-6">
          <div>
            <Text strong className="block mb-2">QR Code Position</Text>
            <Segmented
              value={template.qrPosition || 'bottom'}
              onChange={(value) => onTemplateChange({ ...template, qrPosition: value as 'top' | 'center' | 'bottom' })}
              options={[
                { value: 'top', label: 'Top', icon: <ArrowUpOutlined /> },
                { value: 'center', label: 'Center', icon: <MinusOutlined /> },
                { value: 'bottom', label: 'Bottom', icon: <ArrowDownOutlined /> },
              ]}
              block
            />
          </div>

          <div>
            <Text strong className="block mb-2">Border Radius: {template.borderRadius || 16}px</Text>
            <Slider
              min={0}
              max={32}
              value={template.borderRadius || 16}
              onChange={(value) => onTemplateChange({ ...template, borderRadius: value })}
            />
          </div>

          <div>
            <Text strong className="block mb-2">Padding: {template.padding || 24}px</Text>
            <Slider
              min={12}
              max={40}
              value={template.padding || 24}
              onChange={(value) => onTemplateChange({ ...template, padding: value })}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Tabs items={tabItems} />
    </div>
  );
};

export default TemplateCustomizer;
