import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeName, themes } from './themeTypes';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

const THEME_STORAGE_KEY = 'qc_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('ThemeProvider rendering');
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('purple');
  const { user, token } = useAuth();

  // Load theme from user data or localStorage on mount
  useEffect(() => {
    if (user?.theme && themes[user.theme as ThemeName]) {
      setCurrentTheme(user.theme as ThemeName);
    } else {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    }
  }, [user?.theme]);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Check if it's a gradient theme
    const isGradient = currentTheme.startsWith('gradient_');

    if (isGradient) {
      // For gradient themes, create gradient backgrounds
      const gradientMap: Record<string, string> = {
        gradient_sunset: `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`,
        gradient_ocean: `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`,
        gradient_forest: `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`,
        gradient_royal: `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`,
      };

      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
      root.style.setProperty('--primary-light', theme.colors.primaryLight);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
      root.style.setProperty('--ring', theme.colors.ring);
      root.style.setProperty('--sidebar-primary', theme.colors.sidebarPrimary);
      root.style.setProperty('--sidebar-accent', theme.colors.sidebarAccent);

      // Set gradient background for certain elements
      root.style.setProperty('--gradient-bg', gradientMap[currentTheme] || `hsl(${theme.colors.primaryLight})`);
    } else {
      // For solid themes, use solid colors
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
      root.style.setProperty('--primary-light', theme.colors.primaryLight);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
      root.style.setProperty('--ring', theme.colors.ring);
      root.style.setProperty('--sidebar-primary', theme.colors.sidebarPrimary);
      root.style.setProperty('--sidebar-accent', theme.colors.sidebarAccent);
      root.style.setProperty('--gradient-bg', `hsl(${theme.colors.primaryLight})`);
    }

    // Update Ant Design theme
    const antTheme = {
      token: {
        colorPrimary: `hsl(${theme.colors.primary})`,
        borderRadius: 8,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    };

    // Update document class for theme-specific styles
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = async (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Save to backend if user is authenticated
    if (token && user) {
      try {
        await authAPI.updateTheme(theme);
      } catch (error) {
        console.error('Failed to save theme to backend:', error);
        // Theme is still saved locally, so no need to revert
      }
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};