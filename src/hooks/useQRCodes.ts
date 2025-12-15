import { useState, useEffect } from 'react';
import { QRCodeData } from '../types/qrcode';

const STORAGE_KEY = 'qr-codes-data';

export const useQRCodes = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setQRCodes(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const saveQRCode = (qrCode: QRCodeData) => {
    const updated = [...qrCodes, qrCode];
    setQRCodes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  return {
    qrCodes,
    loading,
    saveQRCode,
    updateQRCode,
    deleteQRCode,
    getQRCode,
  };
};
