import React, { forwardRef, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      disabled,
      required,
      className = '',
      rows = 4,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const hasError = Boolean(error);

    const borderClass = hasError
      ? 'border-brand-feedback-error focus:border-brand-feedback-error focus:ring-brand-feedback-error/20'
      : 'border-brand-subdued-border focus:border-brand-purple focus:ring-brand-purple/20';

    return (
      <div className="w-full font-body text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-label uppercase text-brand-black font-medium mb-1.5"
          >
            {label}
            {required && <span className="text-brand-feedback-error ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={`w-full bg-white text-brand-black text-[15px] placeholder:text-brand-subdued-low border rounded-none transition-colors duration-150 py-3 px-3.5 focus:outline-none focus:ring-1 resize-y disabled:bg-brand-gray-50 disabled:text-brand-subdued-low disabled:cursor-not-allowed ${borderClass} ${className}`.trim()}
          {...rest}
        />

        {hasError ? (
          <p id={errorId} role="alert" className="mt-1 text-caption text-brand-feedback-error">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1 text-caption text-brand-subdued-medium">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
