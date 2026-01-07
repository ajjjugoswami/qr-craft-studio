import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { qrCodeAPI } from '@/lib/api';
import { QRCodeData, defaultTemplates, defaultStyling } from '@/types/qrcode';

// ============ Types ============
interface LimitErrorData {
  success: boolean;
  message: string;
  upgradeRequired: boolean;
  currentPlan: string;
  currentCount: number;
  maxAllowed: number;
}

interface QRCodesState {
  items: QRCodeData[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  // Limit error handling
  limitError: LimitErrorData | null;
  showLimitDialog: boolean;
  // Pagination metadata
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const initialState: QRCodesState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
  limitError: null,
  showLimitDialog: false,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

// ============ Async Thunks ============

// Fetch QR codes with optional pagination and search
export const fetchQRCodes = createAsyncThunk(
  'qrCodes/fetchAll',
  async (params: { page?: number; limit?: number; search?: string } = {}, { getState, rejectWithValue }) => {
    try {
      const res = await qrCodeAPI.getAll(params);
      const list: QRCodeData[] = (res.qrCodes || []).map((q: any) => ({
        id: q._id,
        name: q.name,
        type: q.type,
        content: q.content,
        template: q.template && Object.keys(q.template).length ? q.template : null,
        styling: q.styling && Object.keys(q.styling).length ? q.styling : defaultStyling,
        createdAt: q.createdAt,
        scans: q.scanCount || 0,
        status: q.status || 'active',
        previewImage: q.previewImage ?? null,
        password: q.password ?? null,
        expirationDate: q.expirationDate ?? q.expirationdate ?? null,
        scanLimit: q.scanLimit ?? q.scanlimit ?? null,
      }));

      return {
        items: list,
        page: res.page || params.page || 1,
        limit: res.limit || params.limit || 10,
        total: res.total || 0,
        totalPages: res.totalPages || Math.max(1, Math.ceil((res.total || 0) / (res.limit || params.limit || 10))),
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load QR codes');
    }
  }
);

// Fetch single QR code
export const fetchQRCode = createAsyncThunk(
  'qrCodes/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await qrCodeAPI.getOne(id);
      const q = res.qrCode;
      const qrCode: QRCodeData = {
        id: q._id,
        name: q.name,
        type: q.type,
        content: q.content,
        template: q.template && Object.keys(q.template).length ? q.template : null,
        styling: q.styling && Object.keys(q.styling).length ? q.styling : defaultStyling,
        createdAt: q.createdAt,
        scans: q.scanCount || 0,
        status: q.status || 'active',
        previewImage: q.previewImage ?? null,
        password: q.password ?? null,
        expirationDate: q.expirationDate ?? q.expirationdate ?? null,
        scanLimit: q.scanLimit ?? q.scanlimit ?? null,
        whiteLabel: q.whiteLabel || null,
      };
      return qrCode;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load QR code');
    }
  }
);

// Create QR code
export const createQRCode = createAsyncThunk(
  'qrCodes/create',
  async (qrInput: Partial<QRCodeData> & { previewImage?: string }, { rejectWithValue }) => {
    try {
      const payload = {
        type: qrInput.type,
        content: qrInput.content,
        name: qrInput.name,
        template: qrInput.template,
        styling: qrInput.styling,
        previewImage: qrInput.previewImage,
        password: (qrInput as any).password || null,
        expirationDate: (qrInput as any).expirationDate || null,
        scanLimit: (qrInput as any).scanLimit || null,
      };

      const res = await qrCodeAPI.create(payload as any);
      const created = res.qrCode;

      const qr: QRCodeData = {
        id: created._id,
        name: created.name,
        type: created.type,
        content: created.content,
        template: created.template || null,
        styling: created.styling || defaultStyling,
        createdAt: created.createdAt,
        scans: created.scanCount || 0,
        status: created.status || 'active',
        previewImage: created.previewImage ?? null,
        password: created.password ?? null,
        expirationDate: created.expirationDate ?? created.expirationdate ?? null,
        scanLimit: created.scanLimit ?? created.scanlimit ?? null,
      };

      return qr;
    } catch (err: any) {
      // Check if this is a limit error
      const errorData = err?.response?.data;
      if (
        errorData &&
        errorData.success === false &&
        errorData.upgradeRequired === true &&
        typeof errorData.currentCount === 'number' &&
        typeof errorData.maxAllowed === 'number'
      ) {
        // Return the full error data for limit errors
        return rejectWithValue({ 
          isLimitError: true, 
          limitData: errorData,
          message: errorData.message || 'QR code limit reached'
        });
      }
      
      // Regular error
      return rejectWithValue({ 
        isLimitError: false, 
        message: errorData?.message || 'Failed to save QR code' 
      });
    }
  }
);

// Update QR code
export const updateQRCode = createAsyncThunk(
  'qrCodes/update',
  async ({ id, data }: { id: string; data: Partial<QRCodeData> }, { rejectWithValue }) => {
    try {
      const res = await qrCodeAPI.update(id, data);
      const updatedQR = res.qrCode;
      
      const qr: QRCodeData = {
        id: updatedQR._id,
        name: updatedQR.name,
        type: updatedQR.type,
        content: updatedQR.content,
        template: updatedQR.template || null,
        styling: updatedQR.styling || defaultStyling,
        createdAt: updatedQR.createdAt,
        scans: updatedQR.scanCount || 0,
        status: updatedQR.status || 'active',
        previewImage: updatedQR.previewImage ?? null,
        password: updatedQR.password ?? null,
        expirationDate: updatedQR.expirationDate ?? updatedQR.expirationdate ?? null,
        scanLimit: updatedQR.scanLimit ?? updatedQR.scanlimit ?? null,
      };
      
      return qr;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update QR code');
    }
  }
);

// Note: fetchStats has been moved to statsSlice.ts
// Import from '@/store/slices/statsSlice' instead

// Delete QR code
export const deleteQRCode = createAsyncThunk(
  'qrCodes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await qrCodeAPI.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete QR code');
    }
  }
);

// ============ Slice ============
const qrCodesSlice = createSlice({
  name: 'qrCodes',
  initialState,
  reducers: {
    clearQRCodes: (state) => {
      state.items = [];
      state.lastFetched = null;
      state.error = null;
      state.limitError = null;
      state.showLimitDialog = false;
      state.page = 1;
      state.total = 0;
      state.totalPages = 1;
    },
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    showLimitDialog: (state, action: PayloadAction<LimitErrorData>) => {
      state.limitError = action.payload;
      state.showLimitDialog = true;
    },
    hideLimitDialog: (state) => {
      state.limitError = null;
      state.showLimitDialog = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchQRCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQRCodes.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.page = action.payload.page || state.page;
        state.limit = action.payload.limit || state.limit;
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.lastFetched = Date.now();
      })
      .addCase(fetchQRCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      })
      // Fetch one
      .addCase(fetchQRCode.fulfilled, (state, action) => {
        const index = state.items.findIndex((q) => q.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      // Create
      .addCase(createQRCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createQRCode.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        
        if (payload?.isLimitError && payload?.limitData) {
          // Handle limit error - store the data and show dialog
          state.limitError = payload.limitData;
          state.showLimitDialog = true;
        } else {
          // Handle regular error - show message
          const errorMessage = payload?.message || action.payload as string;
          message.error(errorMessage);
        }
      })
      // Update
      .addCase(updateQRCode.fulfilled, (state, action) => {
        const index = state.items.findIndex((q) => q.id === action.payload.id);
        if (index >= 0) {
          state.items[index] = action.payload;
        }
        message.success('QR Code updated');
      })
      .addCase(updateQRCode.rejected, (state, action) => {
        message.error(action.payload as string);
      })
      // Delete
      .addCase(deleteQRCode.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q.id !== action.payload);
        message.success('QR Code deleted');
      })
      .addCase(deleteQRCode.rejected, (state, action) => {
        message.error(action.payload as string);
      });
      // Note: fetchStats is handled in statsSlice.ts
  },
});

export const { clearQRCodes, invalidateCache, showLimitDialog, hideLimitDialog } = qrCodesSlice.actions;

// ============ Selectors ============
export const selectQRCodes = (state: { qrCodes: QRCodesState }) => state.qrCodes.items;
export const selectQRCodesLoading = (state: { qrCodes: QRCodesState }) => state.qrCodes.loading;
export const selectQRCodesPage = (state: { qrCodes: QRCodesState }) => state.qrCodes.page;
export const selectQRCodesLimit = (state: { qrCodes: QRCodesState }) => state.qrCodes.limit;
export const selectQRCodesTotal = (state: { qrCodes: QRCodesState }) => state.qrCodes.total;
export const selectQRCodesTotalPages = (state: { qrCodes: QRCodesState }) => state.qrCodes.totalPages;
export const selectLimitError = (state: { qrCodes: QRCodesState }) => state.qrCodes.limitError;
export const selectShowLimitDialog = (state: { qrCodes: QRCodesState }) => state.qrCodes.showLimitDialog;
// Deprecated: Use stats slice selectors instead
export const selectQRCodesTotalScans = (state: { qrCodes: QRCodesState }) => 0;
export const selectQRCodesTotalActive = (state: { qrCodes: QRCodesState }) => 0;
export const selectQRCodeById = (id: string) => (state: { qrCodes: QRCodesState }) =>
  state.qrCodes.items.find((q) => q.id === id);
export const selectShouldFetchQRCodes = (state: { qrCodes: QRCodesState }) => {
  const { lastFetched, loading, error } = state.qrCodes;
  if (loading || error) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default qrCodesSlice.reducer;
