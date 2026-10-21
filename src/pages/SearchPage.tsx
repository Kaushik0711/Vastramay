import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Sparkles, SlidersHorizontal, ArrowUpDown, History } from 'lucide-react';
import { PRODUCTS } from '@/data';
import { catalogService, searchService, POPULAR_SEARCH_TERMS } from '@/services';
import { ProductCard } from '@/components/product';
import {
  Breadcrumb,
  Button,
  IconButton,
  EmptyState,
} from '@/components/ui';
import {
  CatalogFilters,
  MobileFilterDrawer,
  type FilterState,
} from '@/components/catalog';

const ITEMS_PER_PAGE = 8;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramQ = searchParams.get('q') || '';
  const [queryInput, setQueryInput] = useState(paramQ);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    searchService.getRecentSearches(),
  );

  // Sync input if URL search param changes via back/forward navigation
  const [prevParamQ, setPrevParamQ] = useState(paramQ);
  if (paramQ !== prevParamQ) {
    setPrevParamQ(paramQ);
    setQueryInput(paramQ);
  }

  // Parse filters from URL search params
  const categoryParam = searchParams.get('category') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const priceParam = searchParams.get('price') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = (searchParams.get('sort') || 'featured') as FilterState['sortBy'];

  const filters: FilterState = useMemo(
    () => ({
      category: categoryParam,
      size: sizeParam,
      color: colorParam,
      priceTier: priceParam,
      inStockOnly: inStockParam,
      sortBy: sortParam,
    }),
    [categoryParam, sizeParam, colorParam, priceParam, inStockParam, sortParam],
  );

  const updateFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (paramQ) params.set('q', paramQ);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.size) params.set('size', newFilters.size);
    if (newFilters.color) params.set('color', newFilters.color);
    if (newFilters.priceTier) params.set('price', newFilters.priceTier);
    if (newFilters.inStockOnly) params.set('inStock', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'featured') {
      params.set('sort', newFilters.sortBy);
    }

    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = queryInput.trim();
    const params = new URLSearchParams();
    if (clean) {
      params.set('q', clean);
      searchService.saveRecentSearch(clean);
      setRecentSearches(searchService.getRecentSearches());
    }
    // Retain sorting if set
    if (filters.sortBy && filters.sortBy !== 'featured') {
      params.set('sort', filters.sortBy);
    }
    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSelectTerm = (term: string) => {
    setQueryInput(term);
    searchService.saveRecentSearch(term);
    setRecentSearches(searchService.getRecentSearches());
    const params = new URLSearchParams();
    params.set('q', term);
    if (filters.sortBy && filters.sortBy !== 'featured') {
      params.set('sort', filters.sortBy);
    }
    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleClearQuery = () => {
    setQueryInput('');
    const params = new URLSearchParams();
    if (filters.sortBy && filters.sortBy !== 'featured') {
      params.set('sort', filters.sortBy);
    }
    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleResetAll = () => {
    setQueryInput('');
    setSearchParams(new URLSearchParams());
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Filter and sort products deterministically using catalogService
  const matchingProducts = useMemo(() => {
    return catalogService.filterAndSort(PRODUCTS, filters, paramQ);
  }, [filters, paramQ]);

  // Paginated slice
  const displayedProducts = useMemo(() => {
    return matchingProducts.slice(0, visibleCount);
  }, [matchingProducts, visibleCount]);

  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.size ? 1 : 0,
    filters.color ? 1 : 0,
    filters.priceTier ? 1 : 0,
    filters.inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, matchingProducts.length));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      {/* 1. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search', href: '/search' },
          ...(paramQ ? [{ label: `"${paramQ}"` }] : []),
        ]}
        className="mb-6"
      />

      {/* 2. Search Input & Discovery Header */}
      <div className="max-w-3xl mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-brand-black mb-3 tracking-tight">
          Search the Wardrobe
        </h1>
        <p className="text-body-base text-brand-subdued-medium mb-6">
          Explore artisanal silk kurtas, handcrafted sherwanis, festive bundis, and bespoke accessories.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-brand-black pointer-events-none">
            <Search size={20} />
          </div>

          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search by garment name, fabric, motif, or occasion..."
            aria-label="Search garments"
            className="w-full bg-white text-brand-black text-[15px] sm:text-base border border-brand-subdued-border pl-12 pr-28 py-3.5 rounded-none focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {queryInput && (
              <IconButton
                aria-label="Clear query input"
                variant="ghost"
                size="sm"
                icon={<X size={16} />}
                onClick={handleClearQuery}
              />
            )}
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>

        {/* Discovery suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-caption">
          <span className="text-brand-subdued-low flex items-center gap-1">
            <Sparkles size={13} className="text-brand-purple" />
            Trending:
          </span>
          {POPULAR_SEARCH_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectTerm(term)}
              className="border border-brand-subdued-border px-2.5 py-1 text-xs text-brand-black hover:border-brand-purple hover:text-brand-purple transition-colors bg-white"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-caption">
            <span className="text-brand-subdued-low flex items-center gap-1">
              <History size={13} />
              Recent:
            </span>
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectTerm(term)}
                className="border border-brand-subdued-border px-2 py-0.5 text-xs text-brand-subdued-high hover:border-brand-black hover:text-brand-black transition-colors bg-brand-subdued-surface"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Toolbar: Results count, Mobile Filter trigger, Desktop Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-subdued-border">
        {/* Left: Result count & Filter Trigger */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 border border-brand-subdued-border px-4 py-2 text-btn uppercase tracking-wider text-brand-black hover:border-brand-black transition-colors"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-brand-purple text-white text-[10px] flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <p className="text-label uppercase tracking-widest text-brand-subdued-medium">
            Showing {Math.min(visibleCount, matchingProducts.length)} of {matchingProducts.length} pieces
            {paramQ && ` for "${paramQ}"`}
          </p>
        </div>

        {/* Right: Sorting Selector */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ArrowUpDown size={14} className="text-brand-subdued-low" />
          <label htmlFor="search-sort" className="sr-only">
            Sort search results
          </label>
          <select
            id="search-sort"
            value={filters.sortBy}
            onChange={(e) =>
              updateFilters({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="text-body-sm text-brand-black bg-white border border-brand-subdued-border px-3 py-2 rounded-none focus:outline-none focus:border-brand-purple cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 4. Main Body: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white pr-4">
          <CatalogFilters
            filters={filters}
            onChange={updateFilters}
            onReset={() => updateFilters({ ...filters, category: '', size: '', color: '', priceTier: '', inStockOnly: false })}
          />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {displayedProducts.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    aspectRatio="3/4"
                  />
                ))}
              </div>

              {/* Load More Interaction */}
              {visibleCount < matchingProducts.length && (
                <div className="pt-8 text-center border-t border-brand-subdued-border flex flex-col items-center gap-4">
                  <p className="text-caption text-brand-subdued-medium">
                    Showing {visibleCount} of {matchingProducts.length} items
                  </p>
                  <div className="w-48 h-0.5 bg-brand-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-brand-purple transition-all duration-300"
                      style={{
                        width: `${(visibleCount / matchingProducts.length) * 100}%`,
                      }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleLoadMore}
                    className="min-w-[200px]"
                  >
                    Load More Pieces
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No Pieces Found"
              description={
                paramQ
                  ? `We couldn't find any items matching "${paramQ}". Try one of our suggested keywords or reset your filters.`
                  : 'No pieces match your current filter selections.'
              }
              action={
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" onClick={handleResetAll}>
                    Reset All Filters & Query
                  </Button>
                  <Link to="/shop">
                    <Button variant="secondary" size="sm">
                      Browse Full Wardrobe
                    </Button>
                  </Link>
                </div>
              }
            />
          )}
        </main>
      </div>

      {/* 5. Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onApply={updateFilters}
        onReset={() => updateFilters({ ...filters, category: '', size: '', color: '', priceTier: '', inStockOnly: false })}
      />
    </div>
  );
}
