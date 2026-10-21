import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`border border-brand-feedback-error-border bg-brand-feedback-error-subtle p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`.trim()}
    >
      <div className="w-12 h-12 flex items-center justify-center text-brand-feedback-error mb-4">
        <AlertTriangle size={36} strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-2xl text-brand-black mb-2 tracking-tight">
        {title}
      </h3>

      <p className="font-body text-body-sm text-brand-subdued-medium max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={14} />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
