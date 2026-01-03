import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RouteChangeListener from "./components/RouteChangeListener";
import { hslToRgb } from "./utils/colorUtils";

// Import all page components directly (no lazy loading)
import LandingPage from "./pages/landing/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import Analytics from "./pages/Analytics";
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeListener />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
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
              element={<ProtectedRoute><Analytics /></ProtectedRoute>}
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
              path="/pricing"
              element={<ProtectedRoute><PricingPage /></ProtectedRoute>}
            />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/submissions" element={<AdminRoute><Submissions /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminDataPage /></AdminRoute>} />

            {/* Public redirect route for scanned QR codes (no auth required) */}
            <Route path="/r/:id" element={<Redirector />} />
            <Route path="/r" element={<Redirector />} />

            {/* QR unavailable when expired or scan limit reached */}
            <Route path="/qr/unavailable/:id" element={<QRUnavailable />} />

            <Route path="*" element={<NotFound />}/>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
