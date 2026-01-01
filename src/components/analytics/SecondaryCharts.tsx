import React from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeeklyData, QRTypeData, LocationData } from '@/types/analytics';

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface SecondaryChartsProps {
  weeklyData: WeeklyData[];
  qrTypeDistribution: QRTypeData[];
  locationData: LocationData[];
}

const SecondaryCharts: React.FC<SecondaryChartsProps> = ({
  weeklyData,
  qrTypeDistribution,
  locationData,
}) => {
  return (
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
              <Pie 
                data={qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }]} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                dataKey="value" 
                label={({ name }) => name}
              >
                {(qrTypeDistribution.length ? qrTypeDistribution : [{ name: 'URL', value: 5 }]).map((_, index) => (
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
              <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="scans" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default SecondaryCharts;
