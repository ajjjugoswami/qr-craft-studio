import React from 'react';
import { Typography, Button, Empty, Card, Row, Col } from 'antd';
import { Plus, QrCode, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDemoScansOverTime, demoDeviceData } from '@/lib/hardCodeAnalyticsData';

const { Title, Text } = Typography;

const EmptyQRState: React.FC = () => {
  const navigate = useNavigate();
  const scansOverTime = getDemoScansOverTime();
  const deviceData = demoDeviceData;

  return (
    <div className="relative">
      <div className="blur-sm opacity-60">
        <Title level={5} className="!mb-4 text-center">Sample Analytics Preview</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Scan Activity (Sample)" className="h-full">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scansOverTime}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={6} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Device Distribution (Sample)" className="h-full">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {deviceData.map((_, index) => (<Cell key={`cell-${index}`} fill={['#6366f1', '#22c55e', '#f59e0b'][index % 3]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Empty
          image={
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <QrCode size={32} className="text-primary md:hidden" />
              <QrCode size={40} className="text-primary hidden md:block" />
            </div>
          }
          description={
            <div className="text-center">
              <Title level={4} className="!mb-2 !text-base md:!text-lg">No QR Codes Yet</Title>
              <Text type="secondary" className="block mb-4 md:mb-6 text-sm">
                Create your first QR code to get started
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<Plus size={18} />}
                onClick={() => navigate('/create')}
                className="w-full sm:w-auto"
              >
                Create Your First QR Code
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default EmptyQRState;