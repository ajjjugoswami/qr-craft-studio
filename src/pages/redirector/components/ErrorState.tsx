import React from 'react';
import { Button } from 'antd';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface ErrorStateProps {
  content: string | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ content }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
      <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-5 h-5 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-1">Unable to Redirect</h2>
      <p className="text-sm text-muted-foreground mb-4">The automatic redirect failed</p>
      
      {content && (
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={() => (window.location.href = content)}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Open Link
        </Button>
      )}
    </div>
  );
};
