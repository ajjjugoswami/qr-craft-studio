import React, { useState } from 'react';
import { Typography, Row, Col, Tabs } from 'antd';
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
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All Templates' },
    { key: 'professional', label: 'Professional' },
    { key: 'creative', label: 'Creative' },
    { key: 'minimal', label: 'Minimal' },
  ];

  const filterTemplates = () => {
    if (activeCategory === 'all') return defaultTemplates;
    
    const categoryMap: Record<string, string[]> = {
      professional: ['professional-dark', 'corporate-blue', 'slate-modern', 'elegant-white'],
      creative: ['luxury-gold', 'modern-purple', 'soft-pink', 'warm-orange'],
      minimal: ['minimalist', 'ocean-teal', 'fresh-green', 'ruby-red'],
    };
    
    return defaultTemplates.filter(t => categoryMap[activeCategory]?.includes(t.id));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4} className="!mb-1">Choose Your Card Template</Title>
        <Text type="secondary">
          Select a professional template that matches your brand
        </Text>
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        items={categories}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        {filterTemplates().map((template) => (
          <Col key={template.id} xs={12} sm={8} md={6}>
            <div
              className={`
                rounded-xl cursor-pointer transition-all overflow-hidden
                hover:ring-2 hover:ring-primary hover:shadow-lg
                ${selectedTemplate.id === template.id ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'}
              `}
              onClick={() => onSelect(template)}
            >
              <div
                className="h-32 flex flex-col items-center justify-center relative p-4"
                style={{
                  background: template.showGradient && template.gradientColor
                    ? `linear-gradient(135deg, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)`
                    : template.backgroundColor,
                  color: template.textColor,
                }}
              >
                {selectedTemplate.id === template.id && (
                  <CheckCircleFilled
                    className="absolute top-2 right-2 text-lg"
                    style={{ 
                      color: template.textColor,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' 
                    }}
                  />
                )}
                <h4 
                  className="font-bold text-sm text-center leading-tight"
                  style={{ fontSize: `${(template.titleFontSize || 24) * 0.5}px` }}
                >
                  {template.title}
                </h4>
                <p className="text-xs opacity-80 text-center mt-1">
                  {template.subtitle}
                </p>
                <div className="mt-2 w-8 h-8 bg-white rounded flex items-center justify-center shadow">
                  <div className="w-6 h-6 bg-gray-800 rounded-sm" />
                </div>
              </div>
              <div className="p-3 bg-card text-center border-t border-border">
                <Text strong className="text-sm">{template.name}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateSelector;
