import React, { useState } from 'react';
import { Typography, Collapse, Card, Input, Divider } from 'antd';
import {
  HelpCircle,
  Search,
  QrCode,
  Palette,
  Download,
  Shield,
  Users,
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title, Text, Paragraph } = Typography;

const faqCategories = [
  {
    key: 'getting-started',
    title: 'Getting Started',
    faqs: [
      {
        key: '1',
        question: 'What types of QR codes can I create?',
        answer: 'You can create QR codes for URLs, vCards, text, WiFi networks, emails, phone numbers, locations, and social media profiles.',
        icon: <QrCode size={16} />,
      },
      {
        key: '2',
        question: 'How do I get started?',
        answer: 'Sign up, choose your QR code type, customize and download. It\'s that easy!',
        icon: <ChevronRight size={16} />,
      },
    ]
  },
  {
    key: 'customization',
    title: 'Customization',
    faqs: [
      {
        key: '3',
        question: 'Can I customize my QR code appearance?',
        answer: 'Yes! Choose from 16 themes, customize colors, adjust size, and apply card templates.',
        icon: <Palette size={16} />,
      },
      {
        key: '4',
        question: 'What is error correction level?',
        answer: 'Error correction allows QR codes to be read even if partially damaged. We offer 4 levels: Low (7%), Medium (15%), Quartile (25%), and High (30%).',
        icon: <Shield size={16} />,
      },
    ]
  },
  {
    key: 'data-privacy',
    title: 'Data & Privacy',
    faqs: [
      {
        key: '5',
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard SSL encryption and secure authentication to protect your data.',
        icon: <Shield size={16} />,
      },
    ]
  },
  {
    key: 'usage-features',
    title: 'Usage & Features',
    faqs: [
      {
        key: '7',
        question: 'Can I download my QR codes?',
        answer: 'Yes! Download as high-resolution PNG images and track scan analytics.',
        icon: <Download size={16} />,
      },
      {
        key: '8',
        question: 'Do you offer analytics?',
        answer: 'Premium users get detailed analytics including scan counts, locations, and device statistics.',
        icon: <Users size={16} />,
      },
    ]
  }
];

const FAQs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Title level={2} className="!text-xl md:!text-2xl !mb-2">
            Frequently Asked Questions
          </Title>
          <Text type="secondary" className="text-sm md:text-base">
            Everything you need to know about QR Studio
          </Text>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            size="large"
            placeholder="Search FAQs..."
            prefix={<Search size={18} className="text-muted-foreground" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            allowClear
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.key} className="overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-foreground">{category.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {category.faqs.length}
                </span>
              </div>
              <Collapse
                ghost
                activeKey={activeKeys}
                onChange={(keys) => setActiveKeys(keys as string[])}
                expandIcon={({ isActive }) => 
                  isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                }
                items={category.faqs.map(faq => ({
                  key: faq.key,
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{faq.icon}</span>
                      <Text strong className="text-sm md:text-base">{faq.question}</Text>
                    </div>
                  ),
                  children: (
                    <div className="pl-6 border-l-2 border-primary/20">
                      <Paragraph className="text-muted-foreground text-sm !mb-0">
                        {faq.answer}
                      </Paragraph>
                    </div>
                  ),
                }))}
              />
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8">
          <Divider><Text type="secondary">Still have questions?</Text></Divider>
          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
              <Mail size={24} className="text-primary" />
            </div>
            <Title level={4} className="!mb-2 !text-base">Contact Support</Title>
            <Text type="secondary" className="block mb-4 text-sm">
              Our team is here to help you.
            </Text>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              <Mail size={16} />
              Contact Us
            </a>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FAQs;
