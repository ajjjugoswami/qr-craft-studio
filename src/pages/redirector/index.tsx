import React from 'react';
import { useRedirector } from './hooks/useRedirector';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { PasswordPrompt, LoadingState, ErrorState, DirectContent } from './components';

const Redirector: React.FC = () => {
  const {
    loading,
    content,
    qrType,
    template,
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

  // For styled landing pages, render full-screen (no wrapper padding)
  const hasStyledTemplate = template && template.id && template.title;
  
  if (showDirectContent && content && qrType && hasStyledTemplate) {
    return (
      <DirectContent
        content={content}
        qrType={qrType}
        // template={template}
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
