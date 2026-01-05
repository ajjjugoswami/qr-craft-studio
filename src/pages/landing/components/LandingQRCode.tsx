import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface LandingQRCodeProps {
  data: string;
  color: string;
  backgroundColor?: string;
  size?: number;
  dotType?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  cornerSquareType?: 'square' | 'extra-rounded' | 'dot';
  cornerDotType?: 'square' | 'dot';
}

const LandingQRCode: React.FC<LandingQRCodeProps> = ({
  data,
  color,
  backgroundColor = 'transparent',
  size = 80,
  dotType = 'rounded',
  cornerSquareType = 'extra-rounded',
  cornerDotType = 'dot',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: size,
        height: size,
        data,
        dotsOptions: {
          color,
          type: dotType,
        },
        cornersSquareOptions: {
          color,
          type: cornerSquareType,
        },
        cornersDotOptions: {
          color,
          type: cornerDotType,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        qrOptions: {
          errorCorrectionLevel: 'M',
        },
      });
    }

    if (ref.current && qrCode.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }
  }, [data, color, backgroundColor, size, dotType, cornerSquareType, cornerDotType]);

  return <div ref={ref} className="flex items-center justify-center" />;
};

export default LandingQRCode;
