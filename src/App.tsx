import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import Analytics from "./pages/Analytics";
import QRAnalytics from "./pages/QRAnalytics";
import Redirector from "./pages/Redirector";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Submissions from "./pages/Submissions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const antTheme = {
  token: {
    colorPrimary: '#6366f1',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antTheme}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
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
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/submissions" element={<AdminRoute><Submissions /></AdminRoute>} />

                {/* Public redirect route for scanned QR codes (no auth required) */}
                <Route path="/r/:id" element={<Redirector />} />
                <Route path="/r" element={<Redirector />} />

                <Route path="*" element={<NotFound />}/>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
