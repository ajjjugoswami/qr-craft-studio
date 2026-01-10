import React, { useState } from 'react';
import { Typography } from 'antd';
import { QRType } from '@/types/qrcode';
import { 
  Link, Mail, Phone, MessageSquare, FileText, Wifi, MapPin, 
  Instagram, Facebook, Youtube, MessageCircle, Image,
  Music, Send, CreditCard, Twitter, Linkedin,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Contact,
  Check
} from 'lucide-react';

const { Text } = Typography;

interface MobileQRTypeSelectorProps {
  selectedType: QRType;
  onSelect: (type: QRType) => void;
}

interface QRTypeOption {
  value: QRType;
  label: string;
  icon: React.ReactNode;
}

interface QRTypeCategory {
  label: string;
  key: string;
  types: QRTypeOption[];
}

const qrTypeCategories: QRTypeCategory[] = [
  {
    label: 'Basic',
    key: 'basic',
    types: [
      { value: 'url', label: 'URL / Link', icon: <Link className="w-5 h-5" /> },
      { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-5 h-5" /> },
      { value: 'vcard', label: 'vCard', icon: <Contact className="w-5 h-5" /> },
      { value: 'mecard', label: 'MeCard', icon: <Contact className="w-5 h-5" /> },
      { value: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
      { value: 'phone', label: 'Phone', icon: <Phone className="w-5 h-5" /> },
      { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-5 h-5" /> },
      { value: 'location', label: 'Location', icon: <MapPin className="w-5 h-5" /> },
      { value: 'event', label: 'Event', icon: <Calendar className="w-5 h-5" /> },
      { value: 'text', label: 'Text', icon: <FileText className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Social',
    key: 'social',
    types: [
      { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" /> },
      { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" /> },
      { value: 'facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
      { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-5 h-5" /> },
      { value: 'twitter', label: 'X / Twitter', icon: <Twitter className="w-5 h-5" /> },
      { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
      { value: 'spotify', label: 'Spotify', icon: <Music className="w-5 h-5" /> },
      { value: 'telegram', label: 'Telegram', icon: <Send className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Media',
    key: 'media',
    types: [
      { value: 'pdf', label: 'PDF', icon: <FileDown className="w-5 h-5" /> },
      { value: 'video', label: 'Video', icon: <PlayCircle className="w-5 h-5" /> },
      { value: 'audio', label: 'Audio', icon: <Headphones className="w-5 h-5" /> },
      { value: 'image', label: 'Image', icon: <Image className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Business',
    key: 'business',
    types: [
      { value: 'paypal', label: 'PayPal', icon: <CreditCard className="w-5 h-5" /> },
      { value: 'coupon', label: 'Coupon', icon: <Tag className="w-5 h-5" /> },
      { value: 'review', label: 'Review', icon: <Star className="w-5 h-5" /> },
      { value: 'feedback', label: 'Feedback', icon: <ClipboardList className="w-5 h-5" /> },
    ]
  }
];

const MobileQRTypeSelector: React.FC<MobileQRTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const [activeCategory, setActiveCategory] = useState('basic');

  const currentCategory = qrTypeCategories.find(c => c.key === activeCategory);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <Text className="text-lg font-semibold block mb-1">Select QR Type</Text>
        <Text type="secondary" className="text-sm">
          What do you want to link to?
        </Text>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide mb-4">
        {qrTypeCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all flex-shrink-0
              ${activeCategory === cat.key 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Type Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-2.5">
        {currentCategory?.types.map((type) => {
          const isSelected = selectedType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => onSelect(type.value)}
              className={`
                relative p-3 rounded-xl border-2 transition-all
                flex flex-col items-center justify-center gap-1.5
                min-h-[80px]
                ${isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check size={10} className="text-primary-foreground" />
                </div>
              )}
              <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                {type.icon}
              </span>
              <Text className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-primary' : ''}`}>
                {type.label}
              </Text>
            </button>
          );
        })}
      </div>

      {/* Selected Type Display */}
      <div className="mt-6 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {qrTypeCategories.flatMap(c => c.types).find(t => t.value === selectedType)?.icon}
          </div>
          <div>
            <Text className="font-semibold block">
              {qrTypeCategories.flatMap(c => c.types).find(t => t.value === selectedType)?.label}
            </Text>
            <Text type="secondary" className="text-sm">Currently selected</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileQRTypeSelector;
