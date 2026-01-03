import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchAdminSubscriptions,
  selectSubscriptionStats,
  selectAdminSubscriptions,
  selectAdminPayments,
  selectSubscriptionLoading,
  selectSubscriptionError,
  selectSubscriptionPage,
  selectSubscriptionLimit,
  selectSubscriptionTotalSubs,
  selectSubscriptionTotalPayments,
  selectSubscriptionSearch,
  setSubscriptionSearch,
} from '@/store/slices/adminSlice';

export const useAdminSubscriptions = () => {
  const dispatch = useAppDispatch();
  
  const stats = useAppSelector(selectSubscriptionStats);
  const subscriptions = useAppSelector(selectAdminSubscriptions);
  const payments = useAppSelector(selectAdminPayments);
  const loading = useAppSelector(selectSubscriptionLoading);
  const error = useAppSelector(selectSubscriptionError);
  const page = useAppSelector(selectSubscriptionPage);
  const limit = useAppSelector(selectSubscriptionLimit);
  const totalSubs = useAppSelector(selectSubscriptionTotalSubs);
  const totalPayments = useAppSelector(selectSubscriptionTotalPayments);
  const search = useAppSelector(selectSubscriptionSearch);

  // Fetch data
  const fetchData = useCallback((params?: { page?: number; limit?: number; search?: string }) => {
    dispatch(fetchAdminSubscriptions(params));
  }, [dispatch]);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch(setSubscriptionSearch(searchTerm));
    dispatch(fetchAdminSubscriptions({ page: 1, search: searchTerm }));
  }, [dispatch]);

  // Handle table change (pagination)
  const handleTableChange = useCallback((newPage: number, newLimit: number) => {
    dispatch(fetchAdminSubscriptions({ page: newPage, limit: newLimit, search }));
  }, [dispatch, search]);

  // Refresh data
  const refresh = useCallback(() => {
    dispatch(fetchAdminSubscriptions({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Auto-fetch data on mount
  useEffect(() => {
    if (!stats && !loading) {
      fetchData();
    }
  }, [stats, loading, fetchData]);

  return {
    // Data
    stats,
    subscriptions,
    payments,
    
    // State
    loading,
    error,
    
    // Pagination
    page,
    limit,
    totalSubs,
    totalPayments,
    search,
    
    // Actions
    fetchData,
    handleSearch,
    handleTableChange,
    refresh,
  };
};

export default useAdminSubscriptions;