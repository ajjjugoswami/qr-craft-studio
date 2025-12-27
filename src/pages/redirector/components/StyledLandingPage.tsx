import React from 'react';
import { Button } from 'antd';
import { 
  Phone, Mail, MessageSquare, MapPin, Globe, Copy, Check,
  Instagram, Facebook, Youtube, Music, Send, CreditCard, Twitter, Linkedin, Video, MessageCircle,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Contact, Image as ImageIcon,
  ExternalLink, Share2
} from 'lucide-react';
import { QRTemplate } from '@/types/qrcode';

interface StyledLandingPageProps {
  content: string;
  qrType: string;
  template: QRTemplate;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

const getIcon = (qrType: string, className: string = "w-8 h-8") => {
  switch (qrType) {
    case 'phone': return <Phone className={className} />;
    case 'email': return <Mail className={className} />;
    case 'sms': return <MessageSquare className={className} />;
    case 'location': return <MapPin className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'facebook': return <Facebook className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'whatsapp': return <MessageCircle className={className} />;
    case 'tiktok': return <Video className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'spotify': return <Music className={className} />;
    case 'telegram': return <Send className={className} />;
    case 'paypal': return <CreditCard className={className} />;
    case 'event': return <Calendar className={className} />;
    case 'mecard': 
    case 'vcard': return <Contact className={className} />;
    case 'pdf': return <FileDown className={className} />;
    case 'video': return <PlayCircle className={className} />;
    case 'audio': return <Headphones className={className} />;
    case 'image': return <ImageIcon className={className} />;
    case 'coupon': return <Tag className={className} />;
    case 'review': return <Star className={className} />;
    case 'feedback': return <ClipboardList className={className} />;
    default: return <Globe className={className} />;
  }
};

const getAction = (qrType: string, content: string) => {
  switch (qrType) {
    case 'phone': return { label: 'Call Now', href: `tel:${content}` };
    case 'email': return { label: 'Send Email', href: `mailto:${content}` };
    case 'sms': return { label: 'Send SMS', href: `sms:${content}` };
    case 'location': return { label: 'Open in Maps', href: `https://maps.google.com/?q=${encodeURIComponent(content)}` };
    case 'instagram': return { label: 'Open Instagram', href: content };
    case 'facebook': return { label: 'Go to Facebook page', href: content };
    case 'youtube': return { label: 'Open YouTube', href: content };
    case 'whatsapp': return { label: 'Open WhatsApp', href: content };
    case 'tiktok': return { label: 'Open TikTok', href: content };
    case 'twitter': return { label: 'Open X / Twitter', href: content };
    case 'linkedin': return { label: 'Open LinkedIn', href: content };
    case 'spotify': return { label: 'Open Spotify', href: content };
    case 'telegram': return { label: 'Open Telegram', href: content };
    case 'paypal': return { label: 'Open PayPal', href: content };
    case 'pdf': return { label: 'View PDF', href: content };
    case 'video': return { label: 'Play Video', href: content };
    case 'audio': return { label: 'Play Audio', href: content };
    case 'image': return { label: 'View Image', href: content };
    case 'review': return { label: 'Leave Review', href: content };
    case 'feedback': return { label: 'Open Survey', href: content };
    case 'url': return { label: 'Visit Website', href: content };
    default: return null;
  }
};

// Parse coupon data
const parseCouponData = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    return { code: content };
  }
};

// Get gradient style based on template
const getGradientStyle = (template: QRTemplate): React.CSSProperties => {
  if (!template.showGradient || !template.gradientColor) {
    return { backgroundColor: template.backgroundColor };
  }
  
  const directions: Record<string, string> = {
    'to-bottom': 'to bottom',
    'to-right': 'to right',
    'to-bottom-right': 'to bottom right',
    'to-top-right': 'to top right',
  };
  
  const direction = directions[template.gradientDirection || 'to-bottom'] || 'to bottom';
  return {
    background: `linear-gradient(${direction}, ${template.backgroundColor}, ${template.gradientColor})`,
  };
};

export const StyledLandingPage: React.FC<StyledLandingPageProps> = ({ 
  content, 
  qrType, 
  template, 
  copied, 
  onCopy 
}) => {
  const action = getAction(qrType, content);
  const isCoupon = qrType === 'coupon';
  const couponData = isCoupon ? parseCouponData(content) : null;
  const isImage = qrType === 'image';
  const isPdf = qrType === 'pdf';
  const isVideo = qrType === 'video';
  const isAudio = qrType === 'audio';
  const isSocialMedia = ['instagram', 'facebook', 'youtube', 'tiktok', 'twitter', 'linkedin', 'spotify', 'telegram'].includes(qrType);

  // Determine header curve type based on template
  const headerCurveStyle = template.decorativeStyle === 'circles' ? 'rounded-b-[50px]' : 
                          template.decorativeStyle === 'geometric' ? 'rounded-b-3xl' : 
                          'rounded-b-[40px]';

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={getGradientStyle(template)}
    >
      {/* Header Section */}
      <div 
        className={`relative pt-8 pb-20 px-6 ${headerCurveStyle}`}
        style={getGradientStyle(template)}
      >
        {/* Share Button */}
        <button 
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          onClick={() => navigator.share?.({ url: window.location.href }).catch(() => {})}
        >
          <Share2 className="w-5 h-5" style={{ color: template.textColor }} />
        </button>

        {/* Icon */}
        {isSocialMedia && (
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: template.accentColor || 'rgba(255,255,255,0.2)' }}
          >
            {getIcon(qrType, "w-8 h-8")}
          </div>
        )}

        {/* Title & Subtitle */}
        <h1 
          className="text-center font-bold mb-2"
          style={{ 
            color: template.textColor,
            fontSize: `${template.titleFontSize || 28}px`,
            fontFamily: template.fontFamily,
            fontWeight: template.titleFontWeight === 'bold' ? 700 : template.titleFontWeight === 'semibold' ? 600 : 500,
            letterSpacing: template.titleLetterSpacing ? `${template.titleLetterSpacing}px` : undefined,
          }}
        >
          {template.title || 'Welcome'}
        </h1>
        
        <p 
          className="text-center opacity-90"
          style={{ 
            color: template.textColor,
            fontSize: `${template.subtitleFontSize || 16}px`,
            fontFamily: template.fontFamily,
            fontWeight: template.subtitleFontWeight === 'semibold' ? 600 : template.subtitleFontWeight === 'medium' ? 500 : 400,
          }}
        >
          {template.subtitle || ''}
        </p>
      </div>

      {/* Content Card */}
      <div className="flex-1 px-4 -mt-12">
        <div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto"
          style={{ 
            borderRadius: `${template.borderRadius || 16}px`,
            border: template.showBorder ? `${template.borderWidth || 1}px solid ${template.borderColor || '#e5e7eb'}` : undefined,
          }}
        >
          {/* Media Preview for image/pdf/video types */}
          {(isImage || isPdf || isVideo || isAudio) && (
            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
              {isImage ? (
                <img 
                  src={content} 
                  alt="Content" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                  {getIcon(qrType, "w-16 h-16")}
                </div>
              )}
            </div>
          )}

          {/* Coupon Badge */}
          {isCoupon && couponData?.discount && (
            <div className="relative bg-gradient-to-r from-amber-100 to-orange-100 p-8 flex items-center justify-center">
              <div 
                className="px-6 py-2 rounded-full text-sm font-semibold shadow-md"
                style={{ 
                  backgroundColor: template.accentColor || template.backgroundColor,
                  color: template.textColor || '#fff',
                }}
              >
                🎉 {couponData.discount}
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="p-6">
            {isCoupon ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{couponData?.discount || 'Special Offer'}</h3>
                {couponData?.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{couponData.description}</p>
                )}
                
                {/* Dashed separator */}
                <div className="border-t-2 border-dashed border-gray-200 my-4" />

                {/* Coupon Code */}
                {couponData?.code && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">Coupon Code</p>
                    <button 
                      onClick={() => onCopy(couponData.code, 'code')}
                      className="px-6 py-3 bg-gray-100 rounded-lg text-lg font-mono font-bold text-gray-800 hover:bg-gray-200 transition-colors w-full flex items-center justify-center gap-2"
                    >
                      {couponData.code}
                      {copied === 'code' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
                
                {couponData?.validUntil && (
                  <p className="text-xs text-gray-400 text-center">Valid until: {couponData.validUntil}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Content display for non-coupon types */}
                {!isImage && !isPdf && !isVideo && !isAudio && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 break-all">
                      <p className="text-gray-700 text-sm">{content}</p>
                    </div>
                    <button 
                      onClick={() => onCopy(content, 'content')} 
                      className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 transition-colors"
                    >
                      {copied === 'content' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Button */}
          {action && (
            <div className="p-4 pt-0">
              <button
                onClick={() => window.location.href = action.href}
                className="w-full py-3.5 rounded-xl font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{
                  backgroundColor: template.ctaButton?.backgroundColor || template.backgroundColor,
                  color: template.ctaButton?.textColor || template.textColor,
                  borderRadius: `${template.ctaButton?.borderRadius || 12}px`,
                }}
              >
                {template.ctaButton?.text || action.label}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-8" />
    </div>
  );
};