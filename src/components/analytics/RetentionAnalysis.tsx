import React from 'react';
import { Card, Spin, Empty, Typography, Statistic, Row, Col, Progress } from 'antd';
import { Users, UserCheck, UserPlus, Repeat } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

interface RetentionProps {
  data?: any;
  loading?: boolean;
  qrCodeId?: string;
}

const RetentionAnalysis: React.FC<RetentionProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="Retention Analysis">
        <Empty description="No data available" />
      </Card>
    );
  }
  const newScanPercentage = data.totalScans > 0 ? (data.newScans / data.totalScans) * 100 : 0;
  const returningScanPercentage = data.totalScans > 0 ? (data.returningScans / data.totalScans) * 100 : 0;

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary" />
          Retention Analysis
        </div>
      }
    >
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Unique Scanners" 
              value={data.uniqueScanners} 
              prefix={<Users size={20} className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="New Scans" 
              value={data.newScans} 
              prefix={<UserPlus size={20} className="text-blue-500" />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Returning Scans" 
              value={data.returningScans} 
              prefix={<UserCheck size={20} className="text-green-500" />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Statistic 
              title="Repeat Rate" 
              value={data.repeatRate} 
              suffix="%" 
              prefix={<Repeat size={20} className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Text strong>New Visitors</Text>
            <Text>{newScanPercentage.toFixed(1)}%</Text>
          </div>
          <Progress 
            percent={newScanPercentage} 
            showInfo={false}
            strokeColor="#6366f1"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Text strong>Returning Visitors</Text>
            <Text>{returningScanPercentage.toFixed(1)}%</Text>
          </div>
          <Progress 
            percent={returningScanPercentage} 
            showInfo={false}
            strokeColor="#22c55e"
          />
        </div>
      </div>

      {data.dailyRetention && data.dailyRetention.length > 0 && (
        <div className="mt-6">
          <Title level={5}>Daily Unique Users (Last 30 Days)</Title>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.dailyRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="uniqueUsers" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default RetentionAnalysis;
