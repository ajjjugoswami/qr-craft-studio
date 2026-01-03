import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme, Spin } from "antd";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RouteChangeListener from "./components/RouteChangeListener";

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateQR = lazy(() => import("./pages/CreateQR"));
const Analytics = lazy(() => import("./pages/Analytics"));
const QRAnalytics = lazy(() => import("./pages/QRAnalytics"));
const CompareQRCodesPage = lazy(() => import("./pages/CompareQRCodes"));
const Redirector = lazy(() => import("./pages/Redirector"));
const QRUnavailable = lazy(() => import("./pages/QRUnavailable"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Contact = lazy(() => import("./pages/Contact"));
const Submissions = lazy(() => import("./pages/Submissions"));
const AdminDataPage = lazy(() => import("./pages/AdminData"));
const Profile = lazy(() => import("./pages/Profile"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Spin size="large" />
  </div>
);

const AppContent = () => {
  const { mode, currentTheme, theme: themeConfig } = useTheme();
  
  // Detect system preference for mode calculation
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
  
  // Convert HSL string to RGB values for Ant Design
  const hslToRgb = (hsl: string) => {
    const [h, s, l] = hsl.split(' ').map((v, i) => 
      i === 0 ? parseInt(v) : parseInt(v.replace('%', ''))
    );
    const a = s * Math.min(l, 100 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color / 100);
    };
    return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
  };

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
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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
