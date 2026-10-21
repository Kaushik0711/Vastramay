import React from 'react';

export interface ProductSkeletonProps {
  aspectRatio?: '3/4' | '4/5';
  className?: string;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
  aspectRatio = '3/4',
  className = '',
}) => {
  const aspectClass = aspectRatio === '3/4' ? 'aspect-[3/4]' : 'aspect-[4/5]';

  return (
    <div
      role="status"
      aria-label="Loading product..."
      className={`group flex flex-col font-body ${className}`.trim()}
    >
      {/* Image skeleton: square 0px radius with subtle pulse */}
      <div
        className={`w-full ${aspectClass} bg-brand-gray-100 skeleton rounded-none relative overflow-hidden`}
      />

      {/* Product metadata skeleton */}
      <div className="pt-3.5 space-y-2">
        {/* Category tag */}
        <div className="w-16 h-2.5 bg-brand-gray-200 skeleton rounded-none" />

        {/* Product title */}
        <div className="w-3/4 h-4 bg-brand-gray-200 skeleton rounded-none" />

        {/* Price */}
        <div className="w-24 h-4 bg-brand-gray-200 skeleton rounded-none pt-1" />
      </div>
      <span className="sr-only">Loading product information...</span>
    </div>
  );
};

export default ProductSkeleton;
