import React from 'react';
import { Typography, Button, Empty, Card, Row, Col, Statistic, Input } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
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
      <div className="animate-fade-in space-y-4 md:space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="!mb-0 !text-xl md:!text-2xl">Welcome back! 👋</Title>
            <Text type="secondary" className="text-sm">Manage your QR codes</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto h-11 sm:h-10"
          >
            Create New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Card className="!p-0" styles={{ body: { padding: '12px' } }}>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <QrCode size={14} className="text-primary" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">Total</span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-primary">{qrCodes.length}</span>
              </div>
            )}
          </Card>
          
          <Card className="!p-0" styles={{ body: { padding: '12px' } }}>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={14} className="text-success" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">Scans</span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-success">{totalScans}</span>
              </div>
            )}
          </Card>
          
          <Card className="!p-0" styles={{ body: { padding: '12px' } }}>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={14} className="text-warning" />
                  <span className="text-[11px] md:text-xs text-muted-foreground">Active</span>
                </div>
                <span className="text-lg md:text-2xl font-bold text-warning">{activeQRs}</span>
              </div>
            )}
          </Card>
        </div>

        {/* QR Codes List Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Title level={4} className="!mb-0 !text-base md:!text-lg">Your QR Codes</Title>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search..."
              prefix={<Search size={16} className="text-muted-foreground" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-48 md:w-64"
              allowClear
            />
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          viewMode === 'list' ? (
            <div className="space-y-3">
              {Array.from({length: 4}).map((_, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({length: 8}).map((_, i) => (
                <Card key={i}>
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : qrCodes.length === 0 ? (
          <Card className="py-12 md:py-16">
            <Empty
              image={
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode size={40} className="text-primary md:hidden" />
                  <QrCode size={48} className="text-primary hidden md:block" />
                </div>
              }
              description={
                <div className="text-center">
                  <Title level={4} className="!mb-2 !text-base md:!text-lg">No QR Codes Yet</Title>
                  <Text type="secondary" className="block mb-4 md:mb-6 text-sm">
                    Create your first QR code to get started
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    icon={<Plus size={18} />}
                    onClick={() => navigate('/create')}
                    className="w-full sm:w-auto"
                  >
                    Create Your First QR Code
                  </Button>
                </div>
              }
            />
          </Card>
        ) : filteredQRCodes.length === 0 ? (
          <Card className="py-8 md:py-12">
            <Empty
              description={
                <div className="text-center">
                  <Text type="secondary">No QR codes found for "{searchTerm}"</Text>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredQRCodes.map((qrCode) => (
              <QRCodeCard
                key={qrCode.id}
                qrCode={qrCode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
