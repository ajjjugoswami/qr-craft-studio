import React, { useState, useCallback } from 'react';
import { Card, Row, Col, message } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import HeatmapByTime from '@/components/analytics/HeatmapByTime';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import StatsOverview from '@/components/analytics/StatsOverview';
import MainCharts from '@/components/analytics/MainCharts';
import SecondaryCharts from '@/components/analytics/SecondaryCharts';
import AdvancedAnalyticsSection from '@/components/analytics/AdvancedAnalyticsSection';
import EmptyAnalyticsState from '@/components/analytics/EmptyAnalyticsState';

const MainAnalytics: React.FC = () => {
  const [mode, setMode] = useState<'real' | 'demo'>('real');
  
  const {
    loading,
    scans,
    qrCodes,
    totalQRCodes,
    activeQRs,
    scansOverTime,
    weeklyData,
    deviceData,
    topQRCodes,
    qrTypeDistribution,
    locationData,
    displayedTotalScans,
    avgScansPerQR,
    advancedAnalytics,
    advancedLoading,
  } = useAnalyticsData(mode);

  const downloadCSV = useCallback(() => {
    // Comprehensive CSV with all analytics data
    const lines: string[] = [];
    
    // Section 1: Scans Over Time (Last 30 Days)
    lines.push('=== SCANS OVER TIME (Last 30 Days) ===');
    lines.push('Date,Scans');
    scansOverTime.forEach((item) => {
      lines.push(`"${item.date}",${item.scans}`);
    });
    lines.push('');
    
    // Section 2: Weekly Performance
    lines.push('=== WEEKLY PERFORMANCE ===');
    lines.push('Day,Scans');
    weeklyData.forEach((item) => {
      lines.push(`"${item.day}",${item.scans}`);
    });
    lines.push('');
    
    // Section 3: Device Distribution
    lines.push('=== DEVICE DISTRIBUTION ===');
    lines.push('Device Type,Count');
    deviceData.forEach((d) => {
      lines.push(`"${d.name}",${d.value}`);
    });
    lines.push('');
    
    // Section 4: Top Locations
    lines.push('=== TOP LOCATIONS ===');
    lines.push('Country,Scans');
    locationData.forEach((l) => {
      lines.push(`"${l.country}",${l.scans}`);
    });
    lines.push('');
    
    // Section 5: Top Performing QR Codes
    lines.push('=== TOP PERFORMING QR CODES ===');
    lines.push('QR Code Name,Scans');
    topQRCodes.forEach((qr) => {
      lines.push(`"${qr.name}",${qr.scans}`);
    });
    lines.push('');
    
    // Section 6: QR Code Type Distribution
    lines.push('=== QR CODE TYPE DISTRIBUTION ===');
    lines.push('Type,Count');
    qrTypeDistribution.forEach((t) => {
      lines.push(`"${t.name}",${t.value}`);
    });
    lines.push('');
    
    // Section 7: Summary Statistics
    lines.push('=== SUMMARY STATISTICS ===');
    lines.push('Metric,Value');
    lines.push(`"Total Scans",${displayedTotalScans}`);
    lines.push(`"Total QR Codes",${totalQRCodes}`);
    lines.push(`"Active QR Codes",${activeQRs}`);
    lines.push(`"Average Scans per QR",${avgScansPerQR}`);
    lines.push(`"Unique Visitors (est.)",${Math.round((displayedTotalScans || 0) * 0.7)}`);
    lines.push(`"Data Mode","${mode}"`);
    lines.push(`"Export Date","${new Date().toISOString()}"`);

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-overview-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('Full analytics CSV downloaded successfully');
  }, [scansOverTime, weeklyData, deviceData, locationData, topQRCodes, qrTypeDistribution, displayedTotalScans, activeQRs, qrCodes.length, avgScansPerQR, mode]);

  if (loading && mode === 'real') {
    return (
      <DashboardLayout>
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-72 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-36" />
          </div>
          <Row gutter={[16, 16]}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card className="h-full"><Skeleton className="w-full h-72 rounded-lg" /></Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="h-full"><Skeleton className="w-full h-72 rounded-lg" /></Card>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }

  // Check if there's no data (no scans and no QR codes, or all zeros)
  // Only show empty state when NOT loading to avoid flash of "no data" during initial load
  const hasNoData = mode === 'real' && !loading && (
    (qrCodes.length === 0 && scans.length === 0) ||
    (displayedTotalScans === 0 && scans.length === 0)
  );

  if (hasNoData) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <AnalyticsHeader 
            mode={mode} 
            onModeChange={setMode} 
            onDownloadCSV={downloadCSV} 
          />
          <EmptyAnalyticsState onSwitchToDemo={() => setMode('demo')} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <AnalyticsHeader 
          mode={mode} 
          onModeChange={setMode} 
          onDownloadCSV={downloadCSV} 
        />

        <StatsOverview 
          displayedTotalScans={displayedTotalScans}
          activeQRs={activeQRs}
          totalQRCodes={totalQRCodes}
          avgScansPerQR={avgScansPerQR}
        />

        <MainCharts 
          scansOverTime={scansOverTime}
          deviceData={deviceData}
        />

        <SecondaryCharts 
          weeklyData={weeklyData}
          qrTypeDistribution={qrTypeDistribution}
          locationData={locationData}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <HeatmapByTime scans={scans} mode={mode} />
          </Col>
        </Row>

        <AdvancedAnalyticsSection 
          advancedAnalytics={advancedAnalytics}
          advancedLoading={advancedLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default MainAnalytics;