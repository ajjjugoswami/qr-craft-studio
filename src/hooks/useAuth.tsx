import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  initializeAuth,
  signIn,
  signUp,
  signOut,
  updateUser,
  selectUser,
  selectToken,
  selectAuthLoading,
  selectAuthInitialized,
  selectAuthInitializing,
} from '@/store/slices/authSlice';
import type { User } from '@/context/authTypes';

/**
 * Custom hook for authentication that uses Redux store
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const loading = useAppSelector(selectAuthLoading);
  const initialized = useAppSelector(selectAuthInitialized);
  const initializing = useAppSelector(selectAuthInitializing);

  // Initialize auth on first load (deduped via slice condition)
  useEffect(() => {
    if (!initialized && !initializing) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized, initializing]);

  const signin = useCallback(
    async (email: string, password: string) => {
      await dispatch(signIn({ email, password })).unwrap();
    },
    [dispatch]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, verificationToken?: string) => {
      await dispatch(signUp({ name, email, password, verificationToken })).unwrap();
    },
    [dispatch]
  );

  const signout = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  const handleUpdateUser = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  return {
    user,
    token,
    loading,
    initialized,
    signin,
    signup,
    signout,
    updateUser: handleUpdateUser,
  };
};
