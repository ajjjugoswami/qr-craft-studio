import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, message, Drawer } from 'antd';
import { ArrowLeft, Check, Settings2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { qrCodeAPI } from '@/lib/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import TemplateSelector from '../components/qr/TemplateSelector';
import TemplateEditorModal from '../components/qr/TemplateEditorModal';
import QRTypeSelector from '../components/qr/QRTypeSelector';
import ContentEditor from '../components/qr/ContentEditor';
import QRDesignTemplates from '../components/qr/QRDesignTemplates';
import QRStyleEditor from '../components/qr/QRStyleEditor';
import QRCodePreview from '../components/qr/QRCodePreview';
import AdvancedSettings from '../components/qr/AdvancedSettings';
import { useQRCodes } from '../hooks/useQRCodes';
import {
  QRTemplate,
  QRStyling,
  QRType,
  defaultTemplates,
  defaultStyling,
} from '../types/qrcode';

const { Text } = Typography;

const steps = [
  { title: 'Template', description: 'Choose design' },
  { title: 'Type', description: 'QR type' },
  { title: 'Content', description: 'Enter data' },
  { title: 'Design', description: 'Customize' },
  { title: 'Finish', description: 'Fine-tune' },
  { title: 'Advanced', description: 'Protection & limits' },
];

const CreateQR: React.FC = () => {
  const navigate = useNavigate();
  const { saveQRCode, updateQRCode, getQRCode } = useQRCodes();
  const previewRef = useRef<HTMLDivElement>(null);

  const { id } = useParams<{ id?: string }>();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<QRTemplate | null>(defaultTemplates[0]);
  const [type, setType] = useState<QRType>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>(defaultStyling);
  const [name, setName] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [scanLimit, setScanLimit] = useState<number | null>(null);

  const [initialized, setInitialized] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    const loadForEdit = async () => {
      if (!id) return;
      setEditingId(id);

      const existing = getQRCode(id);
      if (existing) {
        setTemplate(existing.template ?? defaultTemplates[0]);
        setStyling(existing.styling ?? defaultStyling);
        setType(existing.type ?? 'url');
        setContent(existing.content ?? 'https://example.com');
        setName(existing.name ?? '');
        setPassword((existing as any).password ?? null);
        setExpirationDate((existing as any).expirationDate ?? (existing as any).expirationdate ?? null);
        setScanLimit((existing as any).scanLimit ?? (existing as any).scanlimit ?? null);
        message.info('Loaded QR code for editing');
        return;
      }

      try {
        const res = await qrCodeAPI.getOne(id);
        const q: any = res.qrCode;
        if (q) {
          setTemplate(q.template ?? defaultTemplates[0]);
          setStyling(q.styling ?? defaultStyling);
          setType(q.type ?? 'url');
          setContent(q.content ?? 'https://example.com');
          setName(q.name ?? '');
          setPassword(q.password ?? null);
          setExpirationDate(q.expirationDate ?? q.expirationdate ?? null);
          setScanLimit(q.scanLimit ?? q.scanlimit ?? null);
          message.info('Loaded QR code for editing');
        }
      } catch (err) {
        console.error('Failed to load QR for edit:', err);
        message.error('Failed to load QR for editing');
      }
    };

    loadForEdit();
  }, [id, getQRCode]);

  useEffect(() => {}, [initialized]);

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

  const handleSave = async () => {
    if (!name.trim()) {
      message.error('Please enter a name for your QR code');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: name.trim(),
        type,
        content,
        template: template || null,
        styling,
        password: password || null,
        expirationDate: expirationDate || null,
        scanLimit: scanLimit || null,
      };

      if (editingId) {
        await updateQRCode(editingId, payload);
        message.success('QR Code updated');
      } else {
        await saveQRCode(payload);
        message.success('QR Code saved!');
      }
      navigate('/dashboard');
    } catch (err) {
      // error handled in hook
    } finally {
      setSaving(false);
    }
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
      case 5:
        return (
          <AdvancedSettings
            password={password}
            onPasswordChange={setPassword}
            expirationDate={expirationDate}
            onExpirationChange={setExpirationDate}
            scanLimit={scanLimit}
            onScanLimitChange={setScanLimit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Mobile Step Indicator */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </Text>
            <Text type="secondary" className="text-sm">
              {steps[currentStep].title}
            </Text>
          </div>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Steps */}
        <Card className="mb-4 md:mb-6 hidden lg:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    {index < currentStep ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    ) : index === currentStep ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-medium">{index + 1}</span>
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
                  <Text type="secondary" className="text-xs hidden xl:block">
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

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[400px] md:min-h-[500px]">
              {renderStepContent()}
            </Card>
            
            {/* Mobile Navigation */}
            <div className="flex items-center justify-between mt-4 lg:hidden">
              <Button
                size="large"
                onClick={handlePrev}
                disabled={currentStep === 0}
                icon={<ChevronLeft size={18} />}
                className="flex-1 mr-2"
              >
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSave}
                  loading={saving}
                  disabled={saving}
                  className="flex-1 ml-2"
                >
                  Save QR Code
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  className="flex-1 ml-2"
                >
                  Next
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Preview */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-6">
              <Card 
                title="Live Preview" 
                extra={
                  template && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<Settings2 size={14} />}
                      onClick={() => setShowTemplateEditor(true)}
                    >
                      Edit
                    </Button>
                  )
                }
              >
                <div className="flex flex-col items-center">
                  <QRCodePreview
                    ref={previewRef}
                    content={content}
                    template={template}
                    styling={styling}
                    editable={!!template}
                    onTemplateChange={template ? setTemplate : undefined}
                    qrId={editingId || undefined}
                    qrType={type}
                  />
                  {template && (
                    <Text type="secondary" className="text-xs mt-4 text-center">
                      Click text to edit • Use "Edit" for more options
                    </Text>
                  )}
                </div>
              </Card>

              {/* Desktop Navigation */}
              <div className="mt-4 flex justify-between">
                <Button
                  size="middle"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save QR Code'}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview FAB */}
        <button
          onClick={() => setShowPreviewDrawer(true)}
          className="lg:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40"
        >
          <Eye size={24} />
        </button>

        {/* Mobile Preview Drawer */}
        <Drawer
          title="Preview"
          placement="bottom"
          onClose={() => setShowPreviewDrawer(false)}
          open={showPreviewDrawer}
          height="80vh"
          className="lg:hidden"
          extra={
            template && (
              <Button
                type="primary"
                size="small"
                icon={<Settings2 size={14} />}
                onClick={() => {
                  setShowPreviewDrawer(false);
                  setShowTemplateEditor(true);
                }}
              >
                Edit Template
              </Button>
            )
          }
        >
          <div className="flex flex-col items-center py-4">
            <QRCodePreview
              ref={previewRef}
              content={content}
              template={template}
              styling={styling}
              editable={!!template}
              onTemplateChange={template ? setTemplate : undefined}
              qrId={editingId || undefined}
              qrType={type}
            />
            {template && (
              <Text type="secondary" className="text-xs mt-4 text-center">
                Tap text to edit inline
              </Text>
            )}
          </div>
        </Drawer>

        {/* Template Editor Modal */}
        <TemplateEditorModal
          open={showTemplateEditor}
          onClose={() => setShowTemplateEditor(false)}
          template={template}
          onTemplateChange={setTemplate}
          content={content}
          styling={styling}
          qrId={editingId || undefined}
          qrType={type}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateQR;
