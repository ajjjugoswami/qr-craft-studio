import api from './api';
import type { 
  Plans, 
  PaymentOrder, 
  PaymentVerificationData, 
  Subscription, 
  PaymentHistory 
} from '@/types/payment';

export const paymentAPI = {
  // Get available plans
  getPlans: async (): Promise<{ success: boolean; plans: Plans }> => {
    const response = await api.get('/payments/plans');
    return response.data;
  },

  // Create payment order
  createOrder: async (planType: string, duration: number = 1): Promise<{ success: boolean; order: PaymentOrder }> => {
    const response = await api.post('/payments/create-order', {
      planType,
      duration
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (data: PaymentVerificationData): Promise<{ success: boolean; message: string; subscription: Subscription }> => {
    const response = await api.post('/payments/verify', data);
    return response.data;
  },

  // Get current subscription
  getSubscription: async (): Promise<{ success: boolean; subscription: Subscription }> => {
    const response = await api.get('/payments/subscription');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    payments: PaymentHistory[];
    pagination: {
      total: number;
      pages: number;
      page: number;
      limit: number;
    };
  }> => {
    const response = await api.get(`/payments/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<{ success: boolean; message: string; subscription: Subscription }> => {
    const response = await api.post('/payments/cancel');
    return response.data;
  }
};