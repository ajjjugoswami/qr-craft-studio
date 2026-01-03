import { useState, useEffect } from 'react';
import { message } from 'antd';
import { paymentAPI } from '@/lib/paymentApi';
import { useAuth } from './useAuth';
import type { 
  Plans, 
  PaymentOrder, 
  Subscription, 
  PaymentHistory, 
  RazorpayOptions,
  RazorpayResponse 
} from '@/types/payment';

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const usePayment = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      const response = await paymentAPI.getPlans();
      if (response.success) {
        setPlans(response.plans);
      }
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      message.error('Failed to fetch plans');
    } finally {
      setPlansLoading(false);
    }
  };

  // Fetch subscription
  const fetchSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      const response = await paymentAPI.getSubscription();
      if (response.success) {
        setSubscription(response.subscription);
      }
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      message.error('Failed to fetch subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await paymentAPI.getPaymentHistory(page, limit);
      if (response.success) {
        setPaymentHistory(response.payments);
      }
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      message.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (planType: string, duration: number = 1): Promise<boolean> => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        message.error('Payment system is currently unavailable. Please try again.');
        return false;
      }

      // Create order
      const orderResponse = await paymentAPI.createOrder(planType, duration);
      if (!orderResponse.success) {
        message.error('Failed to create payment order');
        return false;
      }

      const order = orderResponse.order;

      return new Promise((resolve) => {
        const options: RazorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
          amount: order.amount,
          currency: order.currency,
          name: 'QR Studio',
          description: `${order.planName} - ${duration} month${duration > 1 ? 's' : ''}`,
          image: '/logo.png',
          order_id: order.id,
          handler: async (response: RazorpayResponse) => {
            try {
              const verifyResponse = await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.success) {
                message.success('Payment successful! Your subscription has been activated.');
                setSubscription(verifyResponse.subscription);
                resolve(true);
              } else {
                message.error('Payment verification failed. Please contact support.');
                resolve(false);
              }
            } catch (error: any) {
              console.error('Payment verification error:', error);
              message.error('Payment verification failed. Please contact support.');
              resolve(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.mobile || ''
          },
          notes: {
            planType,
            duration
          },
          theme: {
            color: '#6366f1'
          },
          modal: {
            ondismiss: () => {
              message.info('Payment cancelled');
              resolve(false);
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      });
    } catch (error: any) {
      console.error('Payment process error:', error);
      message.error('Payment failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await paymentAPI.cancelSubscription();
      
      if (response.success) {
        message.success('Subscription cancelled successfully');
        setSubscription(response.subscription);
        return true;
      } else {
        message.error('Failed to cancel subscription');
        return false;
      }
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      message.error('Failed to cancel subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has access to a feature
  const hasFeatureAccess = (feature: keyof Subscription['features']): boolean => {
    if (!subscription) return false;
    return subscription.features[feature] === true || subscription.features[feature] === -1;
  };

  // Get remaining QR codes
  const getRemainingQRCodes = (currentCount: number): number => {
    if (!subscription) return Math.max(0, 5 - currentCount); // Free plan default
    if (subscription.features.maxQRCodes === -1) return -1; // Unlimited
    return Math.max(0, subscription.features.maxQRCodes - currentCount);
  };

  // Check if upgrade is required
  const isUpgradeRequired = (currentQRCount: number): boolean => {
    if (!subscription) return currentQRCount >= 5; // Free plan limit
    if (subscription.features.maxQRCodes === -1) return false; // Unlimited
    return currentQRCount >= subscription.features.maxQRCodes;
  };

  // Initialize data on mount
  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  return {
    // Data
    plans,
    subscription,
    paymentHistory,
    
    // Loading states
    loading,
    plansLoading,
    subscriptionLoading,
    
    // Actions
    processPayment,
    cancelSubscription,
    fetchSubscription,
    fetchPaymentHistory,
    
    // Utilities
    hasFeatureAccess,
    getRemainingQRCodes,
    isUpgradeRequired
  };
};