// Re-export from SubscriptionContext for backward compatibility
import { useSubscription } from '@/context/SubscriptionContext';

export const usePayment = () => {
  const context = useSubscription();
  
  return {
    // Data
    plans: context.plans,
    subscription: context.subscription,
    paymentHistory: context.paymentHistory,
    
    // Loading states
    loading: context.loading,
    plansLoading: context.plansLoading,
    subscriptionLoading: context.subscriptionLoading,
    
    // Actions
    processPayment: context.processPayment,
    cancelSubscription: context.cancelSubscription,
    fetchSubscription: context.refreshSubscription,
    refreshSubscriptionFeatures: context.refreshSubscriptionFeatures,
    fetchPaymentHistory: context.fetchPaymentHistory,
    downloadInvoice: context.downloadInvoice,
    
    // Utilities
    hasFeatureAccess: context.hasFeatureAccess,
    getRemainingQRCodes: context.getRemainingQRCodes,
    isUpgradeRequired: context.isUpgradeRequired
  };
};
