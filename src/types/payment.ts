export interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    maxQRCodes: number;
    maxScansPerQR: number;
    analytics: boolean;
    advancedAnalytics: boolean;
    whiteLabel: boolean;
    removeWatermark: boolean;
    passwordProtection: boolean;
    expirationDate: boolean;
    customScanLimit: boolean;
  };
}

export interface Plans {
  basic: Plan;
  pro: Plan;
  enterprise: Plan;
  trial: Plan;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  planType: string;
  planName: string;
  duration: number;
}

export interface Subscription {
  planType: 'free' | 'basic' | 'pro' | 'enterprise' | 'trial';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate?: string;
  endDate?: string;
  isTrialSubscription?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  features: {
    maxQRCodes: number;
    maxScansPerQR: number;
    analytics: boolean;
    advancedAnalytics: boolean;
    whiteLabel: boolean;
    removeWatermark: boolean;
    passwordProtection: boolean;
    expirationDate: boolean;
    customScanLimit: boolean;
  };
  paymentId?: {
    amount: number;
    createdAt: string;
    paidAt: string;
  };
}

export interface PaymentHistory {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'refunded';
  planType: string;
  planDuration: number;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
    escape?: boolean;
    backdrop?: boolean;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
      close(): void;
    };
  }
}