import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchQRCodes,
  fetchQRCode,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  selectQRCodes,
  selectQRCodesLoading,
  selectQRCodesPage,
  selectQRCodesLimit,
  selectQRCodesTotal,
  selectQRCodesTotalPages,
  selectQRCodeById,
  selectShouldFetchQRCodes,
  clearQRCodes,
} from '@/store/slices/qrCodesSlice';
import {
  fetchStats,
  selectStatsTotal,
  selectStatsTotalScans,
  selectStatsTotalActive,
  selectShouldFetchStats,
  clearStats,
} from '@/store/slices/statsSlice';
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice';
import { QRCodeData } from '@/types/qrcode';

/**
 * Custom hook for QR codes that uses Redux store
 * Provides caching and prevents redundant API calls
 */
export const useQRCodes = () => {
  const dispatch = useAppDispatch();
  const qrCodes = useAppSelector(selectQRCodes);
  const loading = useAppSelector(selectQRCodesLoading);
  const page = useAppSelector(selectQRCodesPage);
  const limit = useAppSelector(selectQRCodesLimit);
  const total = useAppSelector(selectQRCodesTotal);
  const totalPages = useAppSelector(selectQRCodesTotalPages);
  
  // Stats from separate slice
  const statsTotal = useAppSelector(selectStatsTotal);
  const totalScans = useAppSelector(selectStatsTotalScans);
  const totalActive = useAppSelector(selectStatsTotalActive);
  const shouldFetchStats = useAppSelector(selectShouldFetchStats);
  
  const shouldFetch = useAppSelector(selectShouldFetchQRCodes);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  const prevUserIdRef = useRef<string | undefined>();

  // Fetch stats once on mount (independent of QR codes list)
  useEffect(() => {
    if (isAuthenticated && shouldFetchStats) {
      dispatch(fetchStats());
    }
  }, [dispatch, isAuthenticated, shouldFetchStats]);

  // Fetch QR codes on mount if needed (load first page)
  useEffect(() => {
    if (isAuthenticated && shouldFetch) {
      dispatch(fetchQRCodes({ page: 1, limit }));
    }
  }, [dispatch, isAuthenticated, shouldFetch, limit]);

  // Force refetch when user changes
  useEffect(() => {
    const currentUserId = user?._id;
    const prevUserId = prevUserIdRef.current;
    
    if (currentUserId && prevUserId && currentUserId !== prevUserId) {
      // User changed, clear cache and refetch
      dispatch(clearQRCodes());
      dispatch(clearStats());
      dispatch(fetchQRCodes({ page: 1, limit }));
      dispatch(fetchStats());
    }
    
    prevUserIdRef.current = currentUserId;
  }, [dispatch, user?._id, limit]);

  // Clear data on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearQRCodes());
      dispatch(clearStats());
    }
  }, [dispatch, isAuthenticated]);

  // Save new QR code
  const saveQRCode = useCallback(
    async (qrInput: Partial<QRCodeData> & { previewImage?: string }) => {
      const result = await dispatch(createQRCode(qrInput)).unwrap();
      // Refetch stats after creating
      dispatch(fetchStats());
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

  // Toggle QR code status (active/inactive)
  const toggleQRCodeStatus = useCallback(
    async (id: string) => {
      const qrCode = qrCodes.find(q => q.id === id);
      if (!qrCode) return;
      
      const newStatus = qrCode.status === 'active' ? 'inactive' : 'active';
      await dispatch(updateQRCode({ id, data: { status: newStatus } })).unwrap();
      // Refetch stats after status change
      dispatch(fetchStats());
    },
    [dispatch, qrCodes]
  );

  // Delete QR code
  const handleDeleteQRCode = useCallback(
    async (id: string) => {
      await dispatch(deleteQRCode(id)).unwrap();
      // Refetch stats after delete
      dispatch(fetchStats());
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

  // Force refresh (keeps current pagination)
  const refresh = useCallback((opts: { page?: number; limit?: number; search?: string } = {}) => {
    dispatch(fetchQRCodes(opts));
  }, [dispatch]);

  // Fetch with params
  const fetch = useCallback((opts: { page?: number; limit?: number; search?: string } = {}) => {
    dispatch(fetchQRCodes(opts));
  }, [dispatch]);

  const setPage = useCallback((p: number) => {
    dispatch(fetchQRCodes({ page: p, limit }));
  }, [dispatch, limit]);

  const setSearch = useCallback((search: string) => {
    dispatch(fetchQRCodes({ page: 1, limit, search }));
  }, [dispatch, limit]);

  return {
    qrCodes,
    loading,
    page,
    limit,
    total,
    totalPages,
    // Stats from stats slice
    totalScans,
    totalActive,
    statsTotal,
    saveQRCode,
    updateQRCode: handleUpdateQRCode,
    toggleQRCodeStatus,
    deleteQRCode: handleDeleteQRCode,
    getQRCode,
    fetchSingleQRCode,
    refresh,
    fetch,
    setPage,
    setSearch,
  };
};
