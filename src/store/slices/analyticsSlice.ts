import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { scansAPI } from '@/lib/api';
import { AdvancedAnalytics } from '@/types/analytics';

// ============ Types ============
interface ScanRecord {
  id: string;
  qrCodeId: string;
  createdAt: string;
  device?: { type: string; vendor?: string; model?: string };
  browser?: { name: string; version?: string };
  os?: { name: string; version?: string };
  location?: { city?: string; region?: string; country?: string; lat?: number; lng?: number };
  ip?: string;
}

interface AnalyticsData {
  totalScans: number;
  analytics: {
    scansByDate?: Record<string, number>;
    devices?: Record<string, number>;
    browsers?: Record<string, number>;
    countries?: Record<string, number>;
    topQRCodes?: Array<{ name: string; count: number }>;
  };
}

interface AnalyticsState {
  scans: ScanRecord[];
  analytics: AnalyticsData | null;
  advancedAnalytics: AdvancedAnalytics | null;
  loading: boolean;
  advancedLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: AnalyticsState = {
  scans: [],
  analytics: null,
  advancedAnalytics: null,
  loading: false,
  advancedLoading: false,
  error: null,
  lastFetched: null,
};

// ============ Async Thunks ============

// Fetch all scans and analytics
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [scanRes, analyticsRes] = await Promise.all([
        scansAPI.getAll(),
        scansAPI.getAnalytics(),
      ]);

      return {
        scans: scanRes.scans || [],
        analytics: analyticsRes,
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load analytics');
    }
  }
);

// Fetch advanced analytics
export const fetchAdvancedAnalytics = createAsyncThunk(
  'analytics/fetchAdvanced',
  async (qrCodeId: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const data = await scansAPI.getAdvancedAnalytics(qrCodeId);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load advanced analytics');
    }
  }
);

// ============ Slice ============
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.scans = [];
      state.analytics = null;
      state.advancedAnalytics = null;
      state.lastFetched = null;
      state.error = null;
    },
    invalidateAnalyticsCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.scans = action.payload.scans;
        state.analytics = action.payload.analytics;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.lastFetched = Date.now(); // Prevent immediate retries on failure
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      })
      .addCase(fetchAdvancedAnalytics.pending, (state) => {
        state.advancedLoading = true;
      })
      .addCase(fetchAdvancedAnalytics.fulfilled, (state, action) => {
        state.advancedLoading = false;
        state.advancedAnalytics = action.payload;
      })
      .addCase(fetchAdvancedAnalytics.rejected, (state, action) => {
        state.advancedLoading = false;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      });
  },
});

export const { clearAnalytics, invalidateAnalyticsCache } = analyticsSlice.actions;

// ============ Selectors ============
export const selectScans = (state: { analytics: AnalyticsState }) => state.analytics.scans;
export const selectAnalyticsData = (state: { analytics: AnalyticsState }) => state.analytics.analytics;
export const selectAnalyticsLoading = (state: { analytics: AnalyticsState }) => state.analytics.loading;
export const selectAdvancedAnalytics = (state: { analytics: AnalyticsState }) => state.analytics.advancedAnalytics;
export const selectAdvancedLoading = (state: { analytics: AnalyticsState }) => state.analytics.advancedLoading;
export const selectShouldFetchAnalytics = (state: { analytics: AnalyticsState }) => {
  const { lastFetched, loading, error } = state.analytics;
  if (loading || error) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default analyticsSlice.reducer;
