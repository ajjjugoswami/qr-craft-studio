import React from 'react';
import { VCardContent } from './VCardContent';
import { WiFiContent } from './WiFiContent';
import { GenericContent } from './GenericContent';
import { ImageContent } from './ImageContent';
import { SMSContent } from './SMSContent';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface DirectContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
  whiteLabel?: WhiteLabelConfig | null;
}

export const DirectContent: React.FC<DirectContentProps> = ({ 
  content, 
  qrType, 
  copied, 
  onCopy, 
  whiteLabel 
}) => {
  switch (qrType) {
    case 'vcard':
      return <VCardContent content={content} copied={copied} onCopy={onCopy} whiteLabel={whiteLabel} />;
    case 'wifi':
      return <WiFiContent content={content} copied={copied} onCopy={onCopy} whiteLabel={whiteLabel} />;
    case 'image':
      return <ImageContent content={content} whiteLabel={whiteLabel} />;
    case 'sms':
      return <SMSContent content={content} copied={copied} onCopy={onCopy} whiteLabel={whiteLabel} />;
    default:
      return <GenericContent content={content} qrType={qrType} copied={copied} onCopy={onCopy} whiteLabel={whiteLabel} />
  }
};
