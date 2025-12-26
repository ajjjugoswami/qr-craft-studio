import { useState, useCallback } from 'react';
import { message } from 'antd';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      message.error('Failed to copy');
    }
  }, []);

  return { copied, copyToClipboard };
};
