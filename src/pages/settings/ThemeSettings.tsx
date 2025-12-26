import React, { useState } from 'react';
import { Card, Typography, message, Button } from 'antd';
import { Palette, Save } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { themes, ThemeName } from '../../context/themeTypes';

const { Title, Text } = Typography;

const ThemeSettings: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [saving, setSaving] = useState(false);

  const hasChanges = selectedTheme !== currentTheme;

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName as ThemeName);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setTheme(selectedTheme);
      message.success(`Theme changed to ${themes[selectedTheme].label}`);
    } catch {
      message.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection Card */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Palette className="mr-3 text-primary" size={24} />
            <Title level={4} className="!mb-0">Color Theme</Title>
          </div>
          <Button
            type="primary"
            icon={<Save size={16} />}
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges}
          >
            Save Theme
          </Button>
        </div>

        <Text type="secondary" className="mb-6 block">
          Choose your preferred accent color and click Save to apply.
        </Text>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Object.entries(themes).map(([key, theme]) => {
            const isGradient = key.startsWith('gradient_');
            const isSelected = selectedTheme === key;

            return (
              <div
                key={key}
                className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{
                  background: isGradient
                    ? `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`
                    : `hsl(${theme.colors.primaryLight})`,
                }}
                onClick={() => handleThemeSelect(key)}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                  </div>
                )}

                <div className="text-center">
                  <div className="flex justify-center gap-0.5 mb-1.5">
                    <div
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                  </div>

                  <Text
                    strong
                    className={`text-xs ${isGradient ? 'text-white' : ''}`}
                    style={{ color: isGradient ? 'white' : `hsl(${theme.colors.primary})` }}
                  >
                    {theme.label}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ThemeSettings;
