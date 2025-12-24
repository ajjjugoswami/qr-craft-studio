import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  QrCode, 
  Sparkles, 
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
    { value: '50K+', label: 'QR Codes Created' },
    { value: '10K+', label: 'Happy Users' },
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
      icon: <Sparkles className="h-7 w-7" />,
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
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="QR Studio" 
                  className="h-20 w-18 object-contain transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-2xl tracking-tight font-montserrat">
                QR<span className="text-primary">Studio</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#generator" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Generator
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pricing
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/sign-in">
                <Button variant="ghost" size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
              <nav className="flex flex-col gap-2">
                <a 
                  href="#generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 hover:bg-muted rounded-lg transition-colors font-medium"
                >
                  Generator
                </a>
                <a href="#features" className="px-4 py-3 hover:bg-muted rounded-lg transition-colors font-medium">
                  Features
                </a>
                <a href="#pricing" className="px-4 py-3 hover:bg-muted rounded-lg transition-colors font-medium">
                  Pricing
                </a>
                <div className="flex gap-2 px-4 pt-2">
                  <Link to="/sign-in" className="flex-1">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 lg:pt-28 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-8 animate-fade-in">
              <span>Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 font-montserrat leading-[1.1]">
              Create Stunning
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                QR Codes in Seconds
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Design beautiful, trackable QR codes with custom colors, logos, and templates. 
              Perfect for marketing, events, and business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#generator">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all font-semibold gap-2 group w-full sm:w-auto"
                >
                  Create Free QR Code
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-semibold gap-2 group w-full sm:w-auto">
                  <Play className="h-5 w-5" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 font-montserrat">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-primary/30"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-violet-500/30"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Generator Section - Always Visible */}
      <section id="generator" className="py-14 lg:py-14 bg-gradient-to-b from-muted/50 to-background border-y border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span>Free Forever</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-montserrat">
              Create Your QR Code Now
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No signup required. Generate beautiful QR codes instantly with our free tool.
            </p>
          </div>
          <FreeQRGenerator />
        </div>
      </section>

      {/* QR Types Section */}
      <section className="py-14 lg:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm font-medium mb-4">
              <QrCode className="h-4 w-4 text-primary" />
              <span>12 QR Code Types</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-montserrat">
              One Tool, Endless Possibilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create QR codes for websites, contact cards, WiFi networks, social media, and more.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {qrTypes.map((type, index) => (
              <Card 
                key={index} 
                className={`p-5 text-center relative transition-all duration-300 group cursor-pointer ${
                  type.free 
                    ? 'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30' 
                    : 'bg-muted/30'
                }`}
              >
                {!type.free && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white h-6 w-6 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="h-3 w-3" />
                  </div>
                )}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all ${
                  type.free 
                    ? 'bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary group-hover:scale-110' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {type.icon}
                </div>
                <span className="text-sm font-semibold">{type.label}</span>
                {type.free && (
                  <span className="block text-xs text-primary mt-1 font-medium">Free</span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14 lg:py-14 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Crown className="h-4 w-4" />
              <span>Pro Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-montserrat">
              Powerful Features for
              <span className="block text-primary">Professional Results</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock advanced tools to create, track, and optimize your QR code campaigns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Lock badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Pro
                </div>

                {/* Icon */}
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>

                <h3 className="font-bold text-xl mb-3 font-montserrat">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                {/* Hover CTA */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link to="/signup">
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      Unlock Feature <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

 
       <section id="pricing" className="py-14 lg:py-14 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-montserrat">
              Start Free, Upgrade Anytime
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    <span className="text-5xl font-bold font-montserrat">{plan.price}</span>
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
                    className={`w-full py-6 text-lg font-semibold ${
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
 

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="QR Studio" className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl font-montserrat">
                QR<span className="text-primary">Studio</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-8 text-sm">
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
            <p className="text-sm text-muted-foreground">
              © 2024 QR Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;