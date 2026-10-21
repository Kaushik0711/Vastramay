import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, History, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchService, POPULAR_SEARCH_TERMS } from '@/services';
import type { Product } from '@/types';
import {
  Button,
  IconButton,
  PriceDisplay,
  LoadingIndicator,
  EmptyState,
} from '@/components/ui';

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => searchService.getRecentSearches());

  // Focus and scroll lock on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live query debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let isCancelled = false;
    const handler = setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchService.search(trimmed);
        if (!isCancelled) {
          setResults(found);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [query]);

  const displayedResults = query.trim() ? results : [];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (clean) {
      searchService.saveRecentSearch(clean);
      setRecentSearches(searchService.getRecentSearches());
      onClose();
      navigate(`/search?q=${encodeURIComponent(clean)}`);
    }
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    searchService.saveRecentSearch(term);
    setRecentSearches(searchService.getRecentSearches());
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClearRecent = () => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  const handleProductClick = (slug: string) => {
    if (query.trim()) {
      searchService.saveRecentSearch(query.trim());
    }
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex flex-col justify-start"
        >
          {/* Backdrop: Controlled opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-brand-black/75"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Product Search"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full bg-white border-b border-brand-subdued-border shadow-2xl z-10 max-h-[85vh] flex flex-col font-body"
          >
            {/* Search Input Bar */}
            <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 border-b border-brand-subdued-border">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Search size={22} className="text-brand-black shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search kurtas, sherwanis, silk jackets, fabrics..."
                  aria-label="Search clothing catalog"
                  className="w-full text-base sm:text-xl font-body text-brand-black placeholder:text-brand-subdued-low bg-transparent border-none focus:outline-none focus:ring-0 rounded-none"
                />

                {/* Clear query button */}
                {query && (
                  <IconButton
                    aria-label="Clear search input"
                    variant="ghost"
                    size="sm"
                    icon={<X size={18} />}
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                  />
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <LoadingIndicator size="sm" color="purple" className="shrink-0" />
                )}

                {/* Submit action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!query.trim()}
                  className="hidden sm:inline-flex shrink-0"
                >
                  Search
                </Button>

                {/* Close overlay */}
                <IconButton
                  aria-label="Close search overlay"
                  variant="ghost"
                  size="md"
                  icon={<X size={22} />}
                  onClick={onClose}
                />
              </form>
            </div>

            {/* Results & Discovery Area */}
            <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 overflow-y-auto flex-1">
              {query.trim() ? (
                /* Live Results Area */
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-subdued-border">
                    <p className="text-label uppercase tracking-widest text-brand-subdued-medium">
                      {isLoading ? 'Searching...' : `Found ${displayedResults.length} results`}
                    </p>
                    {displayedResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="text-btn uppercase text-brand-purple hover:underline flex items-center gap-1 font-semibold"
                      >
                        View all in catalog
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>

                  {displayedResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayedResults.slice(0, 8).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.slug)}
                          className="group border border-brand-subdued-border p-3 flex gap-3 cursor-pointer hover:border-brand-black transition-colors duration-150 bg-white"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleProductClick(product.slug);
                          }}
                        >
                          <div className="w-16 h-20 bg-brand-subdued-surface shrink-0 overflow-hidden relative">
                            {product.images[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.images[0].alt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-brand-gray-100" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-brand-subdued-low truncate">
                                {product.tags[0] || 'Apparel'}
                              </p>
                              <h4 className="font-body text-body-sm font-medium text-brand-black truncate group-hover:text-brand-purple transition-colors">
                                {product.title}
                              </h4>
                            </div>
                            <PriceDisplay
                              price={product.basePrice}
                              compareAtPrice={product.compareAtPrice}
                              size="sm"
                              showDiscountBadge={false}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isLoading ? (
                    <EmptyState
                      title="No matching pieces found"
                      description={`We couldn't find anything matching "${query}". Try searching for silk kurtas, sherwanis, or bundis.`}
                      action={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setQuery('')}
                        >
                          Clear Search
                        </Button>
                      }
                    />
                  ) : null}
                </div>
              ) : (
                /* Recent & Popular Discovery Tags */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-label uppercase tracking-widest text-brand-subdued-medium flex items-center gap-1.5">
                          <History size={14} />
                          Recent Searches
                        </p>
                        <button
                          type="button"
                          onClick={handleClearRecent}
                          className="text-caption text-brand-subdued-low hover:text-brand-purple transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleSelectRecent(term)}
                            className="border border-brand-subdued-border px-3 py-1.5 text-body-sm text-brand-black hover:border-brand-purple hover:text-brand-purple transition-colors duration-150 bg-white"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Terms */}
                  <div>
                    <p className="text-label uppercase tracking-widest text-brand-subdued-medium flex items-center gap-1.5 mb-3">
                      <Sparkles size={14} className="text-brand-purple" />
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_TERMS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectRecent(term)}
                          className="border border-brand-subdued-border px-3 py-1.5 text-body-sm text-brand-black hover:border-brand-purple hover:text-brand-purple transition-colors duration-150 bg-white"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
