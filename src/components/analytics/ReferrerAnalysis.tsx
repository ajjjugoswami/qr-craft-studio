import React from 'react';
import { Card, Spin, Empty, Typography, Table } from 'antd';
import { Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ReferrerAnalyticsData, ReferrerData } from '@/types/analytics';

const { Title, Text } = Typography;

interface ReferrerProps {
  data?: ReferrerAnalyticsData;
  loading?: boolean;
  qrCodeId?: string;
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const ReferrerAnalysis: React.FC<ReferrerProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || !data.referrers || !Array.isArray(data.referrers)) {
    return (
      <Card title="Referrer Analysis">
        <Empty description="No data available" />
      </Card>
    );
  }

  const categoryData = Object.entries(data.categorized || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  })).filter(d => d.value > 0);

  const columns = [
    {
      title: 'Referrer Source',
      dataIndex: 'referrer',
      key: 'referrer',
      render: (text: string) => (
        <Text code className="text-xs">
          {text && text.length > 50 ? text.substring(0, 50) + '...' : (text || 'Unknown')}
        </Text>
      ),
    },
    {
      title: 'Scans',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      align: 'right' as const,
      render: (count: number) => <Text strong>{count}</Text>,
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Share2 size={18} className="text-primary" />
          Referrer Analysis
        </div>
      }
    >
      {categoryData.length > 0 && (
        <div className="mb-6">
          <Title level={5}>Traffic Sources</Title>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.referrers && Array.isArray(data.referrers) && data.referrers.length > 0 && (
        <div className="mt-6">
          <Title level={5}>Top Referrers</Title>
          <Table<ReferrerData>
            columns={columns}
            dataSource={data.referrers}
            rowKey={(record, index) => record.referrer || `referrer-${index}`}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            size="large"
          />
        </div>
      )}
    </Card>
  );
};

export default ReferrerAnalysis;
