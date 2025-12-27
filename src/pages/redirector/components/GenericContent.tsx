import React from 'react';
import { 
  Phone, Mail, MapPin, Globe, Copy, Check, ExternalLink, Share2,
  Instagram, Facebook, Youtube, Music, Send, CreditCard, Linkedin, Video, MessageCircle,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Contact, Twitter
} from 'lucide-react';

interface GenericContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

const getTypeConfig = (qrType: string) => {
  switch (qrType) {
    case 'phone':
      return { 
        icon: Phone, 
        title: 'Phone Number', 
        gradient: 'from-green-500 to-emerald-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        action: { label: 'Call Now', prefix: 'tel:' }
      };
    case 'email':
      return { 
        icon: Mail, 
        title: 'Email Address', 
        gradient: 'from-red-500 to-rose-600',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        action: { label: 'Send Email', prefix: 'mailto:' }
      };
    case 'location':
      return { 
        icon: MapPin, 
        title: 'Location', 
        gradient: 'from-orange-500 to-amber-600',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        action: { label: 'Open in Maps', prefix: 'https://maps.google.com/?q=' }
      };
    case 'instagram':
      return { 
        icon: Instagram, 
        title: 'Instagram', 
        gradient: 'from-pink-500 via-purple-500 to-orange-400',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600',
        action: { label: 'Open Instagram', prefix: '' }
      };
    case 'facebook':
      return { 
        icon: Facebook, 
        title: 'Facebook', 
        gradient: 'from-blue-600 to-blue-700',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        action: { label: 'Open Facebook', prefix: '' }
      };
    case 'youtube':
      return { 
        icon: Youtube, 
        title: 'YouTube', 
        gradient: 'from-red-600 to-red-700',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        action: { label: 'Watch on YouTube', prefix: '' }
      };
    case 'whatsapp':
      return { 
        icon: MessageCircle, 
        title: 'WhatsApp', 
        gradient: 'from-green-500 to-green-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        action: { label: 'Open WhatsApp', prefix: '' }
      };
    case 'tiktok':
      return { 
        icon: Video, 
        title: 'TikTok', 
        gradient: 'from-gray-900 via-pink-500 to-cyan-400',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-800',
        action: { label: 'Open TikTok', prefix: '' }
      };
    case 'twitter':
      return { 
        icon: Twitter, 
        title: 'X / Twitter', 
        gradient: 'from-gray-800 to-gray-900',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-800',
        action: { label: 'Open X', prefix: '' }
      };
    case 'linkedin':
      return { 
        icon: Linkedin, 
        title: 'LinkedIn', 
        gradient: 'from-blue-700 to-blue-800',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-700',
        action: { label: 'Open LinkedIn', prefix: '' }
      };
    case 'spotify':
      return { 
        icon: Music, 
        title: 'Spotify', 
        gradient: 'from-green-500 to-green-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        action: { label: 'Open Spotify', prefix: '' }
      };
    case 'telegram':
      return { 
        icon: Send, 
        title: 'Telegram', 
        gradient: 'from-blue-400 to-blue-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-500',
        action: { label: 'Open Telegram', prefix: '' }
      };
    case 'paypal':
      return { 
        icon: CreditCard, 
        title: 'PayPal', 
        gradient: 'from-blue-600 to-blue-700',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        action: { label: 'Open PayPal', prefix: '' }
      };
    case 'event':
      return { 
        icon: Calendar, 
        title: 'Calendar Event', 
        gradient: 'from-purple-500 to-indigo-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        action: null
      };
    case 'mecard':
    case 'vcard':
      return { 
        icon: Contact, 
        title: 'Contact', 
        gradient: 'from-blue-500 to-indigo-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        action: null
      };
    case 'pdf':
      return { 
        icon: FileDown, 
        title: 'Document', 
        gradient: 'from-red-500 to-red-600',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        action: { label: 'View Document', prefix: '' }
      };
    case 'video':
      return { 
        icon: PlayCircle, 
        title: 'Video', 
        gradient: 'from-purple-500 to-pink-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        action: { label: 'Play Video', prefix: '' }
      };
    case 'audio':
      return { 
        icon: Headphones, 
        title: 'Audio', 
        gradient: 'from-orange-500 to-pink-500',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        action: { label: 'Play Audio', prefix: '' }
      };
    case 'coupon':
      return { 
        icon: Tag, 
        title: 'Coupon', 
        gradient: 'from-amber-500 to-orange-600',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        action: null
      };
    case 'review':
      return { 
        icon: Star, 
        title: 'Leave a Review', 
        gradient: 'from-yellow-500 to-orange-500',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        action: { label: 'Leave Review', prefix: '' }
      };
    case 'feedback':
      return { 
        icon: ClipboardList, 
        title: 'Feedback', 
        gradient: 'from-teal-500 to-cyan-600',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        action: { label: 'Open Survey', prefix: '' }
      };
    case 'text':
      return { 
        icon: ClipboardList, 
        title: 'Text', 
        gradient: 'from-slate-600 to-slate-800',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
        action: null
      };
    default:
      return { 
        icon: Globe, 
        title: 'Link', 
        gradient: 'from-slate-600 to-slate-800',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
        action: { label: 'Open Link', prefix: '' }
      };
  }
};

export const GenericContent: React.FC<GenericContentProps> = ({ content, qrType, copied, onCopy }) => {
  const config = getTypeConfig(qrType);
  const Icon = config.icon;

  // Special handling for coupon type
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: content });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center p-4`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-8 text-center relative`}>
          {/* Share button */}
          {navigator.share && (
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          )}
          
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Icon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{config.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCoupon ? (
            <div className="space-y-4">
              {/* Coupon Code */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-dashed border-amber-300 text-center">
                <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-2">Coupon Code</p>
                <p className="text-3xl font-bold text-amber-700 font-mono">{couponData.code}</p>
                {couponData.discount && (
                  <p className="text-xl font-semibold text-amber-600 mt-2">{couponData.discount}</p>
                )}
              </div>
              {couponData.description && (
                <p className="text-gray-600 text-center">{couponData.description}</p>
              )}
              {couponData.validUntil && (
                <p className="text-sm text-gray-500 text-center">Valid until: {couponData.validUntil}</p>
              )}
              <button 
                onClick={() => onCopy(couponData.code || content, 'content')}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {copied === 'content' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied === 'content' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Content Display */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Content</p>
                    <p className="text-gray-800 break-all">{content}</p>
                  </div>
                  <button 
                    onClick={() => onCopy(content, 'content')}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                  >
                    {copied === 'content' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              {config.action && (
                <button 
                  onClick={handleAction}
                  className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2`}
                >
                  <ExternalLink className="w-5 h-5" />
                  {config.action.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
