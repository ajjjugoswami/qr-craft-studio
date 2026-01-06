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
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
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
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.15s]" style={{ animationDelay: '0.15s' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.3s]" style={{ animationDelay: '0.3s' }} />
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
