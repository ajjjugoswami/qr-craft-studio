export type ThemeName = 'purple' | 'blue' | 'green' | 'orange' | 'rose' | 'slate' | 'teal' | 'indigo' | 'emerald' | 'cyan' | 'violet' | 'fuchsia' | 'gradient_sunset' | 'gradient_ocean' | 'gradient_forest' | 'gradient_royal';

export type ThemeMode = 'light' | 'dark' | 'system';

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
  darkColors?: ThemeColors;
}

export interface ThemeContextType {
  currentTheme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
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
  teal: {
    name: 'teal',
    label: 'Teal',
    colors: {
      primary: '178 84% 41%',
      primaryForeground: '0 0% 100%',
      primaryLight: '178 84% 96%',
      accent: '178 84% 41%',
      accentForeground: '0 0% 100%',
      ring: '178 84% 41%',
      sidebarPrimary: '178 84% 41%',
      sidebarAccent: '178 84% 96%',
    },
  },
  indigo: {
    name: 'indigo',
    label: 'Indigo',
    colors: {
      primary: '243 75% 59%',
      primaryForeground: '0 0% 100%',
      primaryLight: '243 75% 96%',
      accent: '243 75% 59%',
      accentForeground: '0 0% 100%',
      ring: '243 75% 59%',
      sidebarPrimary: '243 75% 59%',
      sidebarAccent: '243 75% 96%',
    },
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald',
    colors: {
      primary: '160 84% 39%',
      primaryForeground: '0 0% 100%',
      primaryLight: '160 84% 96%',
      accent: '160 84% 39%',
      accentForeground: '0 0% 100%',
      ring: '160 84% 39%',
      sidebarPrimary: '160 84% 39%',
      sidebarAccent: '160 84% 96%',
    },
  },
  cyan: {
    name: 'cyan',
    label: 'Cyan',
    colors: {
      primary: '188 95% 42%',
      primaryForeground: '0 0% 100%',
      primaryLight: '188 95% 96%',
      accent: '188 95% 42%',
      accentForeground: '0 0% 100%',
      ring: '188 95% 42%',
      sidebarPrimary: '188 95% 42%',
      sidebarAccent: '188 95% 96%',
    },
  },
  violet: {
    name: 'violet',
    label: 'Violet',
    colors: {
      primary: '271 81% 56%',
      primaryForeground: '0 0% 100%',
      primaryLight: '271 81% 96%',
      accent: '271 81% 56%',
      accentForeground: '0 0% 100%',
      ring: '271 81% 56%',
      sidebarPrimary: '271 81% 56%',
      sidebarAccent: '271 81% 96%',
    },
  },
  fuchsia: {
    name: 'fuchsia',
    label: 'Fuchsia',
    colors: {
      primary: '289 84% 52%',
      primaryForeground: '0 0% 100%',
      primaryLight: '289 84% 96%',
      accent: '289 84% 52%',
      accentForeground: '0 0% 100%',
      ring: '289 84% 52%',
      sidebarPrimary: '289 84% 52%',
      sidebarAccent: '289 84% 96%',
    },
  },
  gradient_sunset: {
    name: 'gradient_sunset',
    label: 'Sunset',
    colors: {
      primary: '25 95% 53%',
      primaryForeground: '0 0% 100%',
      primaryLight: '25 95% 96%',
      accent: '346 77% 49%',
      accentForeground: '0 0% 100%',
      ring: '25 95% 53%',
      sidebarPrimary: '25 95% 53%',
      sidebarAccent: '25 95% 96%',
    },
  },
  gradient_ocean: {
    name: 'gradient_ocean',
    label: 'Ocean',
    colors: {
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      primaryLight: '217 91% 96%',
      accent: '188 95% 42%',
      accentForeground: '0 0% 100%',
      ring: '217 91% 60%',
      sidebarPrimary: '217 91% 60%',
      sidebarAccent: '217 91% 96%',
    },
  },
  gradient_forest: {
    name: 'gradient_forest',
    label: 'Forest',
    colors: {
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      primaryLight: '142 76% 96%',
      accent: '160 84% 39%',
      accentForeground: '0 0% 100%',
      ring: '142 76% 36%',
      sidebarPrimary: '142 76% 36%',
      sidebarAccent: '142 76% 96%',
    },
  },
  gradient_royal: {
    name: 'gradient_royal',
    label: 'Royal',
    colors: {
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      primaryLight: '262 83% 96%',
      accent: '271 81% 56%',
      accentForeground: '0 0% 100%',
      ring: '262 83% 58%',
      sidebarPrimary: '262 83% 58%',
      sidebarAccent: '262 83% 96%',
    },
  },
};
