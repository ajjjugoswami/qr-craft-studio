import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ThemeContextType } from '../context/themeTypes';

export const useTheme = (): ThemeContextType => {
  console.log('useTheme called');
  const context = useContext(ThemeContext);
  console.log('context:', context);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};