import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { z } from 'zod';
import { qrCodeAPI } from '@/lib/api';
import { ExternalLink, Loader2, Lock, AlertCircle } from 'lucide-react';

const passwordSchema = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .max(128, 'Password is too long');

const getSmartRedirectUrl = (url: string): { appUrl: string | null; webUrl: string; platform: string } => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtu.be')) {
        videoId = pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return { appUrl: `vnd.youtube://watch?v=${videoId}`, webUrl: url, platform: 'YouTube' };
      }
      return { appUrl: `vnd.youtube://${pathname}`, webUrl: url, platform: 'YouTube' };
    }

    if (hostname.includes('instagram.com')) {
      const username = pathname.split('/')[1];
      if (username && username !== 'p' && username !== 'reel') {
        return { appUrl: `instagram://user?username=${username}`, webUrl: url, platform: 'Instagram' };
      }
      return { appUrl: `instagram://media?id=${pathname}`, webUrl: url, platform: 'Instagram' };
    }

    if (hostname.includes('tiktok.com')) {
      return { appUrl: `snssdk1233://`, webUrl: url, platform: 'TikTok' };
    }

    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const username = pathname.split('/')[1];
      if (username) {
        return { appUrl: `twitter://user?screen_name=${username}`, webUrl: url, platform: 'X' };
      }
      return { appUrl: 'twitter://', webUrl: url, platform: 'X' };
    }

    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return { appUrl: `fb://facewebmodal/f?href=${encodeURIComponent(url)}`, webUrl: url, platform: 'Facebook' };
    }

    if (hostname.includes('linkedin.com')) {
      return { appUrl: `linkedin://${pathname}`, webUrl: url, platform: 'LinkedIn' };
    }

    if (hostname.includes('spotify.com')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return { appUrl: `spotify://${parts[0]}/${parts[1]}`, webUrl: url, platform: 'Spotify' };
      }
      return { appUrl: 'spotify://', webUrl: url, platform: 'Spotify' };
    }

    if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) {
      const phone = pathname.slice(1) || urlObj.searchParams.get('phone') || '';
      return { appUrl: `whatsapp://send?phone=${phone}`, webUrl: url, platform: 'WhatsApp' };
    }

    if (hostname.includes('t.me') || hostname.includes('telegram.me')) {
      return { appUrl: `tg://resolve?domain=${pathname.slice(1)}`, webUrl: url, platform: 'Telegram' };
    }

    return { appUrl: null, webUrl: url, platform: 'Website' };
  } catch {
    return { appUrl: null, webUrl: url, platform: 'Website' };
  }
};

const Redirector: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{ platform: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const [serverPassword, setServerPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordValidated, setPasswordValidated] = useState(false);

  const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);

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

        if (smartRedirect.appUrl && isMobile) {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = smartRedirect.appUrl;
          document.body.appendChild(iframe);

          setTimeout(() => {
            if (mounted) window.location.href = smartRedirect.webUrl;
          }, 1500);
        } else {
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
        const targetUrl = qr?.content;
        if (!targetUrl) throw new Error('Destination not found');

        setContent(targetUrl);
        const smart = getSmartRedirectUrl(targetUrl);
        setRedirectInfo({ platform: smart.platform });

        const p = (qr?.password ?? null) as string | null;
        if (p && p.trim().length > 0) {
          setServerPassword(p);
          setLoading(false);
          return;
        }

        await doRedirect(targetUrl);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Redirect failed';
        message.error(msg);
        setLoading(false);
      }
    };

    bootstrap();
  }, [doRedirect, id, searchParams]);

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

    if (content) {
      await doRedirect(content);
    } else {
      message.error('Destination not found');
    }
  };

  const needsPassword = !!serverPassword && !passwordValidated;

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
