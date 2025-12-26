import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Tooltip, Popconfirm, message, Modal, Dropdown, Spin } from 'antd';
import {
  Edit,
  Download,
  BarChart3,
  Trash2,
  FileImage,
  FileType,
  Eye,
  Lock,
  Target,
} from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
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
  const [downloadingFormat, setDownloadingFormat] = React.useState<'png' | 'jpeg' | null>(null);

  // Support both camelCase and legacy snake/lowercase fields from APIs
  const scanLimitValue = (qrCode.scanLimit ?? (qrCode as any).scanlimit) as number | null | undefined;
  const hasScanLimit = typeof scanLimitValue === 'number' && scanLimitValue > 0;
  const isProtected = typeof qrCode.password === 'string' && qrCode.password.trim().length > 0;

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!previewRef.current || downloadingFormat) return;

    setDownloadingFormat(format);
    try {
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      const node = previewRef.current;
      const fileName = `${qrCode.name}-${Date.now()}`;
      
      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(node, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });
      } else {
        dataUrl = await toJpeg(node, {
          quality: 0.95,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
      }

      const link = document.createElement('a');
      link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : format}`;
      link.href = dataUrl;
      link.click();

      message.success(`Downloaded as ${format.toUpperCase()}!`);
      setDownloadModalOpen(false);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download. Please try again.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const downloadMenuItems = [
    {
      key: 'webp',
      label: 'WebP (High Quality)',
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
          className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full relative"
          styles={{ body: { padding: '16px', height: '100%', position: 'relative' } }}
        >
          {/* Top Right Corner Icons */}
          {(isProtected || hasScanLimit) && (
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              {isProtected && (
                <Tooltip title="Password Protected">
                  <div className="p-1.5 bg-amber-100 rounded-full">
                    <Lock size={12} className="text-amber-600" />
                  </div>
                </Tooltip>
              )}
              {hasScanLimit && (
                <Tooltip title={`Scan Limit: ${scanLimitValue}`}
                >
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <Target size={12} className="text-blue-600" />
                  </div>
                </Tooltip>
              )}
            </div>
          )}

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
                qrType={qrCode.type}
              />
            </div>
          </div>

          {/* Title Row */}
          <div className="mb-2">
            <Text strong className="text-sm truncate block">
              {qrCode.name}
            </Text>
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
          width={480}
          centered
          className="qr-preview-modal"
        >
           <div className="flex flex-col items-center py-4 px-2">
            <Spin spinning={downloadingFormat !== null} tip="Preparing download..." className="w-full">
              <div className="flex justify-center">
                <QRCodePreview
                  ref={previewRef}
                  content={qrCode.content}
                  template={qrCode.template}
                  styling={qrCode.styling}
                  qrId={qrCode.id}
                  qrType={qrCode.type}
                />
              </div>
            </Spin>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDownload('png')}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {downloadingFormat === 'png' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <FileImage size={18} />
                )}
                {downloadingFormat === 'png' ? 'Preparing…' : 'Download PNG'}
              </button>
              <button
                onClick={() => handleDownload('jpeg')}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {downloadingFormat === 'jpeg' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                ) : (
                  <FileType size={18} />
                )}
                {downloadingFormat === 'jpeg' ? 'Preparing…' : 'Download JPG'}
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
              background: qrCode.template?.showGradient && qrCode.template?.gradientColor
                ? `linear-gradient(135deg, ${qrCode.template.backgroundColor} 0%, ${qrCode.template.gradientColor} 100%)`
                : qrCode.template?.backgroundColor || '#f3f4f6'
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
                qrType={qrCode.type}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <Text strong className="text-base truncate">
                {qrCode.name}
              </Text>
              {qrCode.password && (
                <Tooltip title="Password Protected">
                  <Lock size={14} className="text-amber-500" />
                </Tooltip>
              )}
              {qrCode.scanLimit && (
                <Tooltip title={`Scan Limit: ${qrCode.scanLimit}`}>
                  <Target size={14} className="text-blue-500" />
                </Tooltip>
              )}
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
        width={480}
        centered
        className="qr-preview-modal"
      >
        <div className="flex flex-col items-center py-4 px-2">
          <Spin spinning={downloadingFormat !== null} tip="Preparing download..." className="w-full">
            <div className="flex justify-center">
              <QRCodePreview
                ref={previewRef}
                content={qrCode.content}
                template={qrCode.template}
                styling={qrCode.styling}
                qrId={qrCode.id}
                qrType={qrCode.type}
              />
            </div>
          </Spin>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleDownload('png')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {downloadingFormat === 'png' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <FileImage size={18} />
              )}
              {downloadingFormat === 'png' ? 'Preparing…' : 'Download PNG'}
            </button>
            <button
              onClick={() => handleDownload('jpeg')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              {downloadingFormat === 'jpeg' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
              ) : (
                <FileType size={18} />
              )}
              {downloadingFormat === 'jpeg' ? 'Preparing…' : 'Download JPG'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QRCodeCard;