import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  Headphones,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CampaignSlide {
  id: string;
  image: string;
  label: string;
  alt: string;
  title: string;
  caption: string;
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'campaign-01',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    label: 'CAMPAIGN 01',
    alt: 'Refined contemporary tailored navy suit in sophisticated architectural setting',
    title: 'Architectural Tailoring',
    caption: 'Modern silhouette with disciplined craftsmanship.',
  },
  {
    id: 'campaign-02',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1600&q=85',
    label: 'CAMPAIGN 02',
    alt: 'Contemporary royal indigo silk bandhgala with subtle artisanal embroidery',
    title: 'Ceremonial Bandhgala',
    caption: 'Artisanal handloom weaves engineered for celebrations.',
  },
  {
    id: 'campaign-03',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1600&q=85',
    label: 'CAMPAIGN 03',
    alt: 'Editorial lookbook presentation of handcrafted luxury festive attire',
    title: 'The Heritage Achkan',
    caption: 'Timeless Varanasi silk brocades and modern cuts.',
  },
];

const SHOPPING_BENEFITS = [
  {
    icon: Truck,
    title: 'Complimentary Shipping',
    desc: 'On eligible domestic orders across India.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns & Size Exchange',
    desc: 'Clear and convenient return support.',
  },
  {
    icon: ShieldCheck,
    title: 'Authentic Craftsmanship',
    desc: 'Thoughtfully selected styles and details.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: 'Help when you need it.',
  },
];

export interface HomeHeroProps {
  seasonLabel?: string;
  headlineFirst?: string;
  headlineHighlight?: string;
  headlineRest?: string;
  supportingCopy?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  metadataText?: string;
}

export default function HomeHero({
  seasonLabel = "AUTUMN / WINTER '24",
  headlineFirst = 'Modern',
  headlineHighlight = 'Tradition',
  headlineRest = "Today's You.",
  supportingCopy = 'Timeless craftsmanship, contemporary silhouettes and everyday essentials — curated for those who appreciate style with meaning.',
  primaryCtaText = 'EXPLORE COLLECTION',
  primaryCtaLink = '/shop',
  metadataText = 'Modern Wardrobe   |   Timeless Character   |   Vastramay',
}: HomeHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const totalSlides = CAMPAIGN_SLIDES.length;

  const handlePrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Touch swipe support for main campaign image
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation when story modal is open or for slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStoryOpen) {
        setIsStoryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryOpen]);

  const currentCampaign = CAMPAIGN_SLIDES[activeSlide] || CAMPAIGN_SLIDES[0];

  return (
    <section
      id="editorial-hero"
      aria-label="Vastramay Autumn/Winter Editorial Campaign"
      className="relative bg-white border-b border-brand-subdued-border w-full overflow-hidden"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Desktop 4-Zone Editorial Collage / Responsive Grid
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="editorial-hero-grid min-h-[560px] lg:h-[700px] xl:h-[750px] 2xl:h-[790px] w-full bg-white border-b border-brand-subdued-border">
          {/* ── ZONE 1: Left Panel — Editorial Copy (36.5fr) ── */}
          <div className="flex flex-col justify-between px-6 sm:px-10 md:px-12 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-16 bg-white border-b lg:border-b-0 lg:border-r border-brand-subdued-border z-10">
            {/* Top / Main Copy Block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* Eyebrow Label */}
              <div className="mb-4 sm:mb-6">
                <span className="inline-block text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-brand-purple">
                  {seasonLabel}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.25rem] 2xl:text-[4.75rem] text-brand-black leading-[1.03] tracking-tight mb-5 sm:mb-6">
                {headlineFirst} <br className="hidden sm:inline" />
                <span className="text-brand-purple italic font-normal">
                  {headlineHighlight}
                </span>{' '}
                for <br className="hidden sm:inline" />
                {headlineRest}
              </h1>

              {/* Supporting Copy */}
              <p className="font-body text-body-sm sm:text-body-base text-brand-subdued-medium mb-8 sm:mb-10 max-w-md leading-relaxed">
                {supportingCopy}
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Primary CTA */}
                <Link
                  to={primaryCtaLink}
                  id="hero-primary-cta"
                  className="group inline-flex items-center justify-center gap-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-btn font-medium uppercase tracking-wider px-7 h-14 transition-colors duration-200 rounded-none focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                {/* Secondary CTA */}
                <button
                  type="button"
                  id="hero-secondary-cta"
                  onClick={() => setIsStoryOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-brand-black hover:text-white text-brand-black border border-brand-black text-btn font-medium uppercase tracking-wider px-6 h-14 transition-colors duration-200 rounded-none focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-2"
                  aria-label="Watch Vastramay Campaign Story Video"
                >
                  <Play size={14} className="fill-current" />
                  <span>WATCH STORY</span>
                </button>
              </div>
            </motion.div>

            {/* Bottom Editorial Metadata */}
            <div className="mt-8 sm:mt-12 pt-5 border-t border-brand-subdued-border">
              <p className="font-body text-[11px] sm:text-xs text-brand-subdued-low tracking-wide">
                {metadataText}
              </p>
            </div>
          </div>

          {/* ── ZONE 2: Main Campaign Image (33.5fr) ── */}
          <div
            className="relative bg-brand-subdued-surface overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-subdued-border min-h-[420px] sm:min-h-[500px] lg:min-h-full flex flex-col justify-end select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding / Crossfading Campaign Imagery */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCampaign.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentCampaign.image}
                  alt={currentCampaign.alt}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
                {/* Subtle dark gradient overlay at bottom to ensure controls contrast */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Subtle Campaign Tag near bottom edge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-brand-black/85 text-white text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 backdrop-blur-sm border border-white/10">
                {currentCampaign.label}
              </span>
            </div>

            {/* Main Image Slider Controls (Present since 3 campaign slides exist) */}
            {totalSlides > 1 && (
              <div className="relative z-10 px-5 py-4 flex items-center justify-between text-white">
                {/* Current Slide Indicator */}
                <div className="font-body text-xs font-semibold tracking-widest uppercase">
                  <span>0{activeSlide + 1}</span>
                  <span className="text-white/60 mx-1.5">/</span>
                  <span className="text-white/60">0{totalSlides}</span>
                </div>

                {/* Prev / Next Outline Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous campaign slide"
                    className="w-9 h-9 flex items-center justify-center border border-white/40 hover:border-white bg-black/40 hover:bg-black/70 text-white transition-colors duration-150 rounded-none focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next campaign slide"
                    className="w-9 h-9 flex items-center justify-center border border-white/40 hover:border-white bg-black/40 hover:bg-black/70 text-white transition-colors duration-150 rounded-none focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── ZONE 3: Middle Narrow Column — Split Vertically (13fr) ── */}
          <div className="hidden lg:grid grid-rows-2 h-full border-r border-brand-subdued-border bg-brand-subdued-surface">
            {/* Top Panel: Macro Fabric Texture */}
            <div className="relative overflow-hidden group border-b border-brand-subdued-border h-full">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
                alt="Macro texture of handwoven silk weave and fine gilded zari"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block bg-brand-black/85 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 border border-white/10">
                  PREMIUM FABRICS
                </span>
              </div>
            </div>

            {/* Bottom Panel: Secondary Look */}
            <Link
              to="/collections/autumn-winter-26"
              className="relative overflow-hidden group h-full block"
              aria-label="Discover the Look"
            >
              <img
                src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
                alt="Secondary editorial look with handcrafted contemporary tailoring"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="inline-block bg-brand-black/85 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 border border-white/10">
                  DISCOVER THE LOOK
                </span>
                <ArrowRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          </div>

          {/* ── ZONE 4: Far-Right Panel — Tall Monochrome Detail (17fr) ── */}
          <div className="hidden lg:block relative h-full bg-brand-subdued-surface overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
              alt="Monochrome close-up of tailored suit jacket lapel and button craft"
              className="w-full h-full object-cover object-center grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block bg-brand-black/85 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border border-white/10">
                MODERN SILHOUETTES
              </span>
            </div>
          </div>
        </div>

        {/* ── TABLET & MOBILE SECONDARY SUPPORTING IMAGE ROW (< 1024px) ── */}
        <div className="grid grid-cols-2 lg:hidden border-b border-brand-subdued-border bg-brand-subdued-surface divide-x divide-brand-subdued-border">
          {/* Fabric Texture */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
              alt="Macro texture of handwoven silk weave"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-2.5 left-2.5">
              <span className="bg-brand-black/80 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
                PREMIUM FABRICS
              </span>
            </div>
          </div>

          {/* Modern Silhouettes Monochrome */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
              alt="Monochrome tailored jacket silhouette detail"
              className="w-full h-full object-cover grayscale contrast-125"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-2.5 left-2.5">
              <span className="bg-brand-black/80 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
                MODERN SILHOUETTES
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            7. Shopping Benefits Strip
        ───────────────────────────────────────────────────────────── */}
        <div
          id="hero-benefits-strip"
          className="bg-white border-b border-brand-subdued-border"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-brand-subdued-border">
            {SHOPPING_BENEFITS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className={`flex items-start gap-3.5 py-4 px-4 sm:px-6 xl:px-8 ${
                    idx === 1 ? 'border-t-0' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <IconComp size={18} className="text-brand-purple" />
                  </div>
                  <div>
                    <h2 className="font-body text-xs sm:text-body-sm font-semibold text-brand-black tracking-tight">
                      {item.title}
                    </h2>
                    <p className="font-body text-[11px] sm:text-caption text-brand-subdued-medium mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Watch Story Campaign Modal
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isStoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsStoryOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-brand-black text-white border border-brand-subdued-border shadow-2xl overflow-hidden rounded-none"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-purple font-semibold">
                    Atelier Cinematic Journal
                  </p>
                  <h3 id="story-modal-title" className="font-display text-xl sm:text-2xl text-white">
                    Autumn / Winter '24 — Modern Tradition
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStoryOpen(false)}
                  aria-label="Close story modal"
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video / Editorial Canvas */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85"
                  alt="Vastramay Campaign Lookbook Still"
                  className="w-full h-full object-cover filter brightness-75"
                />

                {/* Atmospheric Editorial Narrative Centerpiece */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/40">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-purple mb-2">
                    Vastramay Craft Film
                  </span>
                  <p className="font-display text-2xl sm:text-3xl lg:text-4xl max-w-xl leading-snug mb-4">
                    "Where centuries of handloom heritage meet the precision of modern bespoke tailoring."
                  </p>
                  <p className="font-body text-xs sm:text-body-sm text-zinc-300 max-w-md">
                    Photographed across historic Indian palaces and modern contemporary architecture.
                  </p>
                </div>

                {/* Sound toggle indicator */}
                <button
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black text-white border border-white/20 transition-colors"
                  aria-label={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
                >
                  {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-brand-subdued-surface border-t border-white/10 text-brand-black">
                <p className="text-caption text-brand-subdued-medium">
                  Styled in Mulberry Raw Silk, Handcrafted Buttons & Anatomical Seams.
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/collections/autumn-winter-26"
                    onClick={() => setIsStoryOpen(false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple-dark text-white text-caption uppercase font-semibold px-5 h-10 transition-colors"
                  >
                    <span>Explore This Look</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
