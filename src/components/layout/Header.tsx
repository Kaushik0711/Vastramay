import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND, NAV_LINKS } from '@/config';
import { useCartStore, useWishlistStore } from '@/stores';
import AnnouncementBar from './AnnouncementBar';
import SearchOverlay from './SearchOverlay';
import MobileNavDrawer from './MobileNavDrawer';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartItemCount = useCartStore((s) => s.itemCount());
  const openCartDrawer = useCartStore((s) => s.openDrawer);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  // Close menus on route change using official React prev-state pattern
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    setMobileMenuOpen(false);
    setSearchOverlayOpen(false);
    setActiveDropdown(null);
  }

  // Global Cmd+K / Ctrl+K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOverlayOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-brand-subdued-border">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Desktop / Mobile Header Bar */}
      <div className="max-w-[1440px] mx-auto h-16 sm:h-20 px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Mobile Hamburger Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            id="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-brand-black hover:text-brand-purple transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-brand-purple"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center / Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            id="brand-logo"
            aria-label={`${BRAND.name} Homepage`}
            className="font-display text-2xl sm:text-3xl tracking-tight text-brand-black hover:opacity-90 transition-opacity select-none py-2"
          >
            {BRAND.name}
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-nav"
            role="navigation"
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-8 ml-4 h-20"
          >
            {NAV_LINKS.map((link) => {
              const hasSublinks = 'sublinks' in link && link.sublinks && link.sublinks.length > 0;
              const basePath = link.path.split('?')[0];
              const isCurrent =
                location.pathname === link.path ||
                (basePath.length > 1 && location.pathname.startsWith(basePath));

              return (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => (hasSublinks ? handleMouseEnter(link.label) : setActiveDropdown(null))}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavLink
                    to={link.path}
                    className={`font-body text-btn uppercase tracking-wider transition-colors duration-200 flex items-center gap-1 py-2 ${
                      isCurrent
                        ? 'text-brand-purple font-semibold'
                        : 'text-brand-black hover:text-brand-purple'
                    }`}
                  >
                    <span>{link.label}</span>
                    {hasSublinks && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180 text-brand-purple' : 'text-brand-subdued-low'
                        }`}
                      />
                    )}
                  </NavLink>

                  {/* Active Indicator Bar */}
                  {isCurrent && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple"
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Desktop Dropdown / Mega-Preview Panel */}
                  {hasSublinks && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 w-64 bg-white border border-brand-subdued-border border-t-2 border-t-brand-purple shadow-xl p-4 z-50 font-body rounded-none"
                        >
                          <div className="space-y-1">
                            {link.sublinks.map((sub) => (
                              <NavLink
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className={({ isActive }) =>
                                  `block px-3 py-2 text-body-sm transition-colors ${
                                    isActive
                                      ? 'text-brand-purple font-semibold bg-brand-subdued-surface'
                                      : 'text-brand-subdued-high hover:text-brand-black hover:bg-brand-subdued-surface'
                                  }`
                                }
                              >
                                {sub.label}
                              </NavLink>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-brand-subdued-border">
                            <Link
                              to={link.path}
                              onClick={() => setActiveDropdown(null)}
                              className="text-btn uppercase text-brand-purple hover:underline flex items-center justify-between text-xs font-semibold px-3 py-1"
                            >
                              <span>Explore All</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions (Search, Account, Wishlist, Bag) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            type="button"
            id="header-search-btn"
            onClick={() => setSearchOverlayOpen(true)}
            aria-label="Search clothing catalog (Press Cmd+K)"
            className="p-2 sm:px-3 text-brand-black hover:text-brand-purple transition-colors flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center focus-visible:outline-2 focus-visible:outline-brand-purple"
          >
            <Search size={20} />
            <span className="hidden xl:inline text-caption text-brand-subdued-low border border-brand-subdued-border px-1.5 py-0.5 rounded-none">
              ⌘K
            </span>
          </button>

          {/* Account Link */}
          <Link
            to="/account"
            id="header-account-link"
            aria-label="Customer Account"
            className="p-2 text-brand-black hover:text-brand-purple transition-colors min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center focus-visible:outline-2 focus-visible:outline-brand-purple"
          >
            <User size={20} />
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            id="header-wishlist-link"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="p-2 text-brand-black hover:text-brand-purple transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative focus-visible:outline-2 focus-visible:outline-brand-purple"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-purple text-white text-[10px] flex items-center justify-center font-body rounded-none font-medium">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Button (Opens Mini-Cart Drawer with fallback Link to /cart) */}
          <Link
            to="/cart"
            id="header-cart-link"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                openCartDrawer();
              }
            }}
            aria-label={`Shopping Bag (${cartItemCount} items)`}
            className="p-2 text-brand-black hover:text-brand-purple transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative focus-visible:outline-2 focus-visible:outline-brand-purple"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-purple text-white text-[10px] flex items-center justify-center font-body rounded-none font-medium">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 4. Global Search Overlay */}
      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
      />
    </header>
  );
}
