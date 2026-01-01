import React from 'react';
import { Card, Spin, Empty, Typography } from 'antd';
import { Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PeakTimesData, HourlyData } from '@/types/analytics';

const { Title } = Typography;

interface PeakTimesProps {
  data?: PeakTimesData;
  loading?: boolean;
  qrCodeId?: string;
}

const PeakTimesAnalysis: React.FC<PeakTimesProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || !data.hourlyData || !Array.isArray(data.hourlyData) || data.hourlyData.length === 0) {
    return (
      <Card title="Peak Usage Times">
        <Empty description="No data available" />
      </Card>
    );
  }
  const formatHour = (hour: number | string): string => {
    // If already a string, return it
    if (typeof hour === 'string') return hour;
    
    // Convert number to formatted string
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const hourlyChartData = (data.hourlyData || []).map((d: HourlyData) => ({
    hour: formatHour(d.hour ?? 0),
    count: d.count || d.scans || 0,
    hourValue: typeof d.hour === 'number' ? d.hour : 0,
  }));

  const maxCount = Math.max(...(data.hourlyData || []).map((d: HourlyData) => d.count || d.scans || 0), 1);
  const getBarColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return '#ef4444'; // red - very busy
    if (intensity > 0.4) return '#f59e0b'; // orange - busy
    return '#6366f1'; // blue - normal
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          Peak Usage Times
        </div>
      }
    >
      <div className="mb-4">
        <Title level={5}>Scans by Hour of Day</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))', 
                borderRadius: '8px' 
              }} 
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {hourlyChartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.dailyData && (
        <div className="mt-6">
          <Title level={5}>Scans by Day of Week</Title>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.dailyData}>
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
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default PeakTimesAnalysis;
