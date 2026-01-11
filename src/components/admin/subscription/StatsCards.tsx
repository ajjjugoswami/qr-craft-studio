import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import type { SubscriptionStats } from '@/store/slices/adminSlice';
import { formatStatsCurrency } from '@/utils/currencyFormatter';

interface StatsCardsProps {
  stats: SubscriptionStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <Row gutter={[12, 12]} className="mb-4">
      <Col xs={12} sm={12} lg={6}>
        <Card bodyStyle={{ padding: 12 }}>
          <Statistic
            title={<span className="text-xs">Total Revenue</span>}
            value={stats?.totalRevenue || 0}
            precision={0}
            valueStyle={{ color: '#3f8600', fontSize: 18 }}
            formatter={(value) => formatStatsCurrency(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bodyStyle={{ padding: 12 }}>
          <Statistic
            title={<span className="text-xs">Active Subs</span>}
            value={stats?.activeSubscriptions || 0}
            valueStyle={{ color: '#1890ff', fontSize: 18 }}
            prefix={<Users size={16} />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bodyStyle={{ padding: 12 }}>
          <Statistic
            title={<span className="text-xs">Payments</span>}
            value={stats?.totalPayments || 0}
            valueStyle={{ color: '#722ed1', fontSize: 18 }}
            prefix={<CreditCard size={16} />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bodyStyle={{ padding: 12 }}>
          <Statistic
            title={<span className="text-xs">Conversion</span>}
            value={stats?.conversionRate || 0}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#f5222d', fontSize: 18 }}
            prefix={<TrendingUp size={16} />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;