import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlistStore, useCartStore } from '@/stores';
import { PriceDisplay } from '@/components/ui';

export interface ProductCardProps {
  product: Product;
  className?: string;
  aspectRatio?: '3/4' | '4/5';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  aspectRatio = '3/4',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { productIds, toggle: toggleWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const isInWishlist = productIds.includes(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  const aspectClass = aspectRatio === '3/4' ? 'aspect-[3/4]' : 'aspect-[4/5]';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    if (defaultVariant) {
      addItemToCart({
        productId: product.id,
        variantId: defaultVariant.id,
        title: product.title,
        image: primaryImage?.url || '',
        size: defaultVariant.size,
        color: defaultVariant.color,
        price: defaultVariant.price,
        compareAtPrice: defaultVariant.compareAtPrice,
        quantity: 1,
        slug: product.slug,
        maxStock: defaultVariant.stock,
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className={`group flex flex-col font-body ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 3:4 Aspect Ratio & Square Corners */}
      <Link
        to={`/product/${product.slug}`}
        data-cursor="view"
        className="block relative w-full overflow-hidden bg-brand-subdued-surface border border-brand-subdued-border"
        aria-label={`View ${product.title}`}
      >
        <div className={`w-full ${aspectClass} relative overflow-hidden`}>
          {!imageError && primaryImage ? (
            <>
              {/* Primary Image */}
              <img
                src={isHovered && secondaryImage ? secondaryImage.url : primaryImage.url}
                alt={primaryImage.alt || product.title}
                onError={() => setImageError(true)}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
              />
            </>
          ) : (
            /* Intentional Atelier Archival Card Fallback (zero broken-card look) */
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FBFBF9] border border-brand-subdued-border/60 p-6 text-center select-none">
              <div className="w-10 h-10 border border-brand-subdued-border flex items-center justify-center mb-3 text-brand-purple">
                <span className="font-display text-base font-semibold tracking-wider">VM</span>
              </div>
              <span className="font-display text-base text-brand-black tracking-tight mb-1">
                Vastramay Atelier Edition
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-subdued-medium">
                {product.tags[0] || 'Handcrafted Silk'}
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-brand-black text-white text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-none select-none">
                New In
              </span>
            )}
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="bg-brand-purple text-white text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-none select-none">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button (Always accessible top right) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={
              isInWishlist
                ? `Remove ${product.title} from wishlist`
                : `Save ${product.title} to wishlist`
            }
            className={`absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center bg-white/90 border border-brand-subdued-border transition-all duration-200 z-10 rounded-none focus-visible:outline-2 focus-visible:outline-brand-purple ${
              isInWishlist
                ? 'text-brand-purple'
                : 'text-brand-black hover:text-brand-purple'
            }`}
          >
            <Heart
              size={16}
              className={isInWishlist ? 'fill-brand-purple text-brand-purple' : ''}
            />
          </button>

          {/* Desktop Hover Quick Actions Strip */}
          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-brand-black/40 via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex gap-2 z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Quick add ${product.title} to bag`}
              className="flex-1 bg-white hover:bg-brand-black hover:text-white text-brand-black text-btn uppercase font-medium py-2.5 px-3 rounded-none transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag size={14} />
              <span>Quick Bag</span>
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="bg-brand-purple hover:bg-brand-purple-dark text-white p-2.5 rounded-none flex items-center justify-center shadow-sm"
              aria-label={`Inspect ${product.title}`}
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Metadata */}
      <div className="pt-3.5 flex flex-col justify-between flex-1 space-y-1">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-subdued-low">
            {product.tags[0] || 'Couture'}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="block text-body-sm font-medium text-brand-black group-hover:text-brand-purple transition-colors line-clamp-2 min-h-[2.5rem] leading-snug mt-0.5"
          >
            {product.title}
          </Link>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2">
          <PriceDisplay
            price={product.basePrice}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />

          {/* Color swatch indicator when variant color data exists */}
          {(() => {
            const availableColors = Array.from(
              new Map(
                product.variants
                  .filter((v) => v.colorHex)
                  .map((v) => [v.colorHex, { color: v.color, hex: v.colorHex! }]),
              ).values(),
            );

            if (availableColors.length === 0) return null;

            return (
              <div
                className="flex items-center gap-1"
                aria-label={`Available colors: ${availableColors.map((c) => c.color).join(', ')}`}
              >
                {availableColors.slice(0, 3).map((c) => (
                  <span
                    key={c.hex}
                    title={c.color}
                    className="w-2.5 h-2.5 rounded-none border border-brand-subdued-border inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {availableColors.length > 3 && (
                  <span className="text-[10px] text-brand-subdued-low">
                    +{availableColors.length - 3}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
