import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Sparkles, 
  Download, 
  ArrowRight, 
  Link as LinkIcon, 
  Phone, 
  Mail, 
  MessageSquare,
  Wifi,
  MapPin,
  Lock,
  BarChart3,
  Palette,
  Image,
  Zap,
  Shield,
  Clock,
  Users,
  Globe,
  Smartphone,
  FileText,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  CreditCard,
  Crown,
  Check
} from 'lucide-react';
import FreeQRGenerator from './components/FreeQRGenerator';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('generator');

  const features = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Custom Styling',
      description: 'Choose colors, patterns, and shapes for your QR codes',
      premium: false
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'Download Options',
      description: 'Export in PNG, SVG, or PDF formats',
      premium: false
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analytics & Tracking',
      description: 'Track scans, locations, and device types',
      premium: true
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Dynamic QR Codes',
      description: 'Edit destination URL anytime without reprinting',
      premium: true
    }
  ];

  const qrTypes = [
    { icon: <LinkIcon className="h-5 w-5" />, label: 'URL', free: true },
    { icon: <Phone className="h-5 w-5" />, label: 'Phone', free: true },
    { icon: <Mail className="h-5 w-5" />, label: 'Email', free: true },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'SMS', free: true },
    { icon: <Wifi className="h-5 w-5" />, label: 'WiFi', free: false },
    { icon: <MapPin className="h-5 w-5" />, label: 'Location', free: false },
    { icon: <Instagram className="h-5 w-5" />, label: 'Instagram', free: false },
    { icon: <Facebook className="h-5 w-5" />, label: 'Facebook', free: false },
    { icon: <Youtube className="h-5 w-5" />, label: 'YouTube', free: false },
    { icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp', free: false },
    { icon: <CreditCard className="h-5 w-5" />, label: 'vCard', free: false },
    { icon: <FileText className="h-5 w-5" />, label: 'Text', free: false }
  ];

  const premiumFeatures = [
    {
      icon: <Image className="h-8 w-8" />,
      title: 'Logo Upload',
      description: 'Add your brand logo to the center of QR codes',
      badge: 'Pro'
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: '50+ Templates',
      description: 'Professional designs for every industry and use case',
      badge: 'Pro'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Scan Analytics',
      description: 'Track scans by location, device, browser, and time',
      badge: 'Pro'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Dynamic QR Codes',
      description: 'Change destination anytime without reprinting',
      badge: 'Pro'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Password Protection',
      description: 'Secure your QR codes with password access',
      badge: 'Pro'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Expiration Dates',
      description: 'Set auto-expire dates and scan limits',
      badge: 'Pro'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Bulk Generation',
      description: 'Create multiple QR codes at once with CSV import',
      badge: 'Business'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team Collaboration',
      description: 'Share and manage QR codes with your team',
      badge: 'Business'
    }
  ];

  const comparisonPlans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        { text: '4 QR code types', included: true },
        { text: 'Basic styling options', included: true },
        { text: 'PNG download only', included: true },
        { text: 'Limited templates', included: true },
        { text: 'No analytics', included: false },
        { text: 'No logo upload', included: false },
        { text: 'Static QR only', included: false }
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      popular: true,
      features: [
        { text: 'All 12 QR code types', included: true },
        { text: 'Advanced styling', included: true },
        { text: 'PNG, SVG, PDF exports', included: true },
        { text: '50+ premium templates', included: true },
        { text: 'Full analytics dashboard', included: true },
        { text: 'Logo upload', included: true },
        { text: 'Dynamic QR codes', included: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">QR Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Free QR Code Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Create Beautiful
            <span className="text-primary block">QR Codes Instantly</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate custom QR codes for your business, events, or personal use. 
            No signup required for basic features.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="gap-2">
              <QrCode className="h-4 w-4" />
              Create QR Code
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-0">
            <FreeQRGenerator />
          </TabsContent>

          <TabsContent value="features" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 relative overflow-hidden hover-scale">
                  {feature.premium && (
                    <div className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Pro
                    </div>
                  )}
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* QR Types Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Supported QR Code Types
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Create QR codes for various purposes. Free users get access to basic types.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {qrTypes.map((type, index) => (
              <Card 
                key={index} 
                className={`p-4 text-center relative transition-all duration-200 ${
                  !type.free 
                    ? 'opacity-60 bg-muted/50' 
                    : 'hover:shadow-md hover:border-primary/30'
                }`}
              >
                {!type.free && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center">
                    <Lock className="h-3 w-3" />
                  </div>
                )}
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                  type.free 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {type.icon}
                </div>
                <span className="text-sm font-medium">{type.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Crown className="h-4 w-4" />
            Premium Features
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Unlock the Full Potential
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sign up to access advanced features that help you create professional QR codes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {premiumFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20"
            >
              {/* Locked overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badge */}
              <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                feature.badge === 'Business' 
                  ? 'bg-purple-500/10 text-purple-600' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Lock className="h-3 w-3" />
                {feature.badge}
              </div>

              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>

              {/* Unlock button on hover */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link to="/signup">
                  <Button size="sm" className="w-full gap-1">
                    <Lock className="h-3 w-3" />
                    Unlock Feature
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free and upgrade when you need more power.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {comparisonPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-6 relative ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.price !== '$0' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.popular ? '/signup' : '#'}>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.popular ? 'Get Started' : 'Current Plan'}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Smartphone className="h-4 w-4" />
              Join 10,000+ users
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Create Professional QR Codes?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Sign up for free to access dynamic QR codes, analytics, unlimited templates, 
              and advanced customization options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 QR Studio. Create beautiful QR codes for free.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
