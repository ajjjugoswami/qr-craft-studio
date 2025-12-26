import React from 'react';
import { QRTemplate } from '@/types/qrcode';
import { Crown } from 'lucide-react';

interface TemplateCardProps {
  template: QRTemplate;
  premium?: boolean;
  onUse: (styling: Partial<any>, premium?: boolean) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, premium, onUse }) => {
  const handleClick = () => {
    const styling = {
      fgColor: template.textColor || '#000000',
      bgColor: template.backgroundColor || '#ffffff',
    };
    onUse(styling, premium);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative rounded-xl cursor-pointer transition-all overflow-hidden
        hover:ring-2 hover:ring-primary hover:shadow-lg hover:scale-[1.02]
        ring-1 ring-border bg-card
        ${premium ? 'opacity-90' : ''}
      `}
    >
      {premium && (
        <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white p-1 rounded-full">
          <Crown className="w-3 h-3" />
        </div>
      )}
      
      <div
        className="h-28 flex flex-col items-center justify-center relative p-3"
        style={{
          background: template.showGradient && template.gradientColor
            ? `linear-gradient(${template.gradientDirection === 'to-bottom' ? '180deg' : template.gradientDirection === 'to-right' ? '90deg' : template.gradientDirection === 'to-top-right' ? '45deg' : '135deg'}, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)`
            : template.backgroundColor,
          color: template.textColor,
          borderRadius: `${(template.borderRadius || 16) * 0.5}px ${(template.borderRadius || 16) * 0.5}px 0 0`,
        }}
      >
        <h4
          className="font-bold text-xs text-center leading-tight"
          style={{
            fontFamily: template.fontFamily || 'Inter',
          }}
        >
          {template.title}
        </h4>
        <p
          className="text-[10px] opacity-80 text-center mt-1"
          style={{ fontFamily: template.fontFamily || 'Inter' }}
        >
          {template.subtitle}
        </p>
        <div className="mt-2 w-6 h-6 bg-white rounded flex items-center justify-center shadow">
          <div className="w-4 h-4 bg-gray-800 rounded-sm" />
        </div>
      </div>
      
      <div className="p-2 bg-card text-center border-t border-border">
        <span className="text-xs font-medium truncate block text-foreground">{template.name}</span>
      </div>
    </div>
  );
};

export default TemplateCard;
