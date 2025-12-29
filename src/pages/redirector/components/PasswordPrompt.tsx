import React from 'react';
import { Button, Input } from 'antd';
import { Lock } from 'lucide-react';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface PasswordPromptProps {
  passwordInput: string;
  passwordError: string | null;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  whiteLabel?: WhiteLabelConfig | null;
}

export const PasswordPrompt: React.FC<PasswordPromptProps> = ({
  passwordInput,
  passwordError,
  onPasswordChange,
  onSubmit,
  whiteLabel,
}) => {
  const primaryColor = whiteLabel?.enabled && whiteLabel.primaryColor 
    ? whiteLabel.primaryColor 
    : undefined;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="text-center mb-6">
        <div 
          className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: primaryColor ? `${primaryColor}20` : 'hsl(var(--muted))',
          }}
        >
          <Lock 
            className="w-5 h-5" 
            style={{ color: primaryColor || 'hsl(var(--muted-foreground))' }}
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {whiteLabel?.enabled && whiteLabel.brandName 
            ? whiteLabel.brandName 
            : 'Protected Link'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
      </div>

      <div className="space-y-4">
        <div>
          <Input.Password
            size="large"
            value={passwordInput}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Password"
            status={passwordError ? 'error' : ''}
            onPressEnter={onSubmit}
            className="w-full"
          />
          {passwordError && (
            <p className="text-sm text-destructive mt-1.5">{passwordError}</p>
          )}
        </div>

        <Button 
          type="primary" 
          size="large" 
          className="w-full" 
          onClick={onSubmit}
          style={primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
        >
          Continue
        </Button>
      </div>

      {whiteLabel?.showPoweredBy !== false && (
        <p className="text-xs text-muted-foreground/60 text-center mt-6">
          Powered by QR Studio
        </p>
      )}
    </div>
  );
};
