import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, Table, Tag, Segmented, Button, message, Tabs } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, QrCode, TrendingUp, Users, Download } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useQRCodes } from '../hooks/useQRCodes';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { getDemoScansOverTime, demoDeviceData, demoTopQRCodes, demoLocations } from '@/lib/hardCodeAnalyticsData';
import HeatmapByTime from '@/components/analytics/HeatmapByTime';
import CompareQRCodes from '@/components/analytics/CompareQRCodes';
import GeographicHeatmap from '@/components/analytics/GeographicHeatmap';
import PeakTimesAnalysis from '@/components/analytics/PeakTimesAnalysis';
import RetentionAnalysis from '@/components/analytics/RetentionAnalysis';
import ReferrerAnalysis from '@/components/analytics/ReferrerAnalysis';
import { scansAPI } from '@/lib/api';

const { Title, Text } = Typography;

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const Analytics: React.FC = () => {
  const { qrCodes } = useQRCodes();
  const { scans, analytics, loading } = useAnalytics();
  const formatter = useDateFormatter();
  const [mode, setMode] = useState<'real' | 'demo'>('real');
  const [advancedAnalytics, setAdvancedAnalytics] = useState<any>(null);
  const [advancedLoading, setAdvancedLoading] = useState(false);

  // Fetch combined advanced analytics
  useEffect(() => {
    const fetchAdvancedAnalytics = async () => {
      try {
        setAdvancedLoading(true);
        const data = await scansAPI.getAdvancedAnalytics();
        setAdvancedAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch advanced analytics:', error);
      } finally {
        setAdvancedLoading(false);
      }
    };

    if (mode === 'real') {
      fetchAdvancedAnalytics();
    }
  }, [mode]);

  const activeQRs = useMemo(() => qrCodes.filter(qr => qr.status === 'active').length, [qrCodes]);

  // Scans timeline (last 30 days)
  const scansOverTime = useMemo(() => {
    if (mode === 'demo') return getDemoScansOverTime();

    if (analytics?.analytics?.scansByDate) {
      const map: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        map[key] = (analytics.analytics.scansByDate as any)[key] || 0;
      }
      return Object.entries(map).map(([date, scans]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans }));
    }

    const map: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = 0;
    }
    scans.forEach((s: any) => {
      const key = new Date(s.createdAt).toISOString().split('T')[0];
      if (map[key] !== undefined) map[key] += 1;
    });
    return Object.entries(map).map(([date, scans]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans }));
  }, [scans, analytics, mode]);

  const weeklyData = useMemo(() => {
    if (mode === 'demo') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({ day, scans: Math.floor(Math.random() * 100) + 20 }));
    }
    const map: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    scans.forEach((s: any) => {
      const day = new Date(s.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([day, scans]) => ({ day, scans }));
  }, [scans, mode]);

  const deviceData = useMemo(() => {
    if (mode === 'demo') return demoDeviceData;
    if (analytics?.analytics?.devices) {
      return Object.entries(analytics.analytics.devices).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }
    const counts: Record<string, number> = {};
    scans.forEach((s: any) => { const t = s.device?.type || 'desktop'; counts[t] = (counts[t] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [scans, analytics, mode]);

  const topQRCodes = useMemo(() => {
    if (mode === 'demo') return demoTopQRCodes;
    if (analytics?.analytics?.topQRCodes) {
      return analytics.analytics.topQRCodes.map((t: any) => ({ name: t.name || 'Untitled', scans: t.count }));
    }
    const groups: Record<string, number> = {};
    scans.forEach((s: any) => { const name = s.qrCode?.name || 'Unknown'; groups[name] = (groups[name] || 0) + 1; });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, scans]) => ({ name, scans }));
  }, [scans, analytics, mode]);

  const qrTypeDistribution = useMemo(() => {
    const counts = qrCodes.reduce((acc, qr) => { acc[qr.type] = (acc[qr.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [qrCodes]);

  const locationData = useMemo(() => {
    if (mode === 'demo') return demoLocations;
    if (analytics?.analytics?.countries) {
      return Object.entries(analytics.analytics.countries).map(([country, scans]) => ({ country, scans }));
    }
    const counts: Record<string, number> = {};
    scans.forEach((s: any) => { const c = s.location?.country || 'Unknown'; counts[c] = (counts[c] || 0) + 1; });
    return Object.entries(counts).map(([country, scans]) => ({ country, scans })).slice(0, 10);
  }, [scans, analytics, mode]);

  const demoScans = useMemo(() => getDemoScansOverTime(), []);
  const demoTotalScans = useMemo(() => demoScans.reduce((acc, d) => acc + d.scans, 0), [demoScans]);
  const displayedTotalScans = mode === 'real' ? (analytics?.totalScans ?? scans.length) : demoTotalScans;
  const avgScansPerQR = qrCodes.length ? Math.round(displayedTotalScans / qrCodes.length) : 0;

  const recentActivity = useMemo(() => {
    return qrCodes.slice(0, 5).map((qr) => ({
      key: qr.id,
      name: qr.name,
      type: qr.type,
      scans: qr.scans,
      lastScan: `${Math.floor(Math.random() * 24) + 1}h ago`,
      trend: Math.random() > 0.3 ? 'up' : 'down',
      change: `${(Math.random() * 20).toFixed(1)}%`,
    }));
  }, [qrCodes]);

  const activityColumns = [
    { title: 'QR Code', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: 'Scans', dataIndex: 'scans', key: 'scans' },
    { title: 'Last Scan', dataIndex: 'lastScan', key: 'lastScan' },
    { title: 'Trend', key: 'trend', render: (_: any, record: any) => (
      <span className={record.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
        {record.trend === 'up' ? '↑' : '↓'} {record.change}
      </span>
    ) },
  ];

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
    lines.push(`"Active QR Codes",${activeQRs || qrCodes.length}`);
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

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Title level={2} className="!mb-1">Analytics Overview</Title>
            <Text type="secondary">Track performance across all your QR codes</Text>
          </div>
          <div className="flex items-center gap-3">
            <Button icon={<Download size={16} />} onClick={downloadCSV}>
              Export CSV
            </Button>
            <Segmented
              options={[{ label: 'Real', value: 'real' }, { label: 'Demo', value: 'demo' }]}
              value={mode}
              onChange={(val: string | number) => setMode(val as 'real' | 'demo')}
              size="middle"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
              <Statistic title="Total Scans" value={displayedTotalScans || 0} prefix={<Eye size={20} className="text-primary mr-2" />} valueStyle={{ color: '#6366f1', fontSize: '28px' }} />
              <div className="mt-2 text-xs text-green-500">↑ 12% from last month</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
              <Statistic title="Active QR Codes" value={activeQRs || qrCodes.length} prefix={<QrCode size={20} className="text-green-500 mr-2" />} valueStyle={{ color: '#22c55e', fontSize: '28px' }} />
              <div className="mt-2 text-xs text-green-500">↑ 3 new this week</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
              <Statistic title="Avg. Scans/QR" value={avgScansPerQR || 24} prefix={<TrendingUp size={20} className="text-orange-500 mr-2" />} valueStyle={{ color: '#f59e0b', fontSize: '28px' }} />
              <div className="mt-2 text-xs text-green-500">↑ 8% from last week</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <Statistic title="Unique Visitors" value={Math.round((displayedTotalScans || 0) * 0.7)} prefix={<Users size={20} className="text-purple-500 mr-2" />} valueStyle={{ color: '#8b5cf6', fontSize: '28px' }} />
              <div className="mt-2 text-xs text-red-500">↓ 2% bounce rate</div>
            </Card>
          </Col>
        </Row>

        {/* Main Charts Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Scan Activity (Last 30 Days)" className="h-full">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={scansOverTime}>
                  <defs>
                    <linearGradient id="colorScansMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={4} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScansMain)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Device Distribution" className="h-full">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {deviceData.map((_, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Secondary Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Weekly Performance" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="scans" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="QR Code Types" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                    {(qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }]).map((_, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Top Locations" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="scans" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Heatmap & Compare */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <HeatmapByTime scans={scans} mode={mode} />
          </Col>
        </Row>

        {/* Advanced Analytics - New Section */}
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Top Performing QR Codes" className="h-full">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topQRCodes} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                          <Bar dataKey="scans" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Recent Activity">
                      <Table columns={activityColumns} dataSource={recentActivity} pagination={false} size="small" />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'geographic',
              label: 'Geographic',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <GeographicHeatmap data={advancedAnalytics?.heatmap} loading={advancedLoading} />
                  </Col>
                </Row>
              ),
            },
            {
              key: 'timing',
              label: 'Peak Times',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <PeakTimesAnalysis data={advancedAnalytics?.peakTimes} loading={advancedLoading} />
                  </Col>
                </Row>
              ),
            },
            {
              key: 'retention',
              label: 'Retention',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <RetentionAnalysis data={advancedAnalytics?.retention} loading={advancedLoading} />
                  </Col>
                </Row>
              ),
            },
            {
              key: 'referrers',
              label: 'Referrers',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <ReferrerAnalysis data={advancedAnalytics?.referrers} loading={advancedLoading} />
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;;

