import React, { useState, forwardRef, useEffect, useRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Input, ColorPicker, Slider, Popover } from 'antd';
import { Pencil, Type } from 'lucide-react';
import type { Color } from 'antd/es/color-picker';
import { QRTemplate, QRStyling, CustomField, QRType } from '../../types/qrcode';
import { useAuth } from '../../hooks/useAuth';
import { createQRCodeOptions, createSafeStyling } from '../../lib/qrUtils';

// All QR types should route through /r/{id} so scans are always tracked.
// For unsaved previews (no id yet), we fallback to /r?u=... (no analytics).

interface QRCodePreviewProps {
  content: string;
  template: QRTemplate | null;
  styling: QRStyling;
  compact?: boolean;
  editable?: boolean;
  onTemplateChange?: (template: QRTemplate) => void;
  qrId?: string;
  qrType?: QRType;
  showWatermark?: boolean;
  watermarkText?: string;
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

// Separate component for QR-only rendering (no template)
const QROnlyPreview = React.memo(forwardRef<HTMLDivElement, { 
  content: string; 
  styling: QRStyling; 
  compact?: boolean; 
  qrId?: string; 
  qrType?: QRType;
  showWatermark?: boolean;
  watermarkText?: string;
}>(
  ({ content, styling, compact = false, qrId, qrType = 'url', showWatermark, watermarkText }, ref) => {
    const { user } = useAuth();
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);
    const qrOnlySize = compact ? 48 : Math.min(styling.size, 220); // Increased cap for better visibility

    // Use user settings for watermark defaults
    const effectiveShowWatermark = showWatermark !== undefined ? showWatermark : !user?.removeWatermark;
    const effectiveWatermarkText = watermarkText !== undefined ? watermarkText : user?.watermarkText || 'QR Studio';

    const safeStyling = useMemo(() => createSafeStyling(styling), [styling]);

    useEffect(() => {
      if (qrRef.current) {
        const options = createQRCodeOptions(content, styling, qrOnlySize, qrId);
        qrRef.current.innerHTML = '';
        qrCode.current = new QRCodeStyling(options);
        qrCode.current.append(qrRef.current);
      }
    }, [content, styling, qrId, qrOnlySize, qrType]);

    return (
      <div ref={ref} className="flex items-center justify-center p-4">
        <div
          className="rounded-lg relative"
          style={{ 
            backgroundColor: safeStyling.bgColor,
            padding: compact ? 8 : 16,
          }}
        >
          <div ref={qrRef} />
          {/* Watermark */}
          {effectiveShowWatermark && effectiveWatermarkText && !compact && (
            <div 
              className="absolute bottom-1 right-1 text-[8px] opacity-50"
              style={{ color: safeStyling.fgColor }}
            >
              {effectiveWatermarkText}
            </div>
          )}
        </div>
      </div>
    );
  }
));

QROnlyPreview.displayName = 'QROnlyPreview';

const QRCodePreview = forwardRef<HTMLDivElement, QRCodePreviewProps>(({
  content,
  template,
  styling,
  compact = false,
  editable = false,
  onTemplateChange,
  qrId,
  qrType = 'url',
  showWatermark,
  watermarkText,
}, ref) => {
  const { user } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [showSubtitleEditor, setShowSubtitleEditor] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showQRLabelEditor, setShowQRLabelEditor] = useState(false);
  const [showCTAEditor, setShowCTAEditor] = useState(false);

  // Use user settings for watermark defaults
  const effectiveShowWatermark = showWatermark !== undefined ? showWatermark : !user?.removeWatermark;
  const effectiveWatermarkText = watermarkText !== undefined ? watermarkText : user?.watermarkText || 'QR Studio';
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Memoize safe styling to prevent unnecessary recalculations
  const safeStyling = useMemo(() => ({
    ...styling,
    imageOptions: styling.imageOptions || {
      hideBackgroundDots: true,
      imageSize: 0.2,
      margin: 0,
    },
    cornersSquareOptions: styling.cornersSquareOptions || {
      color: styling.fgColor,
      type: 'square',
    },
    cornersDotOptions: styling.cornersDotOptions || {
      color: styling.fgColor,
      type: 'square',
    },
  }), [styling]);

  // Calculate qrSize - for preview context, allow larger sizes to be visible
  const qrSize = compact ? 48 : Math.min(styling.size, 180); // Increased cap from 140 to 180

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

  const handleCustomFieldChange = (fieldId: string, updates: Partial<CustomField>) => {
    if (onTemplateChange && template) {
      const updatedFields = template.customFields?.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ) || [];
      onTemplateChange({ ...template, customFields: updatedFields });
    }
  };

  const handleQRLabelChange = (value: string) => {
    if (onTemplateChange) {
      onTemplateChange({ ...template, qrLabel: value });
    }
  };

  const handleCTAButtonChange = (updates: Partial<typeof template.ctaButton>) => {
    if (onTemplateChange) {
      onTemplateChange({ 
        ...template, 
        ctaButton: { ...template.ctaButton, ...updates } as any 
      });
    }
  };

  useEffect(() => {
    if (qrRef.current) {
      const options = createQRCodeOptions(content, styling, qrSize, qrId);
      qrRef.current.innerHTML = '';
      qrCode.current = new QRCodeStyling(options);
      qrCode.current.append(qrRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, styling, qrId, qrSize, template?.id, qrType]);

  // If template is null, render QR only using separate component
  if (!template) {
    return <QROnlyPreview ref={ref} content={content} styling={styling} compact={compact} qrId={qrId} qrType={qrType} showWatermark={effectiveShowWatermark} watermarkText={effectiveWatermarkText} />;
  }

  const isHorizontal = template.qrPosition === 'left' || template.qrPosition === 'right';
  const cardWidth = compact ? 'w-16' : isHorizontal ? 'w-full max-w-[420px]' : 'w-full max-w-[360px]';
  const cardHeight = compact ? 'h-20' : isHorizontal ? 'min-h-[200px]' : 'min-h-[420px]';
  
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
          </>
        );
      case 'grid':
        return (
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(${accentColor} 1px, transparent 1px),
                linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        );
      default:
        return null;
    }
  };

  const createFieldEditorContent = (field: CustomField) => {
    const isNumericField = field.type === 'date' || field.type === 'time' || /\d/.test(field.value);
    
    return (
      <div className="w-72 space-y-3 p-1">
        <div>
          <label className="text-xs font-medium block mb-1">
            {field.type === 'date' ? 'Date' : field.type === 'time' ? 'Time' : 'Text'} Content
          </label>
          <Input
            value={field.value}
            onChange={(e) => handleCustomFieldChange(field.id, { value: e.target.value })}
            size="small"
            placeholder={field.type === 'date' ? 'January 1, 2025' : field.type === 'time' ? '12:00 PM' : 'Enter text'}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Font Size: {field.style?.fontSize || 14}px</label>
          <Slider
            min={8}
            max={32}
            value={field.style?.fontSize || 14}
            onChange={(value) => handleCustomFieldChange(field.id, { 
              style: { ...field.style, fontSize: value }
            })}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Text Color</label>
          <ColorPicker
            value={field.style?.color || template.textColor}
            onChange={(color) => handleCustomFieldChange(field.id, {
              style: { ...field.style, color: color.toHexString() }
            })}
            size="small"
          />
        </div>
        {isNumericField && (
          <div>
            <label className="text-xs font-medium block mb-1">Letter Spacing: {field.style?.letterSpacing || 0}px</label>
            <Slider
              min={-1}
              max={5}
              step={0.5}
              value={field.style?.letterSpacing || 0}
              onChange={(value) => handleCustomFieldChange(field.id, {
                style: { ...field.style, letterSpacing: value }
              })}
            />
          </div>
        )}
      </div>
    );
  };

  const renderCustomField = (field: CustomField) => {
    const style: React.CSSProperties = {
      fontSize: field.style?.fontSize || 14,
      fontWeight: fontWeightMap[field.style?.fontWeight || 'normal'],
      color: field.style?.color || template.textColor,
      letterSpacing: field.style?.letterSpacing ? `${field.style.letterSpacing}px` : undefined,
      fontStyle: field.style?.italic ? 'italic' : undefined,
      opacity: field.style?.opacity || 1,
      backgroundColor: field.style?.backgroundColor,
      borderRadius: field.style?.borderRadius,
      padding: field.style?.padding,
      display: field.style?.backgroundColor ? 'inline-block' : undefined,
    };

    if (field.type === 'divider') {
      return (
        <div 
          key={field.id}
          className="w-full h-px my-2"
          style={{ backgroundColor: template.textColor, opacity: 0.2 }}
        />
      );
    }

    // Render editable field
    if (editable && !compact) {
      return (
        <Popover 
          key={field.id}
          content={createFieldEditorContent(field)}
          title={
            <span className="flex items-center gap-2">
              <Type size={14} /> 
              Edit {field.type === 'date' ? 'Date' : field.type === 'time' ? 'Time' : 'Text'}
            </span>
          }
          trigger="click"
          open={editingFieldId === field.id}
          onOpenChange={(open) => setEditingFieldId(open ? field.id : null)}
        >
          <div 
            className="group flex items-center gap-1 cursor-pointer hover:opacity-80 relative z-10"
            style={{ justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}
          >
            <span style={style}>{field.value}</span>
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
      );
    }

    // Render non-editable field
    return (
      <div key={field.id} className="z-10">
        <span style={style}>{field.value}</span>
      </div>
    );
  };

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
        />
      </div>
    </div>
  );

  const renderTextContent = () => {
    const customFields = template.customFields || [];
    const fieldsBeforeTitle = customFields.filter(f => f.type === 'label');
    const fieldsAfterTitle = customFields.filter(f => f.type !== 'label');

    return (
      <div 
        className="flex flex-col gap-2 z-10 w-full"
        style={{ textAlign, fontFamily }}
      >
        {/* Custom fields before title (labels) */}
        {!compact && fieldsBeforeTitle.map(renderCustomField)}

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

        {/* Custom fields after title */}
        {!compact && fieldsAfterTitle.map(renderCustomField)}

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
              className="group flex items-center gap-1 cursor-pointer mt-1 hover:opacity-80 relative"
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
                  fontStyle: 'italic',
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
            className="mt-1"
            style={{ 
              color: template.textColor,
              fontSize: `${subtitleFontSize}px`,
              fontWeight: subtitleFontWeight,
              opacity: 0.85,
              margin: 0,
              fontFamily,
              letterSpacing: `${subtitleLetterSpacing}px`,
              fontStyle: 'italic',
            }}
          >
            {template.subtitle}
          </p>
        )}
      </div>
    );
  };

  const renderQRCode = () => (
    <div className="flex flex-col items-center z-10">
      <div
        className="rounded-xl shadow-inner relative"
        style={{ 
          backgroundColor: styling.bgColor,
          padding: compact ? 4 : 12,
        }}
      >
        <div ref={qrRef} />
        {/* Watermark */}
        {effectiveShowWatermark && effectiveWatermarkText && !compact && (
          <div 
            className="absolute bottom-0 right-2 text-[10px] opacity-50"
            style={{ color: styling.fgColor }}
          >
            {effectiveWatermarkText}
          </div>
        )}
      </div>
      {!compact && template.qrLabel && (
        editable ? (
          <Popover 
            content={
              <div className="w-64 space-y-3 p-1">
                <div>
                  <label className="text-xs font-medium block mb-1">QR Label Text</label>
                  <Input
                    value={template.qrLabel || ''}
                    onChange={(e) => handleQRLabelChange(e.target.value)}
                    size="small"
                    placeholder="Scan for details"
                  />
                </div>
              </div>
            }
            title={<span className="flex items-center gap-2"><Type size={14} /> Edit QR Label</span>}
            trigger="click"
            open={showQRLabelEditor}
            onOpenChange={setShowQRLabelEditor}
          >
            <div className="group flex items-center gap-1 cursor-pointer hover:opacity-80 relative mt-2">
              <span 
                className="text-xs opacity-70"
                style={{ color: template.textColor }}
              >
                {template.qrLabel}
              </span>
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
          <span 
            className="mt-2 text-xs opacity-70"
            style={{ color: template.textColor }}
          >
            {template.qrLabel}
          </span>
        )
      )}
    </div>
  );

  const renderCTAButton = () => {
    if (!template.ctaButton || compact) return null;
    
    if (editable) {
      return (
        <Popover 
          content={
            <div className="w-72 space-y-3 p-1">
              <div>
                <label className="text-xs font-medium block mb-1">Button Text</label>
                <Input
                  value={template.ctaButton.text}
                  onChange={(e) => handleCTAButtonChange({ text: e.target.value })}
                  size="small"
                  placeholder="Click Me"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Background Color</label>
                <ColorPicker
                  value={template.ctaButton.backgroundColor}
                  onChange={(color) => handleCTAButtonChange({ backgroundColor: color.toHexString() })}
                  size="small"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Text Color</label>
                <ColorPicker
                  value={template.ctaButton.textColor}
                  onChange={(color) => handleCTAButtonChange({ textColor: color.toHexString() })}
                  size="small"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Border Radius: {template.ctaButton.borderRadius || 8}px</label>
                <Slider
                  min={0}
                  max={20}
                  value={template.ctaButton.borderRadius || 8}
                  onChange={(value) => handleCTAButtonChange({ borderRadius: value })}
                />
              </div>
            </div>
          }
          title={<span className="flex items-center gap-2"><Type size={14} /> Edit Button</span>}
          trigger="click"
          open={showCTAEditor}
          onOpenChange={setShowCTAEditor}
        >
          <div className="group relative z-10">
            <div
              className="px-6 py-2 font-semibold text-sm cursor-pointer transition-transform hover:scale-105"
              style={{
                backgroundColor: template.ctaButton.backgroundColor,
                color: template.ctaButton.textColor,
                borderRadius: template.ctaButton.borderRadius || 8,
              }}
            >
              {template.ctaButton.text}
            </div>
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
      );
    }
    
    return (
      <div
        className="z-10 px-6 py-2 font-semibold text-sm cursor-pointer transition-transform hover:scale-105"
        style={{
          backgroundColor: template.ctaButton.backgroundColor,
          color: template.ctaButton.textColor,
          borderRadius: template.ctaButton.borderRadius || 8,
        }}
      >
        {template.ctaButton.text}
      </div>
    );
  };

  const getContentOrder = () => {
    if (isHorizontal) {
      return (
        <div className="flex items-center gap-6 w-full h-full">
          {qrPosition === 'left' ? (
            <>
              {renderQRCode()}
              <div className="flex-1 flex flex-col justify-center gap-2">
                {renderTextContent()}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col justify-center gap-2">
                {renderTextContent()}
              </div>
              {renderQRCode()}
            </>
          )}
        </div>
      );
    }

    switch (qrPosition) {
      case 'top':
        return (
          <>
            {renderQRCode()}
            <div className="flex-1" />
            {renderTextContent()}
            {renderCTAButton()}
          </>
        );
      case 'center':
        return (
          <>
            {renderTextContent()}
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              {renderQRCode()}
              {renderCTAButton()}
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
            {renderCTAButton()}
          </>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={`${cardWidth} ${cardHeight} flex flex-col items-center transition-all relative overflow-hidden`}
      style={{
        ...backgroundStyle,
        ...borderStyle,
        color: template.textColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        boxShadow: shadowStyle(),
        fontFamily,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

export default React.memo(QRCodePreview);
