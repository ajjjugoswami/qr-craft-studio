import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { QRStyling } from '@/types/qrcode';

interface FreeStyleOptionsProps {
  styling: QRStyling;
  onStyleChange: (style: Partial<QRStyling>) => void;
}

const colorPresets = [
  { name: 'Black', fg: '#000000', bg: '#ffffff' },
  { name: 'Blue', fg: '#1e40af', bg: '#ffffff' },
  { name: 'Purple', fg: '#7c3aed', bg: '#ffffff' },
  { name: 'Green', fg: '#059669', bg: '#ffffff' },
  { name: 'Red', fg: '#dc2626', bg: '#ffffff' },
  { name: 'Orange', fg: '#ea580c', bg: '#ffffff' }
];

const dotPatterns: Array<{ type: QRStyling['dotsType']; label: string }> = [
  { type: 'square', label: 'Square' },
  { type: 'dots', label: 'Dots' },
  { type: 'rounded', label: 'Rounded' },
  { type: 'classy', label: 'Classy' }
];

const FreeStyleOptions = ({ styling, onStyleChange }: FreeStyleOptionsProps) => {
  const handleColorChange = (fg: string, bg: string) => {
    onStyleChange({
      fgColor: fg,
      bgColor: bg,
      cornersSquareOptions: { ...styling.cornersSquareOptions, color: fg } as any,
      cornersDotOptions: { ...styling.cornersDotOptions, color: fg } as any
    });
  };

  const handlePatternChange = (type: QRStyling['dotsType']) => {
    onStyleChange({
      dotsType: type
    });
  };

  return (
    <div className="space-y-4">
      {/* Color Presets */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Color Theme</Label>
        <div className="grid grid-cols-6 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleColorChange(preset.fg, preset.bg)}
              className={`h-10 w-full rounded-lg border-2 transition-all ${
                styling.fgColor === preset.fg
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ backgroundColor: preset.fg }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Dot Pattern */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Pattern Style</Label>
        <div className="grid grid-cols-4 gap-2">
          {dotPatterns.map((pattern) => (
            <Button
              key={pattern.type}
              variant={styling.dotsType === pattern.type ? 'default' : 'outline'}
              size="sm"
              className="h-9 text-xs"
              onClick={() => handlePatternChange(pattern.type)}
            >
              {pattern.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreeStyleOptions;
