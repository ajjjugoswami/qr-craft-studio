import { useState, useEffect, useCallback } from 'react';
import { QRCodeData, QRTemplate, QRStyling, QRType, defaultTemplates, defaultStyling } from '../types/qrcode';

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

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setQRCodes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored QR codes:', e);
      }
    }
    setLoading(false);
  }, []);

  const saveQRCode = (qrCode: QRCodeData) => {
    const updated = [...qrCodes, qrCode];
    setQRCodes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Clear draft after successful save
    localStorage.removeItem(DRAFT_KEY);
  };

  const updateQRCode = (id: string, data: Partial<QRCodeData>) => {
    const updated = qrCodes.map((qr) =>
      qr.id === id ? { ...qr, ...data } : qr
    );
    setQRCodes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteQRCode = (id: string) => {
    const updated = qrCodes.filter((qr) => qr.id !== id);
    setQRCodes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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