import React, { useEffect, useRef, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IconButton from './IconButton';

export type SideDrawerPosition = 'left' | 'right';
export type SideDrawerSize = 'sm' | 'md' | 'lg';

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: SideDrawerPosition;
  size?: SideDrawerSize;
  closeOnBackdropClick?: boolean;
  className?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  className = '',
}) => {
  const generatedId = useId();
  const titleId = `${generatedId}-drawer-title`;
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }

      // Accessible focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      const timeout = setTimeout(() => {
        if (drawerRef.current) {
          const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
            'button, input, [tabindex="0"]',
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timeout);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const positionClasses = position === 'left' ? 'left-0' : 'right-0';
  const slideInitial = position === 'left' ? '-100%' : '100%';

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 overflow-hidden"
          data-lenis-prevent
        >
          {/* Backdrop: Controlled opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-brand-black/70"
            aria-hidden="true"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Slide-out Panel: Strict 0px border-radius */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ x: slideInitial }}
            animate={{ x: '0%' }}
            exit={{ x: slideInitial }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className={`fixed inset-y-0 ${positionClasses} w-full ${sizeClasses[size]} bg-white border-l border-brand-subdued-border rounded-none shadow-2xl flex flex-col z-10 focus:outline-none ${className}`.trim()}
          >
            {/* Header */}
            <div className="flex items-center justify-between py-4 px-6 border-b border-brand-subdued-border shrink-0">
              {title ? (
                <h2
                  id={titleId}
                  className="font-display text-xl text-brand-black tracking-tight"
                >
                  {title}
                </h2>
              ) : (
                <div />
              )}

              <IconButton
                aria-label="Close drawer"
                variant="ghost"
                size="sm"
                icon={<X size={20} />}
                onClick={onClose}
              />
            </div>

            {/* Content Body with scroll containment */}
            <div
              data-lenis-prevent
              className="p-6 overflow-y-auto flex-1 font-body text-body-base text-brand-subdued-high"
            >
              {children}
            </div>

            {/* Optional Footer */}
            {footer && (
              <div className="p-6 border-t border-brand-subdued-border bg-brand-subdued-surface shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

export default SideDrawer;
