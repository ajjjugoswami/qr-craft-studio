import React, { useState, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { QRTemplate, QRStyling } from '../../types/qrcode';

interface QRCodePreviewProps {
  content: string;
  template: QRTemplate;
  styling: QRStyling;
  compact?: boolean;
  editable?: boolean;
  onTemplateChange?: (template: QRTemplate) => void;
}

const fontWeightMap = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const gradientDirectionMap = {
  'to-bottom': '180deg',
  'to-right': '90deg',
  'to-bottom-right': '135deg',
  'to-top-right': '45deg',
};

const QRCodePreview = forwardRef<HTMLDivElement, QRCodePreviewProps>(({
  content,
  template,
  styling,
  compact = false,
  editable = false,
  onTemplateChange,
}, ref) => {
  const [editingField, setEditingField] = useState<'title' | 'subtitle' | null>(null);
  const [hovered, setHovered] = useState(false);

  const cardSize = compact ? 'w-16 h-20' : 'w-80';
  const qrSize = compact ? 48 : styling.size > 160 ? 160 : styling.size;
  
  const titleFontSize = compact ? 8 : (template.titleFontSize || 24);
  const subtitleFontSize = compact ? 6 : (template.subtitleFontSize || 14);
  const fontWeight = fontWeightMap[template.titleFontWeight || 'bold'];
  const subtitleFontWeight = fontWeightMap[template.subtitleFontWeight || 'normal'];
  const textAlign = template.textAlign || 'center';
  const qrPosition = template.qrPosition || 'bottom';
  const borderRadius = compact ? 8 : (template.borderRadius || 16);
  const padding = compact ? 4 : (template.padding || 24);
  const fontFamily = template.fontFamily || 'Inter';
  const titleLetterSpacing = template.titleLetterSpacing || 0;
  const subtitleLetterSpacing = template.subtitleLetterSpacing || 0;

  const handleTitleChange = (value: string) => {
    if (onTemplateChange) {
      onTemplateChange({ ...template, title: value });
    }
  };

  const handleSubtitleChange = (value: string) => {
    if (onTemplateChange) {
      onTemplateChange({ ...template, subtitle: value });
    }
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
  };

  const gradientDirection = gradientDirectionMap[template.gradientDirection || 'to-bottom-right'];
  const backgroundStyle = template.showGradient && template.gradientColor
    ? { background: `linear-gradient(${gradientDirection}, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)` }
    : { backgroundColor: template.backgroundColor };

  const shadowStyle = () => {
    switch (template.shadowIntensity) {
      case 'light': return '0 4px 20px rgba(0,0,0,0.1)';
      case 'medium': return '0 8px 30px rgba(0,0,0,0.2)';
      case 'strong': return '0 12px 50px rgba(0,0,0,0.3)';
      default: return 'none';
    }
  };

  const borderStyle = template.showBorder ? {
    border: `${template.borderWidth || 1}px solid ${template.borderColor || '#e5e7eb'}`,
  } : {};

  const renderDecorations = () => {
    if (compact) return null;
    const accentColor = template.accentColor || template.textColor;
    
    switch (template.decorativeStyle) {
      case 'circles':
        return (
          <>
            <div 
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
              style={{ 
                background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                transform: 'translate(30%, -30%)'
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-10"
              style={{ 
                background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                transform: 'translate(-30%, 30%)'
              }}
            />
          </>
        );
      case 'dots':
        return (
          <>
            <div className="absolute top-4 right-4 flex gap-2 opacity-30">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              ))}
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2 opacity-30">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              ))}
            </div>
          </>
        );
      case 'lines':
        return (
          <>
            <div 
              className="absolute top-0 left-0 w-full h-1 opacity-20"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full h-1 opacity-20"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="absolute top-0 left-0 w-1 h-full opacity-20"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="absolute top-0 right-0 w-1 h-full opacity-20"
              style={{ backgroundColor: accentColor }}
            />
          </>
        );
      case 'geometric':
        return (
          <>
            <div 
              className="absolute top-4 right-4 w-16 h-16 opacity-10 rotate-45"
              style={{ 
                border: `2px solid ${accentColor}`,
              }}
            />
            <div 
              className="absolute bottom-4 left-4 w-12 h-12 opacity-10"
              style={{ 
                border: `2px solid ${accentColor}`,
                borderRadius: '50%',
              }}
            />
            <div 
              className="absolute top-1/2 right-2 w-8 h-8 opacity-5 -translate-y-1/2"
              style={{ 
                backgroundColor: accentColor,
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderTextContent = () => (
    <div 
      className="flex flex-col z-10 w-full"
      style={{ textAlign, fontFamily }}
    >
      {editingField === 'title' && editable ? (
        <Input
          value={template.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="font-bold"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            color: template.textColor,
            border: 'none',
            fontSize: `${titleFontSize}px`,
            fontWeight,
            textAlign,
            fontFamily,
          }}
        />
      ) : (
        <div 
          className={`group flex items-center gap-2 cursor-pointer ${editable && !compact ? 'hover:opacity-80' : ''}`}
          onClick={() => editable && !compact && setEditingField('title')}
          style={{ justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
        >
          <h3 
            style={{ 
              color: template.textColor,
              fontSize: `${titleFontSize}px`,
              fontWeight,
              margin: 0,
              lineHeight: 1.2,
              fontFamily,
              letterSpacing: `${titleLetterSpacing}px`,
            }}
          >
            {template.title}
          </h3>
          {editable && !compact && hovered && (
            <EditOutlined className="text-sm opacity-70" style={{ color: template.textColor }} />
          )}
        </div>
      )}

      {editingField === 'subtitle' && editable ? (
        <Input
          value={template.subtitle}
          onChange={(e) => handleSubtitleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="mt-2"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            color: template.textColor,
            border: 'none',
            fontSize: `${subtitleFontSize}px`,
            textAlign,
            fontFamily,
          }}
        />
      ) : (
        <div 
          className={`group flex items-center gap-1 cursor-pointer mt-2 ${editable && !compact ? 'hover:opacity-80' : ''}`}
          onClick={() => editable && !compact && setEditingField('subtitle')}
          style={{ justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
        >
          <p 
            style={{ 
              color: template.textColor,
              fontSize: `${subtitleFontSize}px`,
              fontWeight: subtitleFontWeight,
              opacity: 0.85,
              margin: 0,
              fontFamily,
              letterSpacing: `${subtitleLetterSpacing}px`,
            }}
          >
            {template.subtitle}
          </p>
          {editable && !compact && hovered && (
            <EditOutlined className="text-xs opacity-70" style={{ color: template.textColor }} />
          )}
        </div>
      )}
    </div>
  );

  const renderQRCode = () => (
    <div
      className="rounded-xl shadow-inner z-10"
      style={{ 
        backgroundColor: styling.bgColor,
        padding: compact ? 4 : 16,
      }}
    >
      <QRCodeSVG
        value={content || 'https://example.com'}
        size={qrSize}
        fgColor={styling.fgColor}
        bgColor={styling.bgColor}
        level={styling.level}
        includeMargin={styling.includeMargin}
      />
    </div>
  );

  const getContentOrder = () => {
    switch (qrPosition) {
      case 'top':
        return (
          <>
            {renderQRCode()}
            <div className="flex-1" />
            {renderTextContent()}
          </>
        );
      case 'center':
        return (
          <>
            {renderTextContent()}
            <div className="flex-1 flex items-center justify-center">
              {renderQRCode()}
            </div>
          </>
        );
      case 'bottom':
      default:
        return (
          <>
            {renderTextContent()}
            <div className="flex-1" />
            {renderQRCode()}
          </>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={`${cardSize} flex flex-col items-center transition-all relative overflow-hidden`}
      style={{
        ...backgroundStyle,
        ...borderStyle,
        color: template.textColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        minHeight: compact ? '80px' : '420px',
        boxShadow: shadowStyle(),
        fontFamily,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative elements */}
      {renderDecorations()}

      {getContentOrder()}

      {editable && !compact && (
        <p 
          className="text-xs mt-4 opacity-50 z-10 absolute bottom-2" 
          style={{ color: template.textColor }}
        >
          Click text to edit
        </p>
      )}
    </div>
  );
});

QRCodePreview.displayName = 'QRCodePreview';

export default QRCodePreview;