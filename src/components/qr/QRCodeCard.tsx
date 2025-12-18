import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Tooltip, Popconfirm, message, Modal, Dropdown } from 'antd';
import {
  Edit,
  Download,
  BarChart3,
  Trash2,
  FileImage,
  FileType,
  Eye,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeData } from '../../types/qrcode';
import QRCodePreview from './QRCodePreview';
import QRCodeOnly from './QRCodeOnly';

const { Text } = Typography;

interface QRCodeCardProps {
  qrCode: QRCodeData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

const typeColors: Record<string, string> = {
  url: 'blue',
  vcard: 'green',
  text: 'orange',
  wifi: 'purple',
  email: 'cyan',
  phone: 'geekblue',
  sms: 'lime',
  location: 'volcano',
  instagram: 'magenta',
  facebook: 'blue',
  youtube: 'red',
  whatsapp: 'green',
};

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode, onEdit, onDelete, viewMode = 'list' }) => {
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!previewRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      const fileName = `${qrCode.name}-${Date.now()}`;
      
      if (format === 'png') {
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
      } else {
        link.download = `${fileName}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
      }
      
      link.click();
      message.success(`Downloaded as ${format.toUpperCase()}!`);
      setDownloadModalOpen(false);
    } catch (error) {
      message.error('Failed to download. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadMenuItems = [
    {
      key: 'png',
      label: 'PNG (High Quality)',
      icon: <FileImage size={16} />,
      onClick: () => setDownloadModalOpen(true),
    },
    {
      key: 'jpg',
      label: 'JPG (Smaller Size)',
      icon: <FileType size={16} />,
      onClick: () => setDownloadModalOpen(true),
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Grid View Card
  if (viewMode === 'grid') {
    return (
      <>
        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full"
          styles={{ body: { padding: '16px', height: '100%' } }}
        >
          {/* QR Preview */}
          <div 
            className="w-full min-h-[150px] rounded-lg flex items-center justify-center mb-3 relative overflow-hidden"
          >
            <div className="  flex items-center justify-center bg-white rounded-lg">
              <QRCodeOnly
                content={qrCode.content}
                template={qrCode.template}
                styling={qrCode.styling}
                qrId={qrCode.id}
                size={150}
              />
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Text className="text-xs text-muted-foreground">{qrCode.scans}</Text>
              <Text className="text-xs text-muted-foreground">scans</Text>
            </div>
            <Tag color={typeColors[qrCode.type]} className="m-0 uppercase text-xs">
              {qrCode.type}
            </Tag>
            <Tag color="success" className="m-0 text-xs">
              {qrCode.status}
            </Tag>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Tooltip title="Preview">
              <button
                className="p-2 rounded hover:bg-muted transition-colors"
                onClick={() => setDownloadModalOpen(true)}
              >
                <Eye size={16} />
              </button>
            </Tooltip>
            <Tooltip title="Edit">
              <button
                className="p-2 rounded hover:bg-muted transition-colors"
                onClick={() => onEdit(qrCode.id)}
              >
                <Edit size={16} />
              </button>
            </Tooltip>
            <Dropdown menu={{ items: downloadMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="Download">
                <button className="p-2 rounded hover:bg-muted transition-colors">
                  <Download size={16} />
                </button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="Analytics">
              <button
                className="p-2 rounded hover:bg-muted transition-colors"
                onClick={() => navigate(`/analytics/${qrCode.id}`)}
              >
                <BarChart3 size={16} />
              </button>
            </Tooltip>
            <Popconfirm
              title="Delete QR Code"
              description="Are you sure you want to delete this QR code?"
              onConfirm={() => onDelete(qrCode.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <button className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
              </Tooltip>
            </Popconfirm>
          </div>
        </Card>

        {/* Preview Modal */}
        <Modal
          title="QR Code Preview"
          open={downloadModalOpen}
          onCancel={() => setDownloadModalOpen(false)}
          footer={null}
          width={400}
          centered
        >
          <div className="flex flex-col items-center py-4">
            <QRCodePreview
              ref={previewRef}
              content={qrCode.content}
              template={qrCode.template}
              styling={qrCode.styling}
              qrId={qrCode.id}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDownload('png')}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <FileImage size={18} />
                Download PNG
              </button>
              <button
                onClick={() => handleDownload('jpg')}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                <FileType size={18} />
                Download JPG
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  // List View Card (original)
  return (
    <>
      <Card className="mb-4 hover:shadow-md transition-shadow" styles={{ body: { padding: '16px 24px' } }}>
        <div className="flex items-center gap-4">
          {/* QR Preview Mini */}
          <div
            className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ 
              background: qrCode.template.showGradient && qrCode.template.gradientColor
                ? `linear-gradient(135deg, ${qrCode.template.backgroundColor} 0%, ${qrCode.template.gradientColor} 100%)`
                : qrCode.template.backgroundColor 
            }}
            onClick={() => setDownloadModalOpen(true)}
          >
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
              <QRCodeOnly
                content={qrCode.content}
                template={qrCode.template}
                styling={qrCode.styling}
                qrId={qrCode.id}
                size={58}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <Text strong className="text-base truncate">
                {qrCode.name}
              </Text>
            </div>
            <Text type="secondary" className="text-sm truncate block">
              {qrCode.content.substring(0, 50)}
              {qrCode.content.length > 50 && '...'}
            </Text>
            <div className="flex items-center gap-4 mt-2">
              <Text type="secondary" className="text-xs">
                <span style={{ color: 'hsl(var(--primary))' }}>{qrCode.scans}</span> scans
              </Text>
              <Tag color="success" className="m-0">
                {qrCode.status}
              </Tag>
              <Text type="secondary" className="text-xs">
                {formatDate(qrCode.createdAt)}
              </Text>
            </div>
          </div>

          {/* Type Badge */}
          <Tag color={typeColors[qrCode.type]} className="uppercase text-xs">
            {qrCode.type}
          </Tag>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Tooltip title="Edit">
              <button
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                onClick={() => onEdit(qrCode.id)}
              >
                <Edit size={16} />
              </button>
            </Tooltip>
            <Dropdown menu={{ items: downloadMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="Download">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                  <Download size={16} />
                </button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="Analytics">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                onClick={() => navigate(`/analytics/${qrCode.id}`)}
              >
                <BarChart3 size={16} />
              </button>
            </Tooltip>
            <Popconfirm
              title="Delete QR Code"
              description="Are you sure you want to delete this QR code?"
              onConfirm={() => onDelete(qrCode.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
      </Card>

      {/* Download Preview Modal */}
      <Modal
        title="Download QR Code Template"
        open={downloadModalOpen}
        onCancel={() => setDownloadModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <div className="flex flex-col items-center py-4">
          <QRCodePreview
            ref={previewRef}
            content={qrCode.content}
            template={qrCode.template}
            styling={qrCode.styling}
            qrId={qrCode.id}
          />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleDownload('png')}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <FileImage size={18} />
              Download PNG
            </button>
            <button
              onClick={() => handleDownload('jpg')}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <FileType size={18} />
              Download JPG
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QRCodeCard;