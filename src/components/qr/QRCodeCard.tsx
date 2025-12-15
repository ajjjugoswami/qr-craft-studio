import React from 'react';
import { Card, Tag, Typography, Space, Tooltip, Popconfirm, message } from 'antd';
import {
  EditOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeData } from '../../types/qrcode';

const { Text } = Typography;

interface QRCodeCardProps {
  qrCode: QRCodeData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeColors: Record<string, string> = {
  url: 'blue',
  vcard: 'green',
  text: 'orange',
  wifi: 'purple',
  email: 'cyan',
};

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode, onEdit, onDelete }) => {
  const handleDownload = () => {
    const svg = document.getElementById(`qr-${qrCode.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${qrCode.name}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
    message.success('QR Code downloaded!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode.content);
    message.success('Content copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow" bodyStyle={{ padding: '16px 24px' }}>
      <div className="flex items-center gap-4">
        {/* QR Preview */}
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: qrCode.template.backgroundColor }}
        >
          <QRCodeSVG
            id={`qr-${qrCode.id}`}
            value={qrCode.content}
            size={48}
            fgColor={qrCode.styling.fgColor}
            bgColor="transparent"
            level={qrCode.styling.level}
          />
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
        <Space size="small">
          <Tooltip title="Edit">
            <div
              className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
              onClick={() => onEdit(qrCode.id)}
            >
              <EditOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Download">
            <div
              className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
              onClick={handleDownload}
            >
              <DownloadOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Copy Content">
            <div
              className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors"
              onClick={handleCopy}
            >
              <ShareAltOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Analytics">
            <div className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
              <BarChartOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Duplicate">
            <div className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-colors">
              <CopyOutlined />
            </div>
          </Tooltip>
          <Popconfirm
            title="Delete QR Code"
            description="Are you sure you want to delete this QR code?"
            onConfirm={() => onDelete(qrCode.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <div className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-destructive/10 text-destructive transition-colors">
                <DeleteOutlined />
              </div>
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
};

export default QRCodeCard;
