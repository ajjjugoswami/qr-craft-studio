import React, { useState } from 'react';
import { Typography, Upload, Input, Switch, Slider, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { QRStyling } from '../../types/qrcode';

const { Text } = Typography;

interface LogoTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const LogoTab: React.FC<LogoTabProps> = ({ styling, onStyleChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onStyleChange({
        ...styling,
        image: result,
        imageOptions: {
          ...styling.imageOptions!,
          hideBackgroundDots: true,
        },
      });
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const handleRemove = () => {
    onStyleChange({
      ...styling,
      image: undefined,
    });
    setFileList([]);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({
      ...styling,
      image: e.target.value,
    });
  };

  return (
    <div className="pt-4">
      <div className="mb-6">
        <Text strong className="block mb-3">Upload Logo</Text>
        <Upload
          beforeUpload={handleUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
      </div>

      <div className="mb-6">
        <Text strong className="block mb-3">Or enter Image URL</Text>
        <Input
          placeholder="https://example.com/logo.png"
          value={styling.image || ''}
          onChange={handleUrlChange}
        />
      </div>

      {styling.image && (
        <>
          <div className="mb-6">
            <Text strong className="block mb-3">Logo Size: {(styling.imageOptions?.imageSize || 0.4) * 100}%</Text>
            <Slider
              min={0.1}
              max={1}
              step={0.1}
              value={styling.imageOptions?.imageSize || 0.4}
              onChange={(value) =>
                onStyleChange({
                  ...styling,
                  imageOptions: { ...styling.imageOptions!, imageSize: value },
                })
              }
            />
          </div>

          <div className="mb-6">
            <Text strong className="block mb-3">Logo Margin: {styling.imageOptions?.margin || 0}px</Text>
            <Slider
              min={0}
              max={20}
              value={styling.imageOptions?.margin || 0}
              onChange={(value) =>
                onStyleChange({
                  ...styling,
                  imageOptions: { ...styling.imageOptions!, margin: value },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
            <div>
              <Text strong>Hide Background Dots</Text>
              <Text type="secondary" className="block text-xs">
                Hide QR dots behind the logo
              </Text>
            </div>
            <Switch
              checked={styling.imageOptions?.hideBackgroundDots}
              onChange={(checked) =>
                onStyleChange({
                  ...styling,
                  imageOptions: { ...styling.imageOptions!, hideBackgroundDots: checked },
                })
              }
            />
          </div>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            className="w-full"
          >
            Remove Logo
          </Button>
        </>
      )}
    </div>
  );
};

export default LogoTab;