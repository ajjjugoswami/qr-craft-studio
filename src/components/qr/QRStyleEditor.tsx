import React from 'react';
import { Card, Typography, Slider, Radio, ColorPicker, Switch, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { QRStyling } from '../../types/qrcode';

const { Title, Text } = Typography;

interface QRStyleEditorProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

const QRStyleEditor: React.FC<QRStyleEditorProps> = ({
  styling,
  onStyleChange,
}) => {
  const handleColorChange = (key: 'fgColor' | 'bgColor', color: Color) => {
    onStyleChange({
      ...styling,
      [key]: color.toHexString(),
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Title level={3}>Customize QR Design</Title>
        <Text type="secondary">Personalize your QR code appearance</Text>
      </div>

      <Card className="max-w-xl mx-auto">
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <div className="mb-4">
              <Text strong className="block mb-2">QR Code Color</Text>
              <ColorPicker
                value={styling.fgColor}
                onChange={(color) => handleColorChange('fgColor', color)}
                showText
              />
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <Text strong className="block mb-2">Background Color</Text>
              <ColorPicker
                value={styling.bgColor}
                onChange={(color) => handleColorChange('bgColor', color)}
                showText
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="mb-4">
              <Text strong className="block mb-2">
                Size: {styling.size}px
              </Text>
              <Slider
                min={100}
                max={400}
                value={styling.size}
                onChange={(value) => onStyleChange({ ...styling, size: value })}
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="mb-4">
              <Text strong className="block mb-2">Error Correction Level</Text>
              <Radio.Group
                value={styling.level}
                onChange={(e) => onStyleChange({ ...styling, level: e.target.value })}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="L">Low (7%)</Radio.Button>
                <Radio.Button value="M">Medium (15%)</Radio.Button>
                <Radio.Button value="Q">Quartile (25%)</Radio.Button>
                <Radio.Button value="H">High (30%)</Radio.Button>
              </Radio.Group>
              <Text type="secondary" className="block mt-2 text-xs">
                Higher levels allow more damage but result in denser QR codes
              </Text>
            </div>
          </Col>

          <Col span={24}>
            <div className="flex items-center justify-between">
              <div>
                <Text strong>Include Margin</Text>
                <Text type="secondary" className="block text-xs">
                  Add white space around the QR code
                </Text>
              </div>
              <Switch
                checked={styling.includeMargin}
                onChange={(checked) =>
                  onStyleChange({ ...styling, includeMargin: checked })
                }
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QRStyleEditor;
