import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { message } from 'antd';
import confetti from 'canvas-confetti';
import { paymentAPI } from '@/lib/paymentApi';
import { useAuth } from '@/hooks/useAuth';
import type {
  Plans,
  Subscription,
  PaymentHistory,
  RazorpayOptions,
  RazorpayResponse,
} from '@/types/payment';

// --- In-flight request dedupe (prevents multi-mount / fast-refresh duplicates) ---
let plansInFlight: Promise<void> | null = null;
const subscriptionInFlightByUser = new Map<string, Promise<void>>();

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

interface SubscriptionContextType {
  plans: Plans | null;
  subscription: Subscription | null;
  paymentHistory: PaymentHistory[];
  loading: boolean;
  plansLoading: boolean;
  subscriptionLoading: boolean;
  processPayment: (planType: string, duration?: number) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  refreshSubscriptionFeatures: () => Promise<void>;
  fetchPaymentHistory: (page?: number, limit?: number) => Promise<void>;
  downloadInvoice: (paymentId: string) => Promise<void>;
  hasFeatureAccess: (feature: keyof Subscription['features']) => boolean;
  getRemainingQRCodes: (currentCount: number) => number;
  isUpgradeRequired: (currentQRCount: number) => boolean;
  getPlanDisplayName: () => string;
  getPlanStatus: () => string;
  isOnTrial: () => boolean;
  getTrialDaysRemaining: () => number | null;
  getTrialEndDate: () => Date | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userId = user?._id ?? null;

  const [plans, setPlans] = useState<Plans | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Refs to prevent duplicate calls per mount
  const plansFetchedRef = useRef(false);
  const subscriptionFetchedForUserRef = useRef<string | null>(null);

  // Fetch plans (deduped across mounts)
  useEffect(() => {
    const run = async () => {
      if (plansFetchedRef.current) return;

      // If another mount is already fetching plans, await it.
      if (plansInFlight) {
        await plansInFlight;
        return;
      }

      plansInFlight = (async () => {
        try {
          setPlansLoading(true);
          const response = await paymentAPI.getPlans();
          if (response.success) {
            setPlans(response.plans);
            plansFetchedRef.current = true;
          }
        } catch (error: any) {
          console.error('Error fetching plans:', error);
        } finally {
          setPlansLoading(false);
          plansInFlight = null;
        }
      })();

      await plansInFlight;
    };

    run();
  }, []);

  // Fetch subscription when user changes (deduped across mounts)
  useEffect(() => {
    const run = async () => {
      if (!userId) {
        setSubscription(null);
        subscriptionFetchedForUserRef.current = null;
        return;
      }

      if (subscriptionFetchedForUserRef.current === userId) return;

      // If another mount is already fetching subscription for this user, await it.
      const existing = subscriptionInFlightByUser.get(userId);
      if (existing) {
        await existing;
        subscriptionFetchedForUserRef.current = userId;
        return;
      }

      const promise = (async () => {
        try {
          setSubscriptionLoading(true);
          const response = await paymentAPI.getSubscription();
          if (response.success) {
            setSubscription(response.subscription);
          }
        } catch (error: any) {
          console.error('Error fetching subscription:', error);
          // Default free subscription on error so UI stays consistent
          setSubscription({
            planType: 'free',
            status: 'active',
            features: {
              maxQRCodes: 5,
              maxScansPerQR: 100,
              analytics: false,
              advancedAnalytics: false,
              whiteLabel: false,
              removeWatermark: false,
              passwordProtection: false,
              expirationDate: false,
              customScanLimit: false,
            },
          });
        } finally {
          setSubscriptionLoading(false);
          subscriptionInFlightByUser.delete(userId);
        }
      })();

      subscriptionInFlightByUser.set(userId, promise);
      await promise;
      subscriptionFetchedForUserRef.current = userId;
    };

    run();
  }, [userId]);

  // Refresh subscription (forces re-fetch)
  const refreshSubscription = useCallback(async () => {
    if (!userId) return;

    // clear local + in-flight so next call truly refetches
    subscriptionFetchedForUserRef.current = null;
    subscriptionInFlightByUser.delete(userId);

    try {
      setSubscriptionLoading(true);
      const response = await paymentAPI.getSubscription();
      if (response.success) {
        setSubscription(response.subscription);
        subscriptionFetchedForUserRef.current = userId;
      }
    } catch (error: any) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [userId]);

  // Refresh subscription features (updates database features)
  const refreshSubscriptionFeatures = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await paymentAPI.refreshSubscription();
      if (response.success) {
        setSubscription(response.subscription);
        subscriptionFetchedForUserRef.current = userId;
        message.success('Subscription features updated successfully');
      } else {
        message.error('Failed to update subscription features');
      }
    } catch (error: any) {
      console.error('Error refreshing subscription features:', error);
      message.error('Failed to update subscription features');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await paymentAPI.getPaymentHistory(page, limit);
      if (response.success) {
        setPaymentHistory(response.payments);
      }
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Download invoice
  const downloadInvoice = useCallback(async (paymentId: string) => {
    try {
      setLoading(true);
      await paymentAPI.downloadInvoice(paymentId);
      message.success('Invoice downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      message.error(error?.response?.data?.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  }, []);

  // Process payment
  const processPayment = useCallback(
    async (planType: string, duration: number = 1): Promise<boolean> => {
      try {
        setLoading(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          message.error('Payment system is currently unavailable. Please try again.');
          return false;
        }

        const orderResponse = await paymentAPI.createOrder(planType, duration);
        if (!orderResponse.success) {
          message.error('Failed to create payment order');
          return false;
        }

        const order = orderResponse.order;

        return new Promise((resolve) => {
          // Add timeout for cleanup
          let timeoutId: NodeJS.Timeout;
          let isResolved = false;

          const resolveOnce = (result: boolean) => {
            if (!isResolved) {
              isResolved = true;
              clearTimeout(timeoutId);
              resolve(result);
            }
          };

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
                  razorpay_signature: response.razorpay_signature,
                });

                if (verifyResponse.success) {
                  message.success({
                    content: 'Payment successful! Your subscription has been activated.',
                    duration: 5,
                  });
                  // Show confetti animation
                  confetti({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#a855f7', '#8b5cf6', '#7c3aed', '#6366f1', '#4f46e5']
                  });
                  setSubscription(verifyResponse.subscription);
                  // Mark as fetched for this user
                  if (userId) subscriptionFetchedForUserRef.current = userId;
                  // Call subscription API again to ensure latest data
                  await refreshSubscription();
                  resolveOnce(true);
                } else {
                  message.error({
                    content: 'Payment verification failed. Please contact support if amount was deducted.',
                    duration: 6,
                  });
                  resolveOnce(false);
                }
              } catch (error: any) {
                console.error('Payment verification error:', error);
                message.error({
                  content: 'Payment verification failed. Please contact support if amount was deducted.',
                  duration: 6,
                });
                resolveOnce(false);
              }
            },
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: user?.mobile || '',
            },
            notes: {
              planType,
              duration,
            },
            theme: {
              color: '#6366f1',
            },
            modal: {
              ondismiss: () => {
                message.warning({
                  content: 'Payment was cancelled. You can try again anytime.',
                  duration: 4,
                });
                resolveOnce(false);
              },
              // Ensure modal closes properly
              escape: true,
              backdrop: true,
            },
          };

          // Set timeout to ensure proper cleanup
          timeoutId = setTimeout(() => {
            try {
              razorpayInstance.close();
            } catch (error) {
              console.error('Error closing Razorpay instance:', error);
            }
            message.error({
              content: 'Payment session expired. Please try again.',
              duration: 4,
            });
            resolveOnce(false);
          }, 15 * 60 * 1000); // 15 minutes timeout

          const razorpayInstance = new window.Razorpay(options);

          try {
            razorpayInstance.open();
          } catch (error) {
            clearTimeout(timeoutId);
            console.error('Error opening Razorpay:', error);
            message.error({
              content: 'Failed to open payment gateway. Please try again.',
              duration: 4,
            });
            resolveOnce(false);
          }
        });
      } catch (error: any) {
        console.error('Payment process error:', error);
        message.error('Payment failed. Please try again.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    // depend on the actual primitive fields used in prefill
    [user?.name, user?.email, user?.mobile, userId, refreshSubscription]
  );

  // Cancel subscription
  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await paymentAPI.cancelSubscription();

      if (response.success) {
        message.success('Subscription cancelled successfully');
        setSubscription(response.subscription);
        if (userId) subscriptionFetchedForUserRef.current = userId;
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
  }, [userId]);

  const hasFeatureAccess = useCallback(
    (feature: keyof Subscription['features']): boolean => {
      if (!subscription) return false;
      
      // Trial plan users are premium level - get unlimited access to ALL features
      if (subscription.planType === 'trial') {
        return true; // Trial is above Enterprise - unlimited everything
      }
      
      const value = subscription.features[feature];
      return value === true || value === -1;
    },
    [subscription]
  );

  const getRemainingQRCodes = useCallback(
    (currentCount: number): number => {
      if (!subscription) return Math.max(0, 5 - currentCount);
      
      // Trial users get unlimited QR codes
      if (subscription.planType === 'trial') {
        return -1; // Unlimited
      }
      
      if (subscription.features.maxQRCodes === -1) return -1;
      return Math.max(0, subscription.features.maxQRCodes - currentCount);
    },
    [subscription]
  );

  const isUpgradeRequired = useCallback(
    (currentQRCount: number): boolean => {
      if (!subscription) return currentQRCount >= 5;
      
      // Trial users never need to upgrade
      if (subscription.planType === 'trial') {
        return false;
      }
      
      if (subscription.features.maxQRCodes === -1) return false;
      return currentQRCount >= subscription.features.maxQRCodes;
    },
    [subscription]
  );

  const getPlanDisplayName = useCallback((): string => {
    if (!subscription) return 'Free';
    
    const planNames: Record<string, string> = {
      free: 'Free',
      basic: 'Basic',
      pro: 'Pro',
      enterprise: 'Enterprise',
      trial: 'Trial',
    };
    
    return planNames[subscription.planType] || 'Free';
  }, [subscription]);

  const getPlanStatus = useCallback((): string => {
    if (!subscription) return 'active';
    return subscription.status || 'active';
  }, [subscription]);

  const isOnTrial = useCallback((): boolean => {
    if (!subscription) return false;
    return subscription.planType === 'trial';
  }, [subscription]);

  const getTrialDaysRemaining = useCallback((): number | null => {
    if (!subscription || subscription.planType !== 'trial' || !subscription.trialEndDate) return null;
    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    if (now > trialEnd) return 0;
    
    const diffInTime = trialEnd.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return Math.max(0, diffInDays);
  }, [subscription]);

  const getTrialEndDate = useCallback((): Date | null => {
    if (!subscription || subscription.planType !== 'trial' || !subscription.trialEndDate) return null;
    return new Date(subscription.trialEndDate);
  }, [subscription]);

  const value = useMemo<SubscriptionContextType>(
    () => ({
      plans,
      subscription,
      paymentHistory,
      loading,
      plansLoading,
      subscriptionLoading,
      processPayment,
      cancelSubscription,
      refreshSubscription,
      refreshSubscriptionFeatures,
      fetchPaymentHistory,
      downloadInvoice,
      hasFeatureAccess,
      getRemainingQRCodes,
      isUpgradeRequired,
      getPlanDisplayName,
      getPlanStatus,
      isOnTrial,
      getTrialDaysRemaining,
      getTrialEndDate,
    }),
    [
      plans,
      subscription,
      paymentHistory,
      loading,
      plansLoading,
      subscriptionLoading,
      processPayment,
      cancelSubscription,
      refreshSubscription,
      refreshSubscriptionFeatures,
      fetchPaymentHistory,
      downloadInvoice,
      hasFeatureAccess,
      getRemainingQRCodes,
      isUpgradeRequired,
      getPlanDisplayName,
      getPlanStatus,
      isOnTrial,
      getTrialDaysRemaining,
      getTrialEndDate,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
