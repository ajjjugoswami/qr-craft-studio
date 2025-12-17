import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Table, Tag, Button, Empty, Statistic, Row, Col, Spin, message } from 'antd';
import { ArrowLeft, MapPin, Smartphone, Monitor, Tablet, Globe, Eye, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useQRCodes } from '../hooks/useQRCodes';
import type { ScanData } from '../types/qrcode';
import { qrCodeAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

// Mock scan data generator for demo
const generateMockScanData = (count: number): ScanData[] => {
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung Browser', 'Mobile Chrome', 'Mobile Safari'];
  const oses = ['iOS 17.2', 'iOS 18.0', 'Android 14', 'Windows 11', 'macOS 14', 'Android 13'];
  const devices: Array<'mobile' | 'tablet' | 'desktop'> = ['mobile', 'tablet', 'desktop'];
  const vendors = ['Apple', 'Samsung', 'Google', 'Dell', 'HP', 'OnePlus', 'Xiaomi'];
  const models = ['iPhone 15', 'iPhone 14', 'Galaxy S24', 'Pixel 8', 'iPad Pro', 'MacBook Pro', 'Windows PC'];
  const locations = [
    { city: 'Kaithal', region: 'HR', country: 'IN', lat: 29.8015, lng: 76.4, timezone: 'Asia/Kolkata' },
    { city: 'New Delhi', region: 'DL', country: 'IN', lat: 28.6139, lng: 77.209, timezone: 'Asia/Kolkata' },
    { city: 'Mumbai', region: 'MH', country: 'IN', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata' },
    { city: 'New York', region: 'NY', country: 'US', lat: 40.7128, lng: -74.006, timezone: 'America/New_York' },
    { city: 'London', region: 'ENG', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const deviceType = devices[Math.floor(Math.random() * devices.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      id: `scan-${i + 1}`,
      date: date.toLocaleDateString('en-GB'),
      time: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'am' : 'pm'}`,
      browser: browsers[Math.floor(Math.random() * browsers.length)] + ` ${Math.floor(Math.random() * 50) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 1000)}`,
      os: oses[Math.floor(Math.random() * oses.length)],
      deviceType,
      deviceVendor: vendors[Math.floor(Math.random() * vendors.length)],
      deviceModel: models[Math.floor(Math.random() * models.length)],
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      location,
    };
  });
};

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const QRAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQRCode } = useQRCodes();
  const { signout } = useAuth();

  const qrCode = id ? getQRCode(id) : undefined;

  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState<ScanData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch analytics and scans
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [aRes, sRes] = await Promise.all([
          qrCodeAPI.getAnalytics(id),
          qrCodeAPI.getScans(id),
        ]);

        if (!mounted) return;

        // aRes: { success, totalScans, analytics }
        setAnalytics(aRes.analytics ? aRes : { success: true, totalScans: 0, analytics: {} });

        // sRes: { success, count, scans }
        const scans = (sRes.scans || []).map((s: any) => ({
          id: s._id,
          date: new Date(s.createdAt).toLocaleDateString('en-GB'),
          time: new Date(s.createdAt).toLocaleTimeString('en-GB'),
          browser: `${s.browser?.name ?? 'Unknown'} ${s.browser?.version ?? ''}`.trim(),
          os: `${s.os?.name ?? 'Unknown'} ${s.os?.version ?? ''}`.trim(),
          deviceType: s.device?.type || 'desktop',
          deviceVendor: s.device?.vendor || '',
          deviceModel: s.device?.model || '',
          ipAddress: s.ip || s.ipAddress || '',
          location: {
            city: s.location?.city || '',
            region: s.location?.region || '',
            country: s.location?.country || '',
            lat: s.location?.latitude || s.location?.lat || 0,
            lng: s.location?.longitude || s.location?.lng || 0,
            timezone: s.location?.timezone || '',
          },
        } as ScanData));

        setScanData(scans.length ? scans : generateMockScanData(15));

      } catch (err: any) {
        if (err?.response?.status === 401) {
          message.error('Session expired, please sign in again');
          signout();
        } else {
          message.error('Failed to load analytics');
        }
        // fallback to mock
        setScanData(generateMockScanData(qrCode?.scans || 15));
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [id, qrCode?.scans, signout]);

  // Process data for charts
  const deviceTypeData = useMemo(() => {
    // Prefer analytics.devices if present
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
    // Prefer analytics scansByDate if present
    if (analytics?.analytics?.scansByDate) {
      // analytics.analytics.scansByDate is { 'YYYY-MM-DD': count }
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
    return last7Days.map(day => ({
      day,
      scans: Math.floor(Math.random() * 10) + 1,
    }));
  }, [analytics]);

  const columns = [
    { title: 'Scan Date', dataIndex: 'date', key: 'date', width: 100 },
    { title: 'Scan Time', dataIndex: 'time', key: 'time', width: 90 },
    { title: 'Browser', dataIndex: 'browser', key: 'browser', width: 200, ellipsis: true },
    { title: 'Operating System', dataIndex: 'os', key: 'os', width: 120 },
    { 
      title: 'Device Type', 
      dataIndex: 'deviceType', 
      key: 'deviceType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'mobile' ? 'blue' : type === 'tablet' ? 'purple' : 'green'}>
          {type}
        </Tag>
      )
    },
    { title: 'Device Vendor', dataIndex: 'deviceVendor', key: 'deviceVendor', width: 110 },
    { title: 'Device Model', dataIndex: 'deviceModel', key: 'deviceModel', width: 110 },
    { title: 'IP Address', dataIndex: 'ipAddress', key: 'ipAddress', width: 130 },
    { 
      title: 'Location', 
      key: 'location', 
      width: 250,
      render: (_: any, record: ScanData) => (
        <span className="text-xs">
          {record.location.city}, {record.location.region}, {record.location.country} {record.location.city ? `(${record.location.city})` : ''}
          {record.location.lat ? ` (Lat ${record.location.lat}, Lng ${record.location.lng})` : ''}
        </span>
      )
    },
  ];

  if (!qrCode) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Empty description="QR Code not found" />
          <Button type="primary" className="mt-4" onClick={() => navigate('/')}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const DeviceIcon = ({ type }: { type: string }) => {
    if (type === 'mobile') return <Smartphone size={18} className="text-blue-500" />;
    if (type === 'tablet') return <Tablet size={18} className="text-purple-500" />;
    return <Monitor size={18} className="text-green-500" />;
  };

  // Show loading while fetching analytics
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  const totalScans = analytics?.totalScans ?? scanData.length;

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            icon={<ArrowLeft size={18} />} 
            onClick={() => navigate('/')}
          />
          <div>
            <Title level={2} className="!mb-0">{qrCode.name}</Title>
            <Text type="secondary">QR Code Analytics & Scan Details</Text>
          </div>
        </div>

        {/* Stats Overview */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic 
                title="Total Scans" 
                value={totalScans} 
                prefix={<Eye size={20} className="text-primary mr-2" />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic 
                title="Today's Scans" 
                value={Math.floor(Math.random() * 5) + 1} 
                prefix={<Calendar size={20} className="text-green-500 mr-2" />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic 
                title="Unique Locations" 
                value={(analytics && analytics.analytics && Object.keys(analytics.analytics.countries || {}).length) || locationData.length} 
                prefix={<MapPin size={20} className="text-orange-500 mr-2" />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic 
                title="Growth Rate" 
                value={12.5} 
                suffix="%" 
                prefix={<TrendingUp size={20} className="text-purple-500 mr-2" />}
                valueStyle={{ color: '#8b5cf6' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]}>
          {/* Scans Over Time */}
          <Col xs={24} lg={12}>
            <Card title="Scans Over Time" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={scansOverTime}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Device Distribution */}
          <Col xs={24} lg={12}>
            <Card title="Device Distribution" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* More Charts */}
        <Row gutter={[16, 16]}>
          {/* Browser Stats */}
          <Col xs={24} lg={12}>
            <Card title="Top Browsers" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={browserData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Top Locations */}
          <Col xs={24} lg={12}>
            <Card title="Top Locations" className="h-full">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData} layout="vertical">
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
                  <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Scan Details Table */}
        <Card title="Scan Details" className="overflow-hidden">
          <Table
            columns={columns}
            dataSource={scanData}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true, 
              showTotal: (total) => `Total ${total} scans` 
            }}
            size="small"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QRAnalytics;