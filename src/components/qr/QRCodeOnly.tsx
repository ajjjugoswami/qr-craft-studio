import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRTemplate, QRStyling, QRType } from '../../types/qrcode';
import { createQRCodeOptions, createSafeStyling } from '../../lib/qrUtils';

// All QR types now go through redirector for scan tracking
// Direct content types (vcard, wifi, etc.) will be displayed on the redirector page
// Redirect types (url, instagram, etc.) will redirect to the target URL

interface QRCodeOnlyProps {
  content: string;
  template: QRTemplate | null;
  styling: QRStyling;
  size?: number;
  qrId?: string;
  qrType?: QRType;
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

  const safeStyling = useMemo(() => createSafeStyling(styling), [styling]);

  useEffect(() => {
    if (qrRef.current) {
      // When an image/logo is present, force high error correction for scannability
      const hasLogo = !!safeStyling.image;
      const errorLevel = hasLogo ? 'H' : safeStyling.level;
      // Limit logo size to 25% max for scannability
      const logoSize = hasLogo ? Math.min(safeStyling.imageOptions?.imageSize || 0.4, 0.25) : (safeStyling.imageOptions?.imageSize || 0.4);
      
      const baseOptions = createQRCodeOptions(content, styling, size, qrId);
      
      // Override with specific options for QRCodeOnly
      const qrOptions = {
        ...baseOptions,
        margin: 0,
        qrOptions: {
          errorCorrectionLevel: errorLevel,
        },
        imageOptions: safeStyling.imageOptions ? {
          hideBackgroundDots: true,
          imageSize: logoSize,
          margin: safeStyling.imageOptions.margin ?? 2,
        } : undefined,
      };

      qrRef.current.innerHTML = '';
      qrCode.current = new QRCodeStyling(qrOptions);
      qrCode.current.append(qrRef.current);
    }
  }, [content, safeStyling, qrId, size, qrType, styling]);

  return (
    <div ref={ref} className="flex items-center justify-center">
      <div ref={qrRef} />
    </div>
  );
});

QRCodeOnly.displayName = 'QRCodeOnly';

export default React.memo(QRCodeOnly);