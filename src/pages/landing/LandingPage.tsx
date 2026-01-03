import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  QrCode, 
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
  Check,
  Star,
  Play,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import FreeQRGenerator from './components/FreeQRGenerator';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { value: '5K+', label: 'QR Codes Created' },
    { value: '2K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
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
      icon: <Image className="h-7 w-7" />,
      title: 'Logo Upload',
      description: 'Brand your QR codes with custom logos',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: <Palette className="h-7 w-7" />,
      title: '50+ Templates',
      description: 'Professional designs for every use case',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: 'Advanced Analytics',
      description: 'Track scans, locations & devices',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: 'Dynamic QR Codes',
      description: 'Update destination anytime',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Password Protection',
      description: 'Secure access to your content',
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      icon: <Clock className="h-7 w-7" />,
      title: 'Expiration Control',
      description: 'Set dates and scan limits',
      gradient: 'from-indigo-500 to-violet-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      content: 'QR Studio transformed how we engage customers. The analytics are invaluable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Restaurant Owner',
      company: 'Fusion Kitchen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      content: 'Our contactless menu QR codes look professional and customers love them.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Event Planner',
      company: 'Elite Events',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      content: 'The templates are stunning. Makes creating event QR codes so easy!',
      rating: 5
    }
  ];

  const comparisonPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '4 QR code types', included: true },
        { text: 'Basic styling options', included: true },
        { text: 'PNG download', included: true },
        { text: 'Limited templates', included: true },
        { text: 'Analytics dashboard', included: false },
        { text: 'Logo upload', included: false },
        { text: 'Dynamic QR codes', included: false }
      ],
      cta: 'Get Started Free'
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      popular: true,
      description: 'Best for professionals',
      features: [
        { text: 'All 12 QR code types', included: true },
        { text: 'Advanced styling', included: true },
        { text: 'PNG, SVG, PDF exports', included: true },
        { text: '50+ premium templates', included: true },
        { text: 'Full analytics dashboard', included: true },
        { text: 'Logo upload', included: true },
        { text: 'Dynamic QR codes', included: true }
      ],
      cta: 'Start Pro Trial'
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-muted rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="QR Studio" 
                className="h-9 w-auto object-contain"
              />
              <span className="font-semibold text-lg tracking-tight">
                QR<span className="text-primary">Studio</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Generator
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <nav className="flex flex-col gap-1">
                <a 
                  href="#generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-sm"
                >
                  Generator
                </a>
                <a href="#features" className="px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-sm">
                  Features
                </a>
                <a href="#pricing" className="px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-sm">
                  Pricing
                </a>
                <div className="flex gap-2 px-3 pt-3">
                  <Link to="/sign-in" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-muted border border-border text-foreground/80 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Trusted by 10,000+ businesses worldwide
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.1]">
              Create Stunning
              <span className="block text-primary">
                QR Codes in Seconds
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Design beautiful, trackable QR codes with custom colors, logos, and templates. 
              Perfect for marketing, events, and business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <a href="#generator">
                <Button 
                  size="lg" 
                  className="px-8 gap-2 group w-full sm:w-auto"
                >
                  Create Free QR Code
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="px-8 gap-2 w-full sm:w-auto">
                  <Play className="h-4 w-4" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-semibold text-foreground mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-16 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
              Create Your QR Code
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              No signup required. Generate and download your QR code instantly.
            </p>
          </div>
          <FreeQRGenerator />
        </div>
      </section>

      {/* QR Types Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-muted text-foreground/70 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <QrCode className="h-3.5 w-3.5" />
              <span>12 QR Code Types</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
              One Tool, Endless Possibilities
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create QR codes for websites, contact cards, WiFi networks, social media, and more.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {qrTypes.map((type, index) => (
              <Card 
                key={index} 
                className={`p-4 text-center relative transition-all duration-200 ${
                  type.free 
                    ? 'hover:border-primary/50 hover:shadow-sm cursor-pointer' 
                    : 'bg-muted/30 opacity-75'
                }`}
              >
                {!type.free && (
                  <div className="absolute -top-1.5 -right-1.5 bg-foreground text-background h-5 w-5 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5" />
                  </div>
                )}
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                  type.free 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {type.icon}
                </div>
                <span className="text-xs font-medium">{type.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-muted text-foreground/70 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Crown className="h-3.5 w-3.5" />
              <span>Pro Features</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
              Professional Tools for
              <span className="text-primary"> Better Results</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Unlock advanced tools to create, track, and optimize your QR code campaigns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 relative group hover:shadow-md transition-shadow duration-200 border-border/80"
              >
                {/* Pro badge */}
                <div className="absolute top-4 right-4 bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5" />
                  Pro
                </div>

                {/* Icon */}
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>

                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section - Temporarily Hidden */}
      {/*
       <section id="pricing" className="py-14 lg:py-14 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-montserrat">
              Start Free, Upgrade Anytime
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. Cancel anytime. Start creating beautiful QR codes today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {comparisonPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 relative transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-2xl shadow-primary/20 scale-[1.02]' 
                    : 'hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8 pt-4">
                  <h3 className="text-2xl font-bold mb-2 font-montserrat">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl md:text-5xl font-bold font-montserrat">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className={`${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="block">
                  <Button 
                    className={`w-full py-3 sm:py-6 text-base sm:text-lg font-semibold ${
                      plan.popular 
                        ? 'shadow-lg shadow-primary/25' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      */}
 

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="QR Studio" className="h-7 w-7 object-contain" />
              <span className="font-semibold text-sm">
                QR<span className="text-primary">Studio</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6 text-xs">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <Link to="/faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © 2026 QR Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;