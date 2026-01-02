import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Button, Statistic, Row, Col, Spin, Segmented, message } from 'antd';
import { ArrowLeft, MapPin, Eye, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useQRCodes } from '../hooks/useQRCodes';
import { useQRAnalytics } from '@/hooks/useQRAnalytics';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatTimeStringShort } from '@/utils/timeFormatter';
import type { ScanData } from '../types/qrcode';
import { generateMockScanData, getDemoQRCodeAnalytics } from '@/lib/hardCodeQRCodeAnalyticsData';

const { Title, Text } = Typography;

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const QRAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQRCode } = useQRCodes();
  const { scans: realScans, analytics: realAnalytics, loading } = useQRAnalytics(id);
  const formatter = useDateFormatter();
  const user = useSelector((state: RootState) => state.auth.user);
  const is24Hour = user?.timeFormat === '24';
  const [mode, setMode] = useState<'real' | 'demo'>('real');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const qrCode = id ? getQRCode(id) : undefined;

  // Demo data
  const demoAnalytics = useMemo(() => getDemoQRCodeAnalytics(), []);
  const demoScans = useMemo(() => generateMockScanData(15), []);

  const scanData = mode === 'real' ? realScans : demoScans;
  const analytics = mode === 'real' ? realAnalytics : demoAnalytics;

  // Process data for charts
  const deviceTypeData = useMemo(() => {
    if (analytics?.analytics?.devices) {
      return Object.entries(analytics.analytics.devices).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }
    const counts = scanData.reduce((acc, scan) => {
      acc[scan.deviceType] = (acc[scan.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [scanData, analytics]);

  const browserData = useMemo(() => {
    if (analytics?.analytics?.browsers) {
      return Object.entries(analytics.analytics.browsers).map(([name, value]) => ({ name, value }));
    }
    const counts = scanData.reduce((acc, scan) => {
      const browser = scan.browser.split(' ')[0];
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 5);
  }, [scanData, analytics]);

  const locationData = useMemo(() => {
    if (analytics?.analytics?.countries) {
      return Object.entries(analytics.analytics.countries).map(([name, value]) => ({ name, value }));
    }
    const counts = scanData.reduce((acc, scan) => {
      const loc = `${scan.location.city}, ${scan.location.country}`;
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 5);
  }, [scanData, analytics]);

  const scansOverTime = useMemo(() => {
    if (analytics?.analytics?.scansByDate) {
      const entries = Object.entries(analytics.analytics.scansByDate)
        .slice(-7)
        .map(([date, count]) => ({ day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), scans: count }));
      return entries;
    }
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    return last7Days.map(day => ({ day, scans: Math.floor(Math.random() * 10) + 1 }));
  }, [analytics]);

  const columns = [
    { 
      title: 'Scan Date', 
      dataIndex: 'date', 
      key: 'date', 
      width: 120,
      render: (date: string) => <Text>{date}</Text>
    },
    { 
      title: 'Scan Time', 
      dataIndex: 'time', 
      key: 'time', 
      width: 100,
      render: (time: string) => <Text type="secondary">{formatTimeStringShort(time, is24Hour)}</Text>
    },
    { 
      title: 'Browser', 
      dataIndex: 'browser', 
      key: 'browser', 
      width: 180, 
      ellipsis: true,
      render: (browser: string) => <Text>{browser}</Text>
    },
    { 
      title: 'Operating System', 
      dataIndex: 'os', 
      key: 'os', 
      width: 150,
      render: (os: string) => <Text>{os}</Text>
    },
    { 
      title: 'Device Type', 
      dataIndex: 'deviceType', 
      key: 'deviceType', 
      width: 120, 
      render: (type: string) => (
        <Tag color={type === 'mobile' ? 'blue' : type === 'tablet' ? 'purple' : 'green'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ) 
    },
    { 
      title: 'Device Vendor', 
      dataIndex: 'deviceVendor', 
      key: 'deviceVendor', 
      width: 130,
      render: (vendor: string) => <Text type="secondary">{vendor || '-'}</Text>
    },
    { 
      title: 'Device Model', 
      dataIndex: 'deviceModel', 
      key: 'deviceModel', 
      width: 130,
      render: (model: string) => <Text type="secondary">{model || '-'}</Text>
    },
    { 
      title: 'IP Address', 
      dataIndex: 'ipAddress', 
      key: 'ipAddress', 
      width: 140,
      render: (ip: string) => <Text code copyable>{ip}</Text>
    },
    { 
      title: 'Location', 
      key: 'location', 
      width: 280, 
      render: (_: any, record: ScanData) => (
        <div className="flex items-start gap-1">
          <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <Text className="text-xs">
            {record.location.city}, {record.location.region}, {record.location.country}
            {record.location.lat ? ` (${record.location.lat}, ${record.location.lng})` : ''}
          </Text>
        </div>
      ) 
    },
  ];

  const totalScans = analytics?.totalScans ?? scanData.length;

  const downloadCSV = useCallback(() => {
    const headers = ['Date', 'Time', 'Browser', 'OS', 'Device Type', 'Device Vendor', 'Device Model', 'IP Address', 'City', 'Region', 'Country'];
    const rows = scanData.map((scan) => [
      scan.date,
      scan.time,
      scan.browser,
      scan.os,
      scan.deviceType,
      scan.deviceVendor,
      scan.deviceModel,
      scan.ipAddress,
      scan.location.city,
      scan.location.region,
      scan.location.country,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-analytics-${qrCode?.name || id}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('CSV downloaded successfully');
  }, [scanData, qrCode, id]);

  if (loading && mode === 'real') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <Button icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard')} />
          <div className="flex-1 min-w-0">
            <Title level={2} className="!mb-0">{qrCode?.name || 'QR Code'}</Title>
            <Text type="secondary">QR Code Analytics & Scan Details</Text>
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
            <Card className="hover:shadow-md transition-shadow">
              <Statistic title="Total Scans" value={totalScans} prefix={<Eye size={20} className="text-primary mr-2" />} valueStyle={{ color: '#6366f1' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic title="Unique Locations" value={(analytics?.analytics && Object.keys(analytics.analytics.countries || {}).length) || locationData.length} prefix={<MapPin size={20} className="text-orange-500 mr-2" />} valueStyle={{ color: '#f59e0b' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic title="Growth Rate" value={12.5} suffix="%" prefix={<TrendingUp size={20} className="text-purple-500 mr-2" />} valueStyle={{ color: '#8b5cf6' }} />
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Scans Over Time" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={scansOverTime}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Device Distribution" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={deviceTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {deviceTypeData.map((_, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* More Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Top Browsers" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={browserData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Top Locations" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Scan Details Table */}
        <Card title={<div className="flex items-center gap-2"><Eye size={18} className="text-primary" /> Scan Details</div>} className="overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={scanData} 
            rowKey="id" 
            scroll={{ x: 1400 }} 
            pagination={{ 
              current: currentPage,
              pageSize: pageSize, 
              showSizeChanger: true, 
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Total ${total} scans`,
              size: 'default',
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }} 
            size="middle"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QRAnalytics;
