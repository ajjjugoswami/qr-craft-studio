import QRCodeStyling from 'qr-code-styling';
import { getAppOrigin } from './config';
import { QRStyling, QRType, QRTemplate } from '@/types/qrcode';

// Types that should encode content directly
const DIRECT_CONTENT_TYPES: QRType[] = ['vcard', 'wifi', 'phone', 'sms', 'email', 'location', 'text'];

interface DownloadQROptions {
  content: string;
  styling: QRStyling;
  template?: QRTemplate | null;
  qrId?: string;
  qrType?: QRType;
  fileName: string;
  format: 'png' | 'jpeg' | 'webp' | 'svg';
  size?: number;
}

const getQRData = (content: string, qrId?: string, qrType: QRType = 'url'): string => {
  try {
    if (DIRECT_CONTENT_TYPES.includes(qrType)) {
      return content || 'https://example.com';
    }
    
    if (typeof window !== 'undefined') {
      if (typeof content === 'string' && qrId) {
        return `${getAppOrigin()}/r/${qrId}`;
      }
      if (typeof content === 'string') {
        return `${getAppOrigin()}/r?u=${encodeURIComponent(content)}`;
      }
    }
    return content || 'https://example.com';
  } catch {
    return content || 'https://example.com';
  }
};

export const downloadQRCode = async (options: DownloadQROptions): Promise<void> => {
  const {
    content,
    styling,
    qrId,
    qrType = 'url',
    fileName,
    format,
    size = 1024,
  } = options;

  const safeStyling = {
    ...styling,
    imageOptions: styling.imageOptions || {
      hideBackgroundDots: true,
      imageSize: 0.4,
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
  };

  const hasLogo = !!safeStyling.image;
  const errorLevel = hasLogo ? 'H' : safeStyling.level;
  const logoSize = hasLogo ? Math.min(safeStyling.imageOptions?.imageSize || 0.4, 0.25) : (safeStyling.imageOptions?.imageSize || 0.4);

  const qrOptions = {
    width: size,
    height: size,
    data: getQRData(content, qrId, qrType),
    type: 'canvas' as const,
    margin: 10,
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
      hideBackgroundDots: true,
      imageSize: logoSize,
      margin: safeStyling.imageOptions.margin ?? 2,
    } : undefined,
    image: safeStyling.image,
    shape: safeStyling.shape,
  };

  const qrCode = new QRCodeStyling(qrOptions);

  const extension = format === 'jpeg' ? 'jpg' : format;
  await qrCode.download({
    name: fileName,
    extension: extension as 'png' | 'jpeg' | 'webp' | 'svg',
  });
};

export const getQRCodeBlob = async (options: Omit<DownloadQROptions, 'fileName'>): Promise<Blob> => {
  const {
    content,
    styling,
    qrId,
    qrType = 'url',
    format,
    size = 1024,
  } = options;

  const safeStyling = {
    ...styling,
    imageOptions: styling.imageOptions || {
      hideBackgroundDots: true,
      imageSize: 0.4,
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
  };

  const hasLogo = !!safeStyling.image;
  const errorLevel = hasLogo ? 'H' : safeStyling.level;
  const logoSize = hasLogo ? Math.min(safeStyling.imageOptions?.imageSize || 0.4, 0.25) : (safeStyling.imageOptions?.imageSize || 0.4);

  const qrOptions = {
    width: size,
    height: size,
    data: getQRData(content, qrId, qrType),
    type: 'canvas' as const,
    margin: 10,
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
      hideBackgroundDots: true,
      imageSize: logoSize,
      margin: safeStyling.imageOptions.margin ?? 2,
    } : undefined,
    image: safeStyling.image,
    shape: safeStyling.shape,
  };

  const qrCode = new QRCodeStyling(qrOptions);
  
  const rawData = await qrCode.getRawData(format === 'jpeg' ? 'jpeg' : format);
  if (!rawData) {
    throw new Error('Failed to generate QR code');
  }
  // Handle both browser Blob and Node Buffer
  if (rawData instanceof Blob) {
    return rawData;
  }
  // For Node Buffer, convert via ArrayBuffer
  const buffer = rawData as unknown as { buffer: ArrayBuffer };
  return new Blob([new Uint8Array(buffer.buffer)]);
};
