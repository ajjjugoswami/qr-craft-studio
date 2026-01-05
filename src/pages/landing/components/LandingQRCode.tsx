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
  logo?: string;
}

const LandingQRCode: React.FC<LandingQRCodeProps> = ({
  data,
  color,
  backgroundColor = '#ffffff',
  size = 100,
  dotType = 'rounded',
  cornerSquareType = 'extra-rounded',
  cornerDotType = 'dot',
  logo,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const options: any = {
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
        errorCorrectionLevel: 'H',
      },
    };

    if (logo) {
      options.image = logo;
      options.imageOptions = {
        hideBackgroundDots: true,
        imageSize: 0.35,
        margin: 2,
        crossOrigin: 'anonymous',
      };
    }

    qrCode.current = new QRCodeStyling(options);

    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [data, color, backgroundColor, size, dotType, cornerSquareType, cornerDotType, logo]);

  return <div ref={ref} className="flex items-center justify-center" />;
};

export default LandingQRCode;
