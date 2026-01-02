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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left: Form */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* QR Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">QR Code Type</Label>
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
                  className="flex-col h-auto py-3 gap-1"
                  onClick={() => {
                    setQrType(item.type as typeof qrType);
                    setContent(getPlaceholder(item.type as typeof qrType));
                  }}
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium mb-2 block">
              {getLabel()}
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full"
            />
          </div>

          {/* Style Options */}
          <FreeStyleOptions styling={styling} onStyleChange={handleStyleChange} />


          {/* Upgrade CTA */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Palette className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Want more customization?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Sign up to access 50+ templates, logo upload, and advanced styling options.
                </p>
                <Link to="/signup">
                  <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
                    Sign Up Free <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right: Preview */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col items-center">
          <Label className="text-sm sm:text-base font-medium mb-4 self-start">Preview</Label>
          <div className="flex-1 flex items-center justify-center w-full">
            <FreeQRPreview 
              ref={qrRef}
              content={getQRContent()} 
              styling={styling} 
            />
          </div>
          <div className="w-full mt-6 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['png', 'svg', 'pdf'].map((format) => (
                <Button
                  key={format}
                  variant={format === 'png' ? 'default' : 'outline'}
                  className="gap-1.5"
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
                  <Download className="h-3.5 w-3.5" />
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">
              All downloads include QR Studio watermark
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FreeQRGenerator;
