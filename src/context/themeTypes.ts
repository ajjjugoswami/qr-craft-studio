export type ThemeName = 'purple' | 'blue' | 'green' | 'orange' | 'rose' | 'slate';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  primaryLight: string;
  accent: string;
  accentForeground: string;
  ring: string;
  sidebarPrimary: string;
  sidebarAccent: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeName, Theme> = {
  purple: {
    name: 'purple',
    label: 'Purple',
    colors: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      primaryLight: '262 83% 96%',
      accent: '262 83% 58%',
      accentForeground: '0 0% 100%',
      ring: '262 83% 58%',
      sidebarPrimary: '262 83% 58%',
      sidebarAccent: '262 83% 96%',
    },
  },
  blue: {
    name: 'blue',
    label: 'Blue',
    colors: {
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      primaryLight: '217 91% 96%',
      accent: '217 91% 60%',
      accentForeground: '0 0% 100%',
      ring: '217 91% 60%',
      sidebarPrimary: '217 91% 60%',
      sidebarAccent: '217 91% 96%',
    },
  },
  green: {
    name: 'green',
    label: 'Green',
    colors: {
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      primaryLight: '142 76% 96%',
      accent: '142 76% 36%',
      accentForeground: '0 0% 100%',
      ring: '142 76% 36%',
      sidebarPrimary: '142 76% 36%',
      sidebarAccent: '142 76% 96%',
    },
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    colors: {
      primary: '25 95% 53%',
      primaryForeground: '0 0% 100%',
      primaryLight: '25 95% 96%',
      accent: '25 95% 53%',
      accentForeground: '0 0% 100%',
      ring: '25 95% 53%',
      sidebarPrimary: '25 95% 53%',
      sidebarAccent: '25 95% 96%',
    },
  },
  rose: {
    name: 'rose',
    label: 'Rose',
    colors: {
      primary: '346 77% 49%',
      primaryForeground: '0 0% 100%',
      primaryLight: '346 77% 96%',
      accent: '346 77% 49%',
      accentForeground: '0 0% 100%',
      ring: '346 77% 49%',
      sidebarPrimary: '346 77% 49%',
      sidebarAccent: '346 77% 96%',
    },
  },
  slate: {
    name: 'slate',
    label: 'Slate',
    colors: {
      primary: '215 28% 17%',
      primaryForeground: '0 0% 100%',
      primaryLight: '215 28% 96%',
      accent: '215 28% 17%',
      accentForeground: '0 0% 100%',
      ring: '215 28% 17%',
      sidebarPrimary: '215 28% 17%',
      sidebarAccent: '215 28% 96%',
    },
  },
};

export type ThemeContextType = {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  theme: Theme;
};