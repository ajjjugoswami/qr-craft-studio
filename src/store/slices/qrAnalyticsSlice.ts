import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { qrCodeAPI } from '@/lib/api';
import type { ScanData } from '@/types/qrcode';

// ============ Types ============
interface QRAnalyticsData {
  totalScans: number;
  analytics: {
    scansByDate?: Record<string, number>;
    devices?: Record<string, number>;
    browsers?: Record<string, number>;
    countries?: Record<string, number>;
  };
}

interface QRAnalyticsEntry {
  qrCodeId: string;
  scans: ScanData[];
  analytics: QRAnalyticsData | null;
  lastFetched: number;
}

interface QRAnalyticsState {
  entries: Record<string, QRAnalyticsEntry>;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: QRAnalyticsState = {
  entries: {},
  loading: false,
  error: null,
};

// ============ Async Thunks ============

// Fetch analytics for a specific QR code
export const fetchQRAnalytics = createAsyncThunk(
  'qrAnalytics/fetch',
  async (qrCodeId: string, { rejectWithValue }) => {
    try {
      const [analyticsRes, scansRes] = await Promise.all([
        qrCodeAPI.getAnalytics(qrCodeId),
        qrCodeAPI.getScans(qrCodeId),
      ]);

      const scans: ScanData[] = (scansRes.scans || []).map((s: any) => ({
        id: s._id,
        date: new Date(s.createdAt).toLocaleDateString('en-GB'),
        time: new Date(s.createdAt).toLocaleTimeString('en-GB'),
        browser: `${s.browser?.name ?? 'Unknown'} ${s.browser?.version ?? ''}`.trim(),
        os: `${s.os?.name ?? 'Unknown'} ${s.os?.version ?? ''}`.trim(),
        deviceType: s.device?.type || 'desktop',
        deviceVendor: s.device?.vendor || '',
        deviceModel: s.device?.model || '',
        ipAddress: s.ip || s.ipAddress || '',
        location: {
          city: s.location?.city || '',
          region: s.location?.region || '',
          country: s.location?.country || '',
          lat: s.location?.latitude || s.location?.lat || 0,
          lng: s.location?.longitude || s.location?.lng || 0,
          timezone: s.location?.timezone || '',
        },
      }));

      return {
        qrCodeId,
        scans,
        analytics: analyticsRes.analytics ? analyticsRes : { success: true, totalScans: 0, analytics: {} },
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load analytics');
    }
  }
);

// ============ Slice ============
const qrAnalyticsSlice = createSlice({
  name: 'qrAnalytics',
  initialState,
  reducers: {
    clearQRAnalytics: (state) => {
      state.entries = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQRAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQRAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.entries[action.payload.qrCodeId] = {
          qrCodeId: action.payload.qrCodeId,
          scans: action.payload.scans,
          analytics: action.payload.analytics,
          lastFetched: Date.now(),
        };
      })
      .addCase(fetchQRAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      });
  },
});

export const { clearQRAnalytics } = qrAnalyticsSlice.actions;

// ============ Selectors ============
export const selectQRAnalyticsLoading = (state: { qrAnalytics: QRAnalyticsState }) => state.qrAnalytics.loading;
export const selectQRAnalyticsEntry = (qrCodeId: string) => (state: { qrAnalytics: QRAnalyticsState }) =>
  state.qrAnalytics.entries[qrCodeId];
export const selectShouldFetchQRAnalytics = (qrCodeId: string) => (state: { qrAnalytics: QRAnalyticsState }) => {
  const entry = state.qrAnalytics.entries[qrCodeId];
  if (state.qrAnalytics.loading) return false;
  if (!entry) return true;
  return Date.now() - entry.lastFetched > CACHE_DURATION;
};

export default qrAnalyticsSlice.reducer;
