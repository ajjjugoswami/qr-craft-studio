import React from 'react';
import { Loader2 } from 'lucide-react';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface LoadingStateProps {
  progress: number;
  platform?: string;
  whiteLabel?: WhiteLabelConfig | null;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ progress, platform, whiteLabel }) => {
  const primaryColor = whiteLabel?.enabled && whiteLabel.primaryColor 
    ? whiteLabel.primaryColor 
    : 'hsl(var(--primary))';

  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={primaryColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.64} 264`}
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 
            className="w-6 h-6 animate-spin" 
            style={{ color: primaryColor }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-1">
        {whiteLabel?.enabled && whiteLabel.brandName 
          ? whiteLabel.brandName 
          : platform 
            ? `Opening ${platform}` 
            : 'Loading'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {whiteLabel?.enabled && whiteLabel.loadingText 
          ? whiteLabel.loadingText 
          : progress < 100 
            ? 'Please wait...' 
            : 'Redirecting...'}
      </p>
      
      {whiteLabel?.showPoweredBy !== false && (
        <p className="text-xs text-muted-foreground/60 mt-6">
          Powered by QR Studio
        </p>
      )}
    </div>
  );
};
