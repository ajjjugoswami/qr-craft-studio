import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { Analytics } from "@vercel/analytics/react";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { useTheme } from "./hooks/useTheme";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RouteChangeListener from "./components/RouteChangeListener";
import GlobalDialogs from "./components/layout/GlobalDialogs";
import { hslToRgb } from "./utils/colorUtils";

// Import all page components directly (no lazy loading)
import LandingPage from "./pages/landing/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import MainAnalytics from "./pages/Analytics";
import QRAnalytics from "./pages/QRAnalytics";
import CompareQRCodesPage from "./pages/CompareQRCodes";
import Redirector from "./pages/Redirector";
import QRUnavailable from "./pages/QRUnavailable";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Submissions from "./pages/Submissions";
import AdminDataPage from "./pages/AdminData";
import Profile from "./pages/Profile";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationsAndRefunds from "./pages/CancellationsAndRefunds";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const AppContent = () => {
  const { mode, currentTheme, theme: themeConfig } = useTheme();
  
  // Detect system preference for mode calculation
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
  
  const primaryColor = hslToRgb(themeConfig.colors.primary);

  const antTheme = {
    algorithm: effectiveMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      borderRadius: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      ...(effectiveMode === 'dark' ? {
        colorBgBase: '#0a0a0a',
        colorBgContainer: '#141414',
        colorBgElevated: '#1f1f1f',
        colorBorder: '#2a2a2a',
        colorText: '#e5e5e5',
        colorTextSecondary: '#a3a3a3',
      } : {}),
    },
  };

  return (
    <ConfigProvider theme={antTheme}>
      <TooltipProvider>
        <BrowserRouter>
          <RouteChangeListener />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/create"
              element={<ProtectedRoute><CreateQR /></ProtectedRoute>}
            />
            <Route
              path="/edit/:id"
              element={<ProtectedRoute><CreateQR /></ProtectedRoute>}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute><MainAnalytics /></ProtectedRoute>}
            />
            <Route
              path="/analytics/:id"
              element={<ProtectedRoute><QRAnalytics /></ProtectedRoute>}
            />
            <Route
              path="/compare"
              element={<ProtectedRoute><CompareQRCodesPage /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/theme"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/watermark"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/whitelabel"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/subscription"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/settings/security"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/pricing"
              element={<ProtectedRoute><PricingPage /></ProtectedRoute>}
            />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refunds" element={<CancellationsAndRefunds />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/submissions" element={<AdminRoute><Submissions /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminDataPage /></AdminRoute>} />
            <Route path="/admin/subscriptions" element={<AdminRoute><AdminDataPage /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AdminDataPage /></AdminRoute>} />
            <Route path="/admin/plan-pricing" element={<AdminRoute><AdminDataPage /></AdminRoute>} />

            {/* Public redirect route for scanned QR codes (no auth required) */}
            <Route path="/r/:id" element={<Redirector />} />
            <Route path="/r" element={<Redirector />} />

            {/* QR unavailable when expired or scan limit reached */}
            <Route path="/qr/unavailable/:id" element={<QRUnavailable />} />

            <Route path="*" element={<NotFound />}/>
          </Routes>
          
          {/* Global Dialogs - Inside Router context */}
          <GlobalDialogs />
        </BrowserRouter>
        
        {/* Global Toasters */}
        <Toaster />
        <Sonner />
        
        {/* Vercel Analytics */}
        <Analytics />
      </TooltipProvider>
    </ConfigProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
