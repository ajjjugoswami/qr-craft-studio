import React, { useState } from 'react';
import { Typography, Tabs, Row, Col, Tag, Pagination } from 'antd';
import { DesignTemplate, designTemplates, QRStyling, defaultStyling } from '../../types/qrcode';

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

// Mini QR pattern preview component
const QRPatternPreview: React.FC<{ styling: Partial<QRStyling> }> = ({ styling }) => {
  const fgColor = styling.fgColor || '#000000';
  const bgColor = styling.bgColor || '#ffffff';
  const dotsType = styling.dotsType || 'square';
  const cornerColor = styling.cornersSquareOptions?.color || fgColor;
  
  // Get gradient colors if available
  const hasGradient = styling.dotsGradient?.colorStops;
  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine dot style based on dotsType
  const getDotRadius = () => {
    switch (dotsType) {
      case 'dots': return '50%';
      case 'rounded': return '25%';
      case 'extra-rounded': return '40%';
      case 'classy': return '15%';
      case 'classy-rounded': return '30%';
      default: return '0%';
    }
  };

  const getCornerRadius = () => {
    const cornerType = styling.cornersSquareOptions?.type || 'square';
    switch (cornerType) {
      case 'dot': return '50%';
      case 'rounded': return '25%';
      case 'extra-rounded': return '40%';
      case 'classy': return '15%';
      case 'classy-rounded': return '30%';
      default: return '2px';
    }
  };

  const dotRadius = getDotRadius();
  const cornerRadius = getCornerRadius();

  // Create a simplified QR pattern
  const pattern = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
  ];

  return (
    <div 
      className="w-12 h-12 grid gap-[1px] p-[2px] rounded"
      style={{ 
        backgroundColor: bgColor,
        gridTemplateColumns: 'repeat(9, 1fr)',
        border: bgColor === '#ffffff' || bgColor === '#fff' ? '1px solid #e5e7eb' : 'none'
      }}
    >
      {hasGradient && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {styling.dotsGradient?.colorStops?.map((stop, i) => (
                <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        </svg>
      )}
      {pattern.flat().map((cell, i) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const isCorner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
        
        return (
          <div
            key={i}
            style={{
              backgroundColor: cell 
                ? (isCorner ? cornerColor : fgColor)
                : 'transparent',
              borderRadius: isCorner ? cornerRadius : dotRadius,
              aspectRatio: '1',
              background: cell && hasGradient && !isCorner 
                ? `url(#${gradientId})` 
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

const QRDesignTemplates: React.FC<QRDesignTemplatesProps> = ({
  styling,
  onStyleChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const filteredTemplates = activeCategory === 'all' 
    ? designTemplates 
    : designTemplates.filter(t => t.category === activeCategory);

  const totalTemplates = filteredTemplates.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectTemplate = (template: DesignTemplate) => {
    const templateStyling = { ...template.styling };
    delete templateStyling.size;
    delete templateStyling.level;
    delete templateStyling.includeMargin;
    
    onStyleChange({
      ...defaultStyling,
      size: styling.size,
      level: styling.level,
      includeMargin: styling.includeMargin,
      ...templateStyling,
    });
  };

  const isSelected = (template: DesignTemplate) => {
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
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={(key) => {
          setActiveCategory(key);
          setCurrentPage(1);
        }}
        items={tabItems}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        {currentTemplates.map((template) => (
          <Col key={template.id} xs={12} sm={8} md={6}>
            <div
              onClick={() => handleSelectTemplate(template)}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-3
                hover:border-primary hover:shadow-md
                ${isSelected(template)
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border bg-background'
                }
              `}
            >
              <QRPatternPreview styling={template.styling} />
              <Text className="text-center text-sm font-medium">{template.name}</Text>
              <Tag color={categoryConfig[template.category]?.color}>
                {categoryConfig[template.category]?.label}
              </Tag>
            </div>
          </Col>
        ))}
      </Row>

      {totalTemplates > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={totalTemplates}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} templates`}
          />
        </div>
      )}
    </div>
  );
};

export default QRDesignTemplates;
