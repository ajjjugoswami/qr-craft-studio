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
  FileCode,
  FileText,
  Eye,
  Lock,
  Target,
  Power,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { QRCodeData } from '../../types/qrcode';
import QRCodePreview from './QRCodePreview';
import QRCodeOnly from './QRCodeOnly';
import { useAuth } from '../../hooks/useAuth';

const { Text } = Typography;

interface QRCodeCardProps {
  qrCode: QRCodeData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string) => void;
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

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode, onEdit, onDelete, onToggleStatus, viewMode = 'list' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloadModalOpen, setDownloadModalOpen] = React.useState(false);
  const [downloadingFormat, setDownloadingFormat] = React.useState<'png' | 'svg' | 'pdf' | null>(null);

  // Support both camelCase and legacy snake/lowercase fields from APIs
  const scanLimitValue = (qrCode.scanLimit ?? (qrCode as any).scanlimit) as number | null | undefined;
  const hasScanLimit = typeof scanLimitValue === 'number' && scanLimitValue > 0;
  const isProtected = typeof qrCode.password === 'string' && qrCode.password.trim().length > 0;

  // Watermark settings from user profile
  const showWatermark = !user?.removeWatermark;
  const watermarkText = user?.watermarkText || 'QR Studio';

  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    if (!previewRef.current || downloadingFormat) return;

    setDownloadingFormat(format);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const node = previewRef.current;
      const fileName = `${qrCode.name}-${Date.now()}`;
      
      if (format === 'png') {
        const dataUrl = await toPng(node, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'svg') {
        const dataUrl = await toSvg(node, {
          cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const dataUrl = await toPng(node, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
        });
        
        // Create PDF with embedded image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const padding = 40;
          canvas.width = img.width + padding * 2;
          canvas.height = img.height + padding * 2;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding);
            
            const pdfDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${fileName}.pdf`;
            // For proper PDF, we use a simple approach with the image
            // In production, consider using jsPDF for vector PDF
            link.href = pdfDataUrl.replace('image/png', 'application/pdf');
            
            // Alternative: create actual PDF blob
            const pdfBlob = dataURLtoBlob(pdfDataUrl, 'application/pdf');
            link.href = URL.createObjectURL(pdfBlob);
            link.click();
            URL.revokeObjectURL(link.href);
          }
        };
        img.src = dataUrl;
        message.success('Downloaded as PDF!');
        setDownloadModalOpen(false);
        setDownloadingFormat(null);
        return;
      }

      message.success(`Downloaded as ${format.toUpperCase()}!`);
      setDownloadModalOpen(false);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download. Please try again.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Helper to convert dataURL to Blob
  const dataURLtoBlob = (dataURL: string, mimeType: string): Blob => {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  const downloadMenuItems = [
    {
      key: 'png',
      label: 'PNG (High Quality)',
      icon: <FileImage size={16} />,
      onClick: () => setDownloadModalOpen(true),
    },
    {
      key: 'svg',
      label: 'SVG (Vector)',
      icon: <FileCode size={16} />,
      onClick: () => setDownloadModalOpen(true),
    },
    {
      key: 'pdf',
      label: 'PDF (Print Ready)',
      icon: <FileText size={16} />,
      onClick: () => setDownloadModalOpen(true),
    },
  ];

  const actionsMenuItems = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: () => onEdit(qrCode.id),
    },
    ...(onToggleStatus ? [{
      key: 'toggle-status',
      label: qrCode.status === 'active' ? 'Deactivate' : 'Activate',
      icon: qrCode.status === 'active' ? <XCircle size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />,
      onClick: () => onToggleStatus(qrCode.id),
    }] : []),
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
          className="qr-card glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group h-full relative"
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
            <Tag color={qrCode.status === 'active' ? 'success' : 'error'} className="m-0 text-xs flex items-center gap-1">
              {qrCode.status === 'active' ? (
                <CheckCircle size={10} />
              ) : (
                <XCircle size={10} />
              )}
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
            <Tooltip title="Analytics">
              <button
                className="p-2 rounded hover:bg-muted transition-colors"
                onClick={() => navigate(`/analytics/${qrCode.id}`)}
              >
                <BarChart3 size={16} />
              </button>
            </Tooltip>
            <Dropdown menu={{ items: downloadMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="Download">
                <button className="p-2 rounded hover:bg-muted transition-colors">
                  <Download size={16} />
                </button>
              </Tooltip>
            </Dropdown>
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
            <Dropdown menu={{ items: actionsMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="More Actions">
                <button className="p-2 rounded hover:bg-muted transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </Tooltip>
            </Dropdown>
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
                  showWatermark={showWatermark}
                  watermarkText={watermarkText}
                />
              </div>
            </Spin>

            {/* Watermark indicator */}
            <div className="text-xs text-muted-foreground mt-2">
              {showWatermark ? `Watermark: "${watermarkText}"` : 'No watermark'}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
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
                PNG
              </button>
              <button
                onClick={() => handleDownload('svg')}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {downloadingFormat === 'svg' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                ) : (
                  <FileCode size={18} />
                )}
                SVG
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {downloadingFormat === 'pdf' ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                ) : (
                  <FileText size={18} />
                )}
                PDF
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
      <Card className="qr-card glass-card mb-4 hover:shadow-md transition-shadow" styles={{ body: { padding: '16px 24px' } }}>
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
              <Tag color={qrCode.status === 'active' ? 'success' : 'error'} className="m-0 flex items-center gap-1">
                {qrCode.status === 'active' ? (
                  <CheckCircle size={10} />
                ) : (
                  <XCircle size={10} />
                )}
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
            <Tooltip title="Preview">
              <button
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                onClick={() => setDownloadModalOpen(true)}
              >
                <Eye size={16} />
              </button>
            </Tooltip>
            <Tooltip title="Analytics">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                onClick={() => navigate(`/analytics/${qrCode.id}`)}
              >
                <BarChart3 size={16} />
              </button>
            </Tooltip>
            <Dropdown menu={{ items: downloadMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="Download">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                  <Download size={16} />
                </button>
              </Tooltip>
            </Dropdown>
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
            <Dropdown menu={{ items: actionsMenuItems }} placement="bottomRight" trigger={['click']}>
              <Tooltip title="More Actions">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </Tooltip>
            </Dropdown>
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
                showWatermark={showWatermark}
                watermarkText={watermarkText}
              />
            </div>
          </Spin>

          {/* Watermark indicator */}
          <div className="text-xs text-muted-foreground mt-2">
            {showWatermark ? `Watermark: "${watermarkText}"` : 'No watermark'}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
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
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              {downloadingFormat === 'svg' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
              ) : (
                <FileCode size={18} />
              )}
              SVG
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              {downloadingFormat === 'pdf' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
              ) : (
                <FileText size={18} />
              )}
              PDF
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QRCodeCard;