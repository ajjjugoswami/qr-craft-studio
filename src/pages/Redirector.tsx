import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { z } from 'zod';
import { qrCodeAPI } from '@/lib/api';
import { 
  ExternalLink, Loader2, Lock, AlertCircle, User, Phone, Mail, 
  MapPin, Globe, Building, Wifi, WifiOff, MessageSquare, Copy, Check,
  Download
} from 'lucide-react';

const passwordSchema = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .max(128, 'Password is too long');

// Types that should display content instead of redirecting
const DIRECT_CONTENT_TYPES = ['vcard', 'wifi', 'phone', 'sms', 'email', 'location', 'text', 'image'];

type SmartRedirect = {
  appUrl: string | null;
  webUrl: string;
  platform: string;
  androidIntent?: string;
};

const getSmartRedirectUrl = (url: string): SmartRedirect => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;
    const search = urlObj.search || '';

    // YouTube (video)
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtu.be')) {
        videoId = pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }

      if (videoId) {
        const appUrl = `youtube://watch?v=${videoId}`;
        const androidIntent = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'YouTube', androidIntent };
      }

      const appUrl = `youtube://${pathname}`;
      const androidIntent = `intent://www.youtube.com${pathname}${search}#Intent;package=com.google.android.youtube;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'YouTube', androidIntent };
    }

    // Instagram
    if (hostname.includes('instagram.com')) {
      const parts = pathname.split('/').filter(Boolean);
      const username = parts[0];
      if (username && username !== 'p' && username !== 'reel') {
        const appUrl = `instagram://user?username=${username}`;
        const androidIntent = `intent://instagram.com/_u/${username}/#Intent;package=com.instagram.android;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'Instagram', androidIntent };
      }

      // Post / Reel
      const appUrl = `instagram://media?id=${encodeURIComponent(pathname)}`;
      const androidIntent = `intent://instagram.com${pathname}#Intent;package=com.instagram.android;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'Instagram', androidIntent };
    }

    // TikTok - leave as-is but include simple android intent
    if (hostname.includes('tiktok.com')) {
      const androidIntent = `intent://www.tiktok.com${pathname}${search}#Intent;package=com.zhiliaoapp.musically;scheme=https;end`;
      return { appUrl: `snssdk1233://`, webUrl: url, platform: 'TikTok', androidIntent };
    }

    // X / Twitter
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const username = pathname.split('/')[1];
      if (username) {
        const appUrl = `twitter://user?screen_name=${username}`;
        const androidIntent = `intent://twitter.com/${username}#Intent;package=com.twitter.android;scheme=https;end`;
        return { appUrl, webUrl: url, platform: 'X', androidIntent };
      }
      return { appUrl: 'twitter://', webUrl: url, platform: 'X' };
    }

    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      const appUrl = `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
      const androidIntent = `intent://www.facebook.com${pathname}${search}#Intent;package=com.facebook.katana;scheme=https;end`;
      return { appUrl, webUrl: url, platform: 'Facebook', androidIntent };
    }

    // LinkedIn
    if (hostname.includes('linkedin.com')) {
      return { appUrl: `linkedin://${pathname}`, webUrl: url, platform: 'LinkedIn' };
    }

    // Spotify
    if (hostname.includes('spotify.com')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return { appUrl: `spotify://${parts[0]}/${parts[1]}`, webUrl: url, platform: 'Spotify' };
      }
      return { appUrl: 'spotify://', webUrl: url, platform: 'Spotify' };
    }

    // WhatsApp
    if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) {
      const phone = pathname.slice(1) || urlObj.searchParams.get('phone') || '';
      return { appUrl: `whatsapp://send?phone=${phone}`, webUrl: url, platform: 'WhatsApp' };
    }

    // Telegram
    if (hostname.includes('t.me') || hostname.includes('telegram.me')) {
      return { appUrl: `tg://resolve?domain=${pathname.slice(1)}`, webUrl: url, platform: 'Telegram' };
    }

    return { appUrl: null, webUrl: url, platform: 'Website' };
  } catch {
    return { appUrl: null, webUrl: url, platform: 'Website' };
  }
};

// Parse vCard content
const parseVCard = (content: string) => {
  const lines = content.split(/\r?\n/);
  const data: Record<string, string> = {};
  
  for (const line of lines) {
    if (line.startsWith('FN:')) data.name = line.slice(3);
    else if (line.startsWith('TEL:') || line.startsWith('TEL;')) {
      const tel = line.split(':')[1];
      if (tel) data.phone = tel;
    }
    else if (line.startsWith('EMAIL:') || line.startsWith('EMAIL;')) {
      const email = line.split(':')[1];
      if (email) data.email = email;
    }
    else if (line.startsWith('ORG:')) data.org = line.slice(4);
    else if (line.startsWith('TITLE:')) data.title = line.slice(6);
    else if (line.startsWith('URL:')) data.url = line.slice(4);
    else if (line.startsWith('ADR:') || line.startsWith('ADR;')) {
      const adr = line.split(':')[1];
      if (adr) data.address = adr.replace(/;/g, ', ').replace(/,\s*,/g, ',').trim();
    }
  }
  
  return data;
};

// Parse WiFi content
const parseWiFi = (content: string) => {
  const match = content.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/i);
  if (match) {
    return { type: match[1], ssid: match[2], password: match[3] };
  }
  return null;
};

const Redirector: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [qrType, setQrType] = useState<string | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{ platform: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const [serverPassword, setServerPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordValidated, setPasswordValidated] = useState(false);
  
  const [copied, setCopied] = useState<string | null>(null);
  const [showDirectContent, setShowDirectContent] = useState(false);

  const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      message.error('Failed to copy');
    }
  };

  const doRedirect = useCallback(
    async (targetUrl: string) => {
      let mounted = true;
      let progressInterval: ReturnType<typeof setInterval> | undefined;

      try {
        setLoading(true);
        setProgress(0);

        progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 15, 90));
        }, 100);

        if (id) {
          try {
            await qrCodeAPI.incrementScan(id);
          } catch (err: any) {
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || '';
            if (status === 403 && msg.toLowerCase().includes('expired')) {
              window.location.href = `/qr/unavailable/${id}?reason=expired`;
              return;
            }
            if (status === 403 && msg.toLowerCase().includes('limit')) {
              window.location.href = `/qr/unavailable/${id}?reason=limit`;
              return;
            }
          }
        }

        if (!mounted) return;

        setContent(targetUrl);
        const smartRedirect = getSmartRedirectUrl(targetUrl);
        setRedirectInfo({ platform: smartRedirect.platform });

        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        // Prefer Android Intent URLs on Android (more reliable), otherwise try app scheme then fallback to web
        if (isMobile) {
          if (isAndroid && smartRedirect.androidIntent) {
            // Try Android intent which will open app if installed, otherwise fall back to web
            window.location.href = smartRedirect.androidIntent;

            setTimeout(() => {
              if (mounted) window.location.href = smartRedirect.webUrl;
            }, 1500);
          } else if (smartRedirect.appUrl) {
            // For iOS and other mobile browsers, directly set location to the app scheme
            window.location.href = smartRedirect.appUrl;

            setTimeout(() => {
              if (mounted) window.location.href = smartRedirect.webUrl;
            }, 1500);
          } else {
            window.location.href = smartRedirect.webUrl;
          }
        } else {
          // Desktop: always open web URL
          window.location.href = smartRedirect.webUrl;
        }
      } catch (err: unknown) {
        const e = err as Error;
        message.error(e?.message || 'Redirect failed');
        setLoading(false);
      } finally {
        if (progressInterval) clearInterval(progressInterval);
        mounted = false;
      }
    },
    [id, isMobile]
  );

  // Handle direct content types (vcard, wifi, etc.) - show content instead of redirect
  const handleDirectContent = useCallback(async (targetContent: string, type: string) => {
    try {
      setLoading(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90));
      }, 80);

      // Track the scan
      if (id) {
        try {
          await qrCodeAPI.incrementScan(id);
        } catch (err: any) {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || '';
          if (status === 403 && msg.toLowerCase().includes('expired')) {
            window.location.href = `/qr/unavailable/${id}?reason=expired`;
            return;
          }
          if (status === 403 && msg.toLowerCase().includes('limit')) {
            window.location.href = `/qr/unavailable/${id}?reason=limit`;
            return;
          }
        }
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setContent(targetContent);
      setQrType(type);
      setShowDirectContent(true);
      setLoading(false);
    } catch (err) {
      message.error('Failed to load content');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!id) {
          const u = searchParams.get('u');
          if (!u) throw new Error('No target specified');
          const targetUrl = decodeURIComponent(u);
          await doRedirect(targetUrl);
          return;
        }

        const res = await qrCodeAPI.getOne(id);
        const qr = res?.qrCode || res;
        const targetContent = qr?.content;
        const type = qr?.type || 'url';
        
        if (!targetContent) throw new Error('Destination not found');

        setContent(targetContent);
        setQrType(type);

        // Check for password protection
        const p = (qr?.password ?? null) as string | null;
        if (p && p.trim().length > 0) {
          setServerPassword(p);
          setLoading(false);
          return;
        }

        // Check if this is a direct content type
        if (DIRECT_CONTENT_TYPES.includes(type)) {
          await handleDirectContent(targetContent, type);
          return;
        }

        // For redirect types, set redirect info and redirect
        const smart = getSmartRedirectUrl(targetContent);
        setRedirectInfo({ platform: smart.platform });
        await doRedirect(targetContent);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Redirect failed';
        message.error(msg);
        setLoading(false);
      }
    };

    bootstrap();
  }, [doRedirect, handleDirectContent, id, searchParams]);

  const onSubmitPassword = async () => {
    const parsed = passwordSchema.safeParse(passwordInput);
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message || 'Invalid password');
      return;
    }

    setPasswordError(null);

    if (serverPassword && parsed.data !== serverPassword) {
      setPasswordError('Incorrect password');
      return;
    }

    setPasswordValidated(true);

    if (content && qrType) {
      if (DIRECT_CONTENT_TYPES.includes(qrType)) {
        await handleDirectContent(content, qrType);
      } else {
        await doRedirect(content);
      }
    } else {
      message.error('Destination not found');
    }
  };

  const needsPassword = !!serverPassword && !passwordValidated;

  // Render vCard content
  const renderVCardContent = () => {
    if (!content) return null;
    const vcard = parseVCard(content);
    
    const downloadVCard = () => {
      const blob = new Blob([content], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vcard.name || 'contact'}.vcf`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-primary/10 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{vcard.name || 'Contact'}</h2>
          {vcard.title && <p className="text-sm text-muted-foreground mt-1">{vcard.title}</p>}
          {vcard.org && <p className="text-sm text-muted-foreground">{vcard.org}</p>}
        </div>
        
        <div className="p-4 space-y-3">
          {vcard.phone && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="w-5 h-5 text-primary" />
              <a href={`tel:${vcard.phone}`} className="flex-1 text-foreground hover:underline">{vcard.phone}</a>
              <button onClick={() => copyToClipboard(vcard.phone!, 'phone')} className="p-1 hover:bg-muted rounded">
                {copied === 'phone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          )}
          
          {vcard.email && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
              <a href={`mailto:${vcard.email}`} className="flex-1 text-foreground hover:underline truncate">{vcard.email}</a>
              <button onClick={() => copyToClipboard(vcard.email!, 'email')} className="p-1 hover:bg-muted rounded">
                {copied === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          )}
          
          {vcard.url && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
              <a href={vcard.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-foreground hover:underline truncate">{vcard.url}</a>
            </div>
          )}
          
          {vcard.address && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="flex-1 text-foreground text-sm">{vcard.address}</span>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border">
          <Button type="primary" size="large" className="w-full" onClick={downloadVCard} icon={<Download className="w-4 h-4" />}>
            Save Contact
          </Button>
        </div>
      </div>
    );
  };

  // Render WiFi content
  const renderWiFiContent = () => {
    if (!content) return null;
    const wifi = parseWiFi(content);
    
    if (!wifi) {
      return (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
          <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Invalid WiFi data</p>
        </div>
      );
    }

    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-primary/10 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">WiFi Network</h2>
          <p className="text-sm text-muted-foreground mt-1">Connect to this network</p>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Wifi className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Network Name (SSID)</p>
              <p className="text-foreground font-medium">{wifi.ssid}</p>
            </div>
            <button onClick={() => copyToClipboard(wifi.ssid, 'ssid')} className="p-1 hover:bg-muted rounded">
              {copied === 'ssid' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Password</p>
              <p className="text-foreground font-medium font-mono">{wifi.password || '(No password)'}</p>
            </div>
            {wifi.password && (
              <button onClick={() => copyToClipboard(wifi.password, 'wifipass')} className="p-1 hover:bg-muted rounded">
                {copied === 'wifipass' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Building className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Security Type</p>
              <p className="text-foreground font-medium">{wifi.type || 'Open'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">Open your WiFi settings and connect manually using the credentials above</p>
        </div>
      </div>
    );
  };

  // Render generic direct content (phone, email, sms, text, location)
  const renderGenericContent = () => {
    if (!content || !qrType) return null;

    const getIcon = () => {
      switch (qrType) {
        case 'phone': return <Phone className="w-10 h-10 text-primary-foreground" />;
        case 'email': return <Mail className="w-10 h-10 text-primary-foreground" />;
        case 'sms': return <MessageSquare className="w-10 h-10 text-primary-foreground" />;
        case 'location': return <MapPin className="w-10 h-10 text-primary-foreground" />;
        default: return <Globe className="w-10 h-10 text-primary-foreground" />;
      }
    };

    const getTitle = () => {
      switch (qrType) {
        case 'phone': return 'Phone Number';
        case 'email': return 'Email Address';
        case 'sms': return 'SMS Message';
        case 'location': return 'Location';
        default: return 'Content';
      }
    };

    const getAction = () => {
      switch (qrType) {
        case 'phone': return { label: 'Call Now', href: `tel:${content}` };
        case 'email': return { label: 'Send Email', href: `mailto:${content}` };
        case 'sms': return { label: 'Send SMS', href: `sms:${content}` };
        case 'location': return { label: 'Open in Maps', href: `https://maps.google.com/?q=${encodeURIComponent(content)}` };
        default: return null;
      }
    };

    const action = getAction();

    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-primary/10 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            {getIcon()}
          </div>
          <h2 className="text-xl font-semibold text-foreground">{getTitle()}</h2>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1 break-all">
              <p className="text-foreground">{content}</p>
            </div>
            <button onClick={() => copyToClipboard(content, 'content')} className="p-1 hover:bg-muted rounded flex-shrink-0">
              {copied === 'content' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
        
        {action && (
          <div className="p-4 border-t border-border">
            <Button type="primary" size="large" className="w-full" onClick={() => window.location.href = action.href}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render image content
  const renderImageContent = () => {
    if (!content) return null;
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 text-center">
          <img src={content} alt="QR content" className="w-full rounded-md" />
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <Button type="primary" size="middle" className="flex-1" onClick={() => window.open(content, '_blank')}>Open Image</Button>
          <Button size="middle" onClick={() => {
            const a = document.createElement('a');
            a.href = content;
            a.download = 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}>Download</Button>
        </div>
      </div>
    );
  };

  // Render direct content based on type
  const renderDirectContent = () => {
    switch (qrType) {
      case 'vcard':
        return renderVCardContent();
      case 'wifi':
        return renderWiFiContent();
      case 'image':
        return renderImageContent();
      default:
        return renderGenericContent();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {needsPassword ? (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Protected Link</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input.Password
                  size="large"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Password"
                  status={passwordError ? 'error' : ''}
                  onPressEnter={onSubmitPassword}
                  className="w-full"
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1.5">{passwordError}</p>
                )}
              </div>

              <Button 
                type="primary" 
                size="large" 
                className="w-full" 
                onClick={onSubmitPassword}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : showDirectContent ? (
          renderDirectContent()
        ) : loading ? (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.64} 264`}
                  className="transition-all duration-200"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-1">
              {redirectInfo ? `Opening ${redirectInfo.platform}` : 'Loading'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {progress < 100 ? 'Please wait...' : 'Redirecting...'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
            <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Unable to Redirect</h2>
            <p className="text-sm text-muted-foreground mb-4">The automatic redirect failed</p>
            
            {content && (
              <Button
                type="primary"
                size="large"
                className="w-full"
                onClick={() => (window.location.href = content)}
                icon={<ExternalLink className="w-4 h-4" />}
              >
                Open Link
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Redirector;
