import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, message, Input, Tabs } from 'antd';
import { ArrowLeft, Check, Save, Settings2, Sparkles } from 'lucide-react';
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

const { Title, Text } = Typography;

const CreateQR: React.FC = () => {
  const navigate = useNavigate();
  const { saveQRCode, saveDraft, getDraft, clearDraft } = useQRCodes();
  const previewRef = useRef<HTMLDivElement>(null);

  const [template, setTemplate] = useState<QRTemplate>(defaultTemplates[0]);
  const [type, setType] = useState<QRType>('url');
  const [content, setContent] = useState('https://example.com');
  const [styling, setStyling] = useState<QRStyling>(defaultStyling);
  const [name, setName] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('type');

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setTemplate(draft.template);
      setStyling(draft.styling);
      setType(draft.type);
      setContent(draft.content);
      setName(draft.name);
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
      currentStep: 0,
    };
    saveDraft(draft);
  }, [template, styling, type, content, name, saveDraft, initialized]);

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
    navigate('/dashboard');
  };

  const handleClearDraft = () => {
    clearDraft();
    setTemplate(defaultTemplates[0]);
    setStyling(defaultStyling);
    setType('url');
    setContent('https://example.com');
    setName('');
    message.success('Draft cleared');
  };

  const tabItems = [
    {
      key: 'type',
      label: (
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
          QR Type
        </span>
      ),
      children: <QRTypeSelector selectedType={type} onSelect={setType} />,
    },
    {
      key: 'content',
      label: (
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
          Content
        </span>
      ),
      children: (
        <ContentEditor
          type={type}
          content={content}
          name={name}
          onNameChange={setName}
          onContentChange={setContent}
        />
      ),
    },
    {
      key: 'template',
      label: (
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">3</span>
          Card Template
        </span>
      ),
      children: <TemplateSelector selectedTemplate={template} onSelect={setTemplate} />,
    },
    {
      key: 'qrdesign',
      label: (
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">4</span>
          QR Design
        </span>
      ),
      children: <QRDesignTemplates styling={styling} onStyleChange={setStyling} />,
    },
    {
      key: 'customize',
      label: (
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">5</span>
          Fine Tune
        </span>
      ),
      children: (
        <div className="space-y-6">
          <QRStyleEditor styling={styling} onStyleChange={setStyling} />
          <Card title="Card Customization" size="small">
            <TemplateCustomizer template={template} onTemplateChange={setTemplate} />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="text"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/dashboard')}
              className="!px-0"
            >
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <Text type="secondary" className="text-xs flex items-center gap-1">
                <Save size={12} /> Auto-saved
              </Text>
              <Button size="small" onClick={handleClearDraft}>
                Clear Draft
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Title level={2} className="!mb-1 flex items-center gap-2">
                <Sparkles size={24} className="text-primary" />
                Create QR Code
              </Title>
              <Text type="secondary">Design your perfect QR code in minutes</Text>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Editor */}
          <div className="lg:col-span-3">
            {/* QR Name Input */}
            <Card className="mb-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">QR Code Name *</label>
                  <Input
                    size="large"
                    placeholder="Enter a name for your QR code (e.g., Business Card, Menu)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base"
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<Check size={18} />}
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="mt-6"
                >
                  Save QR Code
                </Button>
              </div>
            </Card>

            {/* Tabs */}
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
                className="qr-creation-tabs"
              />
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <Card 
              className="sticky top-6"
              title={
                <div className="flex items-center justify-between">
                  <span>Live Preview</span>
                  <Button
                    type="primary"
                    icon={<Settings2 size={14} />}
                    onClick={() => setShowTemplateEditor(true)}
                    size="small"
                  >
                    Edit Template
                  </Button>
                </div>
              }
            >
              <div className="flex flex-col items-center py-4">
                <div className="bg-muted/30 rounded-xl p-6 w-full flex justify-center">
                  <QRCodePreview
                    ref={previewRef}
                    content={content}
                    template={template}
                    styling={styling}
                    editable={true}
                    onTemplateChange={setTemplate}
                  />
                </div>
                <Text type="secondary" className="text-xs mt-4 text-center">
                  Click on text to edit inline • Use "Edit Template" for advanced options
                </Text>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="mt-4" size="small">
              <Title level={5} className="!mb-3 !text-sm">💡 Quick Tips</Title>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Choose a template that matches your use case</li>
                <li>• Use high contrast colors for better scanning</li>
                <li>• Keep your content URL short when possible</li>
                <li>• Test your QR code before printing</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        open={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        template={template}
        onTemplateChange={setTemplate}
        content={content}
        styling={styling}
      />
    </DashboardLayout>
  );
};

export default CreateQR;