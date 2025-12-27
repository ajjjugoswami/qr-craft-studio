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
    onSubmitPassword,
    setPasswordInputValue,
  } = useRedirector();

  const { copied, copyToClipboard } = useCopyToClipboard();

  // For direct content types that have full-screen layouts
  const fullScreenTypes = ['image', 'sms', 'vcard', 'wifi'];
  
  if (showDirectContent && content && qrType && fullScreenTypes.includes(qrType)) {
    return (
      <DirectContent
        content={content}
        qrType={qrType}
        copied={copied}
        onCopy={copyToClipboard}
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
          />
        ) : showDirectContent && content && qrType ? (
          <DirectContent
            content={content}
            qrType={qrType}
            // template={template}
            copied={copied}
            onCopy={copyToClipboard}
          />
        ) : loading ? (
          <LoadingState progress={progress} platform={redirectInfo?.platform} />
        ) : (
          <ErrorState content={content} />
        )}
      </div>
    </div>
  );
};

export default Redirector;
