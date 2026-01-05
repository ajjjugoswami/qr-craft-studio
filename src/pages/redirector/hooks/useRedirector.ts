import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { z } from 'zod';
import { qrCodeAPI } from '@/lib/api';
import { getSmartRedirectUrl, DIRECT_CONTENT_TYPES } from '../utils/redirectUtils';
import type { WhiteLabelConfig } from '@/context/authTypes';

const passwordSchema = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .max(128, 'Password is too long');

export interface RedirectorState {
  loading: boolean;
  content: string | null;
  qrType: string | null;
  redirectInfo: { platform: string } | null;
  progress: number;
  serverPassword: string | null;
  passwordInput: string;
  passwordError: string | null;
  passwordValidated: boolean;
  showDirectContent: boolean;
  needsPassword: boolean;
  whiteLabel: WhiteLabelConfig | null;
}

const defaultWhiteLabel: WhiteLabelConfig = {
  enabled: false,
  showPoweredBy: true,
};

export const useRedirector = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  const [initializing, setInitializing] = useState(true); // True until we have white-label config
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);
  const [qrType, setQrType] = useState<string | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{ platform: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(defaultWhiteLabel);

  const [serverPassword, setServerPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordValidated, setPasswordValidated] = useState(false);
  
  const [showDirectContent, setShowDirectContent] = useState(false);

  const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const needsPassword = !!serverPassword && !passwordValidated;

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
            if (status === 403 && msg.toLowerCase().includes('inactive')) {
              window.location.href = `/qr/unavailable/${id}?reason=inactive`;
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

        if (isMobile) {
          if (isAndroid && smartRedirect.androidIntent) {
            window.location.href = smartRedirect.androidIntent;
            setTimeout(() => {
              if (mounted) window.location.href = smartRedirect.webUrl;
            }, 1500);
          } else if (smartRedirect.appUrl) {
            window.location.href = smartRedirect.appUrl;
            setTimeout(() => {
              if (mounted) window.location.href = smartRedirect.webUrl;
            }, 1500);
          } else {
            window.location.href = smartRedirect.webUrl;
          }
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

  const handleDirectContent = useCallback(async (targetContent: string, type: string) => {
    try {
      setLoading(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90));
      }, 80);

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

        // Check expiration date BEFORE anything else (including password prompt)
        const expirationDate = qr?.expirationDate || qr?.expirationdate;
        if (expirationDate) {
          const expDate = new Date(expirationDate);
          if (expDate < new Date()) {
            window.location.href = `/qr/unavailable/${id}?reason=expired`;
            return;
          }
        }

        // Check if QR is inactive
        if (qr?.status === 'inactive' || qr?.isActive === false) {
          window.location.href = `/qr/unavailable/${id}?reason=inactive`;
          return;
        }

        setContent(targetContent);
        setQrType(type);

        // Get white-label config from QR owner (stored on QR or fetched separately)
        const ownerWhiteLabel = qr?.whiteLabel || qr?.owner?.whiteLabel || null;
        if (ownerWhiteLabel && ownerWhiteLabel.enabled) {
          setWhiteLabel(ownerWhiteLabel);
        }
        
        // Mark initialization complete - we now know the white-label config
        setInitializing(false);

        const p = (qr?.password ?? null) as string | null;
        if (p && p.trim().length > 0) {
          setServerPassword(p);
          setLoading(false);
          return;
        }

        if (DIRECT_CONTENT_TYPES.includes(type)) {
          await handleDirectContent(targetContent, type);
          return;
        }

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

  const setPasswordInputValue = (value: string) => {
    setPasswordInput(value);
    if (passwordError) setPasswordError(null);
  };

  return {
    loading: initializing || loading, // Keep loading true until we have white-label config
    content,
    qrType,
    redirectInfo,
    progress: initializing ? 0 : progress, // Show 0 progress during initialization
    passwordInput,
    passwordError,
    showDirectContent,
    needsPassword: !initializing && needsPassword, // Only show password prompt after init
    whiteLabel,
    onSubmitPassword,
    setPasswordInputValue,
  };
};
