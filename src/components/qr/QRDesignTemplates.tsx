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

// Mini QR pattern preview component (SVG so colors/gradients match reliably)
const QRPatternPreview: React.FC<{ styling: Partial<QRStyling>; id?: string }> = ({ styling, id }) => {
  const fgColor = styling.fgColor || '#000000';
  const bgColor = styling.bgColor || '#ffffff';
  const dotsType = styling.dotsType || 'square';
  const cornerColor = styling.cornersSquareOptions?.color || fgColor;
  const cornerType = styling.cornersSquareOptions?.type || 'square';

  const gradientStops = styling.dotsGradient?.colorStops;
  const hasGradient = Boolean(gradientStops && gradientStops.length);
  const gradientId = `qrprev-grad-${id || 'template'}`;

  const getRadius = (type: QRStyling['dotsType'] | QRStyling['cornersSquareOptions']['type']) => {
    switch (type) {
      case 'dots':
      case 'dot':
        return 0.5;
      case 'rounded':
        return 0.22;
      case 'extra-rounded':
        return 0.38;
      case 'classy':
        return 0.16;
      case 'classy-rounded':
        return 0.3;
      default:
        return 0.06;
    }
  };

  const dotR = getRadius(dotsType);
  const cornerR = getRadius(cornerType);

  // Simplified 9x9 pattern (just for preview)
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

  const isCorner = (row: number, col: number) =>
    (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);

  const fillFor = (corner: boolean) => {
    if (corner) return cornerColor;
    if (hasGradient) return `url(#${gradientId})`;
    return fgColor;
  };

  return (
    <div
      className="w-12 h-12 rounded"
      style={{
        backgroundColor: bgColor,
        border: bgColor.toLowerCase() === '#ffffff' || bgColor.toLowerCase() === '#fff' ? '1px solid #e5e7eb' : 'none',
      }}
    >
      <svg
        viewBox="0 0 9 9"
        width="48"
        height="48"
        className="block"
        aria-hidden="true"
      >
        {hasGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {gradientStops!.map((stop, i) => (
                <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
        )}

        {/* background */}
        <rect x={0} y={0} width={9} height={9} fill={bgColor} />

        {/* modules */}
        {pattern.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            if (!cell) return null;
            const corner = isCorner(r, c);

            // “dots” type is best represented as circles
            if (!corner && dotsType === 'dots') {
              return (
                <circle
                  key={`${r}-${c}`}
                  cx={c + 0.5}
                  cy={r + 0.5}
                  r={0.42}
                  fill={fillFor(false)}
                />
              );
            }

            const rr = corner ? cornerR : dotR;
            return (
              <rect
                key={`${r}-${c}`}
                x={c + 0.08}
                y={r + 0.08}
                width={0.84}
                height={0.84}
                rx={rr}
                ry={rr}
                fill={fillFor(corner)}
              />
            );
          })
        )}
      </svg>
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
              <QRPatternPreview styling={template.styling} id={template.id} />
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
