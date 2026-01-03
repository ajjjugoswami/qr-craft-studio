import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';
import type { SubscriptionStats } from '@/store/slices/adminSlice';

interface StatsCardsProps {
  stats: SubscriptionStats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in paisa
  };

  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<DollarSign size={20} />}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Active Subscriptions"
            value={stats?.activeSubscriptions || 0}
            valueStyle={{ color: '#1890ff' }}
            prefix={<Users size={20} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Payments"
            value={stats?.totalPayments || 0}
            valueStyle={{ color: '#722ed1' }}
            prefix={<CreditCard size={20} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Conversion Rate"
            value={stats?.conversionRate || 0}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#f5222d' }}
            prefix={<TrendingUp size={20} />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;