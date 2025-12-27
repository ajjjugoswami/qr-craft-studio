import React from 'react';
import { VCardContent } from './VCardContent';
import { WiFiContent } from './WiFiContent';
import { GenericContent } from './GenericContent';
import { ImageContent } from './ImageContent';

interface DirectContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

export const DirectContent: React.FC<DirectContentProps> = ({ content, qrType, copied, onCopy }) => {
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
