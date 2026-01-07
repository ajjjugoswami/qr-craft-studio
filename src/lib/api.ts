import axios from 'axios';

// export const API_URL = 'http://localhost:3000/api';
export const API_URL = 'https://be-link-generator.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (use `qc-token` key)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qc-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler for auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';

    // Only auto-logout/redirect for 401s on protected routes (when token exists)
    const hasToken = !!localStorage.getItem('qc-token');
    const isAuthEndpoint = url.includes('/auth/signin') || url.includes('/auth/signup');

    if (status === 401 && hasToken && !isAuthEndpoint) {
      // clear stored auth and redirect to signin
      try {
        localStorage.removeItem('qc_auth');
        localStorage.removeItem('qc-token');
      } catch (e) {
        // ignore
        console.warn('Failed to clear local auth:', e);
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string; verificationToken?: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  
  signin: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  googleAuth: async (data: { credential: string }) => {
    const response = await api.post('/auth/google-auth', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Get current user (me)
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user theme
  updateTheme: async (theme: string) => {
    const response = await api.put('/auth/theme', { theme });
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: FormData | { name: string; mobile?: string; country?: string; city?: string; language?: string; timezone?: string }) => {
    const isFormData = data instanceof FormData;
    const response = await api.put('/auth/profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },

  // OTP-related methods
  sendVerificationOTP: async (email: string) => {
    const response = await api.post('/auth/send-verification-otp', { email });
    return response.data;
  },

  sendResetOTP: async (email: string) => {
    const response = await api.post('/auth/send-reset-otp', { email });
    return response.data;
  },

  verifyEmailOTP: async (email: string, otp: string) => {
    const response = await api.post('/auth/verify-email-otp', { email, otp });
    return response.data;
  },

  verifyResetOTP: async (email: string, otp: string, newPassword: string) => {
    const response = await api.post('/auth/verify-reset-otp', { email, otp, newPassword });
    return response.data;
  },


};

// QR Code API
export const qrCodeAPI = {
  // Get all QR codes for current user with optional pagination and search
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/qrcodes', { params });
    return response.data;
  },

  // Get single QR code
  getOne: async (id: string) => {
    const response = await api.get(`/qrcodes/${id}`);
    return response.data;
  },

  // Create new QR code
  create: async (data: {
    type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'location' | 'upi' | 'vcard' | 'instagram' | 'facebook' | 'youtube' | 'whatsapp' | 'image';
    content: string;
    name: string;
    template?: {
      id: string;
      name: string;
      backgroundColor: string;
      textColor: string;
      title: string;
      subtitle: string;
      titleFontSize?: number;
      subtitleFontSize?: number;
      titleFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
      subtitleFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
      fontFamily?: string;
      textAlign?: 'left' | 'center' | 'right';
      qrPosition?: 'bottom' | 'center' | 'top';
      borderRadius?: number;
      showGradient?: boolean;
      gradientColor?: string;
      gradientDirection?: 'to-bottom' | 'to-right' | 'to-bottom-right' | 'to-top-right';
      padding?: number;
      shadowIntensity?: 'none' | 'light' | 'medium' | 'strong';
      decorativeStyle?: 'none' | 'circles' | 'dots' | 'lines' | 'geometric';
      accentColor?: string;
    };
    styling?: {
      fgColor: string;
      bgColor: string;
      size: number;
      level: 'L' | 'M' | 'Q' | 'H';
      includeMargin: boolean;
    };
    previewImage?: string;
  }) => {
    const response = await api.post('/qrcodes', data);
    return response.data;
  },

  // Update QR code
  update: async (id: string, data: any) => {
    const response = await api.put(`/qrcodes/${id}`, data);
    return response.data;
  },

  // Delete QR code
  delete: async (id: string) => {
    const response = await api.delete(`/qrcodes/${id}`);
    return response.data;
  },

  // Increment scan count
  incrementScan: async (id: string) => {
    const response = await api.post(`/qrcodes/${id}/scan`);
    return response.data;
  },

  // Get scans for a QR code
  getScans: async (id: string) => {
    const response = await api.get(`/qrcodes/${id}/scans`);
    return response.data;
  },

  // Get analytics for a QR code
  getAnalytics: async (id: string) => {
    const response = await api.get(`/qrcodes/${id}/analytics`);
    return response.data;
  },
  
  // Track scan (for redirect page)
  trackScan: async (id: string) => {
    const response = await api.post(`/qrcodes/${id}/scan`);
    return response.data;
  },

  // Get stats (total counts, not affected by search)
  getStats: async () => {
    const response = await api.get('/qrcodes/stats');
    return response.data;
  },
};

// Uploads API
export const uploadsAPI = {
  uploadLogo: async (dataUrl: string) => {
    const response = await api.post('/uploads/logo', { dataUrl });
    return response.data;
  },
  uploadQRImage: async (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    const response = await api.post('/uploads/qr-image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deleteQRImage: async (publicId: string) => {
    const response = await api.post('/uploads/qr-image/remove', { publicId });
    return response.data;
  },
};

// Scans API
export const scansAPI = {
  // Get all scans for current user
  getAll: async () => {
    const response = await api.get('/scans');
    return response.data;
  },
  
  // Get aggregated analytics for the current user (across all QR codes)
  getAnalytics: async () => {
    const response = await api.get('/scans/analytics');
    return response.data;
  },

  // Get scans by QR code ID
  getByQRCodeId: async (id: string) => {
    const response = await api.get(`/qrcodes/${id}/scans`);
    return response.data;
  },

  // Combined advanced analytics endpoint
  getAdvancedAnalytics: async (id?: string) => {
    const url = id ? `/scans/analytics/advanced/${id}` : '/scans/analytics/advanced';
    const response = await api.get(url);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Get all users and their QR codes (admin only)
  getUsersData: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get subscriptions and payments data (admin only)
  getSubscriptionsData: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/subscriptions', { params });
    return response.data;
  },

  // Get audit logs (admin only)
  getAuditLogs: async (params?: { page?: number; limit?: number; search?: string; action?: string; adminId?: string; targetUserId?: string }) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  // Get plan prices (admin only)
  getPlanPrices: async () => {
    const response = await api.get('/admin/plan-prices');
    return response.data;
  },

  // Update plan prices (admin only)
  updatePlanPrices: async (data: { basic: { monthlyPrice: number; yearlyPrice: number }; pro: { monthlyPrice: number; yearlyPrice: number } }) => {
    const response = await api.put('/admin/plan-prices', data);
    return response.data;
  },

  // Admin user management
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: { blocked?: boolean }) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  create: async (data: { name: string; email: string; subject: string; message: string }) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/contacts/${id}`, { status });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

export default api;

