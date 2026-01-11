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
  Drawer,
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
  Palette,
  Layout,
  QrCode,
  Eye,
  EyeOff,
  X,
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  { value: "label", label: "Label", icon: <Type size={12} /> },
  { value: "text", label: "Text", icon: <Type size={12} /> },
  { value: "date", label: "Date", icon: <Calendar size={12} /> },
  { value: "time", label: "Time", icon: <Clock size={12} /> },
  { value: "divider", label: "Divider", icon: <Minus size={12} /> },
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
  <div className="w-64 max-h-48 overflow-y-auto">
    {emojiCategories.map((category) => (
      <div key={category.name} className="mb-2">
        <div className="text-[10px] font-medium text-muted-foreground mb-1">{category.name}</div>
        <div className="flex flex-wrap gap-0.5">
          {category.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="w-7 h-7 flex items-center justify-center text-sm hover:bg-muted rounded transition-colors"
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
  const isMobile = useIsMobile();
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
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

  // Render inline element editor - MOBILE OPTIMIZED
  const renderFieldEditor = (field: CustomField, index: number) => (
    <Card
      key={field.id}
      size="small"
      className="mb-2 border-border"
      bodyStyle={{ padding: isMobile ? 8 : 12 }}
    >
      <div className="space-y-2">
        {/* Header with type, move, delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <GripVertical size={12} className="text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {field.type}
            </span>
          </div>
          <div className="flex items-center">
            <Button
              size="small"
              type="text"
              icon={<ChevronUp size={12} />}
              onClick={() => moveField(field.id, "up")}
              disabled={index === 0}
              className="!w-6 !h-6 !min-w-0 !p-0"
            />
            <Button
              size="small"
              type="text"
              icon={<ChevronDown size={12} />}
              onClick={() => moveField(field.id, "down")}
              disabled={index === customFields.length - 1}
              className="!w-6 !h-6 !min-w-0 !p-0"
            />
            <Popconfirm
              title="Delete?"
              onConfirm={() => removeField(field.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="text" danger icon={<Trash2 size={12} />} className="!w-6 !h-6 !min-w-0 !p-0" />
            </Popconfirm>
          </div>
        </div>

        {field.type !== "divider" && (
          <>
            {/* Content with emoji picker */}
            <div className="flex gap-1">
              <Input
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                placeholder="Enter content..."
                size="small"
                className="flex-1 text-xs"
              />
              <Popover
                content={<EmojiPicker onSelect={(emoji) => insertEmoji(field.id, emoji, field.value)} />}
                trigger="click"
                placement="bottomRight"
              >
                <Button size="small" icon={<Smile size={12} />} className="!w-7 !h-7 !min-w-0" />
              </Popover>
            </div>

            {/* Inline style controls - compact on mobile */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground mb-0.5 block">Size</label>
                <Slider
                  min={8}
                  max={48}
                  value={field.style?.fontSize || 14}
                  onChange={(v) => updateFieldStyle(field.id, { fontSize: v })}
                  tooltip={{ formatter: (v) => `${v}px` }}
                  className="!m-0"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-0.5 block">Weight</label>
                <Select
                  value={field.style?.fontWeight || "normal"}
                  onChange={(v) => updateFieldStyle(field.id, { fontWeight: v })}
                  options={fontWeightOptions}
                  className="w-full"
                  size="small"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <label className="text-[10px] text-muted-foreground">Color:</label>
                <ColorPicker
                  value={field.style?.color || template.textColor}
                  onChange={(c) => updateFieldStyle(field.id, { color: c.toHexString() })}
                  size="small"
                />
              </div>
              <div className="flex items-center gap-1">
                <Switch
                  size="small"
                  checked={field.style?.italic || false}
                  onChange={(v) => updateFieldStyle(field.id, { italic: v })}
                />
                <label className="text-[10px] text-muted-foreground">Italic</label>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );

  // Mobile preview component
  const MobilePreview = () => (
    <div className="relative flex justify-center items-center p-2 bg-muted/30 rounded-lg">
      <div className="transform scale-[0.5] origin-center">
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
  );

  // Content Tab for mobile
  const ContentTab = () => (
    <div className="space-y-3 overflow-y-auto px-1" style={{ maxHeight: isMobile ? 'calc(100vh - 200px)' : 520 }}>
      {/* Main Title & Subtitle */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">Main Text</div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-medium block mb-0.5">Title</label>
            <div className="flex gap-1">
              <Input
                value={template.title}
                onChange={(e) => onTemplateChange({ ...template, title: e.target.value })}
                placeholder="Enter title"
                size="small"
                className="flex-1 text-xs"
              />
              <Popover
                content={<EmojiPicker onSelect={(emoji) => insertEmojiToMain("title", emoji)} />}
                trigger="click"
                placement="bottomRight"
              >
                <Button size="small" icon={<Smile size={12} />} className="!w-7 !h-7 !min-w-0" />
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Size</label>
              <Slider
                min={14}
                max={48}
                value={template.titleFontSize || 24}
                onChange={(v) => onTemplateChange({ ...template, titleFontSize: v })}
                tooltip={{ formatter: (v) => `${v}px` }}
                className="!m-0"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Weight</label>
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
            <label className="text-[10px] font-medium block mb-0.5">Subtitle</label>
            <div className="flex gap-1">
              <Input
                value={template.subtitle}
                onChange={(e) => onTemplateChange({ ...template, subtitle: e.target.value })}
                placeholder="Enter subtitle"
                size="small"
                className="flex-1 text-xs"
              />
              <Popover
                content={<EmojiPicker onSelect={(emoji) => insertEmojiToMain("subtitle", emoji)} />}
                trigger="click"
                placement="bottomRight"
              >
                <Button size="small" icon={<Smile size={12} />} className="!w-7 !h-7 !min-w-0" />
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Size</label>
              <Slider
                min={10}
                max={28}
                value={template.subtitleFontSize || 14}
                onChange={(v) => onTemplateChange({ ...template, subtitleFontSize: v })}
                tooltip={{ formatter: (v) => `${v}px` }}
                className="!m-0"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-0.5 block">Weight</label>
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Custom Elements</span>
          <Popover
            content={
              <div className="flex flex-col gap-0.5 w-28">
                {fieldTypes.map((ft) => (
                  <Button
                    key={ft.value}
                    type="text"
                    size="small"
                    icon={ft.icon}
                    onClick={() => addField(ft.value as CustomField["type"])}
                    className="justify-start text-xs"
                  >
                    {ft.label}
                  </Button>
                ))}
              </div>
            }
            trigger="click"
            placement="bottomRight"
          >
            <Button size="small" icon={<Plus size={12} />} className="text-xs !h-6">
              Add
            </Button>
          </Popover>
        </div>

        {customFields.length === 0 ? (
          <Empty
            description="No custom elements"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-4"
          />
        ) : (
          customFields.map((field, index) => renderFieldEditor(field, index))
        )}
      </div>
    </div>
  );

  // Style Tab for mobile
  const StyleTab = () => (
    <div className="space-y-3 overflow-y-auto px-1" style={{ maxHeight: isMobile ? 'calc(100vh - 200px)' : 520 }}>
      {/* Typography */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">Typography</div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-medium block mb-0.5">Font Family</label>
            <Select
              value={template.fontFamily || "Inter"}
              onChange={(v) => onTemplateChange({ ...template, fontFamily: v })}
              options={fontFamilyOptions}
              className="w-full"
              size="small"
              showSearch
              optionFilterProp="label"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium block mb-0.5">Text Alignment</label>
            <Select
              value={template.textAlign || "center"}
              onChange={(v) => onTemplateChange({ ...template, textAlign: v })}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              className="w-full"
              size="small"
            />
          </div>
        </div>
      </Card>

      {/* Colors */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">Colors</div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-medium block mb-1">Background</label>
            <ColorPicker
              value={template.backgroundColor}
              onChange={(c) => onTemplateChange({ ...template, backgroundColor: c.toHexString() })}
              size="small"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium block mb-1">Text</label>
            <ColorPicker
              value={template.textColor}
              onChange={(c) => onTemplateChange({ ...template, textColor: c.toHexString() })}
              size="small"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium block mb-1">Accent</label>
            <ColorPicker
              value={template.accentColor || template.textColor}
              onChange={(c) => onTemplateChange({ ...template, accentColor: c.toHexString() })}
              size="small"
            />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-medium">Gradient</label>
            <Switch
              checked={template.showGradient || false}
              onChange={(v) => onTemplateChange({ ...template, showGradient: v })}
              size="small"
            />
          </div>
          {template.showGradient && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">End Color</label>
                <ColorPicker
                  value={template.gradientColor || "#000000"}
                  onChange={(c) => onTemplateChange({ ...template, gradientColor: c.toHexString() })}
                  size="small"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Direction</label>
                <Select
                  value={template.gradientDirection || "to-bottom"}
                  onChange={(v) => onTemplateChange({ ...template, gradientDirection: v })}
                  options={[
                    { value: "to-bottom", label: "↓" },
                    { value: "to-right", label: "→" },
                    { value: "to-bottom-right", label: "↘" },
                    { value: "to-top-right", label: "↗" },
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
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">Card Style</div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-medium block mb-0.5">
              Radius: {template.borderRadius || 16}px
            </label>
            <Slider
              min={0}
              max={32}
              value={template.borderRadius || 16}
              onChange={(v) => onTemplateChange({ ...template, borderRadius: v })}
              className="!m-0"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium block mb-0.5">
              Padding: {template.padding || 24}px
            </label>
            <Slider
              min={12}
              max={48}
              value={template.padding || 24}
              onChange={(v) => onTemplateChange({ ...template, padding: v })}
              className="!m-0"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium block mb-0.5">Shadow</label>
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
              size="small"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  // Layout Tab (color presets) for mobile
  const LayoutTab = () => (
    <div className="space-y-3 overflow-y-auto px-1" style={{ maxHeight: isMobile ? 'calc(100vh - 200px)' : 520 }}>
      {/* QR Label */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">QR Label</div>
        <Input
          value={template.qrLabel || ""}
          onChange={(e) => onTemplateChange({ ...template, qrLabel: e.target.value })}
          placeholder="e.g., Scan for details"
          size="small"
          className="text-xs"
        />
      </Card>

      {/* Color Presets */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="text-xs font-medium mb-2">Style Presets</div>
        <div className="grid grid-cols-5 gap-2">
          {/* Solid */}
          <div
            onClick={() => onTemplateChange({ ...template, showGradient: false })}
            className={`aspect-square rounded-md border-2 cursor-pointer transition-all flex items-center justify-center ${
              !template.showGradient 
                ? 'border-primary ring-1 ring-primary/30' 
                : 'border-border'
            }`}
            style={{ backgroundColor: template.backgroundColor }}
          >
            <span className="text-[8px] font-medium" style={{ color: template.textColor }}>Solid</span>
          </div>

          {/* Preset gradients */}
          {[
            { bg: '#667eea', end: '#764ba2', text: '#fff' },
            { bg: '#11998e', end: '#38ef7d', text: '#fff' },
            { bg: '#ee9ca7', end: '#ffdde1', text: '#1a1a1a' },
            { bg: '#232526', end: '#414345', text: '#fff' },
            { bg: '#1e3c72', end: '#2a5298', text: '#fff' },
            { bg: '#00c6ff', end: '#0072ff', text: '#fff' },
            { bg: '#ed213a', end: '#93291e', text: '#fff' },
            { bg: '#00f260', end: '#0575e6', text: '#fff' },
          ].map((preset, i) => (
            <div
              key={i}
              onClick={() => onTemplateChange({ 
                ...template, 
                showGradient: true,
                backgroundColor: preset.bg,
                gradientColor: preset.end,
                gradientDirection: 'to-bottom-right',
                textColor: preset.text
              })}
              className={`aspect-square rounded-md border-2 cursor-pointer transition-all ${
                template.showGradient && template.backgroundColor === preset.bg
                  ? 'border-primary ring-1 ring-primary/30' 
                  : 'border-border'
              }`}
              style={{ background: `linear-gradient(135deg, ${preset.bg}, ${preset.end})` }}
            />
          ))}
        </div>
      </Card>

      {/* Border settings */}
      <Card size="small" className="border-border" bodyStyle={{ padding: isMobile ? 8 : 12 }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium">Show Border</label>
          <Switch
            checked={template.showBorder || false}
            onChange={(v) => onTemplateChange({ ...template, showBorder: v })}
            size="small"
          />
        </div>
        {template.showBorder && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Color</label>
              <ColorPicker
                value={template.borderColor || "#e5e7eb"}
                onChange={(c) => onTemplateChange({ ...template, borderColor: c.toHexString() })}
                size="small"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-0.5 block">
                Width: {template.borderWidth || 1}px
              </label>
              <Slider
                min={1}
                max={5}
                value={template.borderWidth || 1}
                onChange={(v) => onTemplateChange({ ...template, borderWidth: v })}
                className="!m-0"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: "content",
      label: <span className="flex items-center gap-1 text-xs"><Type size={12} />Content</span>,
      children: <ContentTab />,
    },
    {
      key: "style",
      label: <span className="flex items-center gap-1 text-xs"><Palette size={12} />Style</span>,
      children: <StyleTab />,
    },
    {
      key: "layout",
      label: <span className="flex items-center gap-1 text-xs"><Layout size={12} />Layout</span>,
      children: <LayoutTab />,
    },
  ];

  // Mobile: Use Drawer from bottom
  if (isMobile) {
    return (
      <Drawer
        title={null}
        placement="bottom"
        open={open}
        onClose={onClose}
        height="90vh"
        className="template-editor-drawer"
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-sm font-medium">Template Editor</span>
            <div className="flex items-center gap-2">
              <Button
                type="text"
                size="small"
                icon={showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                onClick={() => setShowPreview(!showPreview)}
                className="!h-7 text-xs"
              >
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button
                type="text"
                size="small"
                icon={<X size={14} />}
                onClick={onClose}
                className="!h-7 !w-7 !min-w-0 !p-0"
              />
            </div>
          </div>

          {/* Preview toggle section */}
          {showPreview && (
            <div className="p-2 bg-muted/30 border-b border-border">
              <MobilePreview />
            </div>
          )}

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs items={tabItems} size="small" className="h-full px-2 pt-2" />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <Button type="primary" onClick={onClose} block size="small" className="!h-9">
              Done
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }

  // Desktop: Use Modal
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
      destroyOnHidden
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
            <div className="relative flex justify-center items-start p-4 bg-muted/30 rounded-lg min-h-[550px]">
              <div className="transform scale-[0.85] origin-top">
                <QRCodePreview
                  content={content}
                  template={template}
                  styling={styling}
                  editable={false}
                  qrId={qrId}
                  qrType={qrType}
                />
              </div>
              {/* Size indicator */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {styling.size}px {styling.includeMargin ? '• Margin' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateEditorModal;
