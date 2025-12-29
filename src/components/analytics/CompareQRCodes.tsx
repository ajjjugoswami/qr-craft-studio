import React, { useState, useMemo } from 'react';
import { Card, Typography, Select, Empty, Row, Col, Statistic, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { QRCodeData } from '@/types/qrcode';

const { Text, Title } = Typography;

interface CompareQRCodesProps {
  qrCodes: QRCodeData[];
}

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const CompareQRCodes: React.FC<CompareQRCodesProps> = ({ qrCodes }) => {
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);

  const selectedQRData = useMemo(() => {
    return qrCodes.filter((qr) => selectedQRs.includes(qr.id));
  }, [qrCodes, selectedQRs]);

  const comparisonData = useMemo(() => {
    if (selectedQRData.length < 2) return null;

    const metrics = selectedQRData.map((qr) => ({
      name: qr.name.length > 15 ? qr.name.substring(0, 15) + '...' : qr.name,
      fullName: qr.name,
      scans: qr.scans,
      type: qr.type,
      status: qr.status,
      createdAt: new Date(qr.createdAt).toLocaleDateString(),
      // Calculate days active
      daysActive: Math.floor((Date.now() - new Date(qr.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      // Scans per day (avoid division by zero)
      scansPerDay: Math.round((qr.scans / Math.max(1, Math.floor((Date.now() - new Date(qr.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 10) / 10,
    }));

    return metrics;
  }, [selectedQRData]);

  const radarData = useMemo(() => {
    if (!comparisonData) return [];

    const maxScans = Math.max(...comparisonData.map((d) => d.scans), 1);
    const maxDays = Math.max(...comparisonData.map((d) => d.daysActive), 1);
    const maxScansPerDay = Math.max(...comparisonData.map((d) => d.scansPerDay), 1);

    return [
      {
        metric: 'Total Scans',
        ...comparisonData.reduce((acc, d, i) => ({ ...acc, [`qr${i}`]: (d.scans / maxScans) * 100 }), {}),
      },
      {
        metric: 'Days Active',
        ...comparisonData.reduce((acc, d, i) => ({ ...acc, [`qr${i}`]: (d.daysActive / maxDays) * 100 }), {}),
      },
      {
        metric: 'Scans/Day',
        ...comparisonData.reduce((acc, d, i) => ({ ...acc, [`qr${i}`]: (d.scansPerDay / maxScansPerDay) * 100 }), {}),
      },
      {
        metric: 'Activity',
        ...comparisonData.reduce((acc, d, i) => ({ ...acc, [`qr${i}`]: d.status === 'active' ? 100 : 30 }), {}),
      },
    ];
  }, [comparisonData]);

  const getTrendIcon = (value: number, best: number) => {
    if (value === best) return <TrendingUp size={14} className="text-green-500" />;
    if (value < best * 0.5) return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-muted-foreground" />;
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <GitCompare size={18} />
          Compare QR Codes
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {/* QR Code Selector */}
        <div>
          <Text type="secondary" className="block mb-2">Select 2-4 QR codes to compare</Text>
          <Select
            mode="multiple"
            placeholder="Select QR codes to compare"
            value={selectedQRs}
            onChange={setSelectedQRs}
            className="w-full"
            maxTagCount={4}
            options={qrCodes.map((qr) => ({
              label: (
                <div className="flex items-center gap-2">
                  <span>{qr.name}</span>
                  <Tag color={qr.status === 'active' ? 'green' : 'default'} className="text-xs">
                    {qr.scans} scans
                  </Tag>
                </div>
              ),
              value: qr.id,
            }))}
            disabled={selectedQRs.length >= 4}
            optionFilterProp="label"
          />
        </div>

        {selectedQRData.length < 2 ? (
          <Empty
            description="Select at least 2 QR codes to compare"
            className="py-8"
          />
        ) : (
          <div className="space-y-6">
            {/* Stats Comparison */}
            <Row gutter={[16, 16]}>
              {comparisonData?.map((qr, index) => (
                <Col key={qr.fullName} xs={24} sm={12} lg={24 / Math.min(comparisonData.length, 4)}>
                  <Card 
                    size="small" 
                    className="text-center"
                    style={{ borderTop: `3px solid ${CHART_COLORS[index]}` }}
                  >
                    <Text strong className="block mb-2 truncate" title={qr.fullName}>
                      {qr.name}
                    </Text>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Text type="secondary">Scans</Text>
                        <div className="font-bold text-lg" style={{ color: CHART_COLORS[index] }}>
                          {qr.scans}
                          {getTrendIcon(qr.scans, Math.max(...comparisonData.map((d) => d.scans)))}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Scans/Day</Text>
                        <div className="font-bold text-lg" style={{ color: CHART_COLORS[index] }}>
                          {qr.scansPerDay}
                          {getTrendIcon(qr.scansPerDay, Math.max(...comparisonData.map((d) => d.scansPerDay)))}
                        </div>
                      </div>
                    </div>
                    <Tag color={qr.status === 'active' ? 'green' : 'default'} className="mt-2">
                      {qr.type}
                    </Tag>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Bar Chart Comparison */}
            <div>
              <Text strong className="block mb-2">Scans Comparison</Text>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="scans" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart for multi-metric comparison */}
            {comparisonData && comparisonData.length >= 2 && (
              <div>
                <Text strong className="block mb-2">Performance Overview</Text>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    {comparisonData.map((_, index) => (
                      <Radar
                        key={index}
                        name={comparisonData[index].fullName}
                        dataKey={`qr${index}`}
                        stroke={CHART_COLORS[index]}
                        fill={CHART_COLORS[index]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompareQRCodes;
