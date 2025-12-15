import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { QRTemplate, defaultTemplates } from '../../types/qrcode';

const { Title, Text } = Typography;

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate;
  onSelect: (template: QRTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Title level={3}>Choose Your Card Template</Title>
        <Text type="secondary">
          Select a template that matches your brand or style
        </Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {defaultTemplates.map((template) => (
          <Col key={template.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className={`qr-template-card ${
                selectedTemplate.id === template.id ? 'selected' : ''
              }`}
              onClick={() => onSelect(template)}
              bodyStyle={{ padding: 0 }}
            >
              <div
                className="h-40 rounded-t-xl flex flex-col items-center justify-center relative"
                style={{
                  backgroundColor: template.backgroundColor,
                  color: template.textColor,
                }}
              >
                {selectedTemplate.id === template.id && (
                  <CheckCircleFilled
                    className="absolute top-3 right-3 text-white text-xl"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                  />
                )}
                <h4 className="font-bold text-lg">{template.title}</h4>
                <p className="text-sm opacity-80">{template.subtitle}</p>
                <div className="mt-3 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-800 rounded" />
                </div>
              </div>
              <div className="p-4 text-center">
                <Text strong>{template.name}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelector;
