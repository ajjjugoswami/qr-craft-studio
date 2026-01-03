import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toPng, toSvg } from 'html-to-image';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const qrInstanceRef = useRef<QRCodeStyling | null>(null);

    useImperativeHandle(ref, () => qrRef.current as HTMLDivElement);

    useEffect(() => {
      const handleDownload = async (e: CustomEvent) => {
        if (containerRef.current) {
          const format = e.detail?.format || 'png';
          
          try {
            if (format === 'png') {
              const dataUrl = await toPng(containerRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2,
              });
              const link = document.createElement('a');
              link.download = 'qr-code.png';
              link.href = dataUrl;
              link.click();
            } else if (format === 'svg') {
              const dataUrl = await toSvg(containerRef.current, {
                backgroundColor: '#ffffff',
              });
              const link = document.createElement('a');
              link.download = 'qr-code.svg';
              link.href = dataUrl;
              link.click();
            } else if (format === 'pdf') {
              // For PDF, we'll create a PNG and embed it in a simple PDF
              const dataUrl = await toPng(containerRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 3,
              });
              
              // Create a simple PDF with the image
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                // A4 size at 72 DPI
                const pdfWidth = 595;
                const pdfHeight = 842;
                canvas.width = pdfWidth;
                canvas.height = pdfHeight;
                
                // White background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, pdfWidth, pdfHeight);
                
                // Center the QR code
                const scale = Math.min(400 / img.width, 400 / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (pdfWidth - scaledWidth) / 2;
                const y = (pdfHeight - scaledHeight) / 2 - 50;
                
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                
                // Add title
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('QR Code', pdfWidth / 2, 60);
                
                // Download as image (PDF requires a library, using PNG as fallback)
                const pdfDataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'qr-code-print.png';
                link.href = pdfDataUrl;
                link.click();
              };
              img.src = dataUrl;
            }
          } catch (error) {
            console.error('Failed to download QR code:', error);
          }
        }
      };

      window.addEventListener('download-qr', handleDownload as EventListener);
      return () => {
        window.removeEventListener('download-qr', handleDownload as EventListener);
      };
    }, []);

    useEffect(() => {
      if (!qrRef.current) return;

      const hasGradients = !!(styling.dotsGradient || styling.backgroundGradient || 
        styling.cornersSquareOptions?.gradient || styling.cornersDotOptions?.gradient);
      // Use higher error correction for gradient styles for better scannability
      const errorLevel = hasGradients ? 'H' : (styling.level || 'M');

      const qrOptions = {
        width: size,
        height: size,
        data: content || 'https://example.com',
        type: 'svg' as const,
        dotsOptions: {
          color: styling.fgColor || '#000000',
          type: (styling.dotsType || 'square') as any,
          ...(styling.dotsGradient && { gradient: styling.dotsGradient }),
        },
        backgroundOptions: {
          color: styling.bgColor || '#ffffff',
          ...(styling.backgroundGradient && { gradient: styling.backgroundGradient }),
        },
        // Always provide corner options with proper fallbacks for scannability
        cornersSquareOptions: {
          color: styling.cornersSquareOptions?.color || styling.fgColor || '#000000',
          type: (styling.cornersSquareOptions?.type || 'square') as any,
          ...(styling.cornersSquareOptions?.gradient && { gradient: styling.cornersSquareOptions.gradient }),
        },
        cornersDotOptions: {
          color: styling.cornersDotOptions?.color || styling.fgColor || '#000000',
          type: (styling.cornersDotOptions?.type || 'square') as any,
          ...(styling.cornersDotOptions?.gradient && { gradient: styling.cornersDotOptions.gradient }),
        },
        qrOptions: {
          errorCorrectionLevel: errorLevel
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
        <div ref={containerRef} className="bg-white p-4">
          <div ref={qrRef} className="flex items-center justify-center" />
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <img src="/logo.png" alt="QR Studio" className="w-5 h-5 object-contain" />
            <span className="text-xs font-medium text-gray-500">QR Studio</span>
          </div>
        </div>
      </div>
    );
  }
);

FreeQRPreview.displayName = 'FreeQRPreview';

export default FreeQRPreview;
