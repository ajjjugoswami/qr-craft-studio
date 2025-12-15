import React, { useState } from 'react';
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

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  content,
  template,
  styling,
  compact = false,
  editable = false,
  onTemplateChange,
}) => {
  const [editingField, setEditingField] = useState<'title' | 'subtitle' | null>(null);
  const [hovered, setHovered] = useState(false);

  const cardSize = compact ? 'w-16 h-20' : 'w-72';
  const qrSize = compact ? 48 : styling.size > 160 ? 160 : styling.size;
  
  const titleFontSize = compact ? 8 : (template.titleFontSize || 24);
  const subtitleFontSize = compact ? 6 : (template.subtitleFontSize || 14);
  const fontWeight = fontWeightMap[template.titleFontWeight || 'bold'];
  const textAlign = template.textAlign || 'center';
  const qrPosition = template.qrPosition || 'bottom';
  const borderRadius = compact ? 8 : (template.borderRadius || 16);
  const padding = compact ? 4 : (template.padding || 24);

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

  const backgroundStyle = template.showGradient && template.gradientColor
    ? { background: `linear-gradient(135deg, ${template.backgroundColor} 0%, ${template.gradientColor} 100%)` }
    : { backgroundColor: template.backgroundColor };

  const renderTextContent = () => (
    <div 
      className={`flex flex-col z-10 w-full`}
      style={{ textAlign }}
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
          className="mt-1"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            color: template.textColor,
            border: 'none',
            fontSize: `${subtitleFontSize}px`,
            textAlign,
          }}
        />
      ) : (
        <div 
          className={`group flex items-center gap-1 cursor-pointer mt-1 ${editable && !compact ? 'hover:opacity-80' : ''}`}
          onClick={() => editable && !compact && setEditingField('subtitle')}
          style={{ justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
        >
          <p 
            style={{ 
              color: template.textColor,
              fontSize: `${subtitleFontSize}px`,
              opacity: 0.85,
              margin: 0,
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
      className={`${cardSize} flex flex-col items-center shadow-2xl transition-all relative overflow-hidden`}
      style={{
        ...backgroundStyle,
        color: template.textColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        minHeight: compact ? '80px' : '380px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative elements */}
      {!compact && (
        <>
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${template.textColor} 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)'
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${template.textColor} 0%, transparent 70%)`,
              transform: 'translate(-30%, 30%)'
            }}
          />
        </>
      )}

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
};

export default QRCodePreview;
