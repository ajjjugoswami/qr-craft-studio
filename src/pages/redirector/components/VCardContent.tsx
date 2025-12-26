import React from 'react';
import { Button } from 'antd';
import { User, Phone, Mail, Globe, MapPin, Copy, Check, Download } from 'lucide-react';
import { parseVCard } from '../utils/contentParsers';

interface VCardContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

export const VCardContent: React.FC<VCardContentProps> = ({ content, copied, onCopy }) => {
  const vcard = parseVCard(content);
  
  const downloadVCard = () => {
    const blob = new Blob([content], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vcard.name || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary/10 p-6 text-center">
        <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{vcard.name || 'Contact'}</h2>
        {vcard.title && <p className="text-sm text-muted-foreground mt-1">{vcard.title}</p>}
        {vcard.org && <p className="text-sm text-muted-foreground">{vcard.org}</p>}
      </div>
      
      <div className="p-4 space-y-3">
        {vcard.phone && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
            <a href={`tel:${vcard.phone}`} className="flex-1 text-foreground hover:underline">{vcard.phone}</a>
            <button onClick={() => onCopy(vcard.phone!, 'phone')} className="p-1 hover:bg-muted rounded">
              {copied === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        )}
        
        {vcard.email && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
            <a href={`mailto:${vcard.email}`} className="flex-1 text-foreground hover:underline truncate">{vcard.email}</a>
            <button onClick={() => onCopy(vcard.email!, 'email')} className="p-1 hover:bg-muted rounded">
              {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        )}
        
        {vcard.url && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
            <a href={vcard.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-foreground hover:underline truncate">{vcard.url}</a>
          </div>
        )}
        
        {vcard.address && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="flex-1 text-foreground text-sm">{vcard.address}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button type="primary" size="large" className="w-full" onClick={downloadVCard} icon={<Download className="w-4 h-4" />}>
          Save Contact
        </Button>
      </div>
    </div>
  );
};
