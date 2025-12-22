import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { z } from 'zod';
import { qrCodeAPI } from '@/lib/api';
import { ExternalLink, Smartphone, Globe, Loader2, Lock } from 'lucide-react';

const passwordSchema = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .max(128, 'Password is too long');

// Smart app redirect patterns - detect platform-specific URLs and redirect to native apps
const getSmartRedirectUrl = (url: string): { appUrl: string | null; webUrl: string; platform: string; icon: string } => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname;

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      if (hostname.includes('youtu.be')) {
        videoId = pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return {
          appUrl: `vnd.youtube://watch?v=${videoId}`,
          webUrl: url,
          platform: 'YouTube',
          icon: '🎬',
        };
      }
      return { appUrl: `vnd.youtube://${pathname}`, webUrl: url, platform: 'YouTube', icon: '🎬' };
    }

    // Instagram
    if (hostname.includes('instagram.com')) {
      const username = pathname.split('/')[1];
      if (username && username !== 'p' && username !== 'reel') {
        return {
          appUrl: `instagram://user?username=${username}`,
          webUrl: url,
          platform: 'Instagram',
          icon: '📸',
        };
      }
      return { appUrl: `instagram://media?id=${pathname}`, webUrl: url, platform: 'Instagram', icon: '📸' };
    }

    // TikTok
    if (hostname.includes('tiktok.com')) {
      return {
        appUrl: `snssdk1233://`,
        webUrl: url,
        platform: 'TikTok',
        icon: '🎵',
      };
    }

    // Twitter/X
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const username = pathname.split('/')[1];
      if (username) {
        return {
          appUrl: `twitter://user?screen_name=${username}`,
          webUrl: url,
          platform: 'Twitter',
          icon: '🐦',
        };
      }
      return { appUrl: 'twitter://', webUrl: url, platform: 'Twitter', icon: '🐦' };
    }

    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return {
        appUrl: `fb://facewebmodal/f?href=${encodeURIComponent(url)}`,
        webUrl: url,
        platform: 'Facebook',
        icon: '👤',
      };
    }

    // LinkedIn
    if (hostname.includes('linkedin.com')) {
      return {
        appUrl: `linkedin://${pathname}`,
        webUrl: url,
        platform: 'LinkedIn',
        icon: '💼',
      };
    }

    // Spotify
    if (hostname.includes('spotify.com')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return {
          appUrl: `spotify://${parts[0]}/${parts[1]}`,
          webUrl: url,
          platform: 'Spotify',
          icon: '🎧',
        };
      }
      return { appUrl: 'spotify://', webUrl: url, platform: 'Spotify', icon: '🎧' };
    }

    // WhatsApp
    if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) {
      const phone = pathname.slice(1) || urlObj.searchParams.get('phone') || '';
      return {
        appUrl: `whatsapp://send?phone=${phone}`,
        webUrl: url,
        platform: 'WhatsApp',
        icon: '💬',
      };
    }

    // Telegram
    if (hostname.includes('t.me') || hostname.includes('telegram.me')) {
      return {
        appUrl: `tg://resolve?domain=${pathname.slice(1)}`,
        webUrl: url,
        platform: 'Telegram',
        icon: '✈️',
      };
    }

    // Default - no app redirect
    return { appUrl: null, webUrl: url, platform: 'Website', icon: '🌐' };
  } catch {
    return { appUrl: null, webUrl: url, platform: 'Website', icon: '🌐' };
  }
};

const Redirector: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{ platform: string; icon: string } | null>(null);
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
          // Track scan; if server responds that QR is expired/limit reached, redirect to unavailable page
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
        setRedirectInfo({ platform: smartRedirect.platform, icon: smartRedirect.icon });

        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Try app redirect first (on mobile)
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
        // Query-param redirect (no password support)
        if (!id) {
          const u = searchParams.get('u');
          if (!u) throw new Error('No target specified');
          const targetUrl = decodeURIComponent(u);
          await doRedirect(targetUrl);
          return;
        }

        // QR-id redirect: fetch first so we can enforce password BEFORE scan is counted
        const res = await qrCodeAPI.getOne(id);
        const qr = res?.qrCode || res;
        const targetUrl = qr?.content;
        if (!targetUrl) throw new Error('Destination not found');

        setContent(targetUrl);
        const smart = getSmartRedirectUrl(targetUrl);
        setRedirectInfo({ platform: smart.platform, icon: smart.icon });

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

    // Client-side verification (backend endpoint does not validate passwords)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full">
        {needsPassword ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Password Required</h3>
              <p className="text-white/60 text-sm">Enter the password to open this QR code.</p>
            </div>

            <div className="space-y-3 text-left">
              <Input.Password
                size="large"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Enter password"
                status={passwordError ? 'error' : ''}
                onPressEnter={onSubmitPassword}
              />
              {passwordError && <div className="text-sm text-red-300">{passwordError}</div>}

              <Button type="primary" size="large" className="w-full" onClick={onSubmitPassword}>
                Continue
              </Button>
            </div>

            {content && (
              <div className="pt-2">
                <button
                  onClick={() => window.location.href = content}
                  className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Open Link Without Redirect
                </button>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="text-center space-y-8">
            {/* Main loader container */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.89} 289`}
                    className="transition-all duration-300 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                    {redirectInfo ? (
                      <span className="text-3xl animate-bounce">{redirectInfo.icon}</span>
                    ) : (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">{redirectInfo ? `Opening ${redirectInfo.platform}` : 'Preparing...'}</h2>
              <p className="text-white/60 text-sm">{progress < 100 ? 'Loading your destination...' : 'Redirecting now...'}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Subtle hint */}
            <p className="text-white/40 text-xs flex items-center justify-center gap-2">
              <Smartphone className="w-3 h-3" />
              Opening in your preferred app when possible
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Redirect Failed</h3>
              <p className="text-white/60 text-sm">Could not redirect automatically</p>
            </div>
            {content && (
              <button
                onClick={() => (window.location.href = content)}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Open Link Manually
              </button>
            )}
          </div>
        )}
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Redirector;
