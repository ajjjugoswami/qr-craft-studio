import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Link as LinkIcon, 
  Phone, 
  Mail, 
  MessageSquare,
  Palette,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FreeQRPreview from './FreeQRPreview';
import FreeStyleOptions from './FreeStyleOptions';
import { toast } from '@/hooks/use-toast';
import type { QRStyling } from '@/types/qrcode';
import { defaultStyling } from '@/types/qrcode';

const FreeQRGenerator = () => {
  const [qrType, setQrType] = useState<'url' | 'phone' | 'email' | 'sms'>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>({ ...defaultStyling });
  const qrRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleStyleChange = useCallback((newStyle: Partial<QRStyling>) => {
    setStyling(prev => ({ ...prev, ...newStyle }));
  }, []);

  const getQRContent = () => {
    const trimmed = content.trim();
    switch (qrType) {
      case 'phone':
        return `tel:${trimmed.replace(/\s+/g, '')}`;
      case 'email':
        return `mailto:${trimmed}`;
      case 'sms':
        return `sms:${trimmed.replace(/\s+/g, '')}`;
      default:
        return trimmed;
    }
  };

  const getPlaceholder = (typeParam?: typeof qrType) => {
    const t = typeParam ?? qrType;
    switch (t) {
      case 'phone':
        return '+1 234 567 8900';
      case 'email':
        return 'email@example.com';
      case 'sms':
        return '+1 234 567 8900';
      default:
        return 'https://example.com';
    }
  };

  const getLabel = () => {
    switch (qrType) {
      case 'phone':
        return 'Phone Number';
      case 'email':
        return 'Email Address';
      case 'sms':
        return 'Phone Number for SMS';
      default:
        return 'Website URL';
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
      {/* Left: Form */}
      <Card className="lg:col-span-3 p-5 sm:p-6 border-border/80">
        <div className="space-y-5">
          {/* QR Type Selection */}
          <div>
            <Label className="text-xs font-medium mb-2.5 block text-muted-foreground uppercase tracking-wide">
              QR Code Type
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'url', icon: <LinkIcon className="h-4 w-4" />, label: 'URL' },
                { type: 'phone', icon: <Phone className="h-4 w-4" />, label: 'Phone' },
                { type: 'email', icon: <Mail className="h-4 w-4" />, label: 'Email' },
                { type: 'sms', icon: <MessageSquare className="h-4 w-4" />, label: 'SMS' }
              ].map((item) => (
                <Button
                  key={item.type}
                  variant={qrType === item.type ? 'default' : 'outline'}
                  size="sm"
                  className={`flex-col h-auto py-2.5 gap-1 transition-all ${
                    qrType === item.type ? '' : 'border-border/80 hover:border-border'
                  }`}
                  onClick={() => {
                    setQrType(item.type as typeof qrType);
                    setContent(getPlaceholder(item.type as typeof qrType));
                  }}
                >
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Label htmlFor="content" className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wide">
              {getLabel()}
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full h-10 border-border/80"
            />
          </div>

          {/* Style Options */}
          <FreeStyleOptions styling={styling} onStyleChange={handleStyleChange} />

          {/* Upgrade CTA */}
          <div className="bg-muted/40 rounded-lg p-4 border border-border/60">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Palette className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-0.5">Want more customization?</p>
                <p className="text-xs text-muted-foreground mb-2.5">
                  Access 50+ templates, logo upload, and advanced styling.
                </p>
                <Link to="/signup">
                  <Button size="sm" variant="outline" className="gap-1 h-7 text-xs border-border/80">
                    Sign Up Free <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right: Preview */}
      <Card className="lg:col-span-2 p-5 sm:p-6 border-border/80">
        <div className="flex flex-col h-full">
          <Label className="text-xs font-medium mb-4 text-muted-foreground uppercase tracking-wide">
            Preview
          </Label>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <FreeQRPreview 
              ref={qrRef}
              content={getQRContent()} 
              styling={styling} 
            />
          </div>
          <div className="mt-5 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['png', 'webp', 'jpg'].map((format) => (
                <Button
                  key={format}
                  variant={format === 'png' ? 'default' : 'outline'}
                  className={`gap-1.5 text-xs ${format !== 'png' ? 'border-border/80' : ''}`}
                  size="sm"
                  disabled={content.trim() === ''}
                  onClick={() => {
                    if (!content.trim()) {
                      toast({ title: 'Missing content', description: 'Please enter the QR content before downloading.' });
                      return;
                    }
                    const downloadEvent = new CustomEvent('download-qr', {
                      detail: { format },
                    });
                    window.dispatchEvent(downloadEvent);
                  }}
                >
                  <Download className="h-3 w-3" />
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
            <p className="text-[10px] text-center text-muted-foreground">
              Free downloads include watermark
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FreeQRGenerator;
