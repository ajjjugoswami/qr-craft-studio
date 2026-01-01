import React from 'react';
import { Card, Spin, Empty, Typography, Statistic, Row, Col } from 'antd';
import { MapPin } from 'lucide-react';

const { Title, Text } = Typography;

interface HeatmapProps {
  data?: any;
  loading?: boolean;
  qrCodeId?: string;
}

const GeographicHeatmap: React.FC<HeatmapProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data || !data.cityData || data.cityData.length === 0) {
    return (
      <Card title="Geographic Distribution">
        <Empty description="No geographic data available" />
      </Card>
    );
  }

  const topCities = data.cityData.slice(0, 10);
  const maxCount = Math.max(...topCities.map((c: any) => c.count));

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          Geographic Distribution
        </div>
      }
    >
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={12}>
          <Statistic title="Total Locations" value={data.cityData.length} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Scans" value={data.total} />
        </Col>
      </Row>

      <div className="space-y-3">
        <Title level={5}>Top Locations</Title>
        {topCities.map((city: any, index: number) => {
          const percentage = (city.count / maxCount) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Text strong>
                  {city.city}, {city.country}
                </Text>
                <Text type="secondary">{city.count} scans</Text>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.cityData.length > 10 && (
        <Text type="secondary" className="mt-4 block text-center">
          And {data.cityData.length - 10} more locations...
        </Text>
      )}
    </Card>
  );
};

export default GeographicHeatmap;
