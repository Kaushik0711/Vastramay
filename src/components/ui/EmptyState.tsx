import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`border border-brand-subdued-border bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`.trim()}
    >
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-brand-subdued-low mb-4">
        {icon || <PackageOpen size={36} strokeWidth={1.5} />}
      </div>

      {/* Title in display font */}
      <h3 className="font-display text-2xl text-brand-black mb-2 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="font-body text-body-sm text-brand-subdued-medium max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
