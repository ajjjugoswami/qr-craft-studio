import React, { useState } from 'react';
import { Card, Typography, message, Button, Segmented } from 'antd';
import { Palette, Save, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { themes, ThemeName, ThemeMode } from '../../context/themeTypes';

const { Title, Text } = Typography;

const ThemeSettings: React.FC = () => {
  const { currentTheme, mode, setTheme, setMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [saving, setSaving] = useState(false);

  // Detect system preference for effective mode calculation
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
  const isDarkMode = effectiveMode === 'dark';

  const hasChanges = selectedTheme !== currentTheme;

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName as ThemeName);
  };

  const handleModeChange = (value: string | number) => {
    const newMode = value as ThemeMode;
    setMode(newMode);
    const modeLabels = { light: 'Light', dark: 'Dark', system: 'System' };
    message.success(`${modeLabels[newMode]} mode enabled`);
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
    <div className="space-y-4 sm:space-y-6">
      {/* Appearance Mode Card */}
      <Card className="shadow-sm !p-3 sm:!p-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Palette className="text-primary" size={20} />
          <div>
            <Title level={5} className="!mb-0 text-sm sm:text-base">Appearance</Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Choose your preferred theme appearance
            </Text>
          </div>
        </div>
        
        <Segmented
          value={mode}
          onChange={handleModeChange}
          block
          size="middle"
          options={[
            {
              label: (
                <div className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2">
                  <Sun size={16} />
                  <span className="font-medium text-xs sm:text-sm">Light</span>
                </div>
              ),
              value: 'light',
            },
            {
              label: (
                <div className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2">
                  <Moon size={16} />
                  <span className="font-medium text-xs sm:text-sm">Dark</span>
                </div>
              ),
              value: 'dark',
            },
            {
              label: (
                <div className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2">
                  <Monitor size={16} />
                  <span className="font-medium text-xs sm:text-sm">System</span>
                </div>
              ),
              value: 'system',
            },
          ]}
        />
      </Card>

      {/* Theme Selection Card */}
      <Card className="shadow-sm !p-3 sm:!p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Palette className="text-primary" size={20} />
            <Title level={5} className="!mb-0 text-sm sm:text-base">Color Theme</Title>
          </div>
          <Button
            type="primary"
            size="small"
            icon={<Save size={14} />}
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges}
          >
            Save
          </Button>
        </div>

        <Text type="secondary" className="mb-3 sm:mb-4 block text-xs sm:text-sm">
          Choose your preferred accent color and click Save to apply.
        </Text>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">{Object.entries(themes).map(([key, theme]) => {
            const isGradient = key.startsWith('gradient_');
            const isSelected = selectedTheme === key;

            // Get background color based on mode
            let backgroundColor;
            if (isGradient) {
              backgroundColor = `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`;
            } else {
              // Use darker background in dark mode with primary color tint
              backgroundColor = isDarkMode 
                ? `hsl(${theme.colors.primary} / 0.15)` 
                : `hsl(${theme.colors.primaryLight})`;
            }

            // Text color - always visible with good contrast
            const textColor = isGradient 
              ? 'white' 
              : isDarkMode 
                ? `hsl(${theme.colors.primary} / 0.9)` 
                : `hsl(${theme.colors.primary})`;

            return (
              <div
                key={key}
                className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : isDarkMode 
                      ? 'border-border/40 hover:border-primary/50 bg-card/30' 
                      : 'border-border hover:border-primary/50'
                }`}
                style={{
                  background: backgroundColor,
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
                      className={`w-3 h-3 rounded-full ${isDarkMode ? 'border border-white/30' : 'border border-white/20'}`}
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div
                      className={`w-3 h-3 rounded-full ${isDarkMode ? 'border border-white/30' : 'border border-white/20'}`}
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                  </div>

                  <Text
                    strong
                    className="text-xs block"
                    style={{ 
                      color: textColor,
                      textShadow: isDarkMode && !isGradient ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                    }}
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
