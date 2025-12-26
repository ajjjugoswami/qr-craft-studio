import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  progress: number;
  platform?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ progress, platform }) => {
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
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.64} 264`}
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-1">
        {platform ? `Opening ${platform}` : 'Loading'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {progress < 100 ? 'Please wait...' : 'Redirecting...'}
      </p>
    </div>
  );
};
