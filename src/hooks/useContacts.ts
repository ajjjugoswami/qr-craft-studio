import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchContacts,
  createContact,
  updateContactStatus,
  deleteContact,
  clearContacts,
  selectContacts,
  selectContactsLoading,
  selectShouldFetchContacts,
} from '@/store/slices/contactsSlice';
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice';

/**
 * Hook for contact submissions with caching (admin only for listing)
 */
export const useContacts = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const shouldFetch = useAppSelector(selectShouldFetchContacts);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Fetch contacts on mount if admin and needed
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin && shouldFetch) {
      dispatch(fetchContacts());
    }
  }, [dispatch, isAuthenticated, user?.isAdmin, shouldFetch]);

  // Clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearContacts());
    }
  }, [dispatch, isAuthenticated]);

  const submitContact = useCallback(
    async (data: { name: string; email: string; subject: string; message: string }) => {
      await dispatch(createContact(data)).unwrap();
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      await dispatch(updateContactStatus({ id, status })).unwrap();
    },
    [dispatch]
  );

  const remove = useCallback(
    async (id: string) => {
      await dispatch(deleteContact(id)).unwrap();
    },
    [dispatch]
  );

  const refresh = useCallback(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return {
    contacts,
    loading,
    submitContact,
    updateStatus,
    deleteContact: remove,
    refresh,
  };
};
