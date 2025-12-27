import React from 'react';
import { User, Phone, Mail, Globe, MapPin, Copy, Check, Download, Building2, Briefcase, Share2 } from 'lucide-react';
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = new Blob([content], { type: 'text/vcard' });
        const file = new File([blob], `${vcard.name || 'contact'}.vcf`, { type: 'text/vcard' });
        await navigator.share({ files: [file] });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center relative">
          {/* Share button */}
          {navigator.share && (
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          )}
          
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white/30">
            {vcard.name ? (
              <span className="text-3xl font-bold text-white">{getInitials(vcard.name)}</span>
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">{vcard.name || 'Contact'}</h2>
          {vcard.title && (
            <div className="flex items-center justify-center gap-2 mt-2 text-white/90">
              <Briefcase className="w-4 h-4" />
              <span>{vcard.title}</span>
            </div>
          )}
          {vcard.org && (
            <div className="flex items-center justify-center gap-2 mt-1 text-white/80">
              <Building2 className="w-4 h-4" />
              <span>{vcard.org}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {vcard.phone && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                  <a href={`tel:${vcard.phone}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {vcard.phone}
                  </a>
                </div>
                <button 
                  onClick={() => onCopy(vcard.phone!, 'phone')}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {copied === 'phone' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {vcard.email && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                  <a href={`mailto:${vcard.email}`} className="text-gray-800 font-medium hover:text-indigo-600 transition-colors truncate block">
                    {vcard.email}
                  </a>
                </div>
                <button 
                  onClick={() => onCopy(vcard.email!, 'email')}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {copied === 'email' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {vcard.url && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Website</p>
                  <a 
                    href={vcard.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-800 font-medium hover:text-purple-600 transition-colors truncate block"
                  >
                    {vcard.url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            </div>
          )}

          {vcard.address && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Address</p>
                  <p className="text-gray-800 font-medium">{vcard.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="p-6 pt-0">
          <button 
            onClick={downloadVCard}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
};
