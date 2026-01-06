import React from 'react';
import { Card, Empty, Typography, Statistic, Row, Col } from 'antd';
import { MapPin } from 'lucide-react';
import { GeographicHeatmapData, CityData } from '@/types/analytics';
import LogoLoader from '@/components/common/LogoLoader';

const { Title, Text } = Typography;

interface HeatmapProps {
  data?: GeographicHeatmapData;
  loading?: boolean;
  qrCodeId?: string;
}

const GeographicHeatmap: React.FC<HeatmapProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <LogoLoader size="sm" />
        </div>
      </Card>
    );
  }

  if (!data || !data.cityData || !Array.isArray(data.cityData) || data.cityData.length === 0) {
    return (
      <Card title="Geographic Distribution">
        <Empty description="No geographic data available" />
      </Card>
    );
  }

  const topCities = (data.cityData || []).slice(0, 10);
  const maxCount = Math.max(...topCities.map((c: any) => c.count || c.scans || 0), 1);
  
  // Calculate total scans if not provided
  const totalScans = data.total || data.totalScansWithCoordinates || 
    (data.cityData || []).reduce((sum, city) => sum + (city.count || city.scans || 0), 0);

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
          <Statistic title="Total Locations" value={data.cityData?.length || 0} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Scans" value={totalScans} />
        </Col>
      </Row>

      <div className="space-y-3">
        <Title level={5}>Top Locations</Title>
        {topCities.map((city: CityData, index: number) => {
          const count = city.count || city.scans || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <Text strong>
                  {city.city || 'Unknown'}, {city.country || 'Unknown'}
                </Text>
                <Text type="secondary">{count} scans</Text>
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
