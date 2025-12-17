import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Row, Col } from 'antd';
import { 
  QrCode, 
  Palette, 
  Download, 
  BarChart3, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Smartphone,
  Building2
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Palette size={28} className="text-primary" />,
      title: 'Designer Templates',
      description: 'Choose from 20+ professionally designed templates for any use case.',
    },
    {
      icon: <Zap size={28} className="text-yellow-500" />,
      title: 'Instant Generation',
      description: 'Create beautiful QR codes in seconds with our intuitive editor.',
    },
    {
      icon: <BarChart3 size={28} className="text-green-500" />,
      title: 'Detailed Analytics',
      description: 'Track scans, locations, devices, and more with real-time insights.',
    },
    {
      icon: <Download size={28} className="text-blue-500" />,
      title: 'Multiple Formats',
      description: 'Download in PNG, JPG, or SVG formats for any use case.',
    },
    {
      icon: <Shield size={28} className="text-purple-500" />,
      title: 'Secure & Reliable',
      description: 'Your QR codes work offline and never expire.',
    },
    {
      icon: <Sparkles size={28} className="text-pink-500" />,
      title: 'Full Customization',
      description: 'Edit colors, fonts, layouts, and add custom fields.',
    },
  ];

  const useCases = [
    { icon: <Building2 size={24} />, label: 'Business Cards' },
    { icon: <Globe size={24} />, label: 'Websites' },
    { icon: <Smartphone size={24} />, label: 'Social Media' },
    { icon: <QrCode size={24} />, label: 'WiFi Access' },
  ];

  const stats = [
    { value: '10K+', label: 'QR Codes Created' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <QrCode size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold">QR Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button type="text" onClick={() => navigate('/analytics')}>Analytics</Button>
              <Button type="text" onClick={() => navigate('/faqs')}>FAQs</Button>
              <Button type="primary" onClick={() => navigate('/create')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={16} />
              Professional QR Code Generator
            </div>
            <Title level={1} className="!text-4xl sm:!text-5xl lg:!text-6xl !font-bold !mb-6 !leading-tight">
              Create Beautiful QR Codes <br className="hidden sm:block" />
              <span className="text-primary">That Convert</span>
            </Title>
            <Paragraph className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Design stunning QR codes with professional templates, full customization, and detailed analytics. Perfect for business cards, marketing, events, and more.
            </Paragraph>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                type="primary" 
                size="large" 
                className="h-14 px-8 text-lg font-semibold"
                onClick={() => navigate('/create')}
              >
                Create QR Code <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button 
                size="large" 
                className="h-14 px-8 text-lg"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { bg: 'from-indigo-500 to-purple-600', title: 'Business', subtitle: 'Professional' },
                { bg: 'from-green-500 to-emerald-600', title: 'Event', subtitle: 'Invitation' },
                { bg: 'from-orange-500 to-red-600', title: 'Menu', subtitle: 'Restaurant' },
                { bg: 'from-pink-500 to-rose-600', title: 'Social', subtitle: 'Connect' },
              ].map((card, i) => (
                <Card 
                  key={i} 
                  className={`bg-gradient-to-br ${card.bg} border-0 text-white overflow-hidden hover:scale-105 transition-transform duration-300`}
                  styles={{ body: { padding: '20px' } }}
                >
                  <div className="flex flex-col items-center text-center py-4">
                    <Text className="text-white/80 text-xs uppercase tracking-wider mb-1">{card.subtitle}</Text>
                    <Text className="text-white font-bold text-lg mb-4">{card.title}</Text>
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                      <QrCode size={48} className="text-gray-800" />
                    </div>
                    <Text className="text-white/60 text-xs mt-3">Scan Me</Text>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, i) => (
              <Col key={i} xs={12} md={6}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className="!text-3xl sm:!text-4xl !font-bold !mb-4">
              Everything You Need
            </Title>
            <Text className="text-lg text-muted-foreground">
              Powerful features to create, customize, and track your QR codes
            </Text>
          </div>
          <Row gutter={[24, 24]}>
            {features.map((feature, i) => (
              <Col key={i} xs={24} sm={12} lg={8}>
                <Card 
                  className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
                  styles={{ body: { padding: '28px' } }}
                >
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <Title level={4} className="!mb-2">{feature.title}</Title>
                  <Text className="text-muted-foreground">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2} className="!text-3xl sm:!text-4xl !font-bold !mb-4">
              Perfect For Every Use Case
            </Title>
            <Text className="text-lg text-muted-foreground">
              From personal to business, we've got you covered
            </Text>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {useCases.map((useCase, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <span className="text-primary">{useCase.icon}</span>
                <span className="font-medium">{useCase.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-background rounded-2xl border border-border p-8 md:p-12">
            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} md={12}>
                <Title level={3} className="!mb-4">Why Choose QR Studio?</Title>
                <div className="space-y-4">
                  {[
                    'Professional designer templates',
                    'Full customization control',
                    'Real-time scan analytics',
                    'Works offline, never expires',
                    'High-resolution downloads',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <Text>{item}</Text>
                    </div>
                  ))}
                </div>
                <Button 
                  type="primary" 
                  size="large" 
                  className="mt-8"
                  onClick={() => navigate('/create')}
                >
                  Start Creating <ArrowRight size={18} className="ml-2" />
                </Button>
              </Col>
              <Col xs={24} md={12}>
                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-8 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-xl shadow-xl">
                    <QrCode size={160} className="text-gray-800" />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-12 md:p-16 text-white">
            <Title level={2} className="!text-white !text-3xl sm:!text-4xl !font-bold !mb-4">
              Ready to Create Your QR Code?
            </Title>
            <Paragraph className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who trust QR Studio for their QR code needs. Start creating beautiful, trackable QR codes today.
            </Paragraph>
            <Button 
              size="large" 
              className="h-14 px-10 text-lg font-semibold bg-white text-primary hover:bg-white/90 border-0"
              onClick={() => navigate('/create')}
            >
              Create Free QR Code <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode size={18} className="text-white" />
            </div>
            <span className="font-semibold">QR Studio</span>
          </div>
          <Text className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} QR Studio. All rights reserved.
          </Text>
          <div className="flex items-center gap-4">
            <Button type="text" size="small" onClick={() => navigate('/faqs')}>FAQs</Button>
            <Button type="text" size="small" onClick={() => navigate('/contact')}>Contact</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;