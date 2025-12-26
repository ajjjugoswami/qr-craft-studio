import React from 'react';
import { Button } from 'antd';
import { 
  Phone, Mail, MessageSquare, MapPin, Globe, Copy, Check,
  Instagram, Facebook, Youtube, Music, Send, CreditCard, Twitter, Linkedin, Video, MessageCircle,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Contact
} from 'lucide-react';

interface GenericContentProps {
  content: string;
  qrType: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

const getIcon = (qrType: string) => {
  const iconClass = "w-10 h-10 text-primary-foreground";
  switch (qrType) {
    case 'phone': return <Phone className={iconClass} />;
    case 'email': return <Mail className={iconClass} />;
    case 'sms': return <MessageSquare className={iconClass} />;
    case 'location': return <MapPin className={iconClass} />;
    case 'instagram': return <Instagram className={iconClass} />;
    case 'facebook': return <Facebook className={iconClass} />;
    case 'youtube': return <Youtube className={iconClass} />;
    case 'whatsapp': return <MessageCircle className={iconClass} />;
    case 'tiktok': return <Video className={iconClass} />;
    case 'twitter': return <Twitter className={iconClass} />;
    case 'linkedin': return <Linkedin className={iconClass} />;
    case 'spotify': return <Music className={iconClass} />;
    case 'telegram': return <Send className={iconClass} />;
    case 'paypal': return <CreditCard className={iconClass} />;
    case 'event': return <Calendar className={iconClass} />;
    case 'mecard': 
    case 'vcard': return <Contact className={iconClass} />;
    case 'pdf': return <FileDown className={iconClass} />;
    case 'video': return <PlayCircle className={iconClass} />;
    case 'audio': return <Headphones className={iconClass} />;
    case 'coupon': return <Tag className={iconClass} />;
    case 'review': return <Star className={iconClass} />;
    case 'feedback': return <ClipboardList className={iconClass} />;
    default: return <Globe className={iconClass} />;
  }
};

const getTitle = (qrType: string) => {
  switch (qrType) {
    case 'phone': return 'Phone Number';
    case 'email': return 'Email Address';
    case 'sms': return 'SMS Message';
    case 'location': return 'Location';
    case 'instagram': return 'Instagram';
    case 'facebook': return 'Facebook';
    case 'youtube': return 'YouTube';
    case 'whatsapp': return 'WhatsApp';
    case 'tiktok': return 'TikTok';
    case 'twitter': return 'X / Twitter';
    case 'linkedin': return 'LinkedIn';
    case 'spotify': return 'Spotify';
    case 'telegram': return 'Telegram';
    case 'paypal': return 'PayPal';
    case 'text': return 'Text Content';
    case 'event': return 'Calendar Event';
    case 'mecard': return 'Contact (MeCard)';
    case 'vcard': return 'Contact (vCard)';
    case 'pdf': return 'PDF / Document';
    case 'video': return 'Video';
    case 'audio': return 'Audio';
    case 'coupon': return 'Coupon / Discount';
    case 'review': return 'Google Review';
    case 'feedback': return 'Feedback / Survey';
    default: return 'Content';
  }
};

const getAction = (qrType: string, content: string) => {
  switch (qrType) {
    case 'phone': return { label: 'Call Now', href: `tel:${content}` };
    case 'email': return { label: 'Send Email', href: `mailto:${content}` };
    case 'sms': return { label: 'Send SMS', href: `sms:${content}` };
    case 'location': return { label: 'Open in Maps', href: `https://maps.google.com/?q=${encodeURIComponent(content)}` };
    case 'instagram': return { label: 'Open Instagram', href: content };
    case 'facebook': return { label: 'Open Facebook', href: content };
    case 'youtube': return { label: 'Open YouTube', href: content };
    case 'whatsapp': return { label: 'Open WhatsApp', href: content };
    case 'tiktok': return { label: 'Open TikTok', href: content };
    case 'twitter': return { label: 'Open X / Twitter', href: content };
    case 'linkedin': return { label: 'Open LinkedIn', href: content };
    case 'spotify': return { label: 'Open Spotify', href: content };
    case 'telegram': return { label: 'Open Telegram', href: content };
    case 'paypal': return { label: 'Open PayPal', href: content };
    case 'pdf': return { label: 'View Document', href: content };
    case 'video': return { label: 'Play Video', href: content };
    case 'audio': return { label: 'Play Audio', href: content };
    case 'review': return { label: 'Leave Review', href: content };
    case 'feedback': return { label: 'Open Survey', href: content };
    default: return null;
  }
};

export const GenericContent: React.FC<GenericContentProps> = ({ content, qrType, copied, onCopy }) => {
  const action = getAction(qrType, content);

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

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary/10 p-6 text-center">
        <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
          {getIcon(qrType)}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{getTitle(qrType)}</h2>
      </div>
      
      <div className="p-4">
        {isCoupon ? (
          <div className="space-y-3">
            <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-dashed border-primary">
              <p className="text-2xl font-bold text-primary">{couponData.code}</p>
              {couponData.discount && <p className="text-lg font-medium text-foreground">{couponData.discount}</p>}
            </div>
            {couponData.description && <p className="text-muted-foreground text-sm">{couponData.description}</p>}
            {couponData.validUntil && <p className="text-xs text-muted-foreground">Valid until: {couponData.validUntil}</p>}
            <button 
              onClick={() => onCopy(couponData.code || content, 'content')} 
              className="w-full p-3 bg-muted/50 rounded-lg flex items-center justify-center gap-2 hover:bg-muted"
            >
              {copied === 'content' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm">Copy Code</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1 break-all">
              <p className="text-foreground">{content}</p>
            </div>
            <button onClick={() => onCopy(content, 'content')} className="p-1 hover:bg-muted rounded flex-shrink-0">
              {copied === 'content' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        )}
      </div>
      
      {action && !isCoupon && (
        <div className="p-4 border-t border-border">
          <Button type="primary" size="large" className="w-full" onClick={() => window.location.href = action.href}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};
