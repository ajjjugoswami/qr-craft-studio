import { getAppOrigin } from './config';
import { QRStyling, QRType } from '@/types/qrcode';

/**
 * Generate QR data URL for redirector
 * All QR types route through /r/{id} for scan tracking
 */
export const getQRData = (content: string, qrId?: string): string => {
  try {
    if (typeof window !== 'undefined') {
      if (typeof content === 'string' && qrId) {
        return `${getAppOrigin()}/r/${qrId}`;
      }
      // Unsaved preview: no analytics (no id), but still previewable
      if (typeof content === 'string') {
        return `${getAppOrigin()}/r?u=${encodeURIComponent(content)}`;
      }
    }
    return content || 'https://example.com';
  } catch {
    return content || 'https://example.com';
  }
};

/**
 * Create safe styling with defaults for QR code rendering
 */
export const createSafeStyling = (styling: QRStyling) => ({
  ...styling,
  imageOptions: styling.imageOptions || {
    hideBackgroundDots: true,
    imageSize: 0.2,
    margin: 0,
  },
  cornersSquareOptions: styling.cornersSquareOptions || {
    color: styling.fgColor,
    type: 'square' as const,
  },
  cornersDotOptions: styling.cornersDotOptions || {
    color: styling.fgColor,
    type: 'square' as const,
  },
});

/**
 * Determine error correction level based on styling
 * Use 'H' (highest) when logos or gradients are present for better scannability
 */
export const getErrorCorrectionLevel = (styling: QRStyling): 'L' | 'M' | 'Q' | 'H' => {
  const hasLogo = !!styling.image;
  const hasGradients = !!(
    styling.dotsGradient ||
    styling.backgroundGradient ||
    styling.cornersSquareOptions?.gradient ||
    styling.cornersDotOptions?.gradient
  );
  
  return hasLogo || hasGradients ? 'H' : (styling.level || 'M');
};

/**
 * Create QR code options for qr-code-styling library
 */
export const createQRCodeOptions = (
  content: string,
  styling: QRStyling,
  size: number,
  qrId?: string
) => {
  const safeStyling = createSafeStyling(styling);
  const errorLevel = getErrorCorrectionLevel(styling);
  const logoSize = safeStyling.imageOptions?.imageSize || 0.2;

  return {
    width: size,
    height: size,
    data: getQRData(content, qrId),
    type: 'svg' as const,
    margin: safeStyling.includeMargin ? 8 : 0, // Increased margin for better visibility
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
    cornersSquareOptions: {
      color: safeStyling.cornersSquareOptions?.color ?? safeStyling.fgColor,
      type: safeStyling.cornersSquareOptions?.type ?? 'square',
      ...(safeStyling.cornersSquareOptions?.gradient && { gradient: safeStyling.cornersSquareOptions.gradient }),
    },
    cornersDotOptions: {
      color: safeStyling.cornersDotOptions?.color ?? safeStyling.fgColor,
      type: safeStyling.cornersDotOptions?.type ?? 'square',
      ...(safeStyling.cornersDotOptions?.gradient && { gradient: safeStyling.cornersDotOptions.gradient }),
    },
    imageOptions: safeStyling.imageOptions ? {
      hideBackgroundDots: true,
      imageSize: logoSize,
      margin: 0,
    } : undefined,
    image: safeStyling.image,
    shape: safeStyling.shape,
  };
};
