import React, { memo } from 'react';
import { Card } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
import CountUp from 'react-countup';
import { QrCode, Eye, TrendingUp, XCircle } from 'lucide-react';

interface StatsCardsProps {
  loading: boolean;
  stats: {
    total: number;
    totalScans: number;
    totalActive: number;
    inactive: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = memo(({ loading, stats }) => {
  return (
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
              <CountUp end={Number(stats.total)} duration={2} />
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
              <CountUp end={stats.totalScans} duration={2.5} separator="," />
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
              <CountUp end={stats.totalActive} duration={2} />
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
              <CountUp end={stats.inactive} duration={2} />
            </span>
          </div>
        )}
      </Card>
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;
