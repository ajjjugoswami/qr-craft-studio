import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Palette
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
    { icon: <MapPin className="h-5 w-5" />, label: 'Location', free: false }
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
            <Link to="/signin">
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
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
                <Card key={index} className="p-6 relative overflow-hidden">
                  {feature.premium && (
                    <div className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {qrTypes.map((type, index) => (
              <Card 
                key={index} 
                className={`p-4 text-center relative ${!type.free ? 'opacity-60' : ''}`}
              >
                {!type.free && (
                  <Lock className="h-3 w-3 absolute top-2 right-2 text-muted-foreground" />
                )}
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                  {type.icon}
                </div>
                <span className="text-sm font-medium">{type.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-primary text-primary-foreground text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Unlock All Features
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
            <Link to="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Sign In
              </Button>
            </Link>
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
