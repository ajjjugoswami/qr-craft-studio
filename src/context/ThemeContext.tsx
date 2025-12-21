import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ThemeContextType, ThemeName, themes } from './themeTypes';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

const THEME_STORAGE_KEY = 'qc_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('purple');
  const { user, token } = useAuth();

  // Load theme from storage on mount
  useEffect(() => {
    if (user?.theme && themes[user.theme as ThemeName]) {
      setCurrentTheme(user.theme as ThemeName);
    } else {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    }
  }, [user?.theme]);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--primary-light', theme.colors.primaryLight);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
    root.style.setProperty('--ring', theme.colors.ring);
    root.style.setProperty('--sidebar-primary', theme.colors.sidebarPrimary);
    root.style.setProperty('--sidebar-accent', theme.colors.sidebarAccent);

    // Check if it's a gradient theme
    const isGradient = currentTheme.startsWith('gradient_');
    if (isGradient) {
      root.style.setProperty(
        '--gradient-bg',
        `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`
      );
    } else {
      root.style.setProperty('--gradient-bg', `hsl(${theme.colors.primaryLight})`);
    }

    root.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = useCallback(async (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (token && user) {
      try {
        await authAPI.updateTheme(theme);
      } catch (error) {
        console.error('Failed to save theme to backend:', error);
      }
    }
  }, [token, user]);

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
