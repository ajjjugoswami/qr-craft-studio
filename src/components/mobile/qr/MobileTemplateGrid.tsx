import React, { useState, useCallback, useMemo } from 'react';
import { Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { QrCode, ChevronLeft, ChevronRight } from 'lucide-react';
import { QRTemplate, defaultTemplates } from '@/types/qrcode';

const { Text } = Typography;

interface MobileTemplateGridProps {
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
  
  if (id.includes('instagram') || id.includes('facebook') || id.includes('youtube') || 
      id.includes('linkedin') || id.includes('whatsapp') ||
      id.includes('twitter') || id.includes('pinterest') || id.includes('social-follow')) return 'social';
  
  if (id.includes('restaurant') || id.includes('bistro') || id.includes('cafe') || 
      id.includes('sushi') || id.includes('pizzeria') || id.includes('foodtruck') ||
      id.includes('bar') || name.includes('menu') || name.includes('café')) return 'restaurant';
  
  if (id.includes('professional') || id.includes('corporate') || id.includes('lawfirm') ||
      id.includes('medical') || id.includes('realestate') || id.includes('consulting') ||
      id.includes('techstartup') || id.includes('fitness') || id.includes('beauty') ||
      id.includes('photography') || id.includes('business-card')) return 'professional';
  
  if (id.includes('tech-cyber') || id.includes('podcast-episode') || id.includes('product-launch-tech') || 
      id.includes('download-app') || id.includes('artisan-guild') || id.includes('velvet-lounge') ||
      id.includes('cosmic') || id.includes('dragon') || id.includes('silk-sage') || 
      id.includes('iron-spark') || id.includes('quick-checkin') || id.includes('my-work-portfolio')) return 'themed';
  
  if (name.includes('luxury') || name.includes('premium') || name.includes('gold') || name.includes('wine')) return 'luxury';
  if (name.includes('neon') || name.includes('sunset') || name.includes('aurora') || name.includes('party') || name.includes('ocean wave')) return 'vibrant';
  if (name.includes('minimal') || name.includes('elegant') || name.includes('white') || name.includes('slate')) return 'minimal';
  
  return 'professional';
};

const MobileTemplateGrid: React.FC<MobileTemplateGridProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 6;

  const filteredTemplates = useMemo(() => 
    defaultTemplates.filter((template) => 
      category === 'all' || getCategoryForTemplate(template) === category
    ),
    [category]
  );

  const totalPages = Math.ceil((filteredTemplates.length + 1) / pageSize);
  const startIndex = currentPage * pageSize;
  
  // Include "No Template" option on first page
  const showNoTemplate = currentPage === 0;
  const templatesOnPage = showNoTemplate 
    ? filteredTemplates.slice(0, pageSize - 1)
    : filteredTemplates.slice(startIndex - 1, startIndex - 1 + pageSize);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setCurrentPage(0);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <Text className="text-lg font-semibold block mb-1">Choose Template</Text>
        <Text type="secondary" className="text-sm">
          Select a template or use plain QR
        </Text>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide mb-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all flex-shrink-0
              ${category === cat.value 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-3">
        {/* No Template Option */}
        {showNoTemplate && (
          <button
            className={`
              rounded-xl overflow-hidden transition-all text-left
              ${selectedTemplate === null 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'ring-1 ring-border hover:ring-primary'
              }
            `}
            onClick={() => onSelect(null)}
          >
            <div className="h-24 bg-muted flex flex-col items-center justify-center relative">
              {selectedTemplate === null && (
                <CheckCircleFilled className="absolute top-2 right-2 text-primary" />
              )}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow border border-border">
                <QrCode size={24} className="text-foreground" />
              </div>
            </div>
            <div className="p-2.5 bg-card border-t border-border">
              <Text className="text-sm font-medium block truncate">No Template</Text>
              <Text type="secondary" className="text-xs">Plain QR</Text>
            </div>
          </button>
        )}

        {templatesOnPage.map((template) => (
          <button
            key={template.id}
            className={`
              rounded-xl overflow-hidden transition-all text-left
              ${selectedTemplate?.id === template.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'ring-1 ring-border hover:ring-primary'
              }
            `}
            onClick={() => onSelect(template)}
          >
            <div
              className="h-24 flex flex-col items-center justify-center relative p-2"
              style={{
                background: template.showGradient && template.gradientColor
                  ? `linear-gradient(180deg, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)`
                  : template.backgroundColor,
                color: template.textColor,
              }}
            >
              {selectedTemplate?.id === template.id && (
                <CheckCircleFilled
                  className="absolute top-2 right-2"
                  style={{ color: template.textColor }}
                />
              )}
              <h4 
                className="font-bold text-xs text-center leading-tight line-clamp-1"
                style={{ fontFamily: template.fontFamily || 'Inter' }}
              >
                {template.title}
              </h4>
              <p 
                className="text-[10px] opacity-80 text-center mt-0.5 line-clamp-1"
                style={{ fontFamily: template.fontFamily || 'Inter' }}
              >
                {template.subtitle}
              </p>
              <div className="mt-1.5 w-6 h-6 bg-white rounded flex items-center justify-center shadow">
                <div className="w-4 h-4 bg-gray-800 rounded-sm" />
              </div>
            </div>
            <div className="p-2.5 bg-card border-t border-border">
              <Text className="text-sm font-medium block truncate">{template.name}</Text>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>
          <Text type="secondary" className="text-sm">
            {currentPage + 1} / {totalPages}
          </Text>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileTemplateGrid;
