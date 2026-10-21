import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  // Check if the browser supports CSS scroll-driven animations during initial render
  const [hasNativeScrollTimeline] = useState(() => {
    return typeof window !== 'undefined' && Boolean(window.CSS?.supports?.('animation-timeline', 'scroll()'));
  });

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Fallback Motion scroll tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      id="reading-progress-container"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none"
    >
      {hasNativeScrollTimeline ? (
        // Native compositor-thread scroll-driven animation
        <div
          id="progress"
          ref={progressBarRef}
          className="native-scroll-progress-bar h-full w-full bg-brand-purple origin-left"
          style={{ transformOrigin: '0 50%' }}
        />
      ) : (
        // Fallback for browsers without animation-timeline: scroll()
        <motion.div
          className="h-full w-full bg-brand-purple origin-left"
          style={{ scaleX, transformOrigin: '0 50%' }}
        />
      )}
    </div>
  );
};

export default ScrollProgress;
