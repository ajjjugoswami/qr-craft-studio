import React, { memo, useMemo } from 'react';
import { Typography, Tabs } from 'antd';
import { QRStyling } from '../../types/qrcode';
import ColorsTab from './ColorsTab';
import SettingsTab from './SettingsTab';
import ShapeTab from './ShapeTab';
import LogoTab from './LogoTab';
import FrameTab from './FrameTab';

const { Title } = Typography;

interface QRStyleEditorProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const QRStyleEditor: React.FC<QRStyleEditorProps> = memo(({
  styling,
  onStyleChange,
}) => {
  const tabItems = useMemo(() => [
    {
      key: 'colors',
      label: 'Colors',
      children: <ColorsTab styling={styling} onStyleChange={onStyleChange} />,
    },
    {
      key: 'shape',
      label: 'Shape',
      children: <ShapeTab styling={styling} onStyleChange={onStyleChange} />,
    },
    {
      key: 'logo',
      label: 'Logo',
      children: <LogoTab styling={styling} onStyleChange={onStyleChange} />,
    },
    {
      key: 'frame',
      label: 'Corners',
      children: <FrameTab styling={styling} onStyleChange={onStyleChange} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      children: <SettingsTab styling={styling} onStyleChange={onStyleChange} />,
    },
  ], [styling, onStyleChange]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={4} className="!mb-1">Customize Design</Title>
      </div>

      <Tabs items={tabItems} />
    </div>
  );
});

QRStyleEditor.displayName = 'QRStyleEditor';

export default QRStyleEditor;
