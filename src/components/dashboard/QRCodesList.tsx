import React, { memo } from 'react';
import { Card } from 'antd';
import { Skeleton } from '@/components/ui/skeleton';
import QRCodeCard from '../qr/QRCodeCard';

interface QRCodesListProps {
  qrCodes: any[];
  loading: boolean;
  viewMode: 'list' | 'grid';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const QRCodesList: React.FC<QRCodesListProps> = memo(({
  qrCodes,
  loading,
  viewMode,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return viewMode === 'list' ? (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <div className="flex flex-col items-center">
              <Skeleton className="w-full aspect-square rounded-lg mb-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {qrCodes.map((qrCode) => (
          <QRCodeCard
            key={qrCode.id}
            qrCode={qrCode}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            viewMode="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {qrCodes.map((qrCode) => (
        <QRCodeCard
          key={qrCode.id}
          qrCode={qrCode}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          viewMode="grid"
        />
      ))}
    </div>
  );
});

QRCodesList.displayName = 'QRCodesList';

export default QRCodesList;
