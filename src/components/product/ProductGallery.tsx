import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ProductImage } from '@/types';
import ProductLightbox from './ProductLightbox';

export interface ProductGalleryProps {
  images: ProductImage[];
  productTitle: string;
  isNew?: boolean;
  hasDiscount?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productTitle,
  isNew = false,
  hasDiscount = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 font-body">
      {/* 1. Thumbnail Strip (Vertical on md+, Horizontal on mobile) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] scrollbar-none shrink-0 py-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setImageError(false);
              }}
              onFocus={() => {
                setSelectedIndex(idx);
                setImageError(false);
              }}
              aria-label={`Select product image ${idx + 1}`}
              className={`w-16 sm:w-20 aspect-[3/4] border transition-all overflow-hidden relative bg-brand-subdued-surface shrink-0 active:scale-95 ${
                idx === selectedIndex
                  ? 'border-brand-purple ring-1 ring-brand-purple opacity-100'
                  : 'border-brand-subdued-border opacity-70 hover:opacity-100 hover:border-brand-black'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${productTitle} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Stage Image */}
      <div
        className="flex-1 relative aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border overflow-hidden group"
        data-cursor="view"
      >
        {!imageError && activeImage ? (
          <motion.img
            key={activeImage.id || activeImage.url}
            src={activeImage.url}
            alt={activeImage.alt || productTitle}
            onError={() => setImageError(true)}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-105 transition-transform duration-700 ease-out"
            onClick={() => setIsLightboxOpen(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-gray-100 p-6 text-center">
            <span className="font-display text-2xl text-brand-black/30 mb-2">
              Vastramay
            </span>
            <span className="text-caption uppercase tracking-wider text-brand-subdued-low">
              Artisanal Handloom Garment
            </span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isNew && (
            <span className="bg-brand-black text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 select-none">
              New In
            </span>
          )}
          {hasDiscount && (
            <span className="bg-brand-purple text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 select-none">
              Special Edit
            </span>
          )}
        </div>

        {/* Lightbox Trigger Button */}
        {activeImage && (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Open fullscreen image lightbox"
            title="Open fullscreen view"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-brand-black hover:text-brand-purple border border-brand-subdued-border p-2.5 transition-colors shadow-sm z-10"
          >
            <Maximize2 size={16} />
          </button>
        )}
      </div>

      {/* 3. Lightbox Dialog */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        initialIndex={selectedIndex}
        productTitle={productTitle}
      />
    </div>
  );
};

export default ProductGallery;
