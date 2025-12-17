import React, { useState } from 'react';
import { Typography, Tabs, Row, Col, Tag } from 'antd';
import {
  AppstoreOutlined,
  StarOutlined,
  BgColorsOutlined,
  BorderOutlined,
  ThunderboltOutlined,
  FireOutlined,
  CrownOutlined,
  ExperimentOutlined,
  MinusOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { DesignTemplate, designTemplates, QRStyling } from '../../types/qrcode';

const { Title, Text } = Typography;

interface QRDesignTemplatesProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  business: { label: 'business', color: 'blue' },
  creative: { label: 'creative', color: 'green' },
  minimal: { label: 'minimal', color: 'default' },
  vibrant: { label: 'vibrant', color: 'magenta' },
};

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    square: <BorderOutlined />,
    sparkles: <StarOutlined />,
    building: <AppstoreOutlined />,
    waves: <BgColorsOutlined />,
    sun: <ThunderboltOutlined />,
    tree: <StarOutlined />,
    circle: <BorderOutlined />,
    bolt: <ThunderboltOutlined />,
    briefcase: <AppstoreOutlined />,
    candy: <StarOutlined />,
    star: <StarOutlined />,
    palette: <BgColorsOutlined />,
    leaf: <StarOutlined />,
    minus: <MinusOutlined />,
    diamond: <CrownOutlined />,
    fire: <FireOutlined />,
    cpu: <ExperimentOutlined />,
  };
  return icons[iconName] || <BorderOutlined />;
};

const QRDesignTemplates: React.FC<QRDesignTemplatesProps> = ({
  styling,
  onStyleChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTemplates = activeCategory === 'all' 
    ? designTemplates 
    : designTemplates.filter(t => t.category === activeCategory);

  const handleSelectTemplate = (template: DesignTemplate) => {
    onStyleChange({
      ...styling,
      ...template.styling,
    });
  };

  const isSelected = (template: DesignTemplate) => {
    // Check if the template's styling matches the current styling
    const templateStyling = template.styling;
    return Object.keys(templateStyling).every(key => {
      const k = key as keyof QRStyling;
      return styling[k] === templateStyling[k];
    });
  };

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'business', label: 'Business' },
    { key: 'creative', label: 'Creative' },
    { key: 'minimal', label: 'Minimal' },
    { key: 'vibrant', label: 'Vibrant' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4} className="!mb-1">Choose Design Template</Title>
        <Text type="secondary">Optional: Pick a pre-designed template to apply professional styling instantly</Text>
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        items={tabItems}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        {filteredTemplates.map((template) => (
          <Col key={template.id} xs={12} sm={8} md={6}>
            <div
              onClick={() => handleSelectTemplate(template)}
              className={`
                p-6 rounded-xl border-2 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-3
                hover:border-primary hover:shadow-md
                ${isSelected(template)
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border bg-background'
                }
              `}
            >
              <span 
                className="text-3xl"
                style={{ color: template?.styling.fgColor }}
              >
                {getIcon(template.icon)}
              </span>
              <Text className="text-center text-sm font-medium">{template.name}</Text>
              <Tag color={categoryConfig[template.category]?.color}>
                {categoryConfig[template.category]?.label}
              </Tag>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QRDesignTemplates;
