import React, { useState } from 'react';
import { Steps, Button, Card, Typography, Input, message, Row, Col } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TemplateSelector from '../components/qr/TemplateSelector';
import TemplateCustomizer from '../components/qr/TemplateCustomizer';
import ContentEditor from '../components/qr/ContentEditor';
import QRStyleEditor from '../components/qr/QRStyleEditor';
import QRCodePreview from '../components/qr/QRCodePreview';
import { useQRCodes } from '../hooks/useQRCodes';
import {
  QRTemplate,
  QRStyling,
  QRCodeData,
  defaultTemplates,
  defaultStyling,
} from '../types/qrcode';

const { Title, Text } = Typography;

const steps = [
  { title: 'Card Template', description: 'Choose card design (Optional)' },
  { title: 'QR Type', description: 'Choose QR code type' },
  { title: 'Content', description: 'Enter your content' },
  { title: 'QR Design', description: 'Customize QR appearance' },
  { title: 'Final Touch', description: 'Fine-tune everything' },
];

const CreateQR: React.FC = () => {
  const navigate = useNavigate();
  const { saveQRCode } = useQRCodes();

  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<QRTemplate>(defaultTemplates[0]);
  const [type, setType] = useState<'url' | 'vcard' | 'text' | 'wifi' | 'email'>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>(defaultStyling);
  const [name, setName] = useState('');

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      message.error('Please enter a name for your QR code');
      return;
    }

    const qrCode: QRCodeData = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      content,
      template,
      styling,
      createdAt: new Date().toISOString(),
      scans: 0,
      status: 'active',
    };

    saveQRCode(qrCode);
    message.success('QR Code saved successfully!');
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TemplateSelector selectedTemplate={template} onSelect={setTemplate} />;
      case 1:
        return (
          <ContentEditor
            type={type}
            content={content}
            onTypeChange={setType}
            onContentChange={setContent}
          />
        );
      case 2:
        return (
          <ContentEditor
            type={type}
            content={content}
            onTypeChange={setType}
            onContentChange={setContent}
          />
        );
      case 3:
        return <QRStyleEditor styling={styling} onStyleChange={setStyling} />;
      case 4:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Title level={3}>Final Touch</Title>
              <Text type="secondary">Review and name your QR code</Text>
            </div>
            <Row gutter={[48, 24]} justify="center" align="middle">
              <Col xs={24} lg={12}>
                <Card>
                  <div className="mb-6">
                    <Text strong className="block mb-2">QR Code Name *</Text>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name for your QR code"
                      size="large"
                    />
                  </div>
                  <TemplateCustomizer
                    template={template}
                    onTemplateChange={setTemplate}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12} className="flex justify-center">
                <QRCodePreview
                  content={content}
                  template={template}
                  styling={styling}
                />
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          <Title level={2}>Create QR Code</Title>
        </div>

        {/* Steps */}
        <Card className="mb-6">
          <Steps
            current={currentStep}
            items={steps.map((step) => ({
              title: step.title,
              description: step.description,
            }))}
          />
        </Card>

        {/* Content Area */}
        <div className="min-h-[500px] mb-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={currentStep === 4 ? 24 : 16}>
              {renderStepContent()}
            </Col>
            {currentStep !== 4 && (
              <Col xs={24} lg={8}>
                <Card title="Preview" className="sticky top-6">
                  <div className="flex flex-col items-center">
                    <QRCodePreview
                      content={content}
                      template={template}
                      styling={styling}
                    />
                    <div className="mt-4 text-center">
                      <Text type="secondary" className="text-sm">
                        Live preview of your QR code
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            size="large"
            onClick={handlePrev}
            disabled={currentStep === 0}
            icon={<ArrowLeftOutlined />}
          >
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              icon={<SaveOutlined />}
            >
              Save QR Code
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateQR;
