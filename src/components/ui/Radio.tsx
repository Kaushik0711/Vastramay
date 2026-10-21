import React, { forwardRef, useId } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      checked,
      disabled,
      required,
      className = '',
      onChange,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const errorId = `${radioId}-error`;
    const helperId = `${radioId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="font-body text-left">
        <label
          htmlFor={radioId}
          className={`inline-flex items-start gap-3 cursor-pointer select-none group ${
            disabled ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          {/* Custom Radio Button: 0px square border per brand geometry */}
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              ref={ref}
              type="radio"
              id={radioId}
              checked={checked}
              disabled={disabled}
              required={required}
              onChange={onChange}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={
                hasError ? errorId : helperText ? helperId : undefined
              }
              className="peer sr-only"
              {...rest}
            />

            {/* Radio box: 0px border-radius */}
            <div
              className={`w-4 h-4 rounded-none border transition-colors duration-150 flex items-center justify-center ${
                hasError
                  ? 'border-brand-feedback-error'
                  : 'border-brand-subdued-border group-hover:border-brand-black peer-focus-visible:ring-2 peer-focus-visible:ring-brand-purple peer-focus-visible:ring-offset-1'
              } peer-checked:border-brand-purple peer-disabled:bg-brand-gray-100 peer-disabled:border-brand-gray-300 ${className}`.trim()}
            >
              {/* Inner dot: square per editorial identity */}
              <div className="w-2 h-2 bg-brand-purple rounded-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150" />
            </div>
          </div>

          {/* Label text */}
          {label && (
            <span className="text-body-sm text-brand-black leading-tight group-hover:text-brand-purple transition-colors duration-150">
              {label}
              {required && <span className="text-brand-feedback-error ml-1">*</span>}
            </span>
          )}
        </label>

        {hasError ? (
          <p id={errorId} role="alert" className="mt-1 ml-7 text-caption text-brand-feedback-error">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1 ml-7 text-caption text-brand-subdued-medium">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Radio.displayName = 'Radio';
export default Radio;
