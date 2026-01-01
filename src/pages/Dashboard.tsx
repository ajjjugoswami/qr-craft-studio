import React from "react";
import {
  Typography,
  Button,
  Empty,
  Card,
  Input,
  Pagination,
  Segmented,
  message,
} from "antd";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import {
  Plus,
  QrCode,
  Eye,
  TrendingUp,
  Search,
  LayoutGrid,
  List,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import QRCodeCard from "../components/qr/QRCodeCard";
import EmptyQRState from "../components/qr/EmptyQRState";
import { useQRCodes } from "../hooks/useQRCodes";

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
    setPage,
    setSearch,
  } = useQRCodes();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");

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

  const handleCreateClick = () => {
    navigate("/create");
    // Confetti on create button click
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#8b5cf6', '#7c3aed', '#6366f1']
    });
  };

  // Server-side filtered list (search applied on server)
  const filteredQRCodes = qrCodes;

  return (
    <DashboardLayout>
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
            size="large"
            icon={<Plus size={18} />}
            onClick={() => navigate("/create")}
            className="w-full sm:w-auto h-11 sm:h-10"
          >
            Create New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="card-compact glass-card stat-card">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <QrCode size={14} className="text-primary" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">
                    Total QR Codes
                  </span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-primary animated-number">
                  <CountUp end={Number(total)} duration={2} />
                </span>
              </div>
            )}
          </Card>

          <Card className="card-compact glass-card stat-card">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={14} className="text-success" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">
                    Total Scans
                  </span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-success animated-number">
                  <CountUp end={totalScans} duration={2.5} separator="," />
                </span>
              </div>
            )}
          </Card>

          <Card className="card-compact glass-card stat-card">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={14} className="text-warning" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">
                    Active Codes
                  </span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-warning animated-number">
                  <CountUp end={totalActive} duration={2} />
                </span>
              </div>
            )}
          </Card>

          <Card className="card-compact glass-card stat-card">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <XCircle size={14} className="text-destructive" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">
                    Inactive
                  </span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-destructive animated-number">
                  <CountUp end={Number(total) - Number(totalActive)} duration={2} />
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          viewMode === "list" ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : qrCodes.length === 0 ? (
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
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search..."
                  prefix={
                    <Search size={16} className="text-muted-foreground" />
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearchTerm(v);
                    if (searchTimeoutRef.current)
                      window.clearTimeout(searchTimeoutRef.current);
                    searchTimeoutRef.current = window.setTimeout(() => {
                      setSearch(v.trim());
                    }, 400);
                  }}
                  className="flex-1 sm:w-48 md:w-64"
                  allowClear
                />
                <Segmented
                  value={viewMode}
                  onChange={(value) => setViewMode(value as "list" | "grid")}
                  options={[
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <List size={16} />
                          <span className="hidden sm:inline">List</span>
                        </div>
                      ),
                      value: "list",
                    },
                    {
                      label: (
                        <div className="flex items-center gap-2">
                          <LayoutGrid size={16} />
                          <span className="hidden sm:inline">Grid</span>
                        </div>
                      ),
                      value: "grid",
                    },
                  ]}
                  className="segmented-animated"
                />
              </div>
            </div>
            {filteredQRCodes.length === 0 ? (
              <Card className="py-8 md:py-12">
                <Empty
                  description={
                    <div className="text-center">
                      <Text type="secondary">
                        No QR codes found for "{searchTerm}"
                      </Text>
                    </div>
                  }
                />
              </Card>
            ) : viewMode === "list" ? (
              <div className="space-y-3">
                {filteredQRCodes.map((qrCode) => (
                  <QRCodeCard
                    key={qrCode.id}
                    qrCode={qrCode}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    viewMode="list"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredQRCodes.map((qrCode) => (
                  <QRCodeCard
                    key={qrCode.id}
                    qrCode={qrCode}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    viewMode="grid"
                  />
                ))}
              </div>
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
