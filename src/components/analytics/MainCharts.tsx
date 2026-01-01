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
  return (
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
  );
};

export default MainCharts;
