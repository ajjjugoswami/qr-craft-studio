import React from 'react';
import { Card, Typography, message } from 'antd';
import { Palette } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { themes, ThemeName } from '../../context/themeTypes';

const { Title, Text } = Typography;

const ThemeSettings: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = (themeName: string) => {
    const theme = themeName as ThemeName;
    setTheme(theme);
    message.success(`Theme changed to ${themes[theme].label}`);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection Card */}
      <Card className="shadow-sm">
        <div className="flex items-center mb-4">
          <Palette className="mr-3 text-primary" size={24} />
          <Title level={4} className="!mb-0">Color Theme</Title>
        </div>

        <Text type="secondary" className="mb-6 block">
          Choose your preferred accent color. Your selection will be saved automatically.
        </Text>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Object.entries(themes).map(([key, theme]) => {
            const isGradient = key.startsWith('gradient_');
            const isSelected = currentTheme === key;

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
                onClick={() => handleThemeChange(key)}
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
