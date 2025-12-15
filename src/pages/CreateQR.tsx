import React, { useState } from 'react';
import { Button, Card, Typography, message, Row, Col } from 'antd';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TemplateSelector from '../components/qr/TemplateSelector';
import QRTypeSelector from '../components/qr/QRTypeSelector';
import ContentEditor from '../components/qr/ContentEditor';
import QRDesignTemplates from '../components/qr/QRDesignTemplates';
import QRStyleEditor from '../components/qr/QRStyleEditor';
import QRCodePreview from '../components/qr/QRCodePreview';
import { useQRCodes } from '../hooks/useQRCodes';
import {
  QRTemplate,
  QRStyling,
  QRCodeData,
  QRType,
  defaultTemplates,
  defaultStyling,
} from '../types/qrcode';

const { Text } = Typography;

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
  const [type, setType] = useState<QRType>('url');
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
        return <QRTypeSelector selectedType={type} onSelect={setType} />;
      case 2:
        return (
          <ContentEditor
            type={type}
            content={content}
            name={name}
            onNameChange={setName}
            onContentChange={setContent}
          />
        );
      case 3:
        return <QRDesignTemplates styling={styling} onStyleChange={setStyling} />;
      case 4:
        return <QRStyleEditor styling={styling} onStyleChange={setStyling} />;
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
        </div>

        {/* Custom Steps */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    {index < currentStep ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckOutlined className="text-white text-xs" />
                      </div>
                    ) : index === currentStep ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{index + 1}</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs font-medium">{index + 1}</span>
                      </div>
                    )}
                    <span className={`font-medium text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                  <Text type="secondary" className="text-xs hidden sm:block">
                    {step.description}
                  </Text>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Content Area with Preview */}
        <div className="min-h-[500px] mb-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card className="min-h-[450px]">
                {renderStepContent()}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="Live Preview" 
                className="sticky top-6"
                extra={<Text type="secondary" className="text-xs">Click text to edit</Text>}
              >
                <div className="flex flex-col items-center">
                  <QRCodePreview
                    content={content}
                    template={template}
                    styling={styling}
                    editable={true}
                    onTemplateChange={setTemplate}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            size="large"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
            >
              Save QR Code
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
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
