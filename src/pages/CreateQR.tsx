import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, message, Row, Col } from 'antd';
import { ArrowLeft, Check, Save, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TemplateSelector from '../components/qr/TemplateSelector';
import TemplateCustomizer from '../components/qr/TemplateCustomizer';
import TemplateEditorModal from '../components/qr/TemplateEditorModal';
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
  const { saveQRCode, saveDraft, getDraft, clearDraft } = useQRCodes();
  const previewRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<QRTemplate>(defaultTemplates[0]);
  const [type, setType] = useState<QRType>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>(defaultStyling);
  const [name, setName] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setTemplate(draft.template);
      setStyling(draft.styling);
      setType(draft.type);
      setContent(draft.content);
      setName(draft.name);
      setCurrentStep(draft.currentStep);
      message.info('Restored your previous draft');
    }
    setInitialized(true);
  }, [getDraft]);

  // Auto-save draft whenever any value changes
  useEffect(() => {
    if (!initialized) return;
    
    const draft = {
      template,
      styling,
      type,
      content,
      name,
      currentStep,
    };
    saveDraft(draft);
  }, [template, styling, type, content, name, currentStep, saveDraft, initialized]);

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
    message.success('QR Code saved with all configurations!');
    navigate('/');
  };

  const handleClearDraft = () => {
    clearDraft();
    setTemplate(defaultTemplates[0]);
    setStyling(defaultStyling);
    setType('url');
    setContent('https://example.com');
    setName('');
    setCurrentStep(0);
    message.success('Draft cleared');
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
        return (
          <div className="space-y-6">
            <QRStyleEditor styling={styling} onStyleChange={setStyling} />
            <Card title="Card Customization" size="small">
              <TemplateCustomizer template={template} onTemplateChange={setTemplate} />
            </Card>
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
        <div className="mb-6 flex items-center justify-between">
          <Button
            type="text"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Text type="secondary" className="text-xs flex items-center gap-1">
              <Save size={12} /> Auto-saved
            </Text>
            <Button size="small" onClick={handleClearDraft}>
              Clear Draft
            </Button>
          </div>
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
                        <Check size={12} className="text-white" />
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
            <Col xs={24} lg={14}>
              <Card className="min-h-[500px]">
                {renderStepContent()}
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card 
                title="Live Preview" 
                className="sticky top-6"
                extra={
                  <Button
                    type="primary"
                    icon={<Settings2 size={14} />}
                    onClick={() => setShowTemplateEditor(true)}
                  >
                    Edit Template
                  </Button>
                }
              >
                <div className="flex flex-col items-center">
                  <QRCodePreview
                    ref={previewRef}
                    content={content}
                    template={template}
                    styling={styling}
                    editable={true}
                    onTemplateChange={setTemplate}
                  />
                  <Text type="secondary" className="text-xs mt-4">
                    Click text to edit inline • Use "Edit Template" for more options
                  </Text>
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

      {/* Template Editor Modal */}
      <TemplateEditorModal
        open={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        template={template}
        onTemplateChange={setTemplate}
      />
    </DashboardLayout>
  );
};

export default CreateQR;
