import React from 'react';
import { Typography, Button, Empty, Spin, Card, Row, Col, Statistic, Input } from 'antd';
import { Plus, QrCode, Eye, TrendingUp, Search, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import QRCodeCard from '../components/qr/QRCodeCard';
import { useQRCodes } from '../hooks/useQRCodes';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { qrCodes, loading, deleteQRCode } = useQRCodes();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('grid');

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteQRCode(id);
  };

  const totalScans = qrCodes.reduce((acc, qr) => acc + qr.scans, 0);
  const activeQRs = qrCodes.filter(qr => qr.status === 'active').length;

  const filteredQRCodes = qrCodes.filter(qr => 
    qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qr.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Title level={2} className="!mb-1">Welcome back! 👋</Title>
            <Text type="secondary">Manage and create your QR codes</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => navigate('/create')}
            className="h-12 px-6 text-base font-medium"
          >
            Create New QR Code
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-muted-foreground">Total QR Codes</span>}
                value={qrCodes.length}
                prefix={<QrCode size={20} className="text-primary mr-2" />}
                valueStyle={{ color: '#6366f1', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-muted-foreground">Total Scans</span>}
                value={totalScans}
                prefix={<Eye size={20} className="text-green-500 mr-2" />}
                valueStyle={{ color: '#22c55e', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-muted-foreground">Active QR Codes</span>}
                value={activeQRs}
                prefix={<TrendingUp size={20} className="text-orange-500 mr-2" />}
                valueStyle={{ color: '#f59e0b', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* QR Codes List Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Title level={4} className="!mb-0">Your QR Codes</Title>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search QR codes..."
              prefix={<Search size={16} className="text-muted-foreground" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              allowClear
            />
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : qrCodes.length === 0 ? (
          <Card className="py-16">
            <Empty
              image={
                <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode size={48} className="text-primary" />
                </div>
              }
              description={
                <div className="text-center">
                  <Title level={4} className="!mb-2">No QR Codes Yet</Title>
                  <Text type="secondary" className="block mb-6">
                    Create your first QR code to get started with tracking and analytics
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    icon={<Plus size={18} />}
                    onClick={() => navigate('/create')}
                  >
                    Create Your First QR Code
                  </Button>
                </div>
              }
            />
          </Card>
        ) : filteredQRCodes.length === 0 ? (
          <Card className="py-12">
            <Empty
              description={
                <div className="text-center">
                  <Text type="secondary">No QR codes found matching "{searchTerm}"</Text>
                </div>
              }
            />
          </Card>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredQRCodes.map((qrCode) => (
              <QRCodeCard
                key={qrCode.id}
                qrCode={qrCode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode="list"
              />
            ))}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredQRCodes.map((qrCode) => (
              <Col key={qrCode.id} xs={24} sm={12} lg={8} xl={6}>
                <QRCodeCard
                  qrCode={qrCode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  viewMode="grid"
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;