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
  subscriptionPlan?: 'free' | 'basic' | 'pro' | 'enterprise' | 'trial';
  subscriptionStatus?: 'active' | 'inactive' | 'expired' | 'cancelled';
  isOnTrial?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
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

export interface AdminSubscription {
  _id: string;
  userId: AdminUser;
  planType: 'free' | 'basic' | 'pro' | 'enterprise' | 'trial';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: string;
  endDate?: string;
  paymentId?: AdminPayment;
  features: {
    maxQRCodes: number;
    maxScansPerQR: number;
    analytics: boolean;
    advancedAnalytics: boolean;
    customization: boolean;
    bulkOperations: boolean;
    apiAccess: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminPayment {
  _id: string;
  userId: AdminUser;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  planType: 'basic' | 'pro' | 'enterprise' | 'trial';
  planDuration: number;
  receipt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  adminId: AdminUser;
  adminEmail: string;
  action: 'USER_BLOCKED' | 'USER_UNBLOCKED' | 'USER_DELETED' | 'SUBSCRIPTION_UPDATED' | 'USER_SUBSCRIPTION_REFRESHED' | 'SYSTEM_CLEANUP' | 'LIMITS_ENFORCED' | 'UPDATE_PLAN_PRICES';
  targetUserId?: AdminUser;
  targetUserEmail?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SubscriptionStats {
  totalRevenue: number;
  activeSubscriptions: number;
  totalPayments: number;
  conversionRate: number;
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
  // Subscription state
  subscriptions: {
    stats: SubscriptionStats | null;
    subscriptions: AdminSubscription[];
    payments: AdminPayment[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    page: number;
    limit: number;
    totalSubs: number;
    totalPayments: number;
    search: string;
  };
  // Audit logs state
  auditLogs: {
    logs: AuditLog[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    page: number;
    limit: number;
    total: number;
    search: string;
    action?: string;
    adminId?: string;
    targetUserId?: string;
  };
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
  subscriptions: {
    stats: null,
    subscriptions: [],
    payments: [],
    loading: false,
    error: null,
    lastFetched: null,
    page: 1,
    limit: 20,
    totalSubs: 0,
    totalPayments: 0,
    search: '',
  },
  auditLogs: {
    logs: [],
    loading: false,
    error: null,
    lastFetched: null,
    page: 1,
    limit: 20,
    total: 0,
    search: '',
  },
};

// ============ Async Thunks ============

// Fetch admin users data with pagination
export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const requestedPage = params.page ?? 1;
      const requestedLimit = params.limit ?? 10;
      
      const res = await adminAPI.getUsersData({ 
        page: requestedPage, 
        limit: requestedLimit, 
        search: params.search 
      });
      const payload = (res?.data ?? res) as any;
      const list: AdminUserRow[] = Array.isArray(payload)
        ? payload
        : payload?.data ?? payload?.users ?? [];

      // Extract total from various possible response structures
      const extractTotal = (): number => {
        if (typeof payload?.total === 'number') return payload.total;
        if (typeof payload?.count === 'number') return payload.count;
        if (typeof payload?.pagination?.total === 'number') return payload.pagination.total;
        if (typeof payload?.pagination?.count === 'number') return payload.pagination.count;
        if (typeof payload?.meta?.total === 'number') return payload.meta.total;
        if (typeof payload?.totalCount === 'number') return payload.totalCount;
        if (typeof payload?.totalUsers === 'number') return payload.totalUsers;
        // If API returns totalPages instead of total, calculate it
        if (typeof payload?.totalPages === 'number') {
          return payload.totalPages * requestedLimit;
        }
        // Fallback: if current page is full, assume there might be more
        // Otherwise use list length
        return list.length;
      };

      return {
        items: list,
        page: requestedPage,
        limit: requestedLimit,
        total: extractTotal(),
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

// Fetch audit logs
export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (params: { page?: number; limit?: number; search?: string; action?: string; adminId?: string; targetUserId?: string } = {}, { rejectWithValue }) => {
    try {
      const requestedPage = params.page ?? 1;
      const requestedLimit = params.limit ?? 20;
      
      const res = await adminAPI.getAuditLogs({ 
        page: requestedPage, 
        limit: requestedLimit, 
        search: params.search,
        action: params.action,
        adminId: params.adminId,
        targetUserId: params.targetUserId
      });
      const payload = (res?.data ?? res) as any;
      const list: AuditLog[] = Array.isArray(payload)
        ? payload
        : payload?.data ?? payload?.logs ?? [];
      
      const extractTotal = () => {
        if (payload?.total !== undefined) return payload.total;
        if (payload?.totalCount !== undefined) return payload.totalCount;
        if (payload?.count !== undefined && payload?.totalPages !== undefined) {
          return payload.count * payload.totalPages;
        }
        // Fallback: if current page is full, assume there might be more
        // Otherwise use list length
        return list.length;
      };

      return {
        logs: list,
        page: requestedPage,
        limit: requestedLimit,
        total: extractTotal(),
        search: params.search ?? '',
        action: params.action,
        adminId: params.adminId,
        targetUserId: params.targetUserId,
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load audit logs');
    }
  }
);

// Fetch subscription and payment data
export const fetchAdminSubscriptions = createAsyncThunk(
  'admin/fetchSubscriptions',
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const requestedPage = params.page ?? 1;
      const requestedLimit = params.limit ?? 20;
      
      const res = await adminAPI.getSubscriptionsData({ 
        page: requestedPage, 
        limit: requestedLimit, 
        search: params.search 
      });
      const payload = res?.data ?? res;

      // Extract subscriptions data
      const subsData = payload.subscriptions?.data ?? payload.subscriptions ?? [];
      const paymentsData = payload.payments?.data ?? payload.payments ?? [];

      // Extract totals with fallbacks
      const extractSubsTotal = (): number => {
        if (typeof payload.subscriptions?.total === 'number') return payload.subscriptions.total;
        if (typeof payload.subscriptions?.count === 'number') return payload.subscriptions.count;
        if (typeof payload.subscriptions?.pagination?.total === 'number') return payload.subscriptions.pagination.total;
        if (typeof payload.totalSubscriptions === 'number') return payload.totalSubscriptions;
        return Array.isArray(subsData) ? subsData.length : 0;
      };

      const extractPaymentsTotal = (): number => {
        if (typeof payload.payments?.total === 'number') return payload.payments.total;
        if (typeof payload.payments?.count === 'number') return payload.payments.count;
        if (typeof payload.payments?.pagination?.total === 'number') return payload.payments.pagination.total;
        if (typeof payload.totalPayments === 'number') return payload.totalPayments;
        return Array.isArray(paymentsData) ? paymentsData.length : 0;
      };

      return {
        stats: payload.stats,
        subscriptions: Array.isArray(subsData) ? subsData : [],
        payments: Array.isArray(paymentsData) ? paymentsData : [],
        page: requestedPage,
        limit: requestedLimit,
        totalSubs: extractSubsTotal(),
        totalPayments: extractPaymentsTotal(),
        search: params.search ?? '',
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(err?.response?.data?.message || 'Failed to load subscription data');
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
    clearSubscriptionData: (state) => {
      state.subscriptions.subscriptions = [];
      state.subscriptions.payments = [];
      state.subscriptions.stats = null;
      state.subscriptions.lastFetched = null;
      state.subscriptions.error = null;
      state.subscriptions.page = 1;
      state.subscriptions.totalSubs = 0;
      state.subscriptions.totalPayments = 0;
      state.subscriptions.search = '';
    },
    setAdminSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSubscriptionSearch: (state, action: PayloadAction<string>) => {
      state.subscriptions.search = action.payload;
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
      })
      // Subscription data
      .addCase(fetchAdminSubscriptions.pending, (state) => {
        state.subscriptions.loading = true;
        state.subscriptions.error = null;
      })
      .addCase(fetchAdminSubscriptions.fulfilled, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.error = null;
        state.subscriptions.stats = action.payload.stats;
        state.subscriptions.subscriptions = action.payload.subscriptions;
        state.subscriptions.payments = action.payload.payments;
        state.subscriptions.page = action.payload.page;
        state.subscriptions.limit = action.payload.limit;
        state.subscriptions.totalSubs = action.payload.totalSubs;
        state.subscriptions.totalPayments = action.payload.totalPayments;
        state.subscriptions.search = action.payload.search;
        state.subscriptions.lastFetched = Date.now();
      })
      .addCase(fetchAdminSubscriptions.rejected, (state, action) => {
        state.subscriptions.loading = false;
        state.subscriptions.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      })
      // Audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLogs.loading = true;
        state.auditLogs.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs.loading = false;
        state.auditLogs.logs = action.payload.logs;
        state.auditLogs.page = action.payload.page;
        state.auditLogs.limit = action.payload.limit;
        state.auditLogs.total = action.payload.total;
        state.auditLogs.search = action.payload.search;
        state.auditLogs.action = action.payload.action;
        state.auditLogs.adminId = action.payload.adminId;
        state.auditLogs.targetUserId = action.payload.targetUserId;
        state.auditLogs.lastFetched = Date.now();
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLogs.loading = false;
        state.auditLogs.error = action.payload as string;
        if (action.payload !== 'unauthorized') {
          message.error(action.payload as string);
        }
      });
  },
});

export const { 
  clearAdminData, 
  clearSubscriptionData,
  setAdminSearch, 
  setSubscriptionSearch,
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
  const { lastFetched, loading, error } = state.admin;
  if (loading || error) return false;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > CACHE_DURATION;
};

// Subscription selectors
export const selectSubscriptionStats = (state: { admin: AdminState }) => state.admin.subscriptions.stats;
export const selectAdminSubscriptions = (state: { admin: AdminState }) => state.admin.subscriptions.subscriptions;
export const selectAdminPayments = (state: { admin: AdminState }) => state.admin.subscriptions.payments;
export const selectSubscriptionLoading = (state: { admin: AdminState }) => state.admin.subscriptions.loading;
export const selectSubscriptionError = (state: { admin: AdminState }) => state.admin.subscriptions.error;
export const selectSubscriptionPage = (state: { admin: AdminState }) => state.admin.subscriptions.page;
export const selectSubscriptionLimit = (state: { admin: AdminState }) => state.admin.subscriptions.limit;
export const selectSubscriptionTotalSubs = (state: { admin: AdminState }) => state.admin.subscriptions.totalSubs;
export const selectSubscriptionTotalPayments = (state: { admin: AdminState }) => state.admin.subscriptions.totalPayments;
export const selectSubscriptionSearch = (state: { admin: AdminState }) => state.admin.subscriptions.search;

// Audit logs selectors
export const selectAuditLogs = (state: { admin: AdminState }) => state.admin.auditLogs.logs;
export const selectAuditLogsLoading = (state: { admin: AdminState }) => state.admin.auditLogs.loading;
export const selectAuditLogsError = (state: { admin: AdminState }) => state.admin.auditLogs.error;
export const selectAuditLogsPage = (state: { admin: AdminState }) => state.admin.auditLogs.page;
export const selectAuditLogsLimit = (state: { admin: AdminState }) => state.admin.auditLogs.limit;
export const selectAuditLogsTotal = (state: { admin: AdminState }) => state.admin.auditLogs.total;
export const selectAuditLogsSearch = (state: { admin: AdminState }) => state.admin.auditLogs.search;

export default adminSlice.reducer;
