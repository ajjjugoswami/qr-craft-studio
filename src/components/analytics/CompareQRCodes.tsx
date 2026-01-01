import React, { useState, useMemo, useEffect } from 'react';
import { Card, Typography, Select, Empty, Row, Col, Tag, Skeleton } from 'antd';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { GitCompare } from 'lucide-react';
import { QRCodeData } from '@/types/qrcode';

const { Text } = Typography;

interface CompareQRCodesProps {
  qrCodes: QRCodeData[];
  loading?: boolean;
}

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CompareQRCodes: React.FC<CompareQRCodesProps> = ({ qrCodes, loading = false }) => {
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);

  // Auto-select first 4 QR codes when data loads
  useEffect(() => {
    if (qrCodes.length > 0 && selectedQRs.length === 0) {
      const defaultSelection = qrCodes.slice(0, 4).map(qr => qr.id);
      setSelectedQRs(defaultSelection);
    }
  }, [qrCodes]);

  const selectedQRData = useMemo(() => {
    return qrCodes.filter((qr) => selectedQRs.includes(qr.id));
  }, [qrCodes, selectedQRs]);

  const comparisonData = useMemo(() => {
    if (selectedQRData.length < 2) return null;

    const metrics = selectedQRData.map((qr, index) => ({
      name: qr.name.length > 12 ? qr.name.substring(0, 12) + '...' : qr.name,
      fullName: qr.name,
      scans: qr.scans,
      type: qr.type,
      status: qr.status,
      createdAt: new Date(qr.createdAt).toLocaleDateString(),
      daysActive: Math.max(1, Math.floor((Date.now() - new Date(qr.createdAt).getTime()) / (1000 * 60 * 60 * 24))),
      scansPerDay: Math.round((qr.scans / Math.max(1, Math.floor((Date.now() - new Date(qr.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 10) / 10,
      color: CHART_COLORS[index % CHART_COLORS.length],
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

  // Pie chart data for scan distribution
  const pieData = useMemo(() => {
    if (!comparisonData) return [];
    return comparisonData.map((d, index) => ({
      name: d.name,
      value: d.scans,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [comparisonData]);

  // Trend data for line chart (simulated weekly trends)
  const trendData = useMemo(() => {
    if (!comparisonData) return [];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, weekIndex) => {
      const weekData: Record<string, any> = { week };
      comparisonData.forEach((qr, qrIndex) => {
        // Simulate trend based on scans per day
        const baseValue = qr.scansPerDay * 7;
        const variance = (Math.random() - 0.5) * baseValue * 0.3;
        weekData[`qr${qrIndex}`] = Math.max(0, Math.round(baseValue + variance + (weekIndex * qr.scansPerDay)));
      });
      return weekData;
    });
  }, [comparisonData]);

  if (loading) {
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
          <Skeleton.Input active block className="h-10" />
          <Row gutter={[12, 12]}>
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))}
          </Row>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </Card>
    );
  }

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
          <Text type="secondary" className="block mb-2">Select QR codes to compare (minimum 2)</Text>
          <Select
            mode="multiple"
            placeholder="Select QR codes to compare"
            value={selectedQRs}
            onChange={setSelectedQRs}
            className="w-full"
            options={qrCodes.map((qr) => ({
              label: `${qr.name} (${qr.scans} scans)`,
              value: qr.id,
            }))}
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
            {/* Stats Comparison Cards */}
            <Row gutter={[12, 12]}>
              {comparisonData?.map((qr, index) => (
                <Col key={qr.fullName} xs={24} sm={12} md={6}>
                  <Card 
                    size="small" 
                    className="text-center"
                    style={{ borderTop: `3px solid ${qr.color}` }}
                  >
                    <Text strong className="block mb-2 truncate text-sm" title={qr.fullName}>
                      {qr.name}
                    </Text>
                    <div className="flex justify-center gap-6 text-xs">
                      <div>
                        <Text type="secondary" className="block">Scans</Text>
                        <div className="font-bold text-base" style={{ color: qr.color }}>
                          {qr.scans}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary" className="block">Scans/Day</Text>
                        <div className="font-bold text-base" style={{ color: qr.color }}>
                          {qr.scansPerDay}
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

            {/* Scan Distribution Pie Chart */}
            <div>
              <Text strong className="block mb-2">Scan Distribution</Text>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} scans`, 'Scans']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Trend Line Chart */}
            {comparisonData && comparisonData.length >= 2 && (
              <div>
                <Text strong className="block mb-2">Weekly Trend</Text>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    {comparisonData.map((qr, index) => (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey={`qr${index}`}
                        name={qr.name}
                        stroke={qr.color}
                        strokeWidth={2}
                        dot={{ fill: qr.color, r: 4 }}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Area Chart for Cumulative Performance */}
            {comparisonData && comparisonData.length >= 2 && (
              <div>
                <Text strong className="block mb-2">Cumulative Scans</Text>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={comparisonData}>
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
                    <Area 
                      type="monotone" 
                      dataKey="scans" 
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Radar Chart */}
            {comparisonData && comparisonData.length >= 2 && (
              <div>
                <Text strong className="block mb-2">Performance Overview</Text>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    {comparisonData.map((qr, index) => (
                      <Radar
                        key={index}
                        name={qr.name}
                        dataKey={`qr${index}`}
                        stroke={qr.color}
                        fill={qr.color}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
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