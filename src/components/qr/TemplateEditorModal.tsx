import React, { useState } from 'react';
import { Modal, Button, Input, Select, Slider, Tabs, ColorPicker, Switch, Space, Card, Empty, Popconfirm } from 'antd';
import { Plus, Trash2, Type, Calendar, Clock, Image, Minus, AlignCenter, Move, GripVertical } from 'lucide-react';
import type { Color } from 'antd/es/color-picker';
import { QRTemplate, CustomField } from '../../types/qrcode';

interface TemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  template: QRTemplate;
  onTemplateChange: (template: QRTemplate) => void;
}

const fieldTypes = [
  { value: 'label', label: 'Label', icon: <Type size={14} /> },
  { value: 'title', label: 'Title', icon: <Type size={14} /> },
  { value: 'subtitle', label: 'Subtitle', icon: <Type size={14} /> },
  { value: 'text', label: 'Text', icon: <Type size={14} /> },
  { value: 'date', label: 'Date', icon: <Calendar size={14} /> },
  { value: 'time', label: 'Time', icon: <Clock size={14} /> },
  { value: 'divider', label: 'Divider', icon: <Minus size={14} /> },
];

const fontWeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
];

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  open,
  onClose,
  template,
  onTemplateChange,
}) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const customFields = template.customFields || [];
  const selectedField = customFields.find(f => f.id === selectedFieldId);

  const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (type: CustomField['type']) => {
    const defaultValues: Record<CustomField['type'], string> = {
      label: 'NEW LABEL',
      title: 'New Title',
      subtitle: 'New Subtitle',
      text: 'New text content',
      date: 'January 1, 2025',
      time: '12:00 PM',
      button: 'Click Me',
      divider: '',
      logo: '',
    };

    const newField: CustomField = {
      id: generateId(),
      type,
      value: defaultValues[type],
      style: {
        fontSize: type === 'label' ? 11 : type === 'title' ? 20 : 14,
        fontWeight: type === 'label' || type === 'title' ? 'bold' : 'normal',
        color: template.textColor,
        letterSpacing: type === 'label' ? 2 : 0,
      },
    };

    onTemplateChange({
      ...template,
      customFields: [...customFields, newField],
    });
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<CustomField>) => {
    onTemplateChange({
      ...template,
      customFields: customFields.map(f =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const updateFieldStyle = (fieldId: string, styleUpdates: Partial<CustomField['style']>) => {
    const field = customFields.find(f => f.id === fieldId);
    if (!field) return;

    updateField(fieldId, {
      style: { ...field.style, ...styleUpdates },
    });
  };

  const removeField = (fieldId: string) => {
    onTemplateChange({
      ...template,
      customFields: customFields.filter(f => f.id !== fieldId),
    });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = customFields.findIndex(f => f.id === fieldId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === customFields.length - 1) return;

    const newFields = [...customFields];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]];

    onTemplateChange({
      ...template,
      customFields: newFields,
    });
  };

  const handleMainFieldChange = (field: 'title' | 'subtitle', value: string) => {
    onTemplateChange({ ...template, [field]: value });
  };

  const handleColorChange = (key: string, color: Color) => {
    onTemplateChange({ ...template, [key]: color.toHexString() });
  };

  const tabItems = [
    {
      key: 'fields',
      label: 'Elements',
      children: (
        <div className="space-y-4">
          {/* Add Field Buttons */}
          <div className="flex flex-wrap gap-2">
            {fieldTypes.map(ft => (
              <Button
                key={ft.value}
                size="small"
                icon={ft.icon}
                onClick={() => addField(ft.value as CustomField['type'])}
              >
                {ft.label}
              </Button>
            ))}
          </div>

          {/* Main Fields */}
          <Card size="small" title="Main Fields">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Title</label>
                <Input
                  value={template.title}
                  onChange={e => handleMainFieldChange('title', e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Subtitle</label>
                <Input
                  value={template.subtitle}
                  onChange={e => handleMainFieldChange('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                />
              </div>
            </div>
          </Card>

          {/* Custom Fields List */}
          <Card size="small" title="Custom Elements">
            {customFields.length === 0 ? (
              <Empty description="No custom elements" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="space-y-2">
                {customFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFieldId === field.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFieldId(field.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-muted-foreground" />
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          {field.type}
                        </span>
                        <span className="text-sm truncate max-w-[150px]">
                          {field.value || '(empty)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="small"
                          type="text"
                          icon={<Move size={12} className="rotate-180" />}
                          onClick={(e) => { e.stopPropagation(); moveField(field.id, 'up'); }}
                          disabled={index === 0}
                        />
                        <Button
                          size="small"
                          type="text"
                          icon={<Move size={12} />}
                          onClick={(e) => { e.stopPropagation(); moveField(field.id, 'down'); }}
                          disabled={index === customFields.length - 1}
                        />
                        <Popconfirm
                          title="Delete this element?"
                          onConfirm={(e) => { e?.stopPropagation(); removeField(field.id); }}
                          okText="Delete"
                          cancelText="Cancel"
                        >
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<Trash2 size={12} />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'style',
      label: 'Element Style',
      children: selectedField ? (
        <div className="space-y-4">
          <Card size="small" title={`Editing: ${selectedField.type}`}>
            {selectedField.type !== 'divider' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Content</label>
                  <Input
                    value={selectedField.value}
                    onChange={e => updateField(selectedField.id, { value: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Font Size: {selectedField.style?.fontSize || 14}px
                  </label>
                  <Slider
                    min={8}
                    max={48}
                    value={selectedField.style?.fontSize || 14}
                    onChange={v => updateFieldStyle(selectedField.id, { fontSize: v })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Font Weight</label>
                  <Select
                    value={selectedField.style?.fontWeight || 'normal'}
                    onChange={v => updateFieldStyle(selectedField.id, { fontWeight: v })}
                    options={fontWeightOptions}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Color</label>
                  <ColorPicker
                    value={selectedField.style?.color || template.textColor}
                    onChange={c => updateFieldStyle(selectedField.id, { color: c.toHexString() })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Letter Spacing: {selectedField.style?.letterSpacing || 0}px
                  </label>
                  <Slider
                    min={0}
                    max={10}
                    value={selectedField.style?.letterSpacing || 0}
                    onChange={v => updateFieldStyle(selectedField.id, { letterSpacing: v })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Opacity: {Math.round((selectedField.style?.opacity || 1) * 100)}%
                  </label>
                  <Slider
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={selectedField.style?.opacity || 1}
                    onChange={v => updateFieldStyle(selectedField.id, { opacity: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Italic</label>
                  <Switch
                    checked={selectedField.style?.italic || false}
                    onChange={v => updateFieldStyle(selectedField.id, { italic: v })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Background Color (optional)</label>
                  <ColorPicker
                    value={selectedField.style?.backgroundColor || 'transparent'}
                    onChange={c => updateFieldStyle(selectedField.id, { backgroundColor: c.toHexString() })}
                    allowClear
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Border Radius: {selectedField.style?.borderRadius || 0}px
                  </label>
                  <Slider
                    min={0}
                    max={24}
                    value={selectedField.style?.borderRadius || 0}
                    onChange={v => updateFieldStyle(selectedField.id, { borderRadius: v })}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Empty description="Select an element to edit its style" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'cta',
      label: 'CTA Button',
      children: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show CTA Button</label>
            <Switch
              checked={!!template.ctaButton}
              onChange={checked => {
                if (checked) {
                  onTemplateChange({
                    ...template,
                    ctaButton: {
                      text: 'Scan to Connect',
                      backgroundColor: template.accentColor || '#00ff88',
                      textColor: template.backgroundColor,
                      borderRadius: 24,
                    },
                  });
                } else {
                  const { ctaButton, ...rest } = template;
                  onTemplateChange(rest as QRTemplate);
                }
              }}
            />
          </div>

          {template.ctaButton && (
            <Card size="small" title="Button Settings">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Button Text</label>
                  <Input
                    value={template.ctaButton.text}
                    onChange={e => onTemplateChange({
                      ...template,
                      ctaButton: { ...template.ctaButton!, text: e.target.value },
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Background Color</label>
                  <ColorPicker
                    value={template.ctaButton.backgroundColor}
                    onChange={c => onTemplateChange({
                      ...template,
                      ctaButton: { ...template.ctaButton!, backgroundColor: c.toHexString() },
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Text Color</label>
                  <ColorPicker
                    value={template.ctaButton.textColor}
                    onChange={c => onTemplateChange({
                      ...template,
                      ctaButton: { ...template.ctaButton!, textColor: c.toHexString() },
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Border Radius: {template.ctaButton.borderRadius || 8}px
                  </label>
                  <Slider
                    min={0}
                    max={32}
                    value={template.ctaButton.borderRadius || 8}
                    onChange={v => onTemplateChange({
                      ...template,
                      ctaButton: { ...template.ctaButton!, borderRadius: v },
                    })}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: 'qr',
      label: 'QR Settings',
      children: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1">QR Label (below QR code)</label>
            <Input
              value={template.qrLabel || ''}
              onChange={e => onTemplateChange({ ...template, qrLabel: e.target.value })}
              placeholder="e.g., Scan for details"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-2">QR Position</label>
            <Select
              value={template.qrPosition || 'bottom'}
              onChange={v => onTemplateChange({ ...template, qrPosition: v })}
              options={[
                { value: 'top', label: 'Top' },
                { value: 'center', label: 'Center' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'right', label: 'Right (Horizontal)' },
                { value: 'left', label: 'Left (Horizontal)' },
              ]}
              className="w-full"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Template Editor"
      open={open}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="close" onClick={onClose}>
          Done
        </Button>,
      ]}
    >
      <Tabs items={tabItems} />
    </Modal>
  );
};

export default TemplateEditorModal;
