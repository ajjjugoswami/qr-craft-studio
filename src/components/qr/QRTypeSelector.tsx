import React from 'react';
import { Typography, Row, Col } from 'antd';
import {
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  FileTextOutlined,
  WifiOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  WhatsAppOutlined,
  IdcardOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { QRType } from '../../types/qrcode';

const { Title, Text } = Typography;

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelect: (type: QRType) => void;
}

const qrTypes: { value: QRType; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'Website URL', icon: <LinkOutlined /> },
  { value: 'email', label: 'Email', icon: <MailOutlined /> },
  { value: 'phone', label: 'Phone', icon: <PhoneOutlined /> },
  { value: 'sms', label: 'SMS', icon: <MessageOutlined /> },
  { value: 'text', label: 'Text', icon: <FileTextOutlined /> },
  { value: 'wifi', label: 'WiFi', icon: <WifiOutlined /> },
  { value: 'location', label: 'Location', icon: <EnvironmentOutlined /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramOutlined /> },
  { value: 'facebook', label: 'Facebook', icon: <FacebookOutlined /> },
  { value: 'youtube', label: 'YouTube', icon: <YoutubeOutlined /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined /> },
  { value: 'vcard', label: 'Business Card', icon: <IdcardOutlined /> },
  { value: 'image', label: 'Image', icon: <PictureOutlined /> },
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
              <span className={`text-2xl ${selectedType === type.value ? 'text-primary' : 'text-muted-foreground'}`}>
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
