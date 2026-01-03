import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchAdminUsers,
  toggleUserBlock,
  deleteAdminUser,
  clearAdminData,
  setAdminSearch,
  optimisticToggleBlock,
  selectAdminUsers,
  selectAdminLoading,
  selectAdminError,
  selectAdminPage,
  selectAdminLimit,
  selectAdminTotal,
  selectAdminSearch,
  selectShouldFetchAdmin,
} from '@/store/slices/adminSlice';
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice';

/**
 * Hook for admin users data with Redux caching
 */
export const useAdminData = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const loading = useAppSelector(selectAdminLoading);
  const error = useAppSelector(selectAdminError);
  const page = useAppSelector(selectAdminPage);
  const limit = useAppSelector(selectAdminLimit);
  const total = useAppSelector(selectAdminTotal);
  const search = useAppSelector(selectAdminSearch);
  const shouldFetch = useAppSelector(selectShouldFetchAdmin);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Fetch admin data on mount if admin and cache expired
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin && shouldFetch) {
      dispatch(fetchAdminUsers({ page: 1, limit }));
    }
  }, [dispatch, isAuthenticated, user?.isAdmin, shouldFetch, limit]);

  // Clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearAdminData());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch with params
  const fetch = useCallback((opts: { page?: number; limit?: number; search?: string } = {}) => {
    dispatch(fetchAdminUsers(opts));
  }, [dispatch]);

  // Refresh current view
  const refresh = useCallback(() => {
    dispatch(fetchAdminUsers({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // Handle table pagination change
  const handleTableChange = useCallback((newPage: number, newLimit: number) => {
    dispatch(fetchAdminUsers({ page: newPage, limit: newLimit, search }));
  }, [dispatch, search]);

  // Search
  const handleSearch = useCallback((searchValue: string) => {
    dispatch(setAdminSearch(searchValue));
    dispatch(fetchAdminUsers({ page: 1, limit, search: searchValue }));
  }, [dispatch, limit]);

  // Block/unblock user with optimistic update
  const toggleBlock = useCallback(async (userId: string, currentlyBlocked: boolean) => {
    const newBlockedState = !currentlyBlocked;
    // Optimistic update
    dispatch(optimisticToggleBlock({ userId, blocked: newBlockedState }));
    
    try {
      await dispatch(toggleUserBlock({ userId, blocked: newBlockedState })).unwrap();
    } catch {
      // Rollback on failure
      dispatch(optimisticToggleBlock({ userId, blocked: currentlyBlocked }));
    }
  }, [dispatch]);

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    await dispatch(deleteAdminUser(userId)).unwrap();
  }, [dispatch]);

  return {
    users,
    loading,
    error,
    page,
    limit,
    total,
    search,
    fetch,
    refresh,
    handleTableChange,
    handleSearch,
    toggleBlock,
    deleteUser,
  };
};
