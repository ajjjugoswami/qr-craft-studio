import React from 'react';
import { Button } from 'antd';
import { Phone, Mail, MessageSquare, MapPin, Globe, Copy, Check } from 'lucide-react';

interface GenericContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

const getIcon = (qrType: string) => {
  switch (qrType) {
    case 'phone': return <Phone className="w-10 h-10 text-primary-foreground" />;
    case 'email': return <Mail className="w-10 h-10 text-primary-foreground" />;
    case 'sms': return <MessageSquare className="w-10 h-10 text-primary-foreground" />;
    case 'location': return <MapPin className="w-10 h-10 text-primary-foreground" />;
    default: return <Globe className="w-10 h-10 text-primary-foreground" />;
  }
};

const getTitle = (qrType: string) => {
  switch (qrType) {
    case 'phone': return 'Phone Number';
    case 'email': return 'Email Address';
    case 'sms': return 'SMS Message';
    case 'location': return 'Location';
    default: return 'Content';
  }
};

const getAction = (qrType: string, content: string) => {
  switch (qrType) {
    case 'phone': return { label: 'Call Now', href: `tel:${content}` };
    case 'email': return { label: 'Send Email', href: `mailto:${content}` };
    case 'sms': return { label: 'Send SMS', href: `sms:${content}` };
    case 'location': return { label: 'Open in Maps', href: `https://maps.google.com/?q=${encodeURIComponent(content)}` };
    default: return null;
  }
};

export const GenericContent: React.FC<GenericContentProps> = ({ content, qrType, copied, onCopy }) => {
  const action = getAction(qrType, content);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary/10 p-6 text-center">
        <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
          {getIcon(qrType)}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{getTitle(qrType)}</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 break-all">
            <p className="text-foreground">{content}</p>
          </div>
          <button onClick={() => onCopy(content, 'content')} className="p-1 hover:bg-muted rounded flex-shrink-0">
            {copied === 'content' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>
      
      {action && (
        <div className="p-4 border-t border-border">
          <Button type="primary" size="large" className="w-full" onClick={() => window.location.href = action.href}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};
