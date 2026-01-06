import React from 'react';

interface LogoLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ 
  message, 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <img 
          src="/logo.png" 
          alt="Loading" 
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`${dotSizes[size]} rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]`} />
        <span className={`${dotSizes[size]} rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]`} style={{ animationDelay: '0.15s' }} />
        <span className={`${dotSizes[size]} rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]`} style={{ animationDelay: '0.3s' }} />
      </div>
      {message && (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
};

export default LogoLoader;
