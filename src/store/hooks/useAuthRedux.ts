import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  initializeAuth,
  signin as signinAction,
  signup as signupAction,
  signout as signoutAction,
  updateUser as updateUserAction,
  selectUser,
  selectToken,
  selectAuthLoading,
  selectAuthInitialized,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthError,
} from '../slices/authSlice';

/**
 * Custom hook to use Redux-based authentication
 * This provides the same interface as the Context-based useAuth hook
 */
export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const loading = useAppSelector(selectAuthLoading);
  const initialized = useAppSelector(selectAuthInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const error = useAppSelector(selectAuthError);

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, initialized]);

  const signin = async (email: string, password: string) => {
    const result = await dispatch(signinAction({ email, password }));
    if (signinAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await dispatch(signupAction({ name, email, password }));
    if (signupAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const signout = () => {
    dispatch(signoutAction());
  };

  const updateUser = (userData: Parameters<typeof updateUserAction>[0]) => {
    dispatch(updateUserAction(userData));
  };

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    isAdmin,
    error,
    signin,
    signup,
    signout,
    updateUser,
  };
};
