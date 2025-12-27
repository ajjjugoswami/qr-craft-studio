import React from 'react';
import { VCardContent } from './VCardContent';
import { WiFiContent } from './WiFiContent';
import { GenericContent } from './GenericContent';
import { ImageContent } from './ImageContent';
import { StyledLandingPage } from './StyledLandingPage';
import { QRTemplate } from '@/types/qrcode';

interface DirectContentProps {
  content: string;
  qrType: string;
  template?: QRTemplate | null;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

export const DirectContent: React.FC<DirectContentProps> = ({ content, qrType, template, copied, onCopy }) => {
  // If we have a styled template, use the StyledLandingPage
  if (template && template.id && template.title) {
    return (
      <StyledLandingPage 
        content={content} 
        qrType={qrType} 
        template={template} 
        copied={copied} 
        onCopy={onCopy} 
      />
    );
  }

  // Otherwise, use the default components
  switch (qrType) {
    case 'vcard':
      return <VCardContent content={content} copied={copied} onCopy={onCopy} />;
    case 'wifi':
      return <WiFiContent content={content} copied={copied} onCopy={onCopy} />;
    case 'image':
      return <ImageContent content={content} />;
    default:
      return <GenericContent content={content} qrType={qrType} copied={copied} onCopy={onCopy} />;
  }
};
