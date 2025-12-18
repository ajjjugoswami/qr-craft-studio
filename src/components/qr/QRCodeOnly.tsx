import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { getAppOrigin } from '../../lib/config';
import { QRTemplate, QRStyling } from '../../types/qrcode';

interface QRCodeOnlyProps {
  content: string;
  template: QRTemplate;
  styling: QRStyling;
  size?: number;
  qrId?: string;
}

const QRCodeOnly = forwardRef<HTMLDivElement, QRCodeOnlyProps>(({
  content,
  template,
  styling,
  size = 200,
  qrId,
}, ref) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  const safeStyling = useMemo(() => ({
    ...styling,
    imageOptions: styling.imageOptions || {
      hideBackgroundDots: true,
      imageSize: 0.4,
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

  useEffect(() => {
    const getQRData = () => {
      try {
        if (typeof window !== 'undefined') {
          if (typeof (content) === 'string' && qrId) {
            return `${getAppOrigin()}/r/${qrId}`;
          }
          if (typeof (content) === 'string') {
            return `${getAppOrigin()}/r?u=${encodeURIComponent(content)}`;
          }
        }
        return content || 'https://example.com';
      } catch (e) {
        return content || 'https://example.com';
      }
    };

    if (qrRef.current) {
      const qrOptions = {
        width: size,
        height: size,
        data: getQRData(),
        type: 'svg' as const,
        margin: 0,
        qrOptions: {
          errorCorrectionLevel: safeStyling.level,
        },
        dotsOptions: {
          color: safeStyling.fgColor,
          type: safeStyling.dotsType,
          ...(safeStyling.dotsGradient && { gradient: safeStyling.dotsGradient }),
        },
        backgroundOptions: {
          color: safeStyling.bgColor,
          ...(safeStyling.backgroundGradient && { gradient: safeStyling.backgroundGradient }),
        },
        cornersSquareOptions: safeStyling.cornersSquareOptions ? {
          color: safeStyling.cornersSquareOptions.color ?? safeStyling.fgColor,
          type: safeStyling.cornersSquareOptions.type ?? 'square',
          ...(safeStyling.cornersSquareOptions.gradient && { gradient: safeStyling.cornersSquareOptions.gradient }),
        } : undefined,
        cornersDotOptions: safeStyling.cornersDotOptions ? {
          color: safeStyling.cornersDotOptions.color ?? safeStyling.fgColor,
          type: safeStyling.cornersDotOptions.type ?? 'square',
          ...(safeStyling.cornersDotOptions.gradient && { gradient: safeStyling.cornersDotOptions.gradient }),
        } : undefined,
        imageOptions: safeStyling.imageOptions ? {
          hideBackgroundDots: safeStyling.imageOptions.hideBackgroundDots ?? true,
          imageSize: safeStyling.imageOptions.imageSize ?? 0.4,
          margin: safeStyling.imageOptions.margin ?? 0,
        } : undefined,
        image: safeStyling.image,
        shape: safeStyling.shape,
      };

      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.current = new QRCodeStyling(qrOptions);
        qrCode.current.append(qrRef.current);
      }
    }
  }, [content, safeStyling, qrId, size]);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div ref={qrRef} />
    </div>
  );
});

QRCodeOnly.displayName = 'QRCodeOnly';

export default React.memo(QRCodeOnly);