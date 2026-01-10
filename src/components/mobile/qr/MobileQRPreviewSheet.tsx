import React from 'react';
import { Typography, Button } from 'antd';
import { Settings2, X, Download, Share2 } from 'lucide-react';
import { QRTemplate, QRStyling, QRType } from '@/types/qrcode';
import QRCodePreview from '@/components/qr/QRCodePreview';

const { Text } = Typography;

interface MobileQRPreviewSheetProps {
  open: boolean;
  onClose: () => void;
  content: string;
  template: QRTemplate | null;
  styling: QRStyling;
  onTemplateChange: (template: QRTemplate) => void;
  onEditTemplate: () => void;
  qrId?: string;
  qrType: QRType;
  previewRef?: React.RefObject<HTMLDivElement>;
}

const MobileQRPreviewSheet: React.FC<MobileQRPreviewSheetProps> = ({
  open,
  onClose,
  content,
  template,
  styling,
  onTemplateChange,
  onEditTemplate,
  qrId,
  qrType,
  previewRef,
}) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Sheet */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
          <Text className="text-lg font-semibold">QR Preview</Text>
          <div className="flex items-center gap-2">
            {template && (
              <Button
                type="primary"
                size="small"
                icon={<Settings2 size={14} />}
                onClick={() => {
                  onClose();
                  onEditTemplate();
                }}
              >
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
          <div className="flex flex-col items-center">
            <QRCodePreview
              ref={previewRef}
              content={content}
              template={template}
              styling={styling}
              editable={!!template}
              onTemplateChange={onTemplateChange}
              qrId={qrId}
              qrType={qrType}
            />
            
            {/* Helper Text */}
            <div className="mt-4 text-center">
              {template ? (
                <Text type="secondary" className="text-sm">
                  Tap text to edit • Use "Edit" for more options
                </Text>
              ) : (
                <Text type="secondary" className="text-sm">
                  Plain QR code • Customize in Design step
                </Text>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mt-6 w-full">
              <Button 
                size="large" 
                icon={<Download size={18} />} 
                className="flex-1"
                disabled
              >
                Download
              </Button>
              <Button 
                size="large" 
                icon={<Share2 size={18} />} 
                className="flex-1"
                disabled
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileQRPreviewSheet;
