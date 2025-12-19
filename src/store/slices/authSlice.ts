import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { authAPI } from '@/lib/api';
import type { RootState } from '../store';

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  theme?: string;
  mobile?: string;
  country?: string;
  city?: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const STORAGE_KEY = 'qc_auth';
const TOKEN_KEY = 'qc-token';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      try {
        const res = await authAPI.getCurrentUser();
        const userData = res._id ? res : res.user;
        return { user: userData, token: storedToken };
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        return rejectWithValue('Token invalid');
      }
    } else {
      // Fallback to old storage format
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.token) {
            localStorage.setItem(TOKEN_KEY, parsed.token);
            return { user: parsed.user ?? null, token: parsed.token ?? null };
          }
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    return { user: null, token: null };
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authAPI.signin({ email, password });
      const { token, _id, name, isAdmin, email: userEmail, theme } = data;
      const user: User = { _id, name, email: userEmail, isAdmin, theme };
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      localStorage.setItem(TOKEN_KEY, token);
      
      message.success('Signed in successfully');
      return { user, token };
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage = err.message || 'Sign in failed';
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authAPI.signup({ name, email, password });
      const { token, _id, name: returnedName, isAdmin, email: userEmail, theme } = data;
      const user: User = { _id, name: returnedName, email: userEmail, isAdmin, theme };
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      localStorage.setItem(TOKEN_KEY, token);
      
      message.success('Account created');
      return { user, token };
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage = err.message || 'Sign up failed';
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      message.info('Signed out');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update stored user data
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }));
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.initialized = true;
      })
      // Sign in
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign up
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { signout, updateUser, clearError } = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user && !!state.auth.token;
export const selectIsAdmin = (state: RootState) => state.auth.user?.isAdmin ?? false;

// Export reducer
export default authSlice.reducer;
