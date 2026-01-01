import React from 'react';
import { Card, Row, Col } from 'antd';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScanData, DeviceData } from '@/types/analytics';

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface MainChartsProps {
  scansOverTime: ScanData[];
  deviceData: DeviceData[];
}

const MainCharts: React.FC<MainChartsProps> = ({ scansOverTime, deviceData }) => {
  // Custom tooltip component for better visuals
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-1">{label}</p>
          <p className="text-primary text-lg font-bold">
            {payload[0].value.toLocaleString()} scans
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Scan Activity (Last 30 Days)" className="chart-container glass-card">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scansOverTime}>
              <defs>
                <linearGradient id="colorScansMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={4} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="scans" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorScansMain)"
                animationDuration={1000}
                animationBegin={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card title="Device Distribution" className="chart-container glass-card h-full">
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
                animationBegin={0}
                animationDuration={800}
              >
                {deviceData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default MainCharts;
