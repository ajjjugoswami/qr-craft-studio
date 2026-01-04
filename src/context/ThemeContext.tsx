import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ThemeContextType, ThemeName, ThemeMode, themes } from './themeTypes';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

const THEME_STORAGE_KEY = 'qc_theme';
const MODE_STORAGE_KEY = 'qc_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('orange');
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');
  const { user, token } = useAuth();

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load theme and mode from storage on mount
  useEffect(() => {
    if (user?.theme && themes[user.theme as ThemeName]) {
      setCurrentTheme(user.theme as ThemeName);
    } else {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    }
    
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      setModeState(savedMode);
    }
  }, [user?.theme]);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    const effectiveMode = mode === 'system' ? systemPreference : mode;
    const themeColors = effectiveMode === 'dark' && theme.darkColors ? theme.darkColors : theme.colors;
    const root = document.documentElement;

    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--primary-foreground', themeColors.primaryForeground);
    root.style.setProperty('--primary-light', themeColors.primaryLight);
    root.style.setProperty('--accent', themeColors.accent);
    root.style.setProperty('--accent-foreground', themeColors.accentForeground);
    root.style.setProperty('--ring', themeColors.ring);
    root.style.setProperty('--sidebar-primary', themeColors.sidebarPrimary);
    root.style.setProperty('--sidebar-accent', themeColors.sidebarAccent);

    // Check if it's a gradient theme
    const isGradient = currentTheme.startsWith('gradient_');
    if (isGradient) {
      root.style.setProperty(
        '--gradient-bg',
        `linear-gradient(135deg, hsl(${themeColors.primary}) 0%, hsl(${themeColors.accent}) 100%)`
      );
    } else {
      root.style.setProperty('--gradient-bg', `hsl(${themeColors.primaryLight})`);
    }

    root.setAttribute('data-theme', currentTheme);
    root.setAttribute('data-mode', effectiveMode);
    
    // Toggle dark class for Tailwind
    if (effectiveMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme, mode, systemPreference]);

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

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    mode,
    setTheme,
    setMode,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
