import React from 'react';
import { User, Phone, Mail, Globe, MapPin, Copy, Check, Download, Building2, Briefcase } from 'lucide-react';
import { parseVCard } from '../utils/contentParsers';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface VCardContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
  whiteLabel?: WhiteLabelConfig | null;
}

export const VCardContent: React.FC<VCardContentProps> = ({ content, copied, onCopy, whiteLabel }) => {
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const primaryColor = whiteLabel?.enabled && whiteLabel.primaryColor ? whiteLabel.primaryColor : '#2563eb';

  return (
    <div className="min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col" style={{ backgroundColor: primaryColor }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 text-center flex-shrink-0 sm:p-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
          {vcard.name ? (
            <span className="text-xl font-bold text-white">{getInitials(vcard.name)}</span>
          ) : (
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-white">{vcard.name || 'Contact'}</h1>
        {vcard.title && (
          <p className="text-white/80 text-sm mt-1 flex items-center justify-center gap-1">
            <Briefcase className="w-3 h-3" /> {vcard.title}
          </p>
        )}
        {vcard.org && (
          <p className="text-white/70 text-xs flex items-center justify-center gap-1">
            <Building2 className="w-3 h-3" /> {vcard.org}
          </p>
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col min-h-0">
        <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="p-4 space-y-2 flex-1 overflow-auto">
            {vcard.phone && (
              <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500">Phone</p>
                  <a href={`tel:${vcard.phone}`} className="text-stone-900 font-medium truncate block">{vcard.phone}</a>
                </div>
                <button onClick={() => onCopy(vcard.phone!, 'phone')} className="p-2 hover:bg-stone-200 rounded-full">
                  {copied === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                </button>
              </div>
            )}

            {vcard.email && (
              <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500">Email</p>
                  <a href={`mailto:${vcard.email}`} className="text-stone-900 font-medium truncate block text-sm">{vcard.email}</a>
                </div>
                <button onClick={() => onCopy(vcard.email!, 'email')} className="p-2 hover:bg-stone-200 rounded-full">
                  {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                </button>
              </div>
            )}

            {vcard.url && (
              <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500">Website</p>
                  <a href={vcard.url} target="_blank" rel="noopener noreferrer" className="text-stone-900 font-medium truncate block text-sm">
                    {vcard.url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            {vcard.address && (
              <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500">Address</p>
                  <p className="text-stone-900 text-sm line-clamp-2">{vcard.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex-shrink-0 border-t border-stone-100">
            <button 
              onClick={downloadVCard}
              className="w-full py-3.5 text-white font-medium rounded-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Download className="w-4 h-4" />
              Save Contact
            </button>
            
            {whiteLabel?.showPoweredBy !== false && (
              <p className="text-xs text-stone-400 text-center mt-3">
                Powered by QR Studio
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
