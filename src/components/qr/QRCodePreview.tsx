import React, { useState, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input, ColorPicker, Slider, Popover	 } from 'antd';
import { Pencil, Type, Palette, Move } from 'lucide-react';
import type { Color } from 'antd/es/color-picker';
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
  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [showSubtitleEditor, setShowSubtitleEditor] = useState(false);

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

  const handleColorChange = (key: 'backgroundColor' | 'textColor', color: Color) => {
    if (onTemplateChange) {
      onTemplateChange({ ...template, [key]: color.toHexString() });
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
            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: accentColor }} />
            <div className="absolute bottom-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: accentColor }} />
            <div className="absolute top-0 left-0 w-1 h-full opacity-20" style={{ backgroundColor: accentColor }} />
            <div className="absolute top-0 right-0 w-1 h-full opacity-20" style={{ backgroundColor: accentColor }} />
          </>
        );
      case 'geometric':
        return (
          <>
            <div 
              className="absolute top-4 right-4 w-16 h-16 opacity-10 rotate-45"
              style={{ border: `2px solid ${accentColor}` }}
            />
            <div 
              className="absolute bottom-4 left-4 w-12 h-12 opacity-10"
              style={{ border: `2px solid ${accentColor}`, borderRadius: '50%' }}
            />
            <div 
              className="absolute top-1/2 right-2 w-8 h-8 opacity-5 -translate-y-1/2"
              style={{ backgroundColor: accentColor }}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Inline editor popover content for title
  const titleEditorContent = (
    <div className="w-64 space-y-3 p-1">
      <div>
        <label className="text-xs font-medium block mb-1">Title Text</label>
        <Input
          value={template.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          size="small"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Font Size: {template.titleFontSize || 24}px</label>
        <Slider
          min={14}
          max={40}
          value={template.titleFontSize || 24}
          onChange={(value) => onTemplateChange?.({ ...template, titleFontSize: value })}
          size="small"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Text Color</label>
        <ColorPicker
          value={template.textColor}
          onChange={(color) => handleColorChange('textColor', color)}
          size="small"
        />
      </div>
    </div>
  );

  // Inline editor popover content for subtitle
  const subtitleEditorContent = (
    <div className="w-64 space-y-3 p-1">
      <div>
        <label className="text-xs font-medium block mb-1">Subtitle Text</label>
        <Input
          value={template.subtitle}
          onChange={(e) => handleSubtitleChange(e.target.value)}
          size="small"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Font Size: {template.subtitleFontSize || 14}px</label>
        <Slider
          min={10}
          max={24}
          value={template.subtitleFontSize || 14}
          onChange={(value) => onTemplateChange?.({ ...template, subtitleFontSize: value })}
          size="small"
        />
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div 
      className="flex flex-col z-10 w-full"
      style={{ textAlign, fontFamily }}
    >
      {/* Title with inline editor */}
      {editable && !compact ? (
        <Popover 
          content={titleEditorContent} 
          title={<span className="flex items-center gap-2"><Type size={14} /> Edit Title</span>}
          trigger="click"
          open={showTitleEditor}
          onOpenChange={setShowTitleEditor}
        >
          <div 
            className="group flex items-center gap-2 cursor-pointer hover:opacity-80 relative"
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
            {hovered && (
              <div 
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center opacity-70"
                style={{ backgroundColor: template.textColor + '30' }}
              >
                <Pencil size={10} style={{ color: template.textColor }} />
              </div>
            )}
          </div>
        </Popover>
      ) : (
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
      )}

      {/* Subtitle with inline editor */}
      {editable && !compact ? (
        <Popover 
          content={subtitleEditorContent} 
          title={<span className="flex items-center gap-2"><Type size={14} /> Edit Subtitle</span>}
          trigger="click"
          open={showSubtitleEditor}
          onOpenChange={setShowSubtitleEditor}
        >
          <div 
            className="group flex items-center gap-1 cursor-pointer mt-2 hover:opacity-80 relative"
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
            {hovered && (
              <div 
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center opacity-70"
                style={{ backgroundColor: template.textColor + '30' }}
              >
                <Pencil size={10} style={{ color: template.textColor }} />
              </div>
            )}
          </div>
        </Popover>
      ) : (
        <p 
          className="mt-2"
          style={{ 
            color: template.textColor,
            fontSize: `${subtitleFontSize}px`,
            fontWeight: subtitleFontWeight,
            opacity: 0.85,
            margin: 0,
            marginTop: 8,
            fontFamily,
            letterSpacing: `${subtitleLetterSpacing}px`,
          }}
        >
          {template.subtitle}
        </p>
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