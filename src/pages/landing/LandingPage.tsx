import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
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
  X,
  TrendingUp,
  MousePointer,
  Eye,
  Target,
  Layers,
  Sparkles,
  Download,
  RefreshCw,
  Building2,
  Stamp,
  Sun,
  Moon,
} from "lucide-react";
import FreeQRGenerator from "./components/FreeQRGenerator";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Animated section wrapper
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useTheme();

  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const effectiveMode =
    mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

  const toggleTheme = () => {
    setMode(effectiveMode === "dark" ? "light" : "dark");
  };

  const stats = [
    { value: "5K+", label: "QR Codes Created" },
    { value: "2K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const qrTypes = [
    { icon: <LinkIcon className="h-4 w-4" />, label: "URL", free: true },
    { icon: <Phone className="h-4 w-4" />, label: "Phone", free: true },
    { icon: <Mail className="h-4 w-4" />, label: "Email", free: true },
    { icon: <MessageSquare className="h-4 w-4" />, label: "SMS", free: true },
    { icon: <Wifi className="h-4 w-4" />, label: "WiFi", free: false },
    { icon: <MapPin className="h-4 w-4" />, label: "Location", free: false },
    {
      icon: <Instagram className="h-4 w-4" />,
      label: "Instagram",
      free: false,
    },
    { icon: <Facebook className="h-4 w-4" />, label: "Facebook", free: false },
    { icon: <Youtube className="h-4 w-4" />, label: "YouTube", free: false },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "WhatsApp",
      free: false,
    },
    { icon: <CreditCard className="h-4 w-4" />, label: "vCard", free: false },
    { icon: <FileText className="h-4 w-4" />, label: "Text", free: false },
  ];

  const premiumFeatures = [
    {
      icon: <Image className="h-6 w-6" />,
      title: "Logo Upload",
      description: "Brand your QR codes with custom logos",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "50+ Templates",
      description: "Professional designs for every use case",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Track scans, locations & devices",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Dynamic QR Codes",
      description: "Update destination anytime",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Password Protection",
      description: "Secure access to your content",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Expiration Control",
      description: "Set dates and scan limits",
    },
  ];

  // Analytics mock data for visualization
  const analyticsData = [
    { day: "Mon", scans: 120 },
    { day: "Tue", scans: 180 },
    { day: "Wed", scans: 150 },
    { day: "Thu", scans: 220 },
    { day: "Fri", scans: 280 },
    { day: "Sat", scans: 190 },
    { day: "Sun", scans: 140 },
  ];

  const maxScans = Math.max(...analyticsData.map((d) => d.scans));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-muted rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="QR Studio"
                className="h-8 w-auto object-contain"
              />
              <span className="font-semibold text-base tracking-tight">
                QR<span className="text-primary">Studio</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#generator"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Generator
              </a>
              <a
                href="#features"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#analytics"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 w-8 p-0"
                onClick={toggleTheme}
              >
                {effectiveMode === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Link to="/sign-in">
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="text-xs h-8">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <nav className="flex flex-col gap-1">
                <a
                  href="#generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
                >
                  Generator
                </a>
                <a
                  href="#features"
                  className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
                >
                  Features
                </a>
                <a
                  href="#analytics"
                  className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
                >
                  Analytics
                </a>
                <div className="flex gap-2 px-3 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-8 p-0"
                    onClick={toggleTheme}
                  >
                    {effectiveMode === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                  <Link to="/sign-in" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button size="sm" className="w-full text-xs">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-muted/80 border border-border text-foreground/80 px-3 py-1 rounded-full text-[10px] font-medium mb-5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Trusted by many businesses worldwide
              </div>
            </AnimatedSection>

            {/* Main Headline */}
            <AnimatedSection delay={100}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-[1.15]">
                Create Stunning
                <span className="block text-primary">QR Codes in Seconds</span>
              </h1>
            </AnimatedSection>

            {/* Subheadline */}
            <AnimatedSection delay={200}>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                Design beautiful, trackable QR codes with custom colors, logos,
                and templates. Perfect for marketing, events, and business.
              </p>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-10">
                <a href="#generator">
                  <Button
                    size="default"
                    className="px-6 gap-2 group w-full sm:w-auto text-sm"
                  >
                    Create Free QR Code
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </a>
                <Link to="/signup">
                  <Button
                    size="default"
                    variant="outline"
                    className="px-6 gap-2 w-full sm:w-auto text-sm"
                  >
                    <Play className="h-3.5 w-3.5" />
                    See How It Works
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={400}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl md:text-2xl font-semibold text-foreground mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section
        id="generator"
        className="py-12 lg:py-16 bg-muted/20 border-y border-border/50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                Create Your QR Code
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No signup required. Generate and download your QR code
                instantly.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={150}>
            <FreeQRGenerator />
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Sparkles className="h-3 w-3" />
                <span>Simple Process</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                Create QR Codes in 3 Easy Steps
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                From idea to scannable code in under a minute
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: <Target className="h-5 w-5" />,
                title: "Choose Your Type",
                description:
                  "Select from 12 QR code types including URL, vCard, WiFi, social media, and more.",
              },
              {
                step: "02",
                icon: <Palette className="h-5 w-5" />,
                title: "Customize Design",
                description:
                  "Add your logo, pick colors, choose patterns, and apply professional templates.",
              },
              {
                step: "03",
                icon: <Download className="h-5 w-5" />,
                title: "Download & Track",
                description:
                  "Export in PNG, WEBP and JPG. Track every scan with real-time analytics.",
              },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="p-5 text-center relative group hover:shadow-md transition-all duration-200 h-full">
                  <div className="absolute top-3 right-3 text-[10px] font-bold text-muted-foreground/50">
                    {item.step}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Showcase Section */}
      <section
        id="analytics"
        className="py-12 lg:py-16 bg-muted/20 border-y border-border/50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                  <BarChart3 className="h-3 w-3" />
                  <span>Real-Time Analytics</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  Track Every Scan with
                  <span className="text-primary"> Powerful Insights</span>
                </h2>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Understand your audience better with comprehensive analytics.
                  See who scans your QR codes, when, and from where.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {
                      icon: <Eye className="h-3.5 w-3.5" />,
                      label: "Total Scans",
                      value: "24,892",
                    },
                    {
                      icon: <TrendingUp className="h-3.5 w-3.5" />,
                      label: "Growth Rate",
                      value: "+34%",
                    },
                    {
                      icon: <Globe className="h-3.5 w-3.5" />,
                      label: "Countries",
                      value: "45+",
                    },
                    {
                      icon: <Smartphone className="h-3.5 w-3.5" />,
                      label: "Mobile Scans",
                      value: "89%",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-background border border-border rounded-lg p-3"
                    >
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        {stat.icon}
                        <span className="text-[10px]">{stat.label}</span>
                      </div>
                      <div className="text-lg font-semibold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <Link to="/signup">
                  <Button size="sm" className="gap-1.5 text-xs">
                    View Full Analytics
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Right: Analytics Chart Mock */}
            <AnimatedSection delay={200}>
              <Card className="p-5 bg-background">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Weekly Scan Activity
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Last 7 days performance
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +12.5%
                  </div>
                </div>

                {/* Chart visualization */}
                <div className="flex items-end gap-2 h-32 mb-3">
                  {analyticsData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden transition-all duration-500"
                        style={{
                          height: `${(data.scans / maxScans) * 100}%`,
                          minHeight: "8px",
                        }}
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm transition-all duration-700"
                          style={{ height: "100%" }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart legend */}
                <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] text-muted-foreground">
                      Scans
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/30" />
                    <span className="text-[10px] text-muted-foreground">
                      Unique Visitors
                    </span>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* White Label Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Visual */}
            <AnimatedSection>
              <Card className="p-5 bg-muted/30">
                <div className="space-y-4">
                  {/* Brand customization preview */}
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">
                          Your Brand Name
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          yourcompany.com
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-6 rounded bg-primary/30" />
                      <div className="h-6 rounded bg-primary/50" />
                      <div className="h-6 rounded bg-primary" />
                    </div>
                  </div>

                  {/* Custom domain */}
                  <div className="bg-background rounded-lg p-3 border border-primary/50">
                    <div className="text-[10px] text-primary mb-1.5 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Custom Domain
                    </div>
                    <div className="text-xs font-mono bg-primary/10 px-2 py-1.5 rounded text-primary">
                      qr.yourcompany.com
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            {/* Right: Content */}
            <AnimatedSection delay={200}>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                  <Building2 className="h-3 w-3" />
                  <span>White Label</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  Your Brand,
                  <span className="text-primary"> Your Platform</span>
                </h2>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Remove all QR Studio branding and make it completely yours.
                  Perfect for agencies and enterprises.
                </p>

                <ul className="space-y-2 mb-5">
                  {[
                    "Custom domain support",
                    "Remove QR Studio branding",
                    "Your logo everywhere",
                    "Branded scan pages",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/signup">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                  >
                    Explore White Label
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Watermark Section */}
      <section className="py-12 lg:py-16 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <AnimatedSection className="order-2 lg:order-1">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                  <Stamp className="h-3 w-3" />
                  <span>Custom Watermark</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  Add Your Signature
                  <span className="text-primary"> To Every QR Code</span>
                </h2>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Customize or remove the watermark on your QR codes. Add your
                  company name, tagline, or remove it entirely.
                </p>

                <ul className="space-y-2 mb-5">
                  {[
                    "Custom text watermark",
                    "Upload your own logo watermark",
                    "Remove watermark completely",
                    "Position & style control",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/signup">
                  <Button size="sm" className="gap-1.5 text-xs">
                    Customize Watermark
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Right: Visual */}
            <AnimatedSection delay={200} className="order-1 lg:order-2">
              <Card className="p-5 bg-background">
                <div className="space-y-3">
                  {/* QR with watermark comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="bg-muted/50 rounded-lg p-4 mb-2 relative">
                        <QrCode className="h-16 w-16 mx-auto text-foreground/30" />
                        <div className="absolute bottom-2 left-0 right-0 text-center">
                          <span className="text-[8px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                            QR Studio
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Default
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/5 rounded-lg p-4 mb-2 border border-primary/30 relative">
                        <QrCode className="h-16 w-16 mx-auto text-primary/50" />
                        <div className="absolute bottom-2 left-0 right-0 text-center">
                          <span className="text-[8px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                            Your Brand
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-primary font-medium">
                        Custom
                      </span>
                    </div>
                  </div>

                  {/* Options preview */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                    <div className="bg-muted rounded px-2 py-1 text-[9px]">
                      Text
                    </div>
                    <div className="bg-muted rounded px-2 py-1 text-[9px]">
                      Logo
                    </div>
                    <div className="bg-primary/10 text-primary rounded px-2 py-1 text-[9px] font-medium">
                      None
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* QR Types Section */}
      <section className="py-12 lg:py-16 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <QrCode className="h-3 w-3" />
                <span>12 QR Code Types</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                One Tool, Endless Possibilities
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Create QR codes for websites, contact cards, WiFi networks,
                social media, and more.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-w-3xl mx-auto">
              {qrTypes.map((type, index) => (
                <Card
                  key={index}
                  className={`p-3 text-center relative transition-all duration-200 ${
                    type.free
                      ? "hover:border-primary/50 hover:shadow-sm cursor-pointer"
                      : "bg-muted/30 opacity-75"
                  }`}
                >
                  {!type.free && (
                    <div className="absolute -top-1 -right-1 bg-foreground text-background h-4 w-4 rounded-full flex items-center justify-center">
                      <Crown className="h-2 w-2" />
                    </div>
                  )}
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${
                      type.free
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {type.icon}
                  </div>
                  <span className="text-[10px] font-medium">{type.label}</span>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Crown className="h-3 w-3" />
                <span>Pro Features</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                Professional Tools for
                <span className="text-primary"> Better Results</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Unlock advanced tools to create, track, and optimize your QR
                code campaigns.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <Card className="p-4 relative group hover:shadow-md transition-shadow duration-200 border-border/80 h-full">
                  <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Lock className="h-2 w-2" />
                    Pro
                  </div>

                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                    {feature.icon}
                  </div>

                  <h3 className="font-semibold text-xs mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={350}>
            <div className="text-center mt-8">
              <Link to="/signup">
                <Button size="sm" className="gap-1.5 text-xs">
                  Start Free Trial
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-12 lg:py-16 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <AnimatedSection>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                  <Shield className="h-3 w-3" />
                  <span>Enterprise Security</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  Secure Your QR Codes
                  <span className="text-primary">
                    {" "}
                    With Advanced Protection
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Control who can access your content with password protection,
                  expiration dates, and scan limits.
                </p>

                <div className="space-y-3 mb-5">
                  {[
                    {
                      icon: <Lock className="h-3.5 w-3.5" />,
                      title: "Password Protection",
                      desc: "Require password to view content",
                    },
                    {
                      icon: <Clock className="h-3.5 w-3.5" />,
                      title: "Expiration Dates",
                      desc: "Auto-disable after specific date",
                    },
                    {
                      icon: <Users className="h-3.5 w-3.5" />,
                      title: "Scan Limits",
                      desc: "Control maximum number of scans",
                    },
                    {
                      icon: <RefreshCw className="h-3.5 w-3.5" />,
                      title: "Instant Deactivation",
                      desc: "Disable QR codes anytime",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-background border border-border rounded-lg p-3"
                    >
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/signup">
                  <Button size="sm" className="gap-1.5 text-xs">
                    Enable Security Features
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Right: Visual */}
            <AnimatedSection delay={200}>
              <Card className="p-5 bg-background">
                <div className="space-y-4">
                  {/* Password protection mock */}
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold">
                        Password Protected
                      </span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="text-[10px] text-muted-foreground mb-2">
                        Enter password to continue
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-muted rounded-md border border-border" />
                        <div className="h-8 px-3 bg-primary rounded-md flex items-center">
                          <span className="text-[10px] text-primary-foreground font-medium">
                            Unlock
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiration indicator */}
                  <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">Expires in</span>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      7 days
                    </span>
                  </div>

                  {/* Scan limit */}
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs">Scan Limit</span>
                      <span className="text-xs font-semibold">45/100</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Layers className="h-3 w-3" />
                <span>100+ Templates</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                Professional Templates for
                <span className="text-primary"> Every Industry</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Choose from our curated collection of stunning QR code card
                templates designed for restaurants, events, business cards, and
                more.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto mb-6">
              {[
                {
                  name: "Business",
                  color: "from-slate-800 to-slate-900",
                  textColor: "text-white",
                },
                {
                  name: "Restaurant",
                  color: "from-amber-800 to-amber-900",
                  textColor: "text-amber-100",
                },
                {
                  name: "Events",
                  color: "from-purple-600 to-purple-800",
                  textColor: "text-white",
                },
                {
                  name: "Social",
                  color: "from-pink-500 to-rose-600",
                  textColor: "text-white",
                },
                {
                  name: "Luxury",
                  color: "from-yellow-600 to-yellow-800",
                  textColor: "text-yellow-100",
                },
                {
                  name: "Tech",
                  color: "from-cyan-500 to-blue-600",
                  textColor: "text-white",
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${category.color} rounded-lg p-4 text-center aspect-[4/3] flex flex-col items-center justify-center`}
                >
                  <QrCode
                    className={`h-8 w-8 ${category.textColor} opacity-50 mb-2`}
                  />
                  <span
                    className={`text-xs font-semibold ${category.textColor}`}
                  >
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="text-center">
              <Link to="/signup">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  Browse All Templates
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Target className="h-3 w-3" />
                <span>Use Cases</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                Perfect for Every
                <span className="text-primary"> Business Need</span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                See how businesses across industries use QR Studio to connect
                with their customers.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: <Building2 className="h-5 w-5" />,
                title: "Restaurants",
                description:
                  "Digital menus, table ordering, WiFi access, and reviews",
                color: "bg-orange-500/10 text-orange-500",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Events",
                description: "Ticketing, check-ins, schedules, and networking",
                color: "bg-purple-500/10 text-purple-500",
              },
              {
                icon: <CreditCard className="h-5 w-5" />,
                title: "Retail",
                description:
                  "Product info, promotions, loyalty programs, and payments",
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: "Marketing",
                description:
                  "Campaigns, lead capture, social media, and analytics",
                color: "bg-green-500/10 text-green-500",
              },
            ].map((useCase, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div
                    className={`h-10 w-10 rounded-xl ${useCase.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}
                  >
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="py-12 lg:py-16 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Content */}
            <AnimatedSection className="order-2 lg:order-1">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                  <Palette className="h-3 w-3" />
                  <span>Full Customization</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                  Make It Uniquely
                  <span className="text-primary"> Yours</span>
                </h2>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  Customize every aspect of your QR codes with colors, patterns,
                  logos, and frames. Match your brand perfectly.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    {
                      icon: <Palette className="h-4 w-4" />,
                      label: "Custom Colors",
                    },
                    {
                      icon: <Image className="h-4 w-4" />,
                      label: "Logo Upload",
                    },
                    {
                      icon: <Layers className="h-4 w-4" />,
                      label: "Pattern Styles",
                    },
                    {
                      icon: <Sparkles className="h-4 w-4" />,
                      label: "Frame Options",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs group cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                        {item.icon}
                      </div>
                      <span className="group-hover:text-foreground transition-colors">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to="/signup">
                  <Button size="sm" className="gap-1.5 text-xs group">
                    Start Customizing
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Right: Visual */}
            <AnimatedSection delay={200} className="order-1 lg:order-2">
              <Card className="p-5 bg-background">
                <div className="space-y-4">
                  {/* Color palette */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-[10px] text-muted-foreground mb-3">
                      Color Palette
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        "#000000",
                        "#3b82f6",
                        "#10b981",
                        "#f97316",
                        "#ec4899",
                        "#8b5cf6",
                        "#06b6d4",
                        "#ef4444",
                      ].map((color, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
                            i === 1 ? "ring-2 ring-offset-2 ring-primary" : ""
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Pattern preview */}
                  <div className="grid grid-cols-4 gap-2">
                    {["Square", "Dots", "Rounded", "Classy"].map(
                      (pattern, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${
                            i === 2
                              ? "bg-primary/10 border border-primary"
                              : "bg-muted/50 border border-transparent hover:border-border"
                          }`}
                        >
                          <div className="w-8 h-8 mx-auto mb-1 bg-foreground/20 rounded" />
                          <span className="text-[9px]">{pattern}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Logo preview */}
                  <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 transition-all hover:border-primary cursor-pointer">
                      <Image className="h-5 w-5 text-primary/50" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium">Add Your Logo</div>
                      <div className="text-[10px] text-muted-foreground">
                        Upload PNG, JPG, or SVG
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <Card className="max-w-2xl mx-auto p-6 md:p-8 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Ready to Create Your First QR Code?
              </h2>
              <p className="text-xs text-muted-foreground mb-5 max-w-md mx-auto">
                Start for free today. No credit card required. Upgrade anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
                <a href="#generator">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs w-full sm:w-auto"
                  >
                    Try Generator First
                  </Button>
                </a>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="QR Studio"
                className="h-6 w-6 object-contain"
              />
              <span className="font-semibold text-xs">
                QR<span className="text-primary">Studio</span>
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px]">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#analytics"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </a>
              <Link
                to="/faqs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQs
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/refunds"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Refunds
              </Link>
              <Link
                to="/shipping-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shipping
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-[10px] text-muted-foreground">
              © 2026 QR Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
