import { useState, useCallback, useRef } from 'react';
import type { QRStyling } from '@/types/qrcode';

interface UseStyleHistoryReturn {
  pushStyle: (style: QRStyling) => void;
  undo: () => QRStyling | null;
  canUndo: boolean;
  clearHistory: () => void;
}

export const useStyleHistory = (maxHistory = 20): UseStyleHistoryReturn => {
  const [history, setHistory] = useState<QRStyling[]>([]);
  const lastPushedRef = useRef<string>('');

  const pushStyle = useCallback((style: QRStyling) => {
    const styleStr = JSON.stringify(style);
    // Avoid duplicate consecutive entries
    if (styleStr === lastPushedRef.current) return;
    
    lastPushedRef.current = styleStr;
    setHistory(prev => {
      const newHistory = [...prev, style];
      // Keep only the last maxHistory entries
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }
      return newHistory;
    });
  }, [maxHistory]);

  const undo = useCallback((): QRStyling | null => {
    if (history.length < 2) return null;
    
    let lastStyle: QRStyling | null = null;
    setHistory(prev => {
      if (prev.length < 2) return prev;
      // Remove current state and return previous
      const newHistory = prev.slice(0, -1);
      lastStyle = newHistory[newHistory.length - 1];
      lastPushedRef.current = JSON.stringify(lastStyle);
      return newHistory;
    });
    
    return lastStyle;
  }, [history.length]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    lastPushedRef.current = '';
  }, []);

  return {
    pushStyle,
    undo,
    canUndo: history.length >= 2,
    clearHistory,
  };
};

