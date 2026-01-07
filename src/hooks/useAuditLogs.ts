import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchAuditLogs,
  selectAuditLogs,
  selectAuditLogsLoading,
  selectAuditLogsError,
  selectAuditLogsPage,
  selectAuditLogsLimit,
  selectAuditLogsTotal,
  selectAuditLogsSearch,
} from '@/store/slices/adminSlice';
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice';
import type { TablePaginationConfig } from 'antd/es/table';

/**
 * Hook for admin audit logs data
 */
export const useAuditLogs = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectAuditLogsLoading);
  const error = useAppSelector(selectAuditLogsError);
  const page = useAppSelector(selectAuditLogsPage);
  const limit = useAppSelector(selectAuditLogsLimit);
  const total = useAppSelector(selectAuditLogsTotal);
  const search = useAppSelector(selectAuditLogsSearch);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Fetch audit logs on mount if admin
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      dispatch(fetchAuditLogs({ page: 1, limit }));
    }
  }, [dispatch, isAuthenticated, user?.isAdmin, limit]);

  // Fetch with params
  const fetch = useCallback((opts: { page?: number; limit?: number; search?: string; action?: string; adminId?: string; targetUserId?: string } = {}) => {
    dispatch(fetchAuditLogs(opts));
  }, [dispatch]);

  // Handle table pagination change
  const handleTableChange = useCallback((pagination: TablePaginationConfig, filters: any, sorter: any, extra: any) => {
    const newPage = pagination.current ?? 1;
    const newLimit = pagination.pageSize ?? limit;
    dispatch(fetchAuditLogs({ page: newPage, limit: newLimit, search }));
  }, [dispatch, search, limit]);

  // Search
  const handleSearch = useCallback((searchValue: string) => {
    dispatch(fetchAuditLogs({ page: 1, limit, search: searchValue }));
  }, [dispatch, limit]);

  return {
    logs,
    loading,
    error,
    page,
    limit,
    total,
    search,
    fetch,
    handleTableChange,
    handleSearch,
  };
};