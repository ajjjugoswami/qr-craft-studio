import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { adminAPI } from '@/lib/api';

// ============ Types ============
export interface AdminUser {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  createdAt?: string | null;
  blocked?: boolean;
  profilePicture?: string;
}

export interface AdminQRCode {
  _id: string;
  name?: string;
  type?: string;
  content?: string | null;
  scanCount?: number;
  createdAt?: string | null;
  status?: string;
}

export interface AdminUserRow {
  user: AdminUser;
  qrcodes: AdminQRCode[];
}

interface AdminState {
  items: AdminUserRow[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  // Pagination
  page: number;
  limit: number;
  total: number;
  search: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: AdminState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
  page: 1,
  limit: 10,
  total: 0,
  search: '',
};

// ============ Async Thunks ============

// Fetch admin users data with pagination
export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const res = await adminAPI.getUsersData(params);
      const payload = (res?.data ?? res) as any;
      const list: AdminUserRow[] = Array.isArray(payload)
        ? payload
        : payload?.data ?? [];

      return {
        items: list,
        page: payload?.page ?? params.page ?? 1,
        limit: payload?.limit ?? params.limit ?? 10,
        total: payload?.total ?? (Array.isArray(payload) ? list.length : payload?.count ?? 0),
        search: params.search ?? '',
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load admin data');
    }
  }
);

// Block/unblock user
export const toggleUserBlock = createAsyncThunk(
  'admin/toggleBlock',
  async ({ userId, blocked }: { userId: string; blocked: boolean }, { rejectWithValue }) => {
    try {
      await adminAPI.updateUser(userId, { blocked });
      return { userId, blocked };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Action failed');
    }
  }
);

// Delete user
export const deleteAdminUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Delete failed');
    }
  }
);

// ============ Slice ============
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminData: (state) => {
      state.items = [];
      state.lastFetched = null;
      state.error = null;
      state.page = 1;
      state.total = 0;
      state.search = '';
    },
    setAdminSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    invalidateAdminCache: (state) => {
      state.lastFetched = null;
    },
    // Optimistic update for blocking
    optimisticToggleBlock: (state, action: PayloadAction<{ userId: string; blocked: boolean }>) => {
      const { userId, blocked } = action.payload;
      const row = state.items.find((r) => r.user._id === userId);
      if (row) {
        row.user.blocked = blocked;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.search = action.payload.search;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      })
      // Toggle block
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const { userId, blocked } = action.payload;
        const row = state.items.find((r) => r.user._id === userId);
        if (row) {
          row.user.blocked = blocked;
        }
        message.success(`User ${blocked ? 'blocked' : 'unblocked'}`);
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        message.error(action.payload as string);
      })
      // Delete user
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.user._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        message.success('User deleted');
      })
      .addCase(deleteAdminUser.rejected, (_, action) => {
        message.error(action.payload as string);
      });
  },
});

export const { 
  clearAdminData, 
  setAdminSearch, 
  invalidateAdminCache,
  optimisticToggleBlock,
} = adminSlice.actions;

// ============ Selectors ============
export const selectAdminUsers = (state: { admin: AdminState }) => state.admin.items;
export const selectAdminLoading = (state: { admin: AdminState }) => state.admin.loading;
export const selectAdminError = (state: { admin: AdminState }) => state.admin.error;
export const selectAdminPage = (state: { admin: AdminState }) => state.admin.page;
export const selectAdminLimit = (state: { admin: AdminState }) => state.admin.limit;
export const selectAdminTotal = (state: { admin: AdminState }) => state.admin.total;
export const selectAdminSearch = (state: { admin: AdminState }) => state.admin.search;
export const selectShouldFetchAdmin = (state: { admin: AdminState }) => {
  const { lastFetched, loading } = state.admin;
  if (loading) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

export default adminSlice.reducer;
