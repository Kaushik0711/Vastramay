import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftSlot,
      rightSlot,
      id,
      disabled,
      required,
      className = '',
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);

    const borderClass = hasError
      ? 'border-brand-feedback-error focus:border-brand-feedback-error focus:ring-brand-feedback-error/20'
      : 'border-brand-subdued-border focus:border-brand-purple focus:ring-brand-purple/20';

    return (
      <div className="w-full font-body text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-label uppercase text-brand-black font-medium mb-1.5"
          >
            {label}
            {required && <span className="text-brand-feedback-error ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftSlot && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-brand-subdued-medium">
              {leftSlot}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`w-full bg-white text-brand-black text-[15px] placeholder:text-brand-subdued-low border rounded-none transition-colors duration-150 py-3 px-3.5 min-h-[44px] focus:outline-none focus:ring-1 disabled:bg-brand-gray-50 disabled:text-brand-subdued-low disabled:cursor-not-allowed ${
              leftSlot ? 'pl-10' : ''
            } ${rightSlot ? 'pr-10' : ''} ${borderClass} ${className}`.trim()}
            {...rest}
          />

          {rightSlot && (
            <div className="absolute right-3.5 flex items-center text-brand-subdued-medium">
              {rightSlot}
            </div>
          )}
        </div>

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

Input.displayName = 'Input';
export default Input;
