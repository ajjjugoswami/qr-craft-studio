import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchAnalytics,
  clearAnalytics,
  selectScans,
  selectAnalyticsData,
  selectAnalyticsLoading,
  selectShouldFetchAnalytics,
} from '@/store/slices/analyticsSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

/**
 * Hook for global analytics data with caching
 */
export const useAnalytics = () => {
  const dispatch = useAppDispatch();
  const scans = useAppSelector(selectScans);
  const analytics = useAppSelector(selectAnalyticsData);
  const loading = useAppSelector(selectAnalyticsLoading);
  const shouldFetch = useAppSelector(selectShouldFetchAnalytics);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch analytics on mount if needed
  useEffect(() => {
    if (isAuthenticated && shouldFetch) {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, isAuthenticated, shouldFetch]);

  // Clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearAnalytics());
    }
  }, [dispatch, isAuthenticated]);

  const refresh = useCallback(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  return {
    scans,
    analytics,
    loading,
    refresh,
  };
};
