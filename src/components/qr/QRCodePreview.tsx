import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRTemplate, QRStyling } from '../../types/qrcode';

interface QRCodePreviewProps {
  content: string;
  template: QRTemplate;
  styling: QRStyling;
  compact?: boolean;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  content,
  template,
  styling,
  compact = false,
}) => {
  const cardSize = compact ? 'w-16 h-20' : 'w-64 h-80';
  const qrSize = compact ? 48 : styling.size;
  const titleSize = compact ? 'text-[8px]' : 'text-xl';
  const subtitleSize = compact ? 'text-[6px]' : 'text-sm';

  return (
    <div
      className={`${cardSize} rounded-xl flex flex-col items-center justify-center p-${compact ? '1' : '6'} shadow-lg transition-all`}
      style={{
        backgroundColor: template.backgroundColor,
        color: template.textColor,
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3 className={`font-bold ${titleSize} mb-1`} style={{ color: template.textColor }}>
          {template.title}
        </h3>
        <p className={`${subtitleSize} opacity-80 mb-${compact ? '1' : '4'}`} style={{ color: template.textColor }}>
          {template.subtitle}
        </p>
      </div>
      <div
        className={`rounded-lg p-${compact ? '1' : '3'}`}
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
    </div>
  );
};

export default QRCodePreview;
