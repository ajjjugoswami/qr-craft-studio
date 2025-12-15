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

  const cardSize = compact ? 'w-16 h-20' : 'w-72 h-96';
  const qrSize = compact ? 48 : styling.size > 180 ? 180 : styling.size;
  const titleSize = compact ? 'text-[8px]' : 'text-xl';
  const subtitleSize = compact ? 'text-[6px]' : 'text-sm';

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

  return (
    <div
      className={`${cardSize} rounded-2xl flex flex-col items-center justify-between p-${compact ? '1' : '6'} shadow-xl transition-all relative overflow-hidden`}
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative elements */}
      {!compact && (
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${template.textColor}40 0%, transparent 70%)`,
            transform: 'translate(30%, -30%)'
          }}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        {editingField === 'title' && editable ? (
          <Input
            value={template.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-center font-bold"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: template.textColor,
              border: 'none',
              fontSize: compact ? '8px' : '20px',
              width: '90%'
            }}
          />
        ) : (
          <div 
            className={`group flex items-center gap-2 cursor-pointer ${editable && !compact ? 'hover:opacity-80' : ''}`}
            onClick={() => editable && !compact && setEditingField('title')}
          >
            <h3 className={`font-bold ${titleSize}`} style={{ color: template.textColor }}>
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
            className="text-center mt-1"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: template.textColor,
              border: 'none',
              fontSize: compact ? '6px' : '14px',
              width: '90%'
            }}
          />
        ) : (
          <div 
            className={`group flex items-center gap-1 cursor-pointer ${editable && !compact ? 'hover:opacity-80' : ''}`}
            onClick={() => editable && !compact && setEditingField('subtitle')}
          >
            <p className={`${subtitleSize} opacity-80 mt-1`} style={{ color: template.textColor }}>
              {template.subtitle}
            </p>
            {editable && !compact && hovered && (
              <EditOutlined className="text-xs opacity-70" style={{ color: template.textColor }} />
            )}
          </div>
        )}
      </div>

      <div
        className={`rounded-xl p-${compact ? '1' : '4'} shadow-inner z-10`}
        style={{ backgroundColor: styling.bgColor }}
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

      {editable && !compact && (
        <p className="text-xs mt-4 opacity-60 z-10" style={{ color: template.textColor }}>
          Click text to edit
        </p>
      )}
    </div>
  );
};

export default QRCodePreview;
