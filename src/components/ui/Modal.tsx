import React, { useEffect, useRef, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IconButton from './IconButton';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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

  // Manage body scroll and focus restoration
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      // Focus modal container
      const timeout = setTimeout(() => {
        if (modalRef.current) {
          const firstInput = modalRef.current.querySelector<HTMLElement>(
            'input, button, [tabindex="0"]',
          );
          if (firstInput) {
            firstInput.focus();
          } else {
            modalRef.current.focus();
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    full: 'max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)]',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          data-lenis-prevent
        >
          {/* Backdrop: Controlled black opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-black/70"
            aria-hidden="true"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal Dialog: Border radius at most 2px (rounded-sm) per locked design tokens */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className={`relative w-full ${sizeClasses[size]} bg-white border border-brand-subdued-border rounded-sm shadow-xl z-10 max-h-[90vh] flex flex-col focus:outline-none ${className}`.trim()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between py-4 px-6 border-b border-brand-subdued-border">
                {title ? (
                  <h2
                    id={titleId}
                    className="font-display text-xl sm:text-2xl text-brand-black tracking-tight"
                  >
                    {title}
                  </h2>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <IconButton
                    aria-label="Close dialog"
                    variant="ghost"
                    size="sm"
                    icon={<X size={20} />}
                    onClick={onClose}
                  />
                )}
              </div>
            )}

            {/* Content Body with scroll containment */}
            <div
              data-lenis-prevent
              className="p-6 overflow-y-auto flex-1 font-body text-body-base text-brand-subdued-high"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
