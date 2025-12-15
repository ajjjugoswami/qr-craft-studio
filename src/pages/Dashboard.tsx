import React from 'react';
import { Typography, Button, Empty, Spin } from 'antd';
import { Plus, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import QRCodeCard from '../components/qr/QRCodeCard';
import { useQRCodes } from '../hooks/useQRCodes';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { qrCodes, loading, deleteQRCode } = useQRCodes();

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteQRCode(id);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Title level={2} className="!mb-0">
            Your QR Codes
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => navigate('/create')}
          >
            Create New
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : qrCodes.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Empty
              image={<QrCode size={80} className="text-muted-foreground" />}
              description={
                <div className="mt-4">
                  <Title level={4} type="secondary">
                    No QR Codes Yet
                  </Title>
                  <p className="text-muted-foreground">
                    Create your first QR code to get started
                  </p>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<Plus size={18} />}
                onClick={() => navigate('/create')}
              >
                Create Your First QR Code
              </Button>
            </Empty>
          </div>
        ) : (
          <div>
            {qrCodes.map((qrCode) => (
              <QRCodeCard
                key={qrCode.id}
                qrCode={qrCode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;