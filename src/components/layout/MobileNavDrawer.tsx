import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  ChevronDown,
  User,
  Heart,
  ShoppingBag,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND, NAV_LINKS } from '@/config';
import { useCartStore, useWishlistStore } from '@/stores';
import { IconButton } from '@/components/ui';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Shop: true, // open Shop by default for immediate discoverability
  });

  const cartItemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Scroll lock, escape key, focus management
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }

        // Focus trap
        if (e.key === 'Tab' && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, [tabindex="0"]',
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div role="presentation" className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-brand-black/75"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            tabIndex={-1}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 w-full max-w-[340px] sm:max-w-[380px] bg-white border-r border-brand-subdued-border rounded-none shadow-2xl flex flex-col z-10 focus:outline-none font-body"
          >
            {/* Top Bar: Brand + Close */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-brand-subdued-border shrink-0">
              <Link
                to="/"
                onClick={onClose}
                className="font-display text-xl tracking-tight text-brand-black"
              >
                {BRAND.name}
              </Link>
              <IconButton
                aria-label="Close mobile navigation menu"
                variant="ghost"
                size="md"
                icon={<X size={22} />}
                onClick={onClose}
              />
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto py-4 px-6 divide-y divide-brand-subdued-border">
              {/* Primary Links */}
              <div className="pb-6 space-y-1">
                {NAV_LINKS.map((link) => {
                  const hasSublinks = 'sublinks' in link && link.sublinks && link.sublinks.length > 0;
                  const isExpanded = expandedSections[link.label];

                  return (
                    <div key={link.label} className="border-b border-brand-subdued-surface last:border-b-0">
                      {hasSublinks ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleSection(link.label)}
                            aria-expanded={isExpanded}
                            className="w-full flex items-center justify-between py-3 text-left font-body text-sm font-semibold uppercase tracking-wider text-brand-black min-h-[44px]"
                          >
                            <span>{link.label}</span>
                            <ChevronDown
                              size={16}
                              className={`text-brand-subdued-low transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-brand-purple' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-3 pb-2 space-y-1"
                              >
                                {link.sublinks.map((sub) => (
                                  <NavLink
                                    key={sub.path}
                                    to={sub.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                      `block py-2 text-sm transition-colors min-h-[40px] flex items-center ${
                                        isActive
                                          ? 'text-brand-purple font-medium'
                                          : 'text-brand-subdued-medium hover:text-brand-black'
                                      }`
                                    }
                                  >
                                    {sub.label}
                                  </NavLink>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <NavLink
                          to={link.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block py-3 text-sm font-semibold uppercase tracking-wider transition-colors min-h-[44px] flex items-center ${
                              isActive
                                ? 'text-brand-purple'
                                : 'text-brand-black hover:text-brand-purple'
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Customer Services */}
              <div className="py-6 space-y-3">
                <p className="text-label uppercase tracking-widest text-brand-subdued-medium">
                  Customer Assistance
                </p>
                <div className="space-y-2 text-body-sm">
                  <Link
                    to="/size-guide"
                    onClick={onClose}
                    className="flex items-center justify-between text-brand-subdued-high hover:text-brand-purple py-1.5"
                  >
                    <span>Size & Fit Guide</span>
                    <ArrowRight size={14} className="text-brand-subdued-low" />
                  </Link>
                  <Link
                    to="/policies/shipping"
                    onClick={onClose}
                    className="flex items-center justify-between text-brand-subdued-high hover:text-brand-purple py-1.5"
                  >
                    <span>Complimentary Shipping & Returns</span>
                    <ArrowRight size={14} className="text-brand-subdued-low" />
                  </Link>
                  <Link
                    to="/faq"
                    onClick={onClose}
                    className="flex items-center justify-between text-brand-subdued-high hover:text-brand-purple py-1.5"
                  >
                    <span>Frequently Asked Questions</span>
                    <ArrowRight size={14} className="text-brand-subdued-low" />
                  </Link>
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="flex items-center justify-between text-brand-subdued-high hover:text-brand-purple py-1.5"
                  >
                    <span>Contact Concierge</span>
                    <ArrowRight size={14} className="text-brand-subdued-low" />
                  </Link>
                </div>
              </div>

              {/* Direct Concierge Contact */}
              <div className="pt-6 space-y-2 text-caption text-brand-subdued-medium">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-brand-purple shrink-0" />
                  <span>{BRAND.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-brand-purple shrink-0" />
                  <span>{BRAND.email}</span>
                </p>
              </div>
            </div>

            {/* Bottom Fixed Action Strip: Account, Wishlist, Bag */}
            <div className="p-4 border-t border-brand-subdued-border bg-brand-subdued-surface grid grid-cols-3 divide-x divide-brand-subdued-border text-center shrink-0">
              <Link
                to="/account"
                onClick={onClose}
                className="flex flex-col items-center justify-center py-2 text-xs text-brand-black hover:text-brand-purple"
              >
                <User size={18} className="mb-1" />
                <span>Account</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex flex-col items-center justify-center py-2 text-xs text-brand-black hover:text-brand-purple relative"
              >
                <div className="relative">
                  <Heart size={18} className="mb-1" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-brand-purple text-white text-[9px] flex items-center justify-center rounded-none font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="flex flex-col items-center justify-center py-2 text-xs text-brand-black hover:text-brand-purple relative"
              >
                <div className="relative">
                  <ShoppingBag size={18} className="mb-1" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-brand-purple text-white text-[9px] flex items-center justify-center rounded-none font-medium">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span>Bag</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavDrawer;
