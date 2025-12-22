import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { qrCodeAPI } from '@/lib/api';
import { QRCodeData, defaultTemplates, defaultStyling } from '@/types/qrcode';

// ============ Types ============
interface QRCodesState {
  items: QRCodeData[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const initialState: QRCodesState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// ============ Async Thunks ============

// Fetch all QR codes
export const fetchQRCodes = createAsyncThunk(
  'qrCodes/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await qrCodeAPI.getAll();
      const list: QRCodeData[] = (res.qrCodes || []).map((q: any) => ({
        id: q._id,
        name: q.name,
        type: q.type,
        content: q.content,
        template: q.template && Object.keys(q.template).length ? q.template : defaultTemplates[0],
        styling: q.styling && Object.keys(q.styling).length ? q.styling : defaultStyling,
        createdAt: q.createdAt,
        scans: q.scanCount || 0,
        status: q.status || 'active',
      }));
      return list;
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
        template: q.template && Object.keys(q.template).length ? q.template : defaultTemplates[0],
        styling: q.styling && Object.keys(q.styling).length ? q.styling : defaultStyling,
        createdAt: q.createdAt,
        scans: q.scanCount || 0,
        status: q.status || 'active',
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
        template: created.template || defaultTemplates[0],
        styling: created.styling || defaultStyling,
        createdAt: created.createdAt,
        scans: created.scanCount || 0,
        status: created.status || 'active',
      };

      return qr;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to save QR code');
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
        template: updatedQR.template || defaultTemplates[0],
        styling: updatedQR.styling || defaultStyling,
        createdAt: updatedQR.createdAt,
        scans: updatedQR.scanCount || 0,
        status: updatedQR.status || 'active',
      };
      
      return qr;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update QR code');
    }
  }
);

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
    },
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchQRCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQRCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
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
        message.error(action.payload as string);
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
  },
});

export const { clearQRCodes, invalidateCache } = qrCodesSlice.actions;

// ============ Selectors ============
export const selectQRCodes = (state: { qrCodes: QRCodesState }) => state.qrCodes.items;
export const selectQRCodesLoading = (state: { qrCodes: QRCodesState }) => state.qrCodes.loading;
export const selectQRCodeById = (id: string) => (state: { qrCodes: QRCodesState }) =>
  state.qrCodes.items.find((q) => q.id === id);
export const selectShouldFetchQRCodes = (state: { qrCodes: QRCodesState }) => {
  const { lastFetched, loading } = state.qrCodes;
  if (loading) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default qrCodesSlice.reducer;
