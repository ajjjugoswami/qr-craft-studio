import React, { useState } from 'react';
import { Typography, Collapse, Card, Input, Space, Tag, Divider } from 'antd';
import {
  HelpCircle,
  Search,
  QrCode,
  Palette,
  Download,
  Shield,
  Zap,
  Users,
  Globe,
  Smartphone,
  Mail,
  Wifi,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const faqCategories = [
  {
    key: 'getting-started',
    title: 'Getting Started',
    color: '#6366f1',
    faqs: [
      {
        key: '1',
        question: 'What types of QR codes can I create?',
        answer: 'You can create QR codes for URLs, vCards (contact information), plain text, WiFi networks, emails, phone numbers, locations, and social media profiles. Each type is optimized for its specific use case.',
        icon: <QrCode size={16} />,
      },
      {
        key: '2',
        question: 'How do I get started?',
        answer: 'Simply sign up for an account, choose your QR code type, customize the content and appearance, then download or share your QR code. It\'s that easy!',
        icon: <ChevronRight size={16} />,
      },
    ]
  },
  {
    key: 'customization',
    title: 'Customization',
    color: '#ec4899',
    faqs: [
      {
        key: '3',
        question: 'Can I customize the appearance of my QR code?',
        answer: 'Absolutely! Choose from 16 beautiful themes including gradients, customize colors, adjust size, select error correction levels, and apply stunning card templates to make your QR codes stand out.',
        icon: <Palette size={16} />,
      },
      {
        key: '4',
        question: 'What is error correction level?',
        answer: 'Error correction allows QR codes to be read even if partially damaged or dirty. We offer 4 levels: Low (7%), Medium (15%), Quartile (25%), and High (30%). Higher levels provide more resilience but create denser patterns.',
        icon: <Shield size={16} />,
      },
    ]
  },
  {
    key: 'data-privacy',
    title: 'Data & Privacy',
    color: '#10b981',
    faqs: [
      {
        key: '5',
        question: 'Where is my data stored?',
        answer: 'Your QR codes and account data are securely stored on our servers with enterprise-grade encryption. We never share your personal information with third parties.',
        icon: <Shield size={16} />,
      },
      {
        key: '6',
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard security measures including SSL encryption, secure authentication, and regular security audits to protect your data.',
        icon: <Shield size={16} />,
      },
    ]
  },
  {
    key: 'usage-features',
    title: 'Usage & Features',
    color: '#f59e0b',
    faqs: [
      {
        key: '7',
        question: 'Can I download my QR codes?',
        answer: 'Yes! Download your QR codes as high-resolution PNG images. You can also access them anytime from your dashboard and track scan analytics.',
        icon: <Download size={16} />,
      },
      {
        key: '8',
        question: 'Do you offer analytics?',
        answer: 'Premium users get detailed analytics including scan counts, locations, devices, and time-based statistics to track your QR code performance.',
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
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-12">
        
          <Title level={1} className="mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about creating and managing QR codes with QR Craft Studio
          </Paragraph>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            size="large"
            placeholder="Search FAQs..."
            prefix={<Search size={18} className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto"
            allowClear
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <Card
              key={category.key}
              className="shadow-sm hover:shadow-md transition-shadow duration-300"
              title={
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                  </div>
                  <span className="font-semibold">{category.title}</span>
                  <Tag color={category.color} className="ml-auto">
                    {category.faqs.length} {category.faqs.length === 1 ? 'Question' : 'Questions'}
                  </Tag>
                </div>
              }
            >
              <Collapse
                ghost
                activeKey={activeKeys}
                onChange={(keys) => setActiveKeys(keys as string[])}
                expandIcon={({ isActive }) => isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              >
                {category.faqs.map((faq) => (
                  <Panel
                    key={faq.key}
                    header={
                      <div className="flex items-center gap-3">
                        <div className="text-gray-500">
                          {faq.icon}
                        </div>
                        <Text strong className="text-base">
                          {faq.question}
                        </Text>
                      </div>
                    }
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <div className="pl-7 ml-3 border-l-2 border-primary/20">
                      <Paragraph className="text-gray-700 leading-relaxed mb-0">
                        {faq.answer}
                      </Paragraph>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 text-center">
          <Divider>
            <Text type="secondary">Still have questions?</Text>
          </Divider>
          <Card className="shadow-sm bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Mail size={24} className="text-primary" />
              </div>
              <div>
                <Title level={4} className="mb-2">Contact Our Support Team</Title>
                <Paragraph className="text-gray-600 mb-4">
                  Can't find what you're looking for? Our friendly support team is here to help.
                </Paragraph>
                <Space>
                  <a href="/contact" className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Mail size={16} />
                    Contact Support
                  </a>
                  <a href="/faqs" className="inline-flex items-center gap-2 px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                    <HelpCircle size={16} />
                    Browse All FAQs
                  </a>
                </Space>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FAQs;
