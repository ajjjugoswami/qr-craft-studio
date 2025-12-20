import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchQRAnalytics,
  clearQRAnalytics,
  selectQRAnalyticsLoading,
  selectQRAnalyticsEntry,
  selectShouldFetchQRAnalytics,
} from '@/store/slices/qrAnalyticsSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

/**
 * Hook for individual QR code analytics with caching
 */
export const useQRAnalytics = (qrCodeId: string | undefined) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectQRAnalyticsLoading);
  const entry = useAppSelector(qrCodeId ? selectQRAnalyticsEntry(qrCodeId) : () => undefined);
  const shouldFetch = useAppSelector(qrCodeId ? selectShouldFetchQRAnalytics(qrCodeId) : () => false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch on mount if needed
  useEffect(() => {
    if (isAuthenticated && qrCodeId && shouldFetch) {
      dispatch(fetchQRAnalytics(qrCodeId));
    }
  }, [dispatch, isAuthenticated, qrCodeId, shouldFetch]);

  // Clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearQRAnalytics());
    }
  }, [dispatch, isAuthenticated]);

  const refresh = useCallback(() => {
    if (qrCodeId) {
      dispatch(fetchQRAnalytics(qrCodeId));
    }
  }, [dispatch, qrCodeId]);

  return {
    scans: entry?.scans || [],
    analytics: entry?.analytics || null,
    loading,
    refresh,
  };
};
