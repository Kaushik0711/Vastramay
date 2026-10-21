import React, { forwardRef } from 'react';

export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'black';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Mandatory for accessibility
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      icon,
      disabled,
      className = '',
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-none transition-colors duration-200 select-none ' +
      'focus-visible:outline-2 focus-visible:outline-brand-purple focus-visible:outline-offset-2 ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variantClasses = {
      ghost:
        'bg-transparent text-brand-black hover:text-brand-purple hover:bg-brand-subdued-surface active:bg-brand-subdued-hover',
      outline:
        'bg-transparent text-brand-black border border-brand-subdued-border hover:border-brand-black hover:bg-brand-black hover:text-white active:bg-brand-gray-800',
      primary:
        'bg-brand-purple text-white border border-brand-purple hover:bg-brand-purple-dark active:bg-brand-purple-active',
      black:
        'bg-brand-black text-white border border-brand-black hover:bg-brand-gray-800 active:bg-brand-gray-900',
    };

    const sizeClasses = {
      sm: 'w-8 h-8 min-w-[32px]',
      md: 'w-11 h-11 min-w-[44px]', // Standard 44px mobile touch target
      lg: 'w-12 h-12 min-w-[48px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
export default IconButton;
