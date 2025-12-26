import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { getAppOrigin } from '../../lib/config';
import { QRTemplate, QRStyling, QRType } from '../../types/qrcode';

// All QR types now go through redirector for scan tracking
// Direct content types (vcard, wifi, etc.) will be displayed on the redirector page
// Redirect types (url, instagram, etc.) will redirect to the target URL

interface QRCodeOnlyProps {
  content: string;
  template: QRTemplate | null;
  styling: QRStyling;
  size?: number;
  qrId?: string;
  qrType?: QRType; // Add type to determine encoding strategy
}

const QRCodeOnly = forwardRef<HTMLDivElement, QRCodeOnlyProps>(({
  content,
  template,
  styling,
  size = 200,
  qrId,
  qrType = 'url',
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
        // ALL QR types now go through redirector for scan tracking
        // The redirector will handle displaying content for direct types (vcard, wifi, etc.)
        // and redirecting for URL-based types (url, instagram, youtube, etc.)
        if (typeof window !== 'undefined') {
          if (typeof content === 'string' && qrId) {
            return `${getAppOrigin()}/r/${qrId}`;
          }
          if (typeof content === 'string') {
            return `${getAppOrigin()}/r?u=${encodeURIComponent(content)}`;
          }
        }
        return content || 'https://example.com';
      } catch (e) {
        return content || 'https://example.com';
      }
    };

    if (qrRef.current) {
      // When an image/logo is present, force high error correction for scannability
      const hasLogo = !!safeStyling.image;
      const errorLevel = hasLogo ? 'H' : safeStyling.level;
      // Limit logo size to 25% max for scannability
      const logoSize = hasLogo ? Math.min(safeStyling.imageOptions?.imageSize || 0.4, 0.25) : (safeStyling.imageOptions?.imageSize || 0.4);
      
      const qrOptions = {
        width: size,
        height: size,
        data: getQRData(),
        type: 'svg' as const,
        margin: 0,
        qrOptions: {
          errorCorrectionLevel: errorLevel,
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
          hideBackgroundDots: true, // Always hide background dots for better logo visibility
          imageSize: logoSize,
          margin: safeStyling.imageOptions.margin ?? 2, // Add small margin for better scannability
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
  }, [content, safeStyling, qrId, size, qrType]);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div ref={qrRef} />
    </div>
  );
});

QRCodeOnly.displayName = 'QRCodeOnly';

export default React.memo(QRCodeOnly);