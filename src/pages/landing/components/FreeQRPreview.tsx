import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QRStyling } from '@/types/qrcode';

interface FreeQRPreviewProps {
  content: string;
  styling: QRStyling;
  size?: number;
  className?: string;
}

const FreeQRPreview = forwardRef<HTMLDivElement, FreeQRPreviewProps>(
  ({ content, styling, size = 240, className = '' }, ref) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const qrInstanceRef = useRef<QRCodeStyling | null>(null);

    useImperativeHandle(ref, () => qrRef.current as HTMLDivElement);

    useEffect(() => {
      const handleDownload = (e: CustomEvent) => {
        if (qrInstanceRef.current) {
          qrInstanceRef.current.download({
            name: 'qr-code',
            extension: e.detail?.format || 'png'
          });
        }
      };

      window.addEventListener('download-qr', handleDownload as EventListener);
      return () => {
        window.removeEventListener('download-qr', handleDownload as EventListener);
      };
    }, []);

    useEffect(() => {
      if (!qrRef.current) return;

      const qrOptions = {
        width: size,
        height: size,
        data: content || 'https://example.com',
        type: 'svg' as const,
        dotsOptions: {
          color: styling.fgColor || '#000000',
          type: (styling.dotsType || 'square') as any
        },
        backgroundOptions: {
          color: styling.bgColor || '#ffffff'
        },
        cornersSquareOptions: {
          color: styling.cornersSquareOptions?.color || styling.fgColor || '#000000',
          type: (styling.cornersSquareOptions?.type || 'square') as any
        },
        cornersDotOptions: {
          color: styling.cornersDotOptions?.color || styling.fgColor || '#000000',
          type: (styling.cornersDotOptions?.type || 'square') as any
        },
        qrOptions: {
          errorCorrectionLevel: styling.level || 'M'
        }
      };

      if (qrInstanceRef.current) {
        qrInstanceRef.current.update(qrOptions);
      } else {
        qrInstanceRef.current = new QRCodeStyling(qrOptions);
        qrRef.current.innerHTML = '';
        qrInstanceRef.current.append(qrRef.current);
      }
    }, [content, styling, size]);

    return (
      <div className={`bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-border ${className}`}>
        <div ref={qrRef} className="flex items-center justify-center" />
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50">
          <img src="/logo.png" alt="QR Studio" className="w-5 h-5 object-contain" />
          <span className="text-xs font-medium text-muted-foreground">QR Studio</span>
        </div>
      </div>
    );
  }
);

FreeQRPreview.displayName = 'FreeQRPreview';

export default FreeQRPreview;
