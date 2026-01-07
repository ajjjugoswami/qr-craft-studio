import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { qrCodeAPI } from '@/lib/api';

// ============ Types ============
interface StatsState {
  total: number;
  totalScans: number;
  totalActive: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const initialState: StatsState = {
  total: 0,
  totalScans: 0,
  totalActive: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

// ============ Async Thunks ============

// Fetch stats (separate from QR codes list)
export const fetchStats = createAsyncThunk(
  'stats/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await qrCodeAPI.getStats();
      return {
        total: res.total || 0,
        totalScans: res.totalScans || 0,
        totalActive: res.totalActive || 0,
      };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load stats');
    }
  }
);

// ============ Slice ============
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.total = 0;
      state.totalScans = 0;
      state.totalActive = 0;
      state.lastFetched = null;
      state.error = null;
    },
    invalidateStatsCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.total = action.payload.total || 0;
        state.totalScans = action.payload.totalScans || 0;
        state.totalActive = action.payload.totalActive || 0;
        state.lastFetched = Date.now();
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStats, invalidateStatsCache } = statsSlice.actions;

// ============ Selectors ============
export const selectStatsTotal = (state: { stats: StatsState }) => state.stats.total;
export const selectStatsTotalScans = (state: { stats: StatsState }) => state.stats.totalScans;
export const selectStatsTotalActive = (state: { stats: StatsState }) => state.stats.totalActive;
export const selectStatsLoading = (state: { stats: StatsState }) => state.stats.loading;
export const selectStatsError = (state: { stats: StatsState }) => state.stats.error;
export const selectShouldFetchStats = (state: { stats: StatsState }) => {
  const { lastFetched, loading, error } = state.stats;
  if (loading || error) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default statsSlice.reducer;
