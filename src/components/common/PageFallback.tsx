import React from 'react';
import { LoadingIndicator } from '@/components/ui';

export const PageFallback: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 bg-white"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingIndicator size="lg" color="purple" label="Loading Atelier..." />
        <span className="font-display text-sm tracking-wider uppercase text-brand-subdued-medium">
          Vastramay Atelier
        </span>
      </div>
    </div>
  );
};

export default PageFallback;
