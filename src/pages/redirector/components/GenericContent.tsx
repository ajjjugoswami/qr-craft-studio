import React from 'react';
import { 
  Phone, Mail, MapPin, Globe, Copy, Check, ExternalLink,
  Instagram, Facebook, Youtube, Music, Send, CreditCard, Linkedin, Video, MessageCircle,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Twitter
} from 'lucide-react';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface GenericContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
  whiteLabel?: WhiteLabelConfig | null;
}

const getTypeConfig = (qrType: string) => {
  switch (qrType) {
    case 'phone':
      return { icon: Phone, title: 'Phone', color: 'bg-green-600', defaultHex: '#16a34a', iconBg: 'bg-green-100', iconColor: 'text-green-600', action: { label: 'Call Now', prefix: 'tel:' } };
    case 'email':
      return { icon: Mail, title: 'Email', color: 'bg-red-500', defaultHex: '#ef4444', iconBg: 'bg-red-100', iconColor: 'text-red-600', action: { label: 'Send Email', prefix: 'mailto:' } };
    case 'location':
      return { icon: MapPin, title: 'Location', color: 'bg-orange-500', defaultHex: '#f97316', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', action: { label: 'Open Maps', prefix: 'https://maps.google.com/?q=' } };
    case 'instagram':
      return { icon: Instagram, title: 'Instagram', color: 'bg-pink-500', defaultHex: '#ec4899', iconBg: 'bg-pink-100', iconColor: 'text-pink-600', action: { label: 'Open Instagram', prefix: '' } };
    case 'facebook':
      return { icon: Facebook, title: 'Facebook', color: 'bg-blue-600', defaultHex: '#2563eb', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', action: { label: 'Open Facebook', prefix: '' } };
    case 'youtube':
      return { icon: Youtube, title: 'YouTube', color: 'bg-red-600', defaultHex: '#dc2626', iconBg: 'bg-red-100', iconColor: 'text-red-600', action: { label: 'Watch', prefix: '' } };
    case 'whatsapp':
      return { icon: MessageCircle, title: 'WhatsApp', color: 'bg-green-500', defaultHex: '#22c55e', iconBg: 'bg-green-100', iconColor: 'text-green-600', action: { label: 'Open WhatsApp', prefix: '' } };
    case 'twitter':
      return { icon: Twitter, title: 'X', color: 'bg-stone-800', defaultHex: '#292524', iconBg: 'bg-stone-100', iconColor: 'text-stone-800', action: { label: 'Open X', prefix: '' } };
    case 'linkedin':
      return { icon: Linkedin, title: 'LinkedIn', color: 'bg-blue-700', defaultHex: '#1d4ed8', iconBg: 'bg-blue-100', iconColor: 'text-blue-700', action: { label: 'Open LinkedIn', prefix: '' } };
    case 'spotify':
      return { icon: Music, title: 'Spotify', color: 'bg-green-500', defaultHex: '#22c55e', iconBg: 'bg-green-100', iconColor: 'text-green-600', action: { label: 'Open Spotify', prefix: '' } };
    case 'telegram':
      return { icon: Send, title: 'Telegram', color: 'bg-sky-500', defaultHex: '#0ea5e9', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', action: { label: 'Open Telegram', prefix: '' } };
    case 'paypal':
      return { icon: CreditCard, title: 'PayPal', color: 'bg-blue-600', defaultHex: '#2563eb', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', action: { label: 'Open PayPal', prefix: '' } };
    case 'event':
      return { icon: Calendar, title: 'Event', color: 'bg-violet-600', defaultHex: '#7c3aed', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', action: null };
    case 'pdf':
      return { icon: FileDown, title: 'Document', color: 'bg-red-600', defaultHex: '#dc2626', iconBg: 'bg-red-100', iconColor: 'text-red-600', action: { label: 'View Document', prefix: '' } };
    case 'video':
      return { icon: PlayCircle, title: 'Video', color: 'bg-purple-600', defaultHex: '#9333ea', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', action: { label: 'Play Video', prefix: '' } };
    case 'audio':
      return { icon: Headphones, title: 'Audio', color: 'bg-orange-500', defaultHex: '#f97316', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', action: { label: 'Play Audio', prefix: '' } };
    case 'coupon':
      return { icon: Tag, title: 'Coupon', color: 'bg-amber-500', defaultHex: '#f59e0b', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', action: null };
    case 'review':
      return { icon: Star, title: 'Review', color: 'bg-yellow-500', defaultHex: '#eab308', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', action: { label: 'Leave Review', prefix: '' } };
    case 'feedback':
      return { icon: ClipboardList, title: 'Feedback', color: 'bg-teal-600', defaultHex: '#0d9488', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', action: { label: 'Open Survey', prefix: '' } };
    case 'text':
      return { icon: ClipboardList, title: 'Text', color: 'bg-stone-600', defaultHex: '#57534e', iconBg: 'bg-stone-100', iconColor: 'text-stone-600', action: null };
    default:
      return { icon: Globe, title: 'Link', color: 'bg-stone-700', defaultHex: '#44403c', iconBg: 'bg-stone-100', iconColor: 'text-stone-600', action: { label: 'Open Link', prefix: '' } };
  }
};

export const GenericContent: React.FC<GenericContentProps> = ({ content, qrType, copied, onCopy, whiteLabel }) => {
  const config = getTypeConfig(qrType);
  const Icon = config.icon;

  const primaryColor = whiteLabel?.enabled && whiteLabel.primaryColor ? whiteLabel.primaryColor : config.defaultHex;

  const isCoupon = qrType === 'coupon';
  let couponData: { code?: string; discount?: string; description?: string; validUntil?: string } = {};
  if (isCoupon) {
    try {
      couponData = JSON.parse(content);
    } catch {
      couponData = { code: content };
    }
  }

  const handleAction = () => {
    if (config.action) {
      const url = config.action.prefix ? `${config.action.prefix}${encodeURIComponent(content)}` : content;
      window.location.href = url;
    }
  };

  return (
    <div 
      className="min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col"
      style={{ backgroundColor: whiteLabel?.enabled ? primaryColor : undefined }}
      {...(!whiteLabel?.enabled && { className: `min-h-[100dvh] h-[100dvh] overflow-hidden ${config.color} flex flex-col` })}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 text-center flex-shrink-0 sm:p-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-white">{config.title}</h1>
      </div>

      {/* Content Card */}
      <div className="flex-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col min-h-0"> 
        <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden">
          {isCoupon ? (
            <>
              <div className="p-4 flex-1 overflow-auto">
                <div className="bg-amber-50 rounded-xl p-4 border-2 border-dashed border-amber-300 text-center">
                  <p className="text-xs text-amber-600 font-medium mb-1">COUPON CODE</p>
                  <p className="text-2xl font-bold text-amber-700 font-mono">{couponData.code}</p>
                  {couponData.discount && <p className="text-amber-600 font-medium mt-1">{couponData.discount}</p>}
                </div>
                {couponData.description && <p className="text-stone-600 text-sm text-center mt-3">{couponData.description}</p>}
                {couponData.validUntil && <p className="text-stone-400 text-xs text-center mt-2">Valid until: {couponData.validUntil}</p>}
              </div>
              <div className="p-4 flex-shrink-0 border-t border-stone-100">
                <button 
                  onClick={() => onCopy(couponData.code || content, 'content')}
                  className="w-full py-3.5 text-white font-medium rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {copied === 'content' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'content' ? 'Copied!' : 'Copy Code'}
                </button>
                
                {whiteLabel?.showPoweredBy !== false && (
                  <p className="text-xs text-stone-400 text-center mt-3">
                    Powered by QR Studio
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-4 flex-1 overflow-auto">
                <div className="bg-stone-50 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-500 font-medium">Content</p>
                      <p className="text-stone-800 text-sm break-all line-clamp-4">{content}</p>
                    </div>
                    <button 
                      onClick={() => onCopy(content, 'content')}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors flex-shrink-0"
                    >
                      {copied === 'content' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                    </button>
                  </div>
                </div>
              </div>
              {config.action && (
                <div className="p-4 flex-shrink-0 border-t border-stone-100">
                  <button 
                    onClick={handleAction}
                    className="w-full py-3.5 text-white font-medium rounded-xl flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {config.action.label}
                  </button>
                  
                  {whiteLabel?.showPoweredBy !== false && (
                    <p className="text-xs text-stone-400 text-center mt-3">
                      Powered by QR Studio
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
