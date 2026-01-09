import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { authAPI } from '@/lib/api';
import { clearQRCodes } from './qrCodesSlice';
import type { WhiteLabelConfig } from '@/context/authTypes';

// ============ Types ============
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  theme?: string;
  mobile?: string;
  country?: string;
  city?: string;
  profilePicture?: string;
  language?: string;
  timezone?: string;
  timeFormat?: '12' | '24';
  removeWatermark?: boolean;
  watermarkText?: string;
  whiteLabel?: WhiteLabelConfig;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  initializing: boolean;
}

const TOKEN_KEY = 'qc-token';
const STORAGE_KEY = 'qc_auth';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  initialized: false,
  initializing: false,
};

// ============ Async Thunks ============

// Initialize auth from storage
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
        // Token invalid
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        return { user: null, token: null };
      }
    }

    // Fallback to old storage format
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          localStorage.setItem(TOKEN_KEY, parsed.token);
        }
        return { user: parsed.user ?? null, token: parsed.token ?? null };
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return { user: null, token: null };
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as any;
      const auth = state.auth as AuthState;
      // Prevent duplicate /auth/me calls when multiple components mount at once
      return !auth.initialized && !auth.initializing;
    },
  }
);

// Sign in
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authAPI.signin({ email, password });
      const { token } = data;

      if (!token) {
        return rejectWithValue('No token returned from signin');
      }

      // Persist token immediately so subsequent calls include it
      localStorage.setItem(TOKEN_KEY, token);

      // Fetch canonical current user from /auth/me
      let profile: any = null;
      try {
        const me = await authAPI.getCurrentUser();
        profile = me._id ? me : me.user ? me.user : me;
      } catch (err) {
        // Fallback to data returned by signin
        profile = { 
          _id: data._id, 
          name: data.name, 
          email: data.email, 
          isAdmin: data.isAdmin, 
          theme: data.theme,
          mobile: data.mobile,
          country: data.country,
          city: data.city,
          profilePicture: data.profilePicture,
          language: data.language,
          timezone: data.timezone,
        };
      }

      const user: User = { 
        _id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        isAdmin: profile.isAdmin, 
        theme: profile.theme ?? 'orange',
        mobile: profile.mobile,
        country: profile.country,
        city: profile.city,
        profilePicture: profile.profilePicture,
        language: profile.language,
        timezone: profile.timezone,
      };

      // Persist user and token
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      try { localStorage.setItem('qc_theme', user.theme); } catch (e) { /* noop */ }

      return { user, token }; 
    } catch (error: any) {
      // Prefer server-provided message when available
      const serverMessage = error?.response?.data?.message || error?.response?.data || error?.message;
      return rejectWithValue(serverMessage || 'Sign in failed');
    }
  }
);

// Sign up
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password, verificationToken }: { name: string; email: string; password: string; verificationToken?: string }, { rejectWithValue }) => {
    try {
      const data = await authAPI.signup({ name, email, password, verificationToken });
      const { token } = data;

      if (!token) {
        return rejectWithValue('No token returned from signup');
      }

      // Persist token immediately
      localStorage.setItem(TOKEN_KEY, token);

      // Fetch canonical current user from /auth/me
      let profile: any = null;
      try {
        const me = await authAPI.getCurrentUser();
        profile = me._id ? me : me.user ? me.user : me;
      } catch (err) {
        // Fallback to data returned by signup
        profile = { 
          _id: data._id, 
          name: data.name || name, 
          email: data.email, 
          isAdmin: data.isAdmin, 
          theme: data.theme,
          mobile: data.mobile,
          country: data.country,
          city: data.city,
          profilePicture: data.profilePicture,
          language: data.language,
          timezone: data.timezone,
        };
      }

      const user: User = { 
        _id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        isAdmin: profile.isAdmin, 
        theme: profile.theme ?? 'orange',
        mobile: profile.mobile,
        country: profile.country,
        city: profile.city,
        profilePicture: profile.profilePicture,
        language: profile.language,
        timezone: profile.timezone,
      };

      // Persist user and token
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      try { localStorage.setItem('qc_theme', user.theme); } catch (e) { /* noop */ }

      return { user, token }; 
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.message;
      const errorCode = error?.response?.data?.code;
      
      // Handle specific error cases
      if (errorCode === 'EMAIL_VERIFICATION_REQUIRED' || errorCode === 'INVALID_VERIFICATION_TOKEN') {
        return rejectWithValue({
          message: serverMessage,
          requiresVerification: true,
          code: errorCode
        });
      }
      
      return rejectWithValue(serverMessage || 'Sign up failed');
    }
  }
);

// Google Sign In
export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async ({ credential }: { credential: string }, { rejectWithValue }) => {
    try {
      const data = await authAPI.googleAuth({ credential });
      const { token } = data;

      if (!token) {
        return rejectWithValue('No token returned from Google authentication');
      }

      // Persist token immediately
      localStorage.setItem(TOKEN_KEY, token);

      // Fetch canonical current user from /auth/me
      let profile: any = null;
      try {
        const me = await authAPI.getCurrentUser();
        profile = me._id ? me : me.user ? me.user : me;
      } catch (err) {
        // Fallback to data returned by google auth
        profile = { 
          _id: data._id, 
          name: data.name, 
          email: data.email, 
          isAdmin: data.isAdmin, 
          theme: data.theme,
          mobile: data.mobile,
          country: data.country,
          city: data.city,
          profilePicture: data.profilePicture,
          language: data.language,
          timezone: data.timezone,
        };
      }

      const user: User = { 
        _id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        isAdmin: profile.isAdmin, 
        theme: profile.theme ?? 'orange',
        mobile: profile.mobile,
        country: profile.country,
        city: profile.city,
        profilePicture: profile.profilePicture,
        language: profile.language,
        timezone: profile.timezone,
      };

      // Persist user and token
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      try { localStorage.setItem('qc_theme', user.theme); } catch (e) { /* noop */ }

      return { user, token };
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.message;
      return rejectWithValue(serverMessage || 'Google authentication failed');
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { name: string; mobile?: string; country?: string; city?: string }, { rejectWithValue }) => {
    try {
      const res = await authAPI.updateProfile(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

// ============ Slice ============
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('qc_theme');
      message.info('Signed out');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initializing = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
      })
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        message.success('Signed in successfully');
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        message.error(action.payload as string);
      })
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        message.success('Account created');
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        message.error(action.payload as string);
      })
      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        message.success('Signed in with Google successfully');
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        message.error(action.payload as string);
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          // The API returns { success: true, user: {...} }
          const updatedUser = action.payload.user || action.payload;
          state.user = { ...state.user, ...updatedUser };
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, token: state.token }));
          message.success('Profile updated');
        }
      });
  },
});

export const { signOut, updateUser } = authSlice.actions;

// ============ Selectors ============
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.user;
export const selectAuthInitialized = (state: { auth: AuthState }) => state.auth.initialized;
export const selectAuthInitializing = (state: { auth: AuthState }) => state.auth.initializing;

export default authSlice.reducer;
