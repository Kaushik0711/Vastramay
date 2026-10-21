import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
      id,
      disabled,
      required,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = Boolean(error);

    const borderClass = hasError
      ? 'border-brand-feedback-error focus:border-brand-feedback-error focus:ring-brand-feedback-error/20'
      : 'border-brand-subdued-border focus:border-brand-purple focus:ring-brand-purple/20';

    return (
      <div className="w-full font-body text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-label uppercase text-brand-black font-medium mb-1.5"
          >
            {label}
            {required && <span className="text-brand-feedback-error ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`w-full appearance-none bg-white text-brand-black text-[15px] border rounded-none transition-colors duration-150 py-3 pl-3.5 pr-10 min-h-[44px] focus:outline-none focus:ring-1 disabled:bg-brand-gray-50 disabled:text-brand-subdued-low disabled:cursor-not-allowed cursor-pointer ${borderClass} ${className}`.trim()}
            {...rest}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-brand-subdued-medium flex items-center">
            <ChevronDown size={18} />
          </div>
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

Select.displayName = 'Select';
export default Select;
