import React from "react";
import { Empty, Card, Button, Alert } from "antd";
import { Crown, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/hooks/usePayment";
import { AdvancedAnalytics } from "@/types/analytics";
import GeographicHeatmap from "./GeographicHeatmap";
import PeakTimesAnalysis from "./PeakTimesAnalysis";
import RetentionAnalysis from "./RetentionAnalysis";
import ReferrerAnalysis from "./ReferrerAnalysis";

interface AdvancedAnalyticsSectionProps {
  advancedAnalytics?: AdvancedAnalytics | null;
  advancedLoading: boolean;
}

const AdvancedAnalyticsSection: React.FC<AdvancedAnalyticsSectionProps> = ({
  advancedAnalytics,
  advancedLoading,
}) => {
  const navigate = useNavigate();
  const { hasFeatureAccess } = usePayment();

  // Check if user has access to advanced analytics
  const canViewAdvancedAnalytics = hasFeatureAccess("advancedAnalytics");

  // Show loading skeleton while fetching (only for premium users)
  if (advancedLoading && canViewAdvancedAnalytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <GeographicHeatmap data={undefined} loading={true} />
          <PeakTimesAnalysis data={undefined} loading={true} />
        </div>
        <div className="flex flex-col gap-4">
          <ReferrerAnalysis data={undefined} loading={true} />
          <RetentionAnalysis data={undefined} loading={true} />
        </div>
      </div>
    );
  }

  // Create mock/demo data for free users
  const mockAdvancedAnalytics: AdvancedAnalytics = {
    heatmap: {
      cityData: [
        {
          city: "New York",
          country: "United States",
          scans: 45,
          count: 45,
          lat: 40.7128,
          lng: -74.006,
        },
        {
          city: "London",
          country: "United Kingdom",
          scans: 32,
          count: 32,
          lat: 51.5074,
          lng: -0.1278,
        },
      ],
      total: 148,
      totalScansWithCoordinates: 148,
    },
    peakTimes: {
      hourlyData: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 50) + 10,
      })),
      peakHour: "14:00",
      peakDay: "Monday",
    },
    referrers: {
      referrers: [
        { referrer: "Direct", count: 156 },
        { referrer: "facebook.com", count: 89 },
      ],
      categorized: {
        direct: 156,
        social: 89,
        search: 0,
        email: 67,
        other: 68,
      },
    },
    retention: {
      totalScans: 459,
      uniqueScanners: 287,
      newScans: 302,
      returningScans: 157,
      repeatRate: 54.7,
      dailyRetention: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        uniqueUsers: Math.floor(Math.random() * 50) + 20,
      })),
    },
  };

  // Use real data for premium users, mock data for free users
  const displayData = canViewAdvancedAnalytics
    ? advancedAnalytics
    : mockAdvancedAnalytics;

  // If premium user has no data, show empty state
  if (canViewAdvancedAnalytics && !advancedAnalytics) {
    return (
      <Card>
        <Empty description="No advanced analytics data available" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Feature Alert for Free Users */}
      {!canViewAdvancedAnalytics && (
        <Alert
          type="info"
          showIcon
          icon={<Crown size={16} />}
          message="Premium Analytics Feature"
          description={
            <div className="flex items-center justify-between">
              <span>
                Upgrade to Pro to unlock detailed geographic, timing, and
                referrer analytics
              </span>
              <Button
                type="primary"
                size="small"
                icon={<ArrowUpRight size={14} />}
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now
              </Button>
            </div>
          }
          className="mb-4"
        />
      )}

      {/* Analytics Grid with Optional Blur Overlay */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <GeographicHeatmap data={displayData?.heatmap} loading={false} />
            <PeakTimesAnalysis data={displayData?.peakTimes} loading={false} />
          </div>
          <div className="flex flex-col gap-4">
            <ReferrerAnalysis data={displayData?.referrers} loading={false} />
            <RetentionAnalysis data={displayData?.retention} loading={false} />
          </div>
        </div>

        {/* Blur Overlay for Free Users */}
        {!canViewAdvancedAnalytics && (
          <div className="absolute inset-0 backdrop-blur-sm bg-white/20 rounded-lg flex items-center justify-center">
            <Card className="text-center max-w-md mx-auto shadow-lg">
              <div className="flex flex-col items-center space-y-4">
                <Crown size={48} className="text-blue-500" />
                <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Get detailed insights about your QR code performance including
                  geographic data, peak usage times, traffic sources, and user
                  retention metrics.
                </p>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowUpRight size={16} />}
                  onClick={() => navigate("/pricing")}
                  className="w-full"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalyticsSection;
