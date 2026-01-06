export interface WhiteLabelConfig {
  enabled: boolean;
  brandName?: string;
  primaryColor?: string;
  loadingText?: string;
  showPoweredBy: boolean;
}

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  theme?: string;
  mobile?: string;
  country?: string;
  city?: string;
  profilePicture?: string;
  language?: string;
  timezone?: string;
  timeFormat?: '12' | '24';
  removeWatermark?: boolean;
  watermarkText?: string;
  whiteLabel?: WhiteLabelConfig;
  subscriptionPlan?: 'free' | 'basic' | 'pro' | 'enterprise' | 'trial';
  subscriptionStatus?: 'active' | 'inactive' | 'expired' | 'cancelled';
  isOnTrial?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => void;
  updateUser: (userData: Partial<User>) => void;
};