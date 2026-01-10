import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Button, Card, Typography, message } from 'antd';
import { Check, Settings2, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { useStyleHistory } from '../hooks/useStyleHistory';
import { useIsMobile } from '../hooks/use-mobile';
import {
  QRTemplate,
  QRStyling,
  QRType,
  defaultStyling,
} from '../types/qrcode';

// Mobile-optimized components
import {
  MobileStepNavigation,
  MobileQRPreviewSheet,
  MobileActionBar,
  MobileTemplateGrid,
  MobileQRTypeSelector,
} from '../components/mobile/qr';

const { Text } = Typography;

const stepKeys = ['template', 'type', 'content', 'design', 'finish', 'advanced'] as const;
type StepKey = typeof stepKeys[number];

const steps = [
  { key: 'template', title: 'Template', description: 'Choose design' },
  { key: 'type', title: 'Type', description: 'QR type' },
  { key: 'content', title: 'Content', description: 'Enter data' },
  { key: 'design', title: 'Design', description: 'Customize' },
  { key: 'finish', title: 'Finish', description: 'Fine-tune' },
  { key: 'advanced', title: 'Advanced', description: 'Protection & limits' },
];

const CreateQR: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { saveQRCode, updateQRCode, getQRCode } = useQRCodes();
  const previewRef = useRef<HTMLDivElement>(null);
  const { pushStyle, undo, canUndo } = useStyleHistory();
  const isMobile = useIsMobile();

  const { id } = useParams<{ id?: string }>();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get current step from URL or default to 0
  const stepParam = searchParams.get('step') as StepKey | null;
  const currentStep = useMemo(() => {
    const idx = stepKeys.indexOf(stepParam as StepKey);
    return idx >= 0 ? idx : 0;
  }, [stepParam]);

  const [template, setTemplate] = useState<QRTemplate | null>(null);
  const [type, setType] = useState<QRType>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>(defaultStyling);
  const [name, setName] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [scanLimit, setScanLimit] = useState<number | null>(null);

  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update URL when step changes
  const setCurrentStep = useCallback((stepIndex: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('step', stepKeys[stepIndex]);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Navigate to step by clicking on stepper
  const goToStep = useCallback((stepIndex: number) => {
    // Only allow navigation to completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep, setCurrentStep]);

  // Wrap setStyling to track history
  const handleStyleChange = useCallback((newStyling: QRStyling) => {
    pushStyle(styling);
    setStyling(newStyling);
  }, [pushStyle, styling]);

  const handleUndo = useCallback(() => {
    const previousStyle = undo();
    if (previousStyle) {
      setStyling(previousStyle);
      message.info('Styling reverted');
    }
  }, [undo]);

  // Initialize step from URL on mount
  useEffect(() => {
    if (!stepParam) {
      setCurrentStep(0);
    }
  }, []);

  useEffect(() => {
    const loadForEdit = async () => {
      if (!id) return;
      setEditingId(id);

      const existing = getQRCode(id);
      if (existing) {
        setTemplate(existing.template ?? null);
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
          setTemplate(q.template ?? null);
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

  const handleNext = useCallback(() => {
    // Validate content step (step 2)
    if (currentStep === 2) {
      if (!name.trim()) {
        message.error('Please enter a QR code title');
        return;
      }
      if (!content.trim()) {
        message.error('Please fill in the required content fields');
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, name, content, setCurrentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleSave = useCallback(async () => {
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

      if (type === 'image') {
        payload.previewImage = content || null;
      }

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
  }, [name, type, content, template, styling, password, expirationDate, scanLimit, editingId, updateQRCode, saveQRCode, navigate]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return isMobile ? (
          <MobileTemplateGrid selectedTemplate={template} onSelect={setTemplate} />
        ) : (
          <TemplateSelector selectedTemplate={template} onSelect={setTemplate} />
        );
      case 1:
        return isMobile ? (
          <MobileQRTypeSelector selectedType={type} onSelect={setType} />
        ) : (
          <QRTypeSelector selectedType={type} onSelect={setType} />
        );
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
        return <QRDesignTemplates styling={styling} onStyleChange={handleStyleChange} />;
      case 4:
        return <QRStyleEditor styling={styling} onStyleChange={handleStyleChange} />;
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
      <div className="animate-fade-in pb-20 lg:pb-0">
        {/* Mobile Step Navigation */}
        {isMobile && (
          <MobileStepNavigation
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        )}

        {/* Desktop Steps - Matching Reference Design */}
        <Card className="mb-4 md:mb-6 hidden lg:block bg-card border-border">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                {/* Step Item */}
                <div 
                  className={`flex items-center gap-3 cursor-pointer transition-opacity ${
                    index <= currentStep ? 'opacity-100' : 'opacity-50'
                  }`}
                  onClick={() => goToStep(index)}
                >
                  {/* Step Icon */}
                  {index < currentStep ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className="text-xs font-semibold">{index + 1}</span>
                    </div>
                  )}
                  
                  {/* Step Text */}
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium leading-tight ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight hidden xl:block">
                      {step.description}
                    </span>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className={`${isMobile ? 'min-h-[350px] !p-3' : 'min-h-[500px]'}`}>
              {renderStepContent()}
            </Card>
          </div>

          {/* Desktop Preview */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-6">
              <Card 
                title="Live Preview" 
                extra={
                  template ? (
                    <Button
                      type="primary"
                      size="small"
                      icon={<Settings2 size={14} />}
                      onClick={() => setShowTemplateEditor(true)}
                    >
                      Edit
                    </Button>
                  ) : null
                }
              >
                <div className="flex flex-col items-center">
                  <QRCodePreview
                    ref={previewRef}
                    content={content}
                    template={template}
                    styling={styling}
                    editable={!!template}
                    onTemplateChange={setTemplate}
                    qrId={editingId || undefined}
                    qrType={type}
                  />
                  {template ? (
                    <Text type="secondary" className="text-xs mt-4 text-center">
                      Click text to edit • Use "Edit" for more options
                    </Text>
                  ) : (
                    <Text type="secondary" className="text-xs mt-4 text-center">
                      Plain QR code • Customize in Design step
                    </Text>
                  )}
                </div>
              </Card>

              {/* Desktop Navigation */}
              <div className="mt-4 flex justify-between items-center gap-2">
                <Button
                  size="middle"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                <Button
                  size="middle"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  icon={<Undo2 size={16} />}
                >
                  Undo
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="primary"
                    size="middle"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                  >
                    Save QR Code
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

        {/* Mobile Action Bar */}
        {isMobile && (
          <MobileActionBar
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onUndo={handleUndo}
            onSave={handleSave}
            onPreview={() => setShowPreviewDrawer(true)}
            canUndo={canUndo}
            saving={saving}
          />
        )}

        {/* Mobile Preview Sheet */}
        <MobileQRPreviewSheet
          open={showPreviewDrawer}
          onClose={() => setShowPreviewDrawer(false)}
          content={content}
          template={template}
          styling={styling}
          onTemplateChange={setTemplate}
          onEditTemplate={() => setShowTemplateEditor(true)}
          qrId={editingId || undefined}
          qrType={type}
          previewRef={previewRef}
        />

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
