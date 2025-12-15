import React from 'react';
import { Typography, Card, Empty } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title } = Typography;

const Analytics: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Title level={2} className="mb-8">Analytics</Title>
        <Card className="h-96 flex items-center justify-center">
          <Empty
            image={<BarChartOutlined style={{ fontSize: 64, color: 'hsl(var(--muted-foreground))' }} />}
            description="Analytics will be available once you have QR codes with scan data"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
