import React from 'react';
import { Typography, Segmented, Button } from 'antd';
import { Download } from 'lucide-react';

const { Title, Text } = Typography;

interface AnalyticsHeaderProps {
  mode: 'real' | 'demo';
  onModeChange: (mode: 'real' | 'demo') => void;
  onDownloadCSV: () => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  mode,
  onModeChange,
  onDownloadCSV,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <Title level={2} className="!mb-1">Analytics Overview</Title>
        <Text type="secondary">Track performance across all your QR codes</Text>
      </div>
      <div className="flex items-center gap-3">
        <Button icon={<Download size={16} />} onClick={onDownloadCSV}>
          Export CSV
        </Button>
        <Segmented
          options={[{ label: 'Real', value: 'real' }, { label: 'Demo', value: 'demo' }]}
          value={mode}
          onChange={(val: string | number) => onModeChange(val as 'real' | 'demo')}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AnalyticsHeader;
