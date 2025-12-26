import React from 'react';
import { Typography, Row, Col } from 'antd';
import { QRType } from '../../types/qrcode';
import { 
  Link, Mail, Phone, MessageSquare, FileText, Wifi, MapPin, 
  Instagram, Facebook, Youtube, MessageCircle, Image,
  Music, Send, CreditCard, Twitter, Linkedin, Video
} from 'lucide-react';

const { Title, Text } = Typography;

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelect: (type: QRType) => void;
}

const qrTypes: { value: QRType; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'Website URL', icon: <Link className="w-6 h-6" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-6 h-6" /> },
  { value: 'phone', label: 'Phone', icon: <Phone className="w-6 h-6" /> },
  { value: 'sms', label: 'SMS', icon: <MessageSquare className="w-6 h-6" /> },
  { value: 'text', label: 'Text', icon: <FileText className="w-6 h-6" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-6 h-6" /> },
  { value: 'location', label: 'Location', icon: <MapPin className="w-6 h-6" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-6 h-6" /> },
  { value: 'facebook', label: 'Facebook', icon: <Facebook className="w-6 h-6" /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-6 h-6" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-6 h-6" /> },
  { value: 'tiktok', label: 'TikTok', icon: <Video className="w-6 h-6" /> },
  { value: 'twitter', label: 'X / Twitter', icon: <Twitter className="w-6 h-6" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-6 h-6" /> },
  { value: 'spotify', label: 'Spotify', icon: <Music className="w-6 h-6" /> },
  { value: 'telegram', label: 'Telegram', icon: <Send className="w-6 h-6" /> },
  { value: 'paypal', label: 'PayPal', icon: <CreditCard className="w-6 h-6" /> },
  { value: 'vcard', label: 'Business Card', icon: <FileText className="w-6 h-6" /> },
  { value: 'image', label: 'Image', icon: <Image className="w-6 h-6" /> },
];

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Title level={4} className="!mb-2">Choose QR Type</Title>
      </div>

      <Row gutter={[16, 16]}>
        {qrTypes.map((type) => (
          <Col key={type.value} xs={12} sm={8} md={6}>
            <div
              onClick={() => onSelect(type.value)}
              className={`
                p-6 rounded-xl border-2 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-3
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
              <Text className={`text-center text-sm font-medium ${selectedType === type.value ? 'text-primary' : ''}`}>
                {type.label}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QRTypeSelector;
