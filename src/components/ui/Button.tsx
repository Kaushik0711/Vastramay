import React, { forwardRef } from 'react';
import LoadingIndicator from './LoadingIndicator';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    // Base styles: editorial geometry (0px radius), clear typography, focus ring, tactile press feedback
    const baseClasses =
      'inline-flex items-center justify-center font-body uppercase font-medium transition-all duration-150 select-none rounded-none border text-center ' +
      'active:scale-[0.98] ' +
      'focus-visible:outline-2 focus-visible:outline-brand-purple focus-visible:outline-offset-2 ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100';

    // Variant classes
    const variantClasses = {
      primary:
        'bg-brand-purple text-white border-brand-purple hover:bg-brand-purple-dark hover:border-brand-purple-dark active:bg-brand-purple-active active:border-brand-purple-active',
      secondary:
        'bg-transparent text-brand-black border-brand-black hover:bg-brand-black hover:text-white active:bg-brand-gray-800 active:border-brand-gray-800',
      tertiary:
        'bg-transparent text-brand-black border-transparent hover:text-brand-purple hover:underline underline-offset-4 active:text-brand-purple-dark p-0',
      ghost:
        'bg-transparent text-brand-black border-transparent hover:bg-brand-subdued-hover active:bg-brand-gray-200',
    };

    // Size classes (tertiary overrides padding)
    const sizeClasses = {
      sm: 'py-2 px-3 text-[12px] tracking-wider min-h-[36px]',
      md: 'py-3 px-5 text-btn tracking-wider min-h-[44px]', // 44px touch target friendly
      lg: 'py-4 px-7 text-[14px] tracking-wider min-h-[50px]',
    };

    const finalSizeClass = variant === 'tertiary' ? 'text-btn py-1 tracking-wider' : sizeClasses[size];
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${finalSizeClass} ${widthClass} ${className}`.trim()}
        {...rest}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <LoadingIndicator size={size === 'sm' ? 'sm' : 'md'} color={variant === 'primary' ? 'white' : 'black'} />
            <span className="sr-only">Loading...</span>
            <span>{children}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
