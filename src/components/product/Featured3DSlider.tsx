import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface Featured3DSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Featured3DSlider: React.FC<Featured3DSliderProps> = ({
  products,
  title = 'The Seasonal Runway Edit',
  subtitle = 'Experience the handcrafted silhouettes of our seasonal atelier in clean, balanced perspective.',
  className = '',
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (products.length === 0) return null;

  return (
    <section className={`font-body overflow-hidden ${className}`.trim()}>
      {/* Editorial Header with Custom Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple flex items-center gap-1.5 mb-1.5 font-semibold">
            <Sparkles size={13} />
            Editorial Showcase
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-black tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body-sm text-brand-subdued-medium mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Prev / Next Navigation Arrows */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label="Previous showcase slide"
            className={`w-10 h-10 border border-brand-subdued-border text-brand-black flex items-center justify-center transition-colors bg-white focus-visible:outline-brand-purple ${
              isBeginning
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-brand-purple hover:text-brand-purple cursor-pointer'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label="Next showcase slide"
            className={`w-10 h-10 border border-brand-subdued-border text-brand-black flex items-center justify-center transition-colors bg-white focus-visible:outline-brand-purple ${
              isEnd
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-brand-purple hover:text-brand-purple cursor-pointer'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Swiper Carousel Container — Balanced layout across all viewports */}
      <div className="relative py-2" data-cursor="drag">
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          grabCursor
          keyboard={{ enabled: true, onlyInViewport: true }}
          loop={false}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onInit={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="featured-runway-swiper !overflow-hidden"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <div className="bg-white p-2 border border-brand-subdued-border/60 h-full">
                <ProductCard product={product} aspectRatio="3/4" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Featured3DSlider;

