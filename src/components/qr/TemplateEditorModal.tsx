import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Slider,
  Tabs,
  ColorPicker,
  Switch,
  Card,
  Empty,
  Popconfirm,
  Collapse,
  Popover,
  Tooltip,
} from "antd";
import {
  Trash2,
  Type,
  Calendar,
  Clock,
  Minus,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Plus,
  Smile,
  Settings2,
  Palette,
  Layout,
  MousePointerClick,
  QrCode,
} from "lucide-react";
import type { Color } from "antd/es/color-picker";
import {
  QRTemplate,
  QRStyling,
  CustomField,
  defaultStyling,
  QRType,
} from "../../types/qrcode";
import QRCodePreview from "./QRCodePreview";

interface TemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  template: QRTemplate | null;
  onTemplateChange: (template: QRTemplate) => void;
  content?: string;
  styling?: QRStyling;
  qrId?: string;
  qrType?: QRType;
}

const fieldTypes = [
  { value: "label", label: "Label", icon: <Type size={14} /> },
  { value: "text", label: "Text", icon: <Type size={14} /> },
  { value: "date", label: "Date", icon: <Calendar size={14} /> },
  { value: "time", label: "Time", icon: <Clock size={14} /> },
  { value: "divider", label: "Divider", icon: <Minus size={14} /> },
];

const fontWeightOptions = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semi Bold" },
  { value: "bold", label: "Bold" },
];

const fontFamilyOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Oswald", label: "Oswald" },
  { value: "Raleway", label: "Raleway" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "Nunito", label: "Nunito" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Archivo Black", label: "Archivo Black" },
  { value: "Satisfy", label: "Satisfy (Script)" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Pacifico", label: "Pacifico" },
  { value: "Lobster", label: "Lobster" },
];

// Common emojis for quick access
const emojiCategories = [
  {
    name: "Popular",
    emojis: ["✨", "🎉", "🚀", "💡", "🔥", "⭐", "💫", "🎯", "💪", "👋", "❤️", "💜", "💙", "💚", "🧡"],
  },
  {
    name: "Business",
    emojis: ["📱", "💼", "📊", "📈", "🏢", "💰", "🎁", "📦", "🛒", "💳", "📧", "📞", "🔗", "📍", "🏆"],
  },
  {
    name: "Social",
    emojis: ["👤", "👥", "🤝", "💬", "🎵", "🎬", "📸", "🎨", "🎧", "🎮", "📺", "🎭", "🎪", "🎡", "🎢"],
  },
  {
    name: "Food & Nature",
    emojis: ["🍕", "🍔", "🍜", "☕", "🍷", "🍰", "🌿", "🌸", "🌺", "🌻", "🍀", "🌙", "☀️", "🌈", "🌊"],
  },
  {
    name: "Arrows & Symbols",
    emojis: ["→", "←", "↑", "↓", "↔", "•", "◆", "■", "▶", "★", "☆", "✓", "✗", "♦", "♣"],
  },
];

const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => (
  <div className="w-72 max-h-64 overflow-y-auto">
    {emojiCategories.map((category) => (
      <div key={category.name} className="mb-3">
        <div className="text-xs font-medium text-muted-foreground mb-2">{category.name}</div>
        <div className="flex flex-wrap gap-1">
          {category.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  open,
  onClose,
  template,
  onTemplateChange,
  content = "https://example.com",
  styling = defaultStyling,
  qrId,
  qrType = 'url',
}) => {
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  
  // Return null if no template (plain QR mode)
  if (!template) {
    return null;
  }
  
  const customFields = template.customFields || [];

  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (type: CustomField["type"]) => {
    const defaultValues: Record<CustomField["type"], string> = {
      label: "NEW LABEL",
      title: "New Title",
      subtitle: "New Subtitle",
      text: "New text content",
      date: "January 1, 2025",
      time: "12:00 PM",
      button: "Click Me",
      divider: "",
      logo: "",
    };

    const newField: CustomField = {
      id: generateId(),
      type,
      value: defaultValues[type],
      style: {
        fontSize: type === "label" ? 11 : type === "title" ? 20 : 14,
        fontWeight: type === "label" || type === "title" ? "bold" : "normal",
        color: template.textColor,
        letterSpacing: type === "label" ? 2 : 0,
      },
    };

    onTemplateChange({
      ...template,
      customFields: [...customFields, newField],
    });
    setExpandedFields([...expandedFields, newField.id]);
  };

  const updateField = (fieldId: string, updates: Partial<CustomField>) => {
    onTemplateChange({
      ...template,
      customFields: customFields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const updateFieldStyle = (
    fieldId: string,
    styleUpdates: Partial<CustomField["style"]>
  ) => {
    const field = customFields.find((f) => f.id === fieldId);
    if (!field) return;

    updateField(fieldId, {
      style: { ...field.style, ...styleUpdates },
    });
  };

  const removeField = (fieldId: string) => {
    onTemplateChange({
      ...template,
      customFields: customFields.filter((f) => f.id !== fieldId),
    });
    setExpandedFields(expandedFields.filter((id) => id !== fieldId));
  };

  const moveField = (fieldId: string, direction: "up" | "down") => {
    const index = customFields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === customFields.length - 1) return;

    const newFields = [...customFields];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newFields[index], newFields[swapIndex]] = [
      newFields[swapIndex],
      newFields[index],
    ];

    onTemplateChange({
      ...template,
      customFields: newFields,
    });
  };

  const insertEmoji = (fieldId: string, emoji: string, currentValue: string) => {
    updateField(fieldId, { value: currentValue + emoji });
  };

  const insertEmojiToMain = (field: "title" | "subtitle", emoji: string) => {
    onTemplateChange({ ...template, [field]: template[field] + emoji });
  };

  // Render inline element editor
  const renderFieldEditor = (field: CustomField, index: number) => (
    <Card
      key={field.id}
      size="small"
      className="mb-3 border-border card-compact"
    >
      <div className="space-y-3">
        {/* Header with type, move, delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical size={14} className="text-muted-foreground cursor-move" />
            <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
              {field.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip title="Move up">
              <Button
                size="small"
                type="text"
                icon={<ChevronUp size={14} />}
                onClick={() => moveField(field.id, "up")}
                disabled={index === 0}
              />
            </Tooltip>
            <Tooltip title="Move down">
              <Button
                size="small"
                type="text"
                icon={<ChevronDown size={14} />}
                onClick={() => moveField(field.id, "down")}
                disabled={index === customFields.length - 1}
              />
            </Tooltip>
            <Popconfirm
              title="Delete this element?"
              onConfirm={() => removeField(field.id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
            </Popconfirm>
          </div>
        </div>

        {field.type !== "divider" && (
          <>
            {/* Content with emoji picker */}
            <div className="flex gap-2">
              <Input
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                placeholder="Enter content..."
                className="flex-1"
              />
              <Popover
                content={<EmojiPicker onSelect={(emoji) => insertEmoji(field.id, emoji, field.value)} />}
                trigger="click"
                placement="bottomRight"
              >
                <Button icon={<Smile size={16} />} />
              </Popover>
            </div>

            {/* Inline style controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Size</label>
                <Slider
                  min={8}
                  max={48}
                  value={field.style?.fontSize || 14}
                  onChange={(v) => updateFieldStyle(field.id, { fontSize: v })}
                  tooltip={{ formatter: (v) => `${v}px` }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Weight</label>
                <Select
                  value={field.style?.fontWeight || "normal"}
                  onChange={(v) => updateFieldStyle(field.id, { fontWeight: v })}
                  options={fontWeightOptions}
                  className="w-full"
                  size="small"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                <ColorPicker
                  value={field.style?.color || template.textColor}
                  onChange={(c) => updateFieldStyle(field.id, { color: c.toHexString() })}
                  size="small"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Spacing</label>
                <Slider
                  min={0}
                  max={10}
                  value={field.style?.letterSpacing || 0}
                  onChange={(v) => updateFieldStyle(field.id, { letterSpacing: v })}
                  tooltip={{ formatter: (v) => `${v}px` }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Opacity</label>
                <Slider
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={field.style?.opacity || 1}
                  onChange={(v) => updateFieldStyle(field.id, { opacity: v })}
                  tooltip={{ formatter: (v) => `${Math.round((v || 1) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  size="small"
                  checked={field.style?.italic || false}
                  onChange={(v) => updateFieldStyle(field.id, { italic: v })}
                />
                <label className="text-xs text-muted-foreground">Italic</label>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">BG:</label>
                <ColorPicker
                  value={field.style?.backgroundColor || "transparent"}
                  onChange={(c) => updateFieldStyle(field.id, { backgroundColor: c.toHexString() })}
                  allowClear
                  size="small"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Radius:</label>
                <Slider
                  min={0}
                  max={24}
                  value={field.style?.borderRadius || 0}
                  onChange={(v) => updateFieldStyle(field.id, { borderRadius: v })}
                  className="w-16"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );

  const tabItems = [
    {
      key: "content",
      label: (
        <span className="flex items-center gap-2">
          <Type size={14} />
          Content
        </span>
      ),
      children: (
        <div className="space-y-4 h-[520px] overflow-y-auto pr-2">
          {/* Main Title & Subtitle */}
          <Card size="small" title="Main Text" className="border-border">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1">Title</label>
                <div className="flex gap-2">
                  <Input
                    value={template.title}
                    onChange={(e) => onTemplateChange({ ...template, title: e.target.value })}
                    placeholder="Enter title"
                    className="flex-1"
                  />
                  <Popover
                    content={<EmojiPicker onSelect={(emoji) => insertEmojiToMain("title", emoji)} />}
                    trigger="click"
                    placement="bottomRight"
                  >
                    <Button icon={<Smile size={16} />} />
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Title Size</label>
                  <Slider
                    min={14}
                    max={48}
                    value={template.titleFontSize || 24}
                    onChange={(v) => onTemplateChange({ ...template, titleFontSize: v })}
                    tooltip={{ formatter: (v) => `${v}px` }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Title Weight</label>
                  <Select
                    value={template.titleFontWeight || "bold"}
                    onChange={(v) => onTemplateChange({ ...template, titleFontWeight: v })}
                    options={fontWeightOptions}
                    className="w-full"
                    size="small"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">Subtitle</label>
                <div className="flex gap-2">
                  <Input
                    value={template.subtitle}
                    onChange={(e) => onTemplateChange({ ...template, subtitle: e.target.value })}
                    placeholder="Enter subtitle"
                    className="flex-1"
                  />
                  <Popover
                    content={<EmojiPicker onSelect={(emoji) => insertEmojiToMain("subtitle", emoji)} />}
                    trigger="click"
                    placement="bottomRight"
                  >
                    <Button icon={<Smile size={16} />} />
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Subtitle Size</label>
                  <Slider
                    min={10}
                    max={28}
                    value={template.subtitleFontSize || 14}
                    onChange={(v) => onTemplateChange({ ...template, subtitleFontSize: v })}
                    tooltip={{ formatter: (v) => `${v}px` }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Subtitle Weight</label>
                  <Select
                    value={template.subtitleFontWeight || "normal"}
                    onChange={(v) => onTemplateChange({ ...template, subtitleFontWeight: v })}
                    options={fontWeightOptions}
                    className="w-full"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Custom Elements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Custom Elements</span>
              <Popover
                content={
                  <div className="flex flex-col gap-1 w-36">
                    {fieldTypes.map((ft) => (
                      <Button
                        key={ft.value}
                        type="text"
                        icon={ft.icon}
                        onClick={() => addField(ft.value as CustomField["type"])}
                        className="justify-start"
                      >
                        Add {ft.label}
                      </Button>
                    ))}
                  </div>
                }
                trigger="click"
                placement="bottomRight"
              >
                <Button size="small" icon={<Plus size={14} />}>
                  Add Element
                </Button>
              </Popover>
            </div>

            {customFields.length === 0 ? (
              <Empty
                description="No custom elements yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="py-6"
              />
            ) : (
              customFields.map((field, index) => renderFieldEditor(field, index))
            )}
          </div>
        </div>
      ),
    },
    {
      key: "style",
      label: (
        <span className="flex items-center gap-2">
          <Palette size={14} />
          Style
        </span>
      ),
      children: (
        <div className="space-y-4 h-[520px] overflow-y-auto pr-2">
          {/* Typography */}
          <Card size="small" title="Typography" className="border-border">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Font Family</label>
                <Select
                  value={template.fontFamily || "Inter"}
                  onChange={(v) => onTemplateChange({ ...template, fontFamily: v })}
                  options={fontFamilyOptions}
                  className="w-full"
                  showSearch
                  optionFilterProp="label"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Text Alignment</label>
                <Select
                  value={template.textAlign || "center"}
                  onChange={(v) => onTemplateChange({ ...template, textAlign: v })}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Title Letter Spacing: {template.titleLetterSpacing || 0}px
                  </label>
                  <Slider
                    min={0}
                    max={10}
                    value={template.titleLetterSpacing || 0}
                    onChange={(v) => onTemplateChange({ ...template, titleLetterSpacing: v })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Subtitle Letter Spacing: {template.subtitleLetterSpacing || 0}px
                  </label>
                  <Slider
                    min={0}
                    max={10}
                    value={template.subtitleLetterSpacing || 0}
                    onChange={(v) => onTemplateChange({ ...template, subtitleLetterSpacing: v })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Colors */}
          <Card size="small" title="Colors" className="border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-2">Background</label>
                <ColorPicker
                  value={template.backgroundColor}
                  onChange={(c) => onTemplateChange({ ...template, backgroundColor: c.toHexString() })}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2">Text Color</label>
                <ColorPicker
                  value={template.textColor}
                  onChange={(c) => onTemplateChange({ ...template, textColor: c.toHexString() })}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-2">Accent Color</label>
                <ColorPicker
                  value={template.accentColor || template.textColor}
                  onChange={(c) => onTemplateChange({ ...template, accentColor: c.toHexString() })}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium">Gradient Background</label>
                <Switch
                  checked={template.showGradient || false}
                  onChange={(v) => onTemplateChange({ ...template, showGradient: v })}
                />
              </div>
              {template.showGradient && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Gradient End</label>
                    <ColorPicker
                      value={template.gradientColor || "#000000"}
                      onChange={(c) => onTemplateChange({ ...template, gradientColor: c.toHexString() })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Direction</label>
                    <Select
                      value={template.gradientDirection || "to-bottom"}
                      onChange={(v) => onTemplateChange({ ...template, gradientDirection: v })}
                      options={[
                        { value: "to-bottom", label: "Top to Bottom" },
                        { value: "to-right", label: "Left to Right" },
                        { value: "to-bottom-right", label: "Diagonal ↘" },
                        { value: "to-top-right", label: "Diagonal ↗" },
                      ]}
                      className="w-full"
                      size="small"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Card Style */}
          <Card size="small" title="Card Style" className="border-border">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1">
                  Border Radius: {template.borderRadius || 16}px
                </label>
                <Slider
                  min={0}
                  max={32}
                  value={template.borderRadius || 16}
                  onChange={(v) => onTemplateChange({ ...template, borderRadius: v })}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">
                  Padding: {template.padding || 24}px
                </label>
                <Slider
                  min={12}
                  max={48}
                  value={template.padding || 24}
                  onChange={(v) => onTemplateChange({ ...template, padding: v })}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Shadow</label>
                <Select
                  value={template.shadowIntensity || "none"}
                  onChange={(v) => onTemplateChange({ ...template, shadowIntensity: v })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "light", label: "Light" },
                    { value: "medium", label: "Medium" },
                    { value: "strong", label: "Strong" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Show Border</label>
                <Switch
                  checked={template.showBorder || false}
                  onChange={(v) => onTemplateChange({ ...template, showBorder: v })}
                />
              </div>
              {template.showBorder && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Border Color</label>
                    <ColorPicker
                      value={template.borderColor || "#e5e7eb"}
                      onChange={(c) => onTemplateChange({ ...template, borderColor: c.toHexString() })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Width: {template.borderWidth || 1}px
                    </label>
                    <Slider
                      min={1}
                      max={5}
                      value={template.borderWidth || 1}
                      onChange={(v) => onTemplateChange({ ...template, borderWidth: v })}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium block mb-1">Decorative Style</label>
                <Select
                  value={template.decorativeStyle || "none"}
                  onChange={(v) => onTemplateChange({ ...template, decorativeStyle: v })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "circles", label: "Circles" },
                    { value: "dots", label: "Dots" },
                    { value: "lines", label: "Lines" },
                    { value: "geometric", label: "Geometric" },
                    { value: "grid", label: "Grid" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: "layout",
      label: (
        <span className="flex items-center gap-2">
          <Layout size={14} />
          Layout
        </span>
      ),
      children: (
        <div className="space-y-4 h-[520px] overflow-y-auto pr-2">
          {/* QR Label */}
          <Card size="small" title="QR Label" className="border-border">
            <Input
              value={template.qrLabel || ""}
              onChange={(e) => onTemplateChange({ ...template, qrLabel: e.target.value })}
              placeholder="e.g., Scan for details"
            />
          </Card>

          {/* Gradient Presets */}
          <Card size="small" title="Card Style Presets" className="border-border">
            <div className="grid grid-cols-4 gap-3">
              {/* No gradient / Solid */}
              <div
                onClick={() => onTemplateChange({ ...template, showGradient: false })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${
                  !template.showGradient 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: template.backgroundColor }}
              >
                <span className="text-[10px] font-medium text-center px-1" style={{ color: template.textColor }}>
                  Solid
                </span>
              </div>

              {/* Preset 1: Sunset */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#ff6b35',
                  gradientColor: '#f7931e',
                  gradientDirection: 'to-bottom-right',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#ff6b35'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
              />

              {/* Preset 2: Ocean */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#667eea',
                  gradientColor: '#764ba2',
                  gradientDirection: 'to-bottom-right',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#667eea'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              />

              {/* Preset 3: Forest */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#11998e',
                  gradientColor: '#38ef7d',
                  gradientDirection: 'to-bottom-right',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#11998e'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
              />

              {/* Preset 4: Rose */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#ee9ca7',
                  gradientColor: '#ffdde1',
                  gradientDirection: 'to-bottom',
                  textColor: '#1a1a1a'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#ee9ca7'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(180deg, #ee9ca7, #ffdde1)' }}
              />

              {/* Preset 5: Dark Elegant */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#232526',
                  gradientColor: '#414345',
                  gradientDirection: 'to-bottom-right',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#232526'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(135deg, #232526, #414345)' }}
              />

              {/* Preset 6: Royal Blue */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#1e3c72',
                  gradientColor: '#2a5298',
                  gradientDirection: 'to-bottom',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#1e3c72'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(180deg, #1e3c72, #2a5298)' }}
              />

              {/* Preset 7: Gold */}
              <div
                onClick={() => onTemplateChange({ 
                  ...template, 
                  showGradient: true,
                  backgroundColor: '#f5af19',
                  gradientColor: '#f12711',
                  gradientDirection: 'to-right',
                  textColor: '#ffffff'
                })}
                className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                  template.showGradient && template.backgroundColor === '#f5af19'
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ background: 'linear-gradient(90deg, #f5af19, #f12711)' }}
              />
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: "cta",
      label: (
        <span className="flex items-center gap-2">
          <MousePointerClick size={14} />
          CTA Button
        </span>
      ),
      children: (
        <div className="space-y-4 h-[520px] overflow-y-auto pr-2">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <label className="text-sm font-medium">Show CTA Button</label>
            <Switch
              checked={!!template.ctaButton}
              onChange={(checked) => {
                if (checked) {
                  onTemplateChange({
                    ...template,
                    ctaButton: {
                      text: "Scan to Connect",
                      backgroundColor: template.accentColor || "#00ff88",
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
            <Card size="small" title="Button Settings" className="border-border">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">Button Text</label>
                  <div className="flex gap-2">
                    <Input
                      value={template.ctaButton.text}
                      onChange={(e) =>
                        onTemplateChange({
                          ...template,
                          ctaButton: { ...template.ctaButton!, text: e.target.value },
                        })
                      }
                      className="flex-1"
                    />
                    <Popover
                      content={
                        <EmojiPicker
                          onSelect={(emoji) =>
                            onTemplateChange({
                              ...template,
                              ctaButton: { ...template.ctaButton!, text: template.ctaButton!.text + emoji },
                            })
                          }
                        />
                      }
                      trigger="click"
                      placement="bottomRight"
                    >
                      <Button icon={<Smile size={16} />} />
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-2">Background</label>
                    <ColorPicker
                      value={template.ctaButton.backgroundColor}
                      onChange={(c) =>
                        onTemplateChange({
                          ...template,
                          ctaButton: { ...template.ctaButton!, backgroundColor: c.toHexString() },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-2">Text Color</label>
                    <ColorPicker
                      value={template.ctaButton.textColor}
                      onChange={(c) =>
                        onTemplateChange({
                          ...template,
                          ctaButton: { ...template.ctaButton!, textColor: c.toHexString() },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Border Radius: {template.ctaButton.borderRadius || 8}px
                  </label>
                  <Slider
                    min={0}
                    max={32}
                    value={template.ctaButton.borderRadius || 8}
                    onChange={(v) =>
                      onTemplateChange({
                        ...template,
                        ctaButton: { ...template.ctaButton!, borderRadius: v },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Template Editor"
      open={open}
      onCancel={onClose}
      width={1000}
      className="template-editor-modal"
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Done
        </Button>,
      ]}
    >
      <div className="flex gap-6">
        {/* Editor Panel */}
        <div className="flex-1 min-w-0">
          <Tabs items={tabItems} />
        </div>

        {/* Live Preview Panel */}
        <div className="w-[360px] flex-shrink-0">
          <div className="sticky top-0">
            <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <QrCode size={14} />
              Live Preview
            </div>
            <div className="flex justify-center items-start p-4 bg-muted/30 rounded-lg min-h-[550px]">
              <div className="transform scale-[0.82] origin-top">
                <QRCodePreview
                  content={content}
                  template={template}
                  styling={styling}
                  editable={false}
                  qrId={qrId}
                  qrType={qrType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateEditorModal;