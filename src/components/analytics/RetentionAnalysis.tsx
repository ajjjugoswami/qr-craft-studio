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
          <Users size={16} className="text-primary" />
          <span className="text-sm font-medium">Retention Analysis</span>
        </div>
      }
      size="small"
    >
      <Row gutter={[8, 8]} className="mb-4">
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic 
              title={<span className="text-xs">Unique</span>}
              value={data.uniqueScanners} 
              prefix={<Users size={14} className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic 
              title={<span className="text-xs">New</span>}
              value={data.newScans} 
              prefix={<UserPlus size={14} className="text-blue-500" />}
              valueStyle={{ color: '#6366f1', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic 
              title={<span className="text-xs">Returning</span>}
              value={data.returningScans} 
              prefix={<UserCheck size={14} className="text-green-500" />}
              valueStyle={{ color: '#22c55e', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="text-center">
            <Statistic 
              title={<span className="text-xs">Rate</span>}
              value={data.repeatRate} 
              suffix="%" 
              prefix={<Repeat size={14} className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b', fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Text className="text-xs">New Visitors</Text>
            <Text className="text-xs">{newScanPercentage.toFixed(1)}%</Text>
          </div>
          <Progress 
            percent={newScanPercentage} 
            showInfo={false}
            strokeColor="#6366f1"
            size="small"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <Text className="text-xs">Returning Visitors</Text>
            <Text className="text-xs">{returningScanPercentage.toFixed(1)}%</Text>
          </div>
          <Progress 
            percent={returningScanPercentage} 
            showInfo={false}
            strokeColor="#22c55e"
            size="small"
          />
        </div>
      </div>

      {data.dailyRetention && data.dailyRetention.length > 0 && (
        <div className="mt-4">
          <Text strong className="text-xs">Daily Unique Users</Text>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data.dailyRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={9}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="uniqueUsers" 
                stroke="#8b5cf6" 
                strokeWidth={1.5}
                dot={{ fill: '#8b5cf6', r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default RetentionAnalysis;
