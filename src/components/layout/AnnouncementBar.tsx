import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ANNOUNCEMENTS } from '@/config';

export interface AnnouncementBarProps {
  autoRotateInterval?: number;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  autoRotateInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isDismissed || isPaused || ANNOUNCEMENTS.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [isDismissed, isPaused, autoRotateInterval]);

  if (isDismissed || ANNOUNCEMENTS.length === (0 as number)) return null;

  const currentItem = ANNOUNCEMENTS[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div
      role="region"
      aria-label="Promotional announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-brand-black text-white text-xs font-body tracking-wider h-9 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 select-none overflow-hidden relative z-40"
    >
      {/* Previous announcement */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="text-white/60 hover:text-white transition-colors p-1 -ml-1 focus-visible:outline-1 focus-visible:outline-brand-purple"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Rotating message */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentItem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center font-medium truncate max-w-xl text-[11px] sm:text-xs tracking-wide"
          >
            {currentItem.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Next and dismiss controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-white/60 hover:text-white transition-colors p-1 focus-visible:outline-1 focus-visible:outline-brand-purple"
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss announcement banner"
          className="text-white/60 hover:text-white transition-colors p-1 -mr-1 ml-1 focus-visible:outline-1 focus-visible:outline-brand-purple"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
