import React from 'react';
import { Card, Typography, Input, ColorPicker, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
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
  const handleColorChange = (key: 'backgroundColor' | 'textColor', color: Color) => {
    onTemplateChange({
      ...template,
      [key]: color.toHexString(),
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Title level={3}>Customize Your Card Template</Title>
        <Text type="secondary">
          Click on any text to edit it. Customize colors and styling.
        </Text>
      </div>

      <Card className="max-w-xl mx-auto">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className="mb-4">
              <Text strong className="block mb-2">Card Title</Text>
              <Input
                value={template.title}
                onChange={(e) =>
                  onTemplateChange({ ...template, title: e.target.value })
                }
                placeholder="Enter title"
                size="large"
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="mb-4">
              <Text strong className="block mb-2">Subtitle</Text>
              <Input
                value={template.subtitle}
                onChange={(e) =>
                  onTemplateChange({ ...template, subtitle: e.target.value })
                }
                placeholder="Enter subtitle"
              />
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <Text strong className="block mb-2">Background Color</Text>
              <ColorPicker
                value={template.backgroundColor}
                onChange={(color) => handleColorChange('backgroundColor', color)}
                showText
              />
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <Text strong className="block mb-2">Text Color</Text>
              <ColorPicker
                value={template.textColor}
                onChange={(color) => handleColorChange('textColor', color)}
                showText
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TemplateCustomizer;
