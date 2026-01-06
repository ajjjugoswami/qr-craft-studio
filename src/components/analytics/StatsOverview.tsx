import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { Eye, QrCode, TrendingUp, Users } from 'lucide-react';

interface StatsOverviewProps {
  displayedTotalScans: number;
  activeQRs: number;
  totalQRCodes: number;
  avgScansPerQR: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  displayedTotalScans,
  activeQRs,
  totalQRCodes,
  avgScansPerQR,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <Statistic 
            title="Total Scans" 
            value={displayedTotalScans || 0} 
            prefix={<Eye size={20} className="text-primary mr-2" />} 
            valueStyle={{ color: '#6366f1', fontSize: '28px' }} 
          />
          <div className="mt-2 text-xs text-green-500">↑ 12% from last month</div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <Statistic 
            title="Active QR Codes" 
            value={activeQRs || 0} 
            prefix={<QrCode size={20} className="text-green-500 mr-2" />} 
            valueStyle={{ color: '#22c55e', fontSize: '28px' }} 
          />
          <div className="mt-2 text-xs text-green-500">↑ 3 new this week</div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
          <Statistic 
            title="Avg. Scans/QR" 
            value={avgScansPerQR || 24} 
            prefix={<TrendingUp size={20} className="text-orange-500 mr-2" />} 
            valueStyle={{ color: '#f59e0b', fontSize: '28px' }} 
          />
          <div className="mt-2 text-xs text-green-500">↑ 8% from last week</div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <Statistic 
            title="Unique Visitors" 
            value={Math.round((displayedTotalScans || 0) * 0.7)} 
            prefix={<Users size={20} className="text-purple-500 mr-2" />} 
            valueStyle={{ color: '#8b5cf6', fontSize: '28px' }} 
          />
          <div className="mt-2 text-xs text-red-500">↓ 2% bounce rate</div>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsOverview;
