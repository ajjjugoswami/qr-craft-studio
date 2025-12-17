import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { QRCodeData, QRTemplate, QRStyling, QRType, defaultTemplates, defaultStyling } from '../types/qrcode';
import { qrCodeAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'qr-codes-data';
const DRAFT_KEY = 'qr-code-draft';

export interface DraftData {
  template: QRTemplate;
  styling: QRStyling;
  type: QRType;
  content: string;
  name: string;
  currentStep: number;
}

export const useQRCodes = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { signout } = useAuth();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await qrCodeAPI.getAll();
        // backend returns { success, count, qrCodes }
        const list = (res.qrCodes || []).map((q: any) => ({
          id: q._id,
          name: q.name,
          type: q.type,
          content: q.content,
          template: q.template && Object.keys(q.template).length ? q.template : defaultTemplates[0],
          styling: q.styling && Object.keys(q.styling).length ? q.styling : defaultStyling,
          createdAt: q.createdAt,
          scans: q.scanCount || 0,
          status: q.status || 'active',
        } as QRCodeData));

        if (mounted) {
          setQRCodes(list);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          // session expired or unauthorized
          signout();
        } else {
          console.error(err);
          message.error('Failed to load QR codes');
          // fallback to cached
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              setQRCodes(JSON.parse(stored));
            } catch (e) {}
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [signout]);

  // Create new QR code (saves to backend and updates state)
  const saveQRCode = async (qrInput: Partial<QRCodeData>) => {
    try {
      const payload = {
        type: qrInput.type,
        content: qrInput.content,
        name: qrInput.name,
        template: qrInput.template,
        styling: qrInput.styling,
        previewImage: (qrInput as any).previewImage,
      };

      const res = await qrCodeAPI.create(payload as any);
      const created = res.qrCode;

      const qr: QRCodeData = {
        id: created._id,
        name: created.name,
        type: created.type,
        content: created.content,
        template: created.template || defaultTemplates[0],
        styling: created.styling || defaultStyling,
        createdAt: created.createdAt,
        scans: created.scanCount || 0,
        status: created.status || 'active',
      };

      const updated = [qr, ...qrCodes];
      setQRCodes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Clear draft
      localStorage.removeItem(DRAFT_KEY);

      return qr;
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Failed to save QR code');
      throw err;
    }
  };

  const updateQRCode = async (id: string, data: Partial<QRCodeData>) => {
    try {
      const res = await qrCodeAPI.update(id, data);
      const updatedQR = res.qrCode;
      const updated = qrCodes.map((q) => q.id === id ? {
        id: updatedQR._id,
        name: updatedQR.name,
        type: updatedQR.type,
        content: updatedQR.content,
        template: updatedQR.template || defaultTemplates[0],
        styling: updatedQR.styling || defaultStyling,
        createdAt: updatedQR.createdAt,
        scans: updatedQR.scanCount || 0,
        status: updatedQR.status || 'active',
      } : q);
      setQRCodes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      message.success('QR Code updated');
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Failed to update QR code');
      throw err;
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      await qrCodeAPI.delete(id);
      const updated = qrCodes.filter((qr) => qr.id !== id);
      setQRCodes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      message.success('QR Code deleted');
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Failed to delete QR code');
      throw err;
    }
  };

  const getQRCode = (id: string) => {
    return qrCodes.find((qr) => qr.id === id);
  };

  // Draft persistence for in-progress QR code creation
  const saveDraft = useCallback((draft: DraftData) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, []);

  const getDraft = useCallback((): DraftData | null => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse draft:', e);
        return null;
      }
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  return {
    qrCodes,
    loading,
    saveQRCode,
    updateQRCode,
    deleteQRCode,
    getQRCode,
    saveDraft,
    getDraft,
    clearDraft,
  };
};