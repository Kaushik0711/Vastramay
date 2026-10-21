import React from 'react';

export type BadgeVariant = 'purple' | 'black' | 'outline' | 'sale' | 'subtle';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'purple',
  size = 'md',
  children,
  className = '',
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-body uppercase font-medium rounded-none select-none tracking-widest';

  const variantClasses = {
    purple: 'bg-brand-purple text-white',
    black: 'bg-brand-black text-white',
    outline: 'bg-transparent text-brand-black border border-brand-black',
    sale: 'bg-brand-purple text-white font-semibold',
    subtle: 'bg-brand-subdued-surface text-brand-black border border-brand-subdued-border',
  };

  const sizeClasses = {
    sm: 'py-0.5 px-2 text-[10px] leading-tight',
    md: 'py-1 px-2.5 text-label leading-tight',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge;
