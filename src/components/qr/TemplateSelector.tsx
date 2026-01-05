import React, { useState, useCallback, useMemo } from 'react';
import { Typography, Segmented, Pagination } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { QrCode } from 'lucide-react';
import { QRTemplate, defaultTemplates } from '../../types/qrcode';

const { Title, Text } = Typography;

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate | null;
  onSelect: (template: QRTemplate | null) => void;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'professional', label: 'Professional' },
  { value: 'social', label: 'Social' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'themed', label: 'Themed' },
];

const getCategoryForTemplate = (template: QRTemplate): string => {
  const name = template.name.toLowerCase();
  const id = template.id.toLowerCase();
  
  // Social media templates
  if (id.includes('instagram') || id.includes('facebook') || id.includes('youtube') || 
      id.includes('linkedin') || id.includes('whatsapp') ||
      id.includes('twitter') || id.includes('pinterest') || id.includes('social-follow')) return 'social';
  
  // Restaurant templates
  if (id.includes('restaurant') || id.includes('bistro') || id.includes('cafe') || 
      id.includes('sushi') || id.includes('pizzeria') || id.includes('foodtruck') ||
      id.includes('bar') || name.includes('menu') || name.includes('café')) return 'restaurant';
  
  // Professional templates
  if (id.includes('professional') || id.includes('corporate') || id.includes('lawfirm') ||
      id.includes('medical') || id.includes('realestate') || id.includes('consulting') ||
      id.includes('techstartup') || id.includes('fitness') || id.includes('beauty') ||
      id.includes('photography') || id.includes('business-card')) return 'professional';
  
  // Themed templates
  if (id.includes('tech-cyber') || id.includes('podcast-episode') || id.includes('product-launch-tech') || 
      id.includes('download-app') || id.includes('artisan-guild') || id.includes('velvet-lounge') ||
      id.includes('cosmic') || id.includes('dragon') || id.includes('silk-sage') || 
      id.includes('iron-spark') || id.includes('quick-checkin') || id.includes('my-work-portfolio')) return 'themed';
  
  if (name.includes('luxury') || name.includes('premium') || name.includes('gold') || name.includes('wine')) return 'luxury';
  if (name.includes('neon') || name.includes('sunset') || name.includes('aurora') || name.includes('party') || name.includes('ocean wave')) return 'vibrant';
  if (name.includes('minimal') || name.includes('elegant') || name.includes('white') || name.includes('slate')) return 'minimal';
  
  return 'professional';
};

const TemplateSelector: React.FC<TemplateSelectorProps> = React.memo(({
  selectedTemplate,
  onSelect,
}) => {
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 11; // 11 templates + 1 "No Template" option = 12 per page

  const filteredTemplates = useMemo(() => 
    defaultTemplates.filter((template) => {
      const matchesCategory = category === 'all' || getCategoryForTemplate(template) === category;
      return matchesCategory;
    }),
    [category]
  );

  const totalTemplates = filteredTemplates.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTemplates = useMemo(() => 
    filteredTemplates.slice(startIndex, endIndex),
    [filteredTemplates, startIndex, endIndex]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setCurrentPage(1);
  }, []);

  const handleSelectTemplate = useCallback((template: QRTemplate | null) => {
    onSelect(template);
  }, [onSelect]);

  // Show "No Template" option only on first page of "All" category
  const showNoTemplate = category === 'all' && currentPage === 1;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4}>Choose Your Card Template</Title>
        <Text type="secondary" className="text-sm">
          Select a template to customize your QR code card, or choose "No Template" for a plain QR code
        </Text>
      </div>

      <div className="mb-6 space-y-4">
        <div className="-mx-4 px-4 overflow-x-auto">
          <div className="w-max">
            <Segmented
              value={category}
              onChange={handleCategoryChange}
              options={categories}
              size="middle"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* No Template Option - only show on first page of All category */}
        {showNoTemplate && (
          <div
            className={`
              rounded-xl cursor-pointer transition-all overflow-hidden
              hover:ring-2 hover:ring-primary hover:shadow-lg hover:scale-[1.02]
              ${selectedTemplate === null ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'ring-1 ring-border'}
            `}
            onClick={() => handleSelectTemplate(null)}
          >
            <div
              className="h-36 flex flex-col items-center justify-center relative p-4 bg-muted"
            >
              {selectedTemplate === null && (
                <CheckCircleFilled
                  className="absolute top-2 right-2 text-lg text-primary"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' 
                  }}
                />
              )}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md border border-border">
                <QrCode size={32} className="text-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Plain QR Code
              </p>
            </div>
            <div className="p-3 bg-card text-center border-t border-border">
              <Text strong className="text-sm truncate block">No Template</Text>
            </div>
          </div>
        )}

        {currentTemplates.map((template) => (
          <div
            key={template.id}
            className={`
              rounded-xl cursor-pointer transition-all overflow-hidden
              hover:ring-2 hover:ring-primary hover:shadow-lg hover:scale-[1.02]
              ${selectedTemplate?.id === template.id ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'ring-1 ring-border'}
            `}
            onClick={() => handleSelectTemplate(template)}
          >
            <div
              className="h-36 flex flex-col items-center justify-center relative p-4"
              style={{
                background: template.showGradient && template.gradientColor
                  ? `linear-gradient(${template.gradientDirection === 'to-bottom' ? '180deg' : template.gradientDirection === 'to-right' ? '90deg' : template.gradientDirection === 'to-top-right' ? '45deg' : '135deg'}, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)`
                  : template.backgroundColor,
                color: template.textColor,
                borderRadius: `${(template.borderRadius || 16) * 0.5}px ${(template.borderRadius || 16) * 0.5}px 0 0`,
              }}
            >
              {selectedTemplate?.id === template.id && (
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
                style={{ 
                  fontSize: `${Math.min((template.titleFontSize || 24) * 0.5, 14)}px`,
                  fontFamily: template.fontFamily || 'Inter',
                }}
              >
                {template.title}
              </h4>
              <p 
                className="text-xs opacity-80 text-center mt-1"
                style={{ fontFamily: template.fontFamily || 'Inter' }}
              >
                {template.subtitle}
              </p>
              <div className="mt-2 w-8 h-8 bg-white rounded flex items-center justify-center shadow">
                <div className="w-6 h-6 bg-gray-800 rounded-sm" />
              </div>
            </div>
            <div className="p-3 bg-card text-center border-t border-border">
              <Text strong className="text-sm truncate block">{template.name}</Text>
            </div>
          </div>
        ))}
      </div>

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

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Text type="secondary">No templates found</Text>
        </div>
      )}
    </div>
  );
});

TemplateSelector.displayName = 'TemplateSelector';

export default TemplateSelector;