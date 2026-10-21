import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

type CursorVariant = 'default' | 'pointer' | 'view' | 'drag' | 'hidden';

export const CustomCursor: React.FC = () => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Lazy initializer to avoid setState in effect
  const [isFinePointer, setIsFinePointer] = useState(() => {
    if (typeof window === 'undefined') return false;
    const fineQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return fineQuery.matches && !motionQuery.matches;
  });

  const isReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  // Smooth mouse coordinates via Motion springs
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring spring (slightly lagged for a luxurious fluid trailing feel)
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Listen for media changes dynamically
    const fineQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleFineChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches && !isReducedMotion.current);
    };
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion.current = e.matches;
      setIsFinePointer(fineQuery.matches && !e.matches);
    };

    fineQuery.addEventListener('change', handleFineChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      fineQuery.removeEventListener('change', handleFineChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Inspect target to determine cursor context
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Essential controls: never interfere with inputs, forms, text selection, or checkout fields
      const isInputOrInteractiveField =
        target.closest('input, textarea, select, [contenteditable="true"], .checkout-input-field, [data-native-cursor="true"]');

      if (isInputOrInteractiveField) {
        setVariant('hidden');
        return;
      }

      // Contextual interactive regions
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor');
        if (customType === 'view') {
          setVariant('view');
          return;
        }
        if (customType === 'drag') {
          setVariant('drag');
          return;
        }
        if (customType === 'hidden') {
          setVariant('hidden');
          return;
        }
      }

      // Check for standard interactive elements (buttons, links)
      const isInteractive = target.closest('a, button, [role="button"], summary, label');
      if (isInteractive) {
        setVariant('pointer');
        return;
      }

      setVariant('default');
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setVariant('hidden');
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isFinePointer, isVisible, mouseX, mouseY]);

  if (!isFinePointer) return null;

  // Variant size, color and label styles
  const isHidden = !isVisible || variant === 'hidden';

  const ringVariants = {
    default: {
      width: 28,
      height: 28,
      backgroundColor: 'rgba(109, 40, 217, 0.05)',
      borderColor: 'rgba(109, 40, 217, 0.45)',
      borderWidth: 1.5,
    },
    pointer: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(109, 40, 217, 0.12)',
      borderColor: '#6D28D9',
      borderWidth: 1.5,
    },
    view: {
      width: 68,
      height: 68,
      backgroundColor: '#6D28D9',
      borderColor: '#6D28D9',
      borderWidth: 0,
    },
    drag: {
      width: 68,
      height: 68,
      backgroundColor: '#101010',
      borderColor: '#6D28D9',
      borderWidth: 1.5,
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    },
  };

  return (
    <div
      className="custom-cursor-container fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Outer Fluid Trailing Ring / Context Badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none select-none text-white font-body text-[11px] font-semibold tracking-widest uppercase transition-opacity duration-150"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
        }}
        variants={ringVariants}
        animate={variant}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {variant === 'view' && (
          <span className="leading-none tracking-wider text-white">VIEW</span>
        )}
        {variant === 'drag' && (
          <span className="leading-none tracking-wider text-brand-purple">DRAG</span>
        )}
      </motion.div>

      {/* Center Precise Dot (tightly bound to cursor for precision clicking) */}
      {variant !== 'view' && variant !== 'drag' && (
        <motion.div
          className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-purple rounded-full pointer-events-none transition-opacity duration-100"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isHidden ? 0 : 1,
          }}
        />
      )}
    </div>
  );
};

export default CustomCursor;
