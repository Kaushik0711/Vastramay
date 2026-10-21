import React from 'react';
import { formatPrice } from '@/config';

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showDiscountBadge?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  size = 'md',
  showDiscountBadge = true,
  className = '',
}) => {
  const hasDiscount = Boolean(compareAtPrice && compareAtPrice > price);
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: 'text-sm font-semibold',
      compare: 'text-xs',
      badge: 'text-[10px] py-0.5 px-1.5',
    },
    md: {
      price: 'text-price font-semibold',
      compare: 'text-sm',
      badge: 'text-label py-0.5 px-2',
    },
    lg: {
      price: 'text-price-lg font-bold',
      compare: 'text-base',
      badge: 'text-label py-1 px-2.5',
    },
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center flex-wrap gap-2 font-body ${className}`.trim()}>
      {/* Current price */}
      <span className={`text-brand-black tracking-tight ${selectedSize.price}`}>
        {formatPrice(price)}
      </span>

      {/* Compare price (original MSRP) */}
      {hasDiscount && (
        <span
          className={`text-brand-subdued-low line-through font-normal ${selectedSize.compare}`}
          aria-label={`Original price: ${formatPrice(compareAtPrice!)}`}
        >
          {formatPrice(compareAtPrice!)}
        </span>
      )}

      {/* Discount badge */}
      {hasDiscount && showDiscountBadge && discountPercent > 0 && (
        <span
          className={`bg-brand-purple text-white font-medium uppercase tracking-wider rounded-none select-none ${selectedSize.badge}`}
        >
          {discountPercent}% OFF
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
