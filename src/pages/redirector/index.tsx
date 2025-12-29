import React from 'react';
import { useRedirector } from './hooks/useRedirector';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { PasswordPrompt, LoadingState, ErrorState, DirectContent } from './components';

const Redirector: React.FC = () => {
  const {
    loading,
    content,
    qrType,
    redirectInfo,
    progress,
    passwordInput,
    passwordError,
    showDirectContent,
    needsPassword,
    whiteLabel,
    onSubmitPassword,
    setPasswordInputValue,
  } = useRedirector();

  const { copied, copyToClipboard } = useCopyToClipboard();

  // All direct content types now have full-screen layouts
  if (showDirectContent && content && qrType) {
    return (
      <DirectContent
        content={content}
        qrType={qrType}
        copied={copied}
        onCopy={copyToClipboard}
        whiteLabel={whiteLabel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {needsPassword ? (
          <PasswordPrompt
            passwordInput={passwordInput}
            passwordError={passwordError}
            onPasswordChange={setPasswordInputValue}
            onSubmit={onSubmitPassword}
            whiteLabel={whiteLabel}
          />
        ) : loading ? (
          <LoadingState 
            progress={progress} 
            platform={redirectInfo?.platform} 
            whiteLabel={whiteLabel}
          />
        ) : (
          <ErrorState content={content} whiteLabel={whiteLabel} />
        )}
      </div>
    </div>
  );
};

export default Redirector;
