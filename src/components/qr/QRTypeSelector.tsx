import React from 'react';
import { Typography, Row, Col } from 'antd';
import { QRType } from '../../types/qrcode';
import { 
  Link, Mail, Phone, MessageSquare, FileText, Wifi, MapPin, 
  Instagram, Facebook, Youtube, MessageCircle, Image,
  Music, Send, CreditCard, Twitter, Linkedin, Video,
  Calendar, FileDown, PlayCircle, Headphones, Tag, Star, ClipboardList, Contact
} from 'lucide-react';

const { Title, Text } = Typography;

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelect: (type: QRType) => void;
}

interface QRTypeCategory {
  label: string;
  types: { value: QRType; label: string; icon: React.ReactNode }[];
}

const qrTypeCategories: QRTypeCategory[] = [
  {
    label: 'Basic',
    types: [
      { value: 'url', label: 'URL / Link', icon: <Link className="w-5 h-5" /> },
      { value: 'wifi', label: 'WiFi Network', icon: <Wifi className="w-5 h-5" /> },
      { value: 'vcard', label: 'Contact (vCard)', icon: <Contact className="w-5 h-5" /> },
      { value: 'mecard', label: 'Contact (MeCard)', icon: <Contact className="w-5 h-5" /> },
      { value: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
      { value: 'phone', label: 'Phone Call', icon: <Phone className="w-5 h-5" /> },
      { value: 'sms', label: 'SMS Message', icon: <MessageSquare className="w-5 h-5" /> },
      { value: 'location', label: 'Location / Map', icon: <MapPin className="w-5 h-5" /> },
      { value: 'event', label: 'Event (Calendar)', icon: <Calendar className="w-5 h-5" /> },
      { value: 'text', label: 'Plain Text', icon: <FileText className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Social & Communication',
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
    label: 'Media & Files',
    types: [
      { value: 'pdf', label: 'PDF / Document', icon: <FileDown className="w-5 h-5" /> },
      { value: 'video', label: 'Video Link', icon: <PlayCircle className="w-5 h-5" /> },
      { value: 'audio', label: 'Audio / MP3', icon: <Headphones className="w-5 h-5" /> },
      { value: 'image', label: 'Image', icon: <Image className="w-5 h-5" /> },
    ]
  },
  {
    label: 'Business & Marketing',
    types: [
      { value: 'paypal', label: 'PayPal', icon: <CreditCard className="w-5 h-5" /> },
      { value: 'coupon', label: 'Coupon', icon: <Tag className="w-5 h-5" /> },
      { value: 'review', label: 'Google Review', icon: <Star className="w-5 h-5" /> },
      { value: 'feedback', label: 'Feedback', icon: <ClipboardList className="w-5 h-5" /> },
    ]
  }
];

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4} className="!mb-2">Choose QR Type</Title>
      </div>

      <div className="space-y-8">
        {qrTypeCategories.map((category) => (
          <div key={category.label}>
            <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
              {category.label}
            </Text>
            <Row gutter={[12, 12]}>
              {category.types.map((type) => (
                <Col key={type.value} xs={12} sm={8} md={6} lg={4}>
                  <div
                    onClick={() => onSelect(type.value)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all
                      flex flex-col items-center justify-center gap-2
                      hover:border-primary hover:bg-primary/5
                      ${selectedType === type.value 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border bg-background'
                      }
                    `}
                  >
                    <span className={`${selectedType === type.value ? 'text-primary' : 'text-muted-foreground'}`}>
                      {type.icon}
                    </span>
                    <Text className={`text-center text-xs font-medium leading-tight ${selectedType === type.value ? 'text-primary' : ''}`}>
                      {type.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRTypeSelector;
