import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateQR from "./pages/CreateQR";
import Analytics from "./pages/Analytics";
import QRAnalytics from "./pages/QRAnalytics";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Submissions from "./pages/Submissions";
import NotFound from "./pages/NotFound";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateQR />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analytics/:id" element={<QRAnalytics />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
