import React from 'react';
import { Typography, Collapse, Card } from 'antd';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title } = Typography;

const faqs = [
  {
    key: '1',
    label: 'What types of QR codes can I create?',
    children: 'You can create QR codes for URLs, vCards (contact information), plain text, WiFi networks, and emails.',
  },
  {
    key: '2',
    label: 'Can I customize the appearance of my QR code?',
    children: 'Yes! You can customize the colors, size, error correction level, and choose from various card templates.',
  },
  {
    key: '3',
    label: 'Where is my data stored?',
    children: 'All your QR codes are stored locally in your browser\'s storage. No data is sent to external servers.',
  },
  {
    key: '4',
    label: 'Can I download my QR codes?',
    children: 'Yes, you can download your QR codes as PNG images by clicking the download button on any QR code card.',
  },
  {
    key: '5',
    label: 'What is error correction level?',
    children: 'Error correction allows QR codes to be read even if they are partially damaged. Higher levels provide more resilience but create denser codes.',
  },
];

const FAQs: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Title level={2} className="mb-8">Frequently Asked Questions</Title>
        <Card>
          <Collapse items={faqs} defaultActiveKey={['1']} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FAQs;
