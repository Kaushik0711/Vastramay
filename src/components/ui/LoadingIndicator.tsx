import React from 'react';

export type LoadingIndicatorSize = 'sm' | 'md' | 'lg';
export type LoadingIndicatorColor = 'purple' | 'black' | 'white';

export interface LoadingIndicatorProps {
  size?: LoadingIndicatorSize;
  color?: LoadingIndicatorColor;
  className?: string;
  label?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  color = 'purple',
  className = '',
  label = 'Loading...',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-2',
  };

  const colorMap = {
    purple: 'border-brand-purple/20 border-t-brand-purple',
    black: 'border-brand-black/20 border-t-brand-black',
    white: 'border-white/30 border-t-white',
  };

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-block animate-spin rounded-full ${sizeMap[size]} ${colorMap[color]} ${className}`.trim()}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default LoadingIndicator;
