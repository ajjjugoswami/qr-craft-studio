import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { store } from "./store";
import { LandingPage } from "./pages/landing";
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
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RouteChangeListener from "./components/RouteChangeListener";

const queryClient = new QueryClient();

const antTheme = {
  algorithm: theme.defaultAlgorithm, // Force light mode
  token: {
    colorPrimary: "hsl(262, 83%, 58%)",
    colorTextBase: "hsl(222, 47%, 11%)",
    colorBgBase: "hsl(0, 0%, 100%)",
    colorBgContainer: "hsl(0, 0%, 100%)",
    colorBgElevated: "hsl(0, 0%, 100%)",
    colorBorder: "hsl(214, 32%, 91%)",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeProvider>
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
          </ThemeProvider>
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
