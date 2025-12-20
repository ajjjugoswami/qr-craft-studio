import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchQRCodes,
  fetchQRCode,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  selectQRCodes,
  selectQRCodesLoading,
  selectQRCodeById,
  selectShouldFetchQRCodes,
  clearQRCodes,
} from '@/store/slices/qrCodesSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { QRCodeData } from '@/types/qrcode';

/**
 * Custom hook for QR codes that uses Redux store
 * Provides caching and prevents redundant API calls
 */
export const useQRCodes = () => {
  const dispatch = useAppDispatch();
  const qrCodes = useAppSelector(selectQRCodes);
  const loading = useAppSelector(selectQRCodesLoading);
  const shouldFetch = useAppSelector(selectShouldFetchQRCodes);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch QR codes on mount if needed
  useEffect(() => {
    if (isAuthenticated && shouldFetch) {
      dispatch(fetchQRCodes());
    }
  }, [dispatch, isAuthenticated, shouldFetch]);

  // Clear data on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearQRCodes());
    }
  }, [dispatch, isAuthenticated]);

  // Save new QR code
  const saveQRCode = useCallback(
    async (qrInput: Partial<QRCodeData> & { previewImage?: string }) => {
      const result = await dispatch(createQRCode(qrInput)).unwrap();
      return result;
    },
    [dispatch]
  );

  // Update existing QR code
  const handleUpdateQRCode = useCallback(
    async (id: string, data: Partial<QRCodeData>) => {
      await dispatch(updateQRCode({ id, data })).unwrap();
    },
    [dispatch]
  );

  // Delete QR code
  const handleDeleteQRCode = useCallback(
    async (id: string) => {
      await dispatch(deleteQRCode(id)).unwrap();
    },
    [dispatch]
  );

  // Get QR code by ID (from cache first)
  const getQRCode = useCallback(
    (id: string): QRCodeData | undefined => {
      return qrCodes.find((q) => q.id === id);
    },
    [qrCodes]
  );

  // Fetch single QR code if not in cache
  const fetchSingleQRCode = useCallback(
    async (id: string) => {
      const cached = qrCodes.find((q) => q.id === id);
      if (cached) return cached;
      
      const result = await dispatch(fetchQRCode(id)).unwrap();
      return result;
    },
    [dispatch, qrCodes]
  );

  // Force refresh
  const refresh = useCallback(() => {
    dispatch(fetchQRCodes());
  }, [dispatch]);

  return {
    qrCodes,
    loading,
    saveQRCode,
    updateQRCode: handleUpdateQRCode,
    deleteQRCode: handleDeleteQRCode,
    getQRCode,
    fetchSingleQRCode,
    refresh,
  };
};
