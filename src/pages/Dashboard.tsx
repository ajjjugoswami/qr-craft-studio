import React from "react";
import {
  Typography,
  Button,
  Pagination,
  message,
} from "antd";
import confetti from 'canvas-confetti';
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import EmptyQRState from "../components/qr/EmptyQRState";
import StatsCards from "../components/dashboard/StatsCards";
import SearchBar from "../components/dashboard/SearchBar";
import QRCodesList from "../components/dashboard/QRCodesList";
import NoSearchResults from "../components/dashboard/NoSearchResults";
import SubscriptionLimitAlert from "../components/payment/SubscriptionLimitAlert";
import { useQRCodes } from "../hooks/useQRCodes";
import { useAppSelector } from "../store";
import { selectStatsLoading } from "../store/slices/statsSlice";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    qrCodes,
    loading,
    deleteQRCode,
    toggleQRCodeStatus,
    page,
    limit,
    total,
    totalPages,
    totalScans,
    totalActive,
    statsTotal,
    setPage,
    setSearch,
  } = useQRCodes();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");
  
  // Get separate loading state for stats
  const statsLoading = useAppSelector(selectStatsLoading);

  // Memoize stats from Redux store - they don't change during search
  const stats = React.useMemo(() => ({
    total: statsTotal,
    totalScans,
    totalActive,
    inactive: Number(statsTotal) - Number(totalActive)
  }), [statsTotal, totalScans, totalActive]);

  // Initial loading (first time) vs search loading - for QR codes list only
  const isInitialLoading = loading && qrCodes.length === 0 && !searchTerm;
  
  // Check if user has no QR codes at all (not searching)
  const hasNoQRCodes = statsTotal === 0 && !statsLoading && !loading;

  // debounce search input
  const searchTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current)
        window.clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteQRCode(id);
    message.success('QR Code deleted successfully!');
  };

  const handleToggleStatus = (id: string) => {
    toggleQRCodeStatus(id);
    // Confetti on activation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#8b5cf6', '#7c3aed']
    });
    message.success('QR Code status updated!');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      setSearch(value.trim());
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearch('');
  };

  return (
    <DashboardLayout>
      {/* Subscription Limit Alert - Fixed at top */}
      <SubscriptionLimitAlert currentQRCount={statsTotal || 0} />
      
      <div className="animate-fade-in space-y-4 md:space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="!mb-0 !text-xl md:!text-2xl">
              Welcome back! 👋
            </Title>
            <Text type="secondary" className="text-sm">
              Manage your QR codes
            </Text>
          </div>
          <Button
            type="primary"
            size="middle"
            icon={<Plus size={16} />}
            onClick={() => navigate("/create")}
            className="w-full sm:w-auto"
          >
            Create New
          </Button>
        </div>

        {/* Stats Cards - Independent loading state */}
        <StatsCards loading={statsLoading} stats={stats} />

        {/* Content */}
        {hasNoQRCodes ? (
          <div style={{ marginTop: "150px" }}>
            <EmptyQRState />
          </div>
        ) : (
          <>
            {/* QR Codes List Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Title level={4} className="!mb-0 !text-base md:!text-lg">
                Your QR Codes
              </Title>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* QR Codes List or No Results */}
            {qrCodes.length === 0 && searchTerm.trim() ? (
              <NoSearchResults searchTerm={searchTerm} onClearSearch={handleClearSearch} />
            ) : (
              <QRCodesList
                qrCodes={qrCodes}
                loading={loading}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </>
        )}

        {Number(total) > Number(limit) && (
          <div className="pt-4 flex justify-end">
            <Pagination
              current={Number(page)}
              pageSize={Number(limit)}
              total={Number(total)}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
