import { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data';
import { catalogService } from '@/services';
import { ProductCard } from '@/components/product';
import {
  Breadcrumb,
  Button,
  EmptyState,
} from '@/components/ui';
import {
  CatalogFilters,
  MobileFilterDrawer,
  type FilterState,
} from '@/components/catalog';
import { SEO } from '@/components/common/SEO';

const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Parse filters from URL search params or category route param
  const categoryParam = searchParams.get('category') || categorySlug || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const priceParam = searchParams.get('price') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const filterParam = searchParams.get('filter') || '';
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

  // Sync state update to URL search params
  const updateFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.size) params.set('size', newFilters.size);
    if (newFilters.color) params.set('color', newFilters.color);
    if (newFilters.priceTier) params.set('price', newFilters.priceTier);
    if (newFilters.inStockOnly) params.set('inStock', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'featured') {
      params.set('sort', newFilters.sortBy);
    }
    if (filterParam) params.set('filter', filterParam);

    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE); // reset pagination when filters change
  };

  const handleReset = () => {
    const params = new URLSearchParams();
    if (filterParam) params.set('filter', filterParam);
    setSearchParams(params);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Base product pool
  const baseProducts = useMemo(() => {
    if (filterParam === 'new') {
      return PRODUCTS.filter((p) => p.isNew);
    }
    return PRODUCTS;
  }, [filterParam]);

  // Filter and sort deterministically
  const filteredProducts = useMemo(() => {
    return catalogService.filterAndSort(baseProducts, filters);
  }, [baseProducts, filters]);

  // Paginated slice
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const activeCategory = CATEGORIES.find(
    (c) => c.id === filters.category || c.slug === filters.category,
  );

  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.size ? 1 : 0,
    filters.color ? 1 : 0,
    filters.priceTier ? 1 : 0,
    filters.inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      <SEO
        title={activeCategory ? `${activeCategory.name} — Luxury Indian Menswear` : 'Ceremonial Wardrobe Catalog'}
        description={activeCategory?.description || 'Explore the Vastramay ceremonial wardrobe catalog featuring handcrafted Chanderi silk kurtas, imperial velvet bandhgalas, and regal sherwanis.'}
      />

      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
          ...(filterParam === 'new' ? [{ label: 'New Arrivals' }] : []),
        ]}
        className="mb-6"
      />

      {/* 2. Page Title & Description */}
      <div className="mb-8 sm:mb-12 border-b border-brand-subdued-border pb-8">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight mb-3">
          {filterParam === 'new'
            ? 'New Arrivals'
            : activeCategory
            ? activeCategory.name
            : 'The Wardrobe'}
        </h1>
        <p className="text-body-base text-brand-subdued-medium max-w-2xl leading-relaxed">
          {activeCategory?.description ||
            'Handcrafted silhouettes woven in Varanasi, Chanderi, and Kashmir. Pure mulberry raw silks and organic mulmul tailored with zero compromise.'}
        </p>
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
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} pieces
          </p>
        </div>

        {/* Right: Sorting Selector */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ArrowUpDown size={14} className="text-brand-subdued-low" />
          <label htmlFor="shop-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="shop-sort"
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

      {/* 4. Main Body: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white pr-4">
          <CatalogFilters
            filters={filters}
            onChange={updateFilters}
            onReset={handleReset}
          />
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {displayedProducts.length > 0 ? (
            <div className="space-y-12">
              {/* Product Grid (2-col mobile, 3-col tablet/desktop) */}
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
              {visibleCount < filteredProducts.length && (
                <div className="pt-8 text-center border-t border-brand-subdued-border flex flex-col items-center gap-4">
                  <p className="text-caption text-brand-subdued-medium">
                    Showing {visibleCount} of {filteredProducts.length} items
                  </p>
                  <div className="w-48 h-0.5 bg-brand-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-brand-purple transition-all duration-300"
                      style={{
                        width: `${(visibleCount / filteredProducts.length) * 100}%`,
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
            /* Empty State */
            <EmptyState
              title="No Matching Garments"
              description="No pieces currently match your selected filter criteria. Try clearing some filters or browse all categories."
              action={
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" onClick={handleReset}>
                    Reset All Filters
                  </Button>
                  <Link to="/shop">
                    <Button variant="secondary" size="sm">
                      View All Garments
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
        onReset={handleReset}
      />
    </div>
  );
}
