import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ThemeContextType, ThemeName, ColorMode, themes } from './themeTypes';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

const THEME_STORAGE_KEY = 'qc_theme';
const COLOR_MODE_STORAGE_KEY = 'qc_color_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('purple');
  const [colorMode, setColorModeState] = useState<ColorMode>('system');
  const [isDark, setIsDark] = useState(false);
  const { user, token } = useAuth();

  // Determine if dark mode should be active based on colorMode and system preference
  const computeIsDark = useCallback((mode: ColorMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    // System preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, []);

  // Load theme and color mode from storage on mount
  useEffect(() => {
    // Load color mode
    const savedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode | null;
    if (savedColorMode && ['light', 'dark', 'system'].includes(savedColorMode)) {
      setColorModeState(savedColorMode);
      setIsDark(computeIsDark(savedColorMode));
    } else {
      setIsDark(computeIsDark('system'));
    }

    // Load theme
    if (user?.theme && themes[user.theme as ThemeName]) {
      setCurrentTheme(user.theme as ThemeName);
    } else {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    }
  }, [user?.theme, computeIsDark]);

  // Listen for system preference changes
  useEffect(() => {
    if (colorMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

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

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    setIsDark(computeIsDark(mode));
  }, [computeIsDark]);

  const toggleDarkMode = useCallback(() => {
    const newMode: ColorMode = isDark ? 'light' : 'dark';
    setColorMode(newMode);
  }, [isDark, setColorMode]);

  const value: ThemeContextType = {
    currentTheme,
    colorMode,
    isDark,
    setTheme,
    setColorMode,
    toggleDarkMode,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
