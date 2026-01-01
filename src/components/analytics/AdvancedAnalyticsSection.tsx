import React from 'react';
import { Empty, Card } from 'antd';
import { AdvancedAnalytics } from '@/types/analytics';
import GeographicHeatmap from './GeographicHeatmap';
import PeakTimesAnalysis from './PeakTimesAnalysis';
import RetentionAnalysis from './RetentionAnalysis';
import ReferrerAnalysis from './ReferrerAnalysis';

interface AdvancedAnalyticsSectionProps {
  advancedAnalytics?: AdvancedAnalytics | null;
  advancedLoading: boolean;
}

const AdvancedAnalyticsSection: React.FC<AdvancedAnalyticsSectionProps> = ({
  advancedAnalytics,
  advancedLoading,
}) => {
  // Safety check - if no data and not loading, show empty state
  if (!advancedLoading && !advancedAnalytics) {
    return (
      <Card>
        <Empty description="No advanced analytics data available" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <GeographicHeatmap data={advancedAnalytics?.heatmap} loading={advancedLoading} />
        <PeakTimesAnalysis data={advancedAnalytics?.peakTimes} loading={advancedLoading} />
      </div>
      <div className="flex flex-col gap-4">
        <ReferrerAnalysis data={advancedAnalytics?.referrers} loading={advancedLoading} />
        <RetentionAnalysis data={advancedAnalytics?.retention} loading={advancedLoading} />
      </div>
    </div>
  );
};

export default AdvancedAnalyticsSection;
