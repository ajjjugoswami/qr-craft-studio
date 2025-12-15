import React from 'react';
import { Typography, Input, ColorPicker, Slider, Select, Switch, Tabs, Segmented, Row, Col, Collapse } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Type,
  Palette,
  Layout,
  Square
} from 'lucide-react';
import { QRTemplate } from '../../types/qrcode';

const { Text } = Typography;

interface TemplateCustomizerProps {
  template: QRTemplate;
  onTemplateChange: (template: QRTemplate) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lato', label: 'Lato' },
];

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  onTemplateChange,
}) => {
  const handleColorChange = (key: 'backgroundColor' | 'textColor' | 'gradientColor' | 'borderColor' | 'accentColor', color: Color) => {
    onTemplateChange({
      ...template,
      [key]: color.toHexString(),
    });
  };

  const tabItems = [
    {
      key: 'text',
      label: <span className="flex items-center gap-1"><Type size={14} /> Text</span>,
      children: (
        <div className="pt-4 space-y-5">
          <Row gutter={16}>
            <Col span={24}>
              <Text strong className="block mb-2">Card Title</Text>
              <Input
                value={template.title}
                onChange={(e) => onTemplateChange({ ...template, title: e.target.value })}
                placeholder="Enter title"
                size="large"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Text strong className="block mb-2">Subtitle</Text>
              <Input
                value={template.subtitle}
                onChange={(e) => onTemplateChange({ ...template, subtitle: e.target.value })}
                placeholder="Enter subtitle"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Text strong className="block mb-2">Font Family</Text>
              <Select
                value={template.fontFamily || 'Inter'}
                onChange={(value) => onTemplateChange({ ...template, fontFamily: value })}
                className="w-full"
                options={fontOptions}
              />
            </Col>
          </Row>

          <Collapse 
            ghost 
            items={[
              {
                key: 'title-settings',
                label: <Text strong>Title Settings</Text>,
                children: (
                  <div className="space-y-4">
                    <div>
                      <Text className="block mb-2">Size: {template.titleFontSize || 24}px</Text>
                      <Slider
                        min={14}
                        max={40}
                        value={template.titleFontSize || 24}
                        onChange={(value) => onTemplateChange({ ...template, titleFontSize: value })}
                      />
                    </div>
                    <div>
                      <Text className="block mb-2">Weight</Text>
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
                      <Text className="block mb-2">Letter Spacing: {template.titleLetterSpacing || 0}px</Text>
                      <Slider
                        min={-2}
                        max={10}
                        value={template.titleLetterSpacing || 0}
                        onChange={(value) => onTemplateChange({ ...template, titleLetterSpacing: value })}
                      />
                    </div>
                  </div>
                )
              },
              {
                key: 'subtitle-settings',
                label: <Text strong>Subtitle Settings</Text>,
                children: (
                  <div className="space-y-4">
                    <div>
                      <Text className="block mb-2">Size: {template.subtitleFontSize || 14}px</Text>
                      <Slider
                        min={10}
                        max={24}
                        value={template.subtitleFontSize || 14}
                        onChange={(value) => onTemplateChange({ ...template, subtitleFontSize: value })}
                      />
                    </div>
                    <div>
                      <Text className="block mb-2">Weight</Text>
                      <Select
                        value={template.subtitleFontWeight || 'normal'}
                        onChange={(value) => onTemplateChange({ ...template, subtitleFontWeight: value })}
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
                      <Text className="block mb-2">Letter Spacing: {template.subtitleLetterSpacing || 0}px</Text>
                      <Slider
                        min={-2}
                        max={10}
                        value={template.subtitleLetterSpacing || 0}
                        onChange={(value) => onTemplateChange({ ...template, subtitleLetterSpacing: value })}
                      />
                    </div>
                  </div>
                )
              }
            ]}
          />

          <div>
            <Text strong className="block mb-2">Text Alignment</Text>
            <Segmented
              value={template.textAlign || 'center'}
              onChange={(value) => onTemplateChange({ ...template, textAlign: value as 'left' | 'center' | 'right' })}
              options={[
                { value: 'left', icon: <AlignLeft size={16} /> },
                { value: 'center', icon: <AlignCenter size={16} /> },
                { value: 'right', icon: <AlignRight size={16} /> },
              ]}
              block
            />
          </div>
        </div>
      ),
    },
    {
      key: 'colors',
      label: <span className="flex items-center gap-1"><Palette size={14} /> Colors</span>,
      children: (
        <div className="pt-4 space-y-5">
          <Row gutter={16}>
            <Col span={12}>
              <Text strong className="block mb-2">Background</Text>
              <ColorPicker
                value={template.backgroundColor}
                onChange={(color) => handleColorChange('backgroundColor', color)}
                showText
                size="large"
              />
            </Col>
            <Col span={12}>
              <Text strong className="block mb-2">Text Color</Text>
              <ColorPicker
                value={template.textColor}
                onChange={(color) => handleColorChange('textColor', color)}
                showText
                size="large"
              />
            </Col>
          </Row>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Text strong>Enable Gradient</Text>
              <Text type="secondary" className="block text-xs">
                Add a gradient effect
              </Text>
            </div>
            <Switch
              checked={template.showGradient || false}
              onChange={(checked) => onTemplateChange({ ...template, showGradient: checked })}
            />
          </div>

          {template.showGradient && (
            <Row gutter={16}>
              <Col span={12}>
                <Text strong className="block mb-2">Gradient Color</Text>
                <ColorPicker
                  value={template.gradientColor || template.backgroundColor}
                  onChange={(color) => handleColorChange('gradientColor', color)}
                  showText
                  size="large"
                />
              </Col>
              <Col span={12}>
                <Text strong className="block mb-2">Direction</Text>
                <Select
                  value={template.gradientDirection || 'to-bottom-right'}
                  onChange={(value) => onTemplateChange({ ...template, gradientDirection: value })}
                  className="w-full"
                  options={[
                    { value: 'to-bottom', label: '↓ To Bottom' },
                    { value: 'to-right', label: '→ To Right' },
                    { value: 'to-bottom-right', label: '↘ Diagonal' },
                    { value: 'to-top-right', label: '↗ Up Diagonal' },
                  ]}
                />
              </Col>
            </Row>
          )}

          <div>
            <Text strong className="block mb-2">Accent Color</Text>
            <ColorPicker
              value={template.accentColor || template.textColor}
              onChange={(color) => handleColorChange('accentColor', color)}
              showText
              size="large"
            />
            <Text type="secondary" className="text-xs mt-1 block">Used for decorative elements</Text>
          </div>

          <div>
            <Text strong className="block mb-3">Quick Colors</Text>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#1a1a2e', '#1e40af', '#065f46', '#5b21b6', '#c2410c', '#be185d', '#0f766e', '#991b1b',
                '#334155', '#000000', '#7c3aed', '#0077b6', '#ff6b6b', '#14532d', '#833ab4', '#78350f'
              ].map((color) => (
                <div
                  key={color}
                  className="w-full aspect-square rounded-lg cursor-pointer border-2 border-transparent hover:border-primary hover:scale-110 transition-all"
                  style={{ backgroundColor: color }}
                  onClick={() => onTemplateChange({ ...template, backgroundColor: color })}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'layout',
      label: <span className="flex items-center gap-1"><Layout size={14} /> Layout</span>,
      children: (
        <div className="pt-4 space-y-5">
          <div>
            <Text strong className="block mb-2">QR Code Position</Text>
            <Segmented
              value={template.qrPosition || 'bottom'}
              onChange={(value) => onTemplateChange({ ...template, qrPosition: value as 'top' | 'center' | 'bottom' })}
              options={[
                { value: 'top', label: 'Top', icon: <ArrowUp size={14} /> },
                { value: 'center', label: 'Center', icon: <Minus size={14} /> },
                { value: 'bottom', label: 'Bottom', icon: <ArrowDown size={14} /> },
              ]}
              block
            />
          </div>

          <div>
            <Text strong className="block mb-2">Border Radius: {template.borderRadius || 16}px</Text>
            <Slider
              min={0}
              max={40}
              value={template.borderRadius || 16}
              onChange={(value) => onTemplateChange({ ...template, borderRadius: value })}
            />
          </div>

          <div>
            <Text strong className="block mb-2">Padding: {template.padding || 24}px</Text>
            <Slider
              min={12}
              max={48}
              value={template.padding || 24}
              onChange={(value) => onTemplateChange({ ...template, padding: value })}
            />
          </div>

          <div>
            <Text strong className="block mb-2">Shadow Intensity</Text>
            <Segmented
              value={template.shadowIntensity || 'medium'}
              onChange={(value) => onTemplateChange({ ...template, shadowIntensity: value as 'none' | 'light' | 'medium' | 'strong' })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'light', label: 'Light' },
                { value: 'medium', label: 'Medium' },
                { value: 'strong', label: 'Strong' },
              ]}
              block
            />
          </div>

          <div>
            <Text strong className="block mb-2">Decorative Style</Text>
            <Segmented
              value={template.decorativeStyle || 'circles'}
              onChange={(value) => onTemplateChange({ ...template, decorativeStyle: value as 'none' | 'circles' | 'dots' | 'lines' | 'geometric' })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'circles', label: 'Circles' },
                { value: 'dots', label: 'Dots' },
                { value: 'lines', label: 'Lines' },
                { value: 'geometric', label: 'Shapes' },
              ]}
              block
            />
          </div>
        </div>
      ),
    },
    {
      key: 'border',
      label: <span className="flex items-center gap-1"><Square size={14} /> Border</span>,
      children: (
        <div className="pt-4 space-y-5">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Text strong>Show Border</Text>
              <Text type="secondary" className="block text-xs">
                Add a border around the card
              </Text>
            </div>
            <Switch
              checked={template.showBorder || false}
              onChange={(checked) => onTemplateChange({ ...template, showBorder: checked })}
            />
          </div>

          {template.showBorder && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong className="block mb-2">Border Color</Text>
                  <ColorPicker
                    value={template.borderColor || '#e5e7eb'}
                    onChange={(color) => handleColorChange('borderColor', color)}
                    showText
                    size="large"
                  />
                </Col>
                <Col span={12}>
                  <Text strong className="block mb-2">Width: {template.borderWidth || 1}px</Text>
                  <Slider
                    min={1}
                    max={6}
                    value={template.borderWidth || 1}
                    onChange={(value) => onTemplateChange({ ...template, borderWidth: value })}
                  />
                </Col>
              </Row>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Tabs items={tabItems} size="small" />
    </div>
  );
};

export default TemplateCustomizer;