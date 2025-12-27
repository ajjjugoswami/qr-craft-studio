import React from 'react';
import { VCardContent } from './VCardContent';
import { WiFiContent } from './WiFiContent';
import { GenericContent } from './GenericContent';
import { ImageContent } from './ImageContent';
import { SMSContent } from './SMSContent';

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
    case 'sms':
      return <SMSContent content={content} copied={copied} onCopy={onCopy} />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <GenericContent content={content} qrType={qrType} copied={copied} onCopy={onCopy} />
          </div>
        </div>
      );
  }
};
