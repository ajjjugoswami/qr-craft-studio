/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Table, Tag, Empty, message, Segmented } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, QrCode, TrendingUp, Users, Smartphone, Monitor, Globe } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useQRCodes } from '../hooks/useQRCodes';
import { scansAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getDemoScansOverTime, demoDeviceData, demoTopQRCodes, demoLocations, getDemoWeeklyData } from '@/lib/hardCodeAnalyticsData';

const { Title, Text } = Typography;

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const Analytics: React.FC = () => {
  const { qrCodes } = useQRCodes();
  const { signout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [mode, setMode] = useState<'real' | 'demo'>('real');

  const totalScans = useMemo(() => (mode === 'real' ? (analytics?.totalScans ?? scans.length) : undefined), [mode, scans, analytics]);
  const activeQRs = useMemo(() => qrCodes.filter(qr => qr.status === 'active').length, [qrCodes]);

  // Demo data is imported from shared module `hardCodeAnalyticsData.ts`
  // (see src/lib/hardCodeAnalyticsData.ts)

  // Scans timeline (last 30 days)
  const scansOverTime = useMemo(() => {
    if (mode === 'demo') return getDemoScansOverTime();

    // Prefer analytics.scansByDate when available
    if (analytics?.analytics?.scansByDate) {
      const map: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        map[key] = analytics.analytics.scansByDate[key] || 0;
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

    scans.forEach(s => {
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

    const map: Record<string, number> = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    scans.forEach(s => {
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
    scans.forEach(s => { const t = s.device?.type || 'desktop'; counts[t] = (counts[t]||0)+1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [scans, analytics, mode]);

  const topQRCodes = useMemo(() => {
    if (mode === 'demo') return demoTopQRCodes;

    if (analytics?.analytics?.topQRCodes) {
      return analytics.analytics.topQRCodes.map((t: any) => ({ name: t.name || 'Untitled', scans: t.count }));
    }

    const groups: Record<string, number> = {};
    scans.forEach(s => { const name = s.qrCode?.name || 'Unknown'; groups[name] = (groups[name]||0)+1; });
    return Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name, scans]) => ({ name, scans }));
  }, [scans, analytics, mode]);
  const qrTypeDistribution = useMemo(() => {
    const counts = qrCodes.reduce((acc, qr) => { acc[qr.type] = (acc[qr.type]||0)+1; return acc; }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [qrCodes]);

  const locationData = useMemo(() => {
    if (mode === 'demo') return demoLocations;

    if (analytics?.analytics?.countries) {
      return Object.entries(analytics.analytics.countries).map(([country, scans]) => ({ country, scans }));
    }

    const counts: Record<string, number> = {};
    scans.forEach(s => { const c = s.location?.country || 'Unknown'; counts[c] = (counts[c]||0)+1; });
    return Object.entries(counts).map(([country, scans]) => ({ country, scans })).slice(0, 10);
  }, [scans, analytics, mode]);

  // Load scans & analytics for user when in REAL mode
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mode === 'demo') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [scanRes, analyticsRes] = await Promise.all([
          scansAPI.getAll(),
          scansAPI.getAnalytics(),
        ]);
        if (!mounted) return;
        setScans(scanRes.scans || []);
        setAnalytics(analyticsRes);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          message.error('Session expired, please sign in again');
          signout();
        } else {
          message.error('Failed to load scans/analytics');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [signout, mode]);
  const demoScans = useMemo(() => getDemoScansOverTime(), []);
  const demoTotalScans = useMemo(() => demoScans.reduce((acc, d) => acc + d.scans, 0), [demoScans]);

  const displayedTotalScans = mode === 'real' ? (analytics?.totalScans ?? scans.length) : demoTotalScans;
  const avgScansPerQR = qrCodes.length ? Math.round(displayedTotalScans / qrCodes.length) : 0;

  const recentActivity = useMemo(() => {
    return qrCodes.slice(0, 5).map((qr, i) => ({
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
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { title: 'Scans', dataIndex: 'scans', key: 'scans' },
    { title: 'Last Scan', dataIndex: 'lastScan', key: 'lastScan' },
    { 
      title: 'Trend', 
      key: 'trend',
      render: (_: any, record: any) => (
        <span className={record.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
          {record.trend === 'up' ? '↑' : '↓'} {record.change}
        </span>
      )
    },
  ];

  if (loading) {
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

          {/* Stats Overview skeletons */}
          <Row gutter={[16,16]}>
            {Array.from({length:4}).map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-3 w-40 mt-2" />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Main Charts skeleton */}
          <Row gutter={[16,16]}>
            <Col xs={24} lg={16}>
              <Card className="h-full">
                <Skeleton className="w-full h-72 rounded-lg" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="h-full">
                <Skeleton className="w-full h-72 rounded-lg" />
              </Card>
            </Col>
          </Row>

          {/* Secondary Charts skeleton */}
          <Row gutter={[16,16]}>
            <Col xs={24} lg={8}>
              <Card className="h-full">
                <Skeleton className="w-full h-48 rounded-lg" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="h-full">
                <Skeleton className="w-full h-48 rounded-lg" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="h-full">
                <Skeleton className="w-full h-48 rounded-lg" />
              </Card>
            </Col>
          </Row>

          {/* Top Performing & Recent Activity skeletons */}
          <Row gutter={[16,16]}>
            <Col xs={24} lg={12}>
              <Card>
                <Skeleton className="w-full h-56 rounded-lg" />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  {Array.from({length:5}).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="!mb-1">Analytics Overview</Title>
            <Text type="secondary">Track performance across all your QR codes</Text>
          </div>
          <div>
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
              <Statistic 
                title="Total Scans" 
                value={displayedTotalScans || 0} 
                prefix={<Eye size={20} className="text-primary mr-2" />}
                valueStyle={{ color: '#6366f1', fontSize: '28px' }}
              />
              <div className="mt-2 text-xs text-green-500">↑ 12% from last month</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
              <Statistic 
                title="Active QR Codes" 
                value={activeQRs || qrCodes.length} 
                prefix={<QrCode size={20} className="text-green-500 mr-2" />}
                valueStyle={{ color: '#22c55e', fontSize: '28px' }}
              />
              <div className="mt-2 text-xs text-green-500">↑ 3 new this week</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
              <Statistic 
                title="Avg. Scans/QR" 
                value={avgScansPerQR || 24} 
                prefix={<TrendingUp size={20} className="text-orange-500 mr-2" />}
                valueStyle={{ color: '#f59e0b', fontSize: '28px' }}
              />
              <div className="mt-2 text-xs text-green-500">↑ 8% from last week</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <Statistic 
                title="Unique Visitors" 
                value={Math.round((displayedTotalScans || 0) * 0.7)} 
                prefix={<Users size={20} className="text-purple-500 mr-2" />}
                valueStyle={{ color: '#8b5cf6', fontSize: '28px' }}
              />
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
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={4} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScansMain)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Device Distribution" className="h-full">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="scans" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="QR Code Types" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }, { name: 'vCard', value: 3 }]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {(qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }, { name: 'vCard', value: 3 }]).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
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
                  <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="scans" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Top Performing & Recent Activity */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Top Performing QR Codes">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topQRCodes.length ? topQRCodes : [{ name: 'Sample QR', scans: 50 }]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="scans" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Recent Activity">
              <Table 
                columns={activityColumns} 
                dataSource={recentActivity.length ? recentActivity : []} 
                pagination={false}
                size="small"
                locale={{ emptyText: 'No recent activity' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;