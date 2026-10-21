import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, ArrowRight, Sparkles } from 'lucide-react';
import { COLLECTIONS, PRODUCTS } from '@/data';
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

export default function CollectionsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // If slug is present, locate specific collection
  const activeCollection = useMemo(() => {
    if (!slug) return null;
    return COLLECTIONS.find((c) => c.slug === slug || c.id === slug) || null;
  }, [slug]);

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

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Base products for this collection
  const collectionProducts = useMemo(() => {
    if (!activeCollection) return [];
    return PRODUCTS.filter(
      (p) =>
        activeCollection.productIds.includes(p.id) ||
        (p.collectionIds && p.collectionIds.includes(activeCollection.id)),
    );
  }, [activeCollection]);

  // Filter & sort deterministically
  const filteredProducts = useMemo(() => {
    return catalogService.filterAndSort(collectionProducts, filters);
  }, [collectionProducts, filters]);

  // Paginated slice
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

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

  /* -------------------------------------------------------------
   * RENDER: 1. COLLECTIONS INDEX (when no slug is passed)
   * ----------------------------------------------------------- */
  if (!slug) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
        <SEO
          title="Editorial Campaign Collections — Vastramay Atelier"
          description="Explore seasonal ceremonial collections, royal heritage edits, and contemporary festive ensembles."
        />

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
          ]}
          className="mb-6"
        />

        {/* Editorial Header */}
        <div className="mb-12 border-b border-brand-subdued-border pb-8">
          <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
            Seasonal Portfolios & Ceremonial Edits
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-black tracking-tight mb-4">
            Artisanal Collections
          </h1>
          <p className="text-body-base text-brand-subdued-medium max-w-2xl leading-relaxed">
            Curated narratives born from handloom looms across Varanasi, Chanderi, and Kashmir. Each capsule is tailored in limited micro-batches with pure mulberry silks and hand zari embroidery.
          </p>
        </div>

        {/* Collections Showcase Grid */}
        <div className="space-y-16">
          {COLLECTIONS.map((col, idx) => {
            const previewProducts = PRODUCTS.filter((p) =>
              col.productIds.includes(p.id),
            ).slice(0, 3);

            return (
              <article
                key={col.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-brand-subdued-border pb-16 last:border-b-0"
              >
                {/* Visual Banner */}
                <div
                  className={`lg:col-span-7 overflow-hidden relative border border-brand-subdued-border bg-brand-subdued-surface aspect-[16/10] sm:aspect-[16/9] ${
                    idx % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-brand-black text-white text-[11px] uppercase tracking-widest font-semibold px-3 py-1">
                    Edition 0{idx + 1}
                  </div>
                </div>

                {/* Narrative & Details */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-6 ${
                    idx % 2 === 1 ? 'lg:order-1 lg:pr-8' : 'lg:pl-8'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-caption uppercase tracking-wider text-brand-purple flex items-center gap-1.5 font-medium">
                      <Sparkles size={13} />
                      Curated Capsule · {col.productIds.length} Pieces
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
                      {col.name}
                    </h2>
                    <p className="text-body-base text-brand-subdued-medium leading-relaxed pt-2">
                      {col.description}
                    </p>
                  </div>

                  {/* Thumbnail Previews */}
                  {previewProducts.length > 0 && (
                    <div className="pt-2">
                      <p className="text-caption text-brand-subdued-low uppercase tracking-wider mb-3">
                        Featured Silhouettes:
                      </p>
                      <div className="flex items-center gap-3">
                        {previewProducts.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.slug}`}
                            className="group/thumb block w-16 sm:w-20 aspect-[3/4] border border-brand-subdued-border overflow-hidden bg-brand-subdued-surface relative"
                            title={p.title}
                          >
                            <img
                              src={p.images[0]?.url}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-2">
                    <Link to={`/collections/${col.slug}`}>
                      <Button
                        variant="primary"
                        size="md"
                        rightIcon={<ArrowRight size={15} />}
                        className="w-full sm:w-auto"
                      >
                        Explore {col.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * RENDER: 2. COLLECTION NOT FOUND
   * ----------------------------------------------------------- */
  if (!activeCollection) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 font-body">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: 'Not Found' },
          ]}
          className="mb-8"
        />
        <EmptyState
          title="Collection Not Found"
          description={`The requested collection "${slug}" could not be located in our seasonal archives.`}
          action={
            <div className="flex gap-4">
              <Link to="/collections">
                <Button variant="primary" size="md">
                  View All Collections
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="secondary" size="md">
                  Browse Wardrobe
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  /* -------------------------------------------------------------
   * RENDER: 3. SPECIFIC COLLECTION DETAIL (/collections/:slug)
   * ----------------------------------------------------------- */
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      <SEO
        title={`${activeCollection.name} — Editorial Collection`}
        description={activeCollection.description || `Explore garments in the ${activeCollection.name} campaign collection.`}
        ogImage={activeCollection.image}
      />

      {/* 1. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: activeCollection.name },
        ]}
        className="mb-6"
      />

      {/* 2. Campaign Banner with Responsive Photography */}
      <div className="relative mb-10 overflow-hidden border border-brand-subdued-border bg-brand-black aspect-[16/8] sm:aspect-[21/9] min-h-[260px] flex items-end">
        <img
          src={activeCollection.image}
          alt={activeCollection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-3xl">
          <p className="text-label uppercase tracking-widest text-brand-purple-light mb-2">
            Curated Capsule · {collectionProducts.length} Silhouettes
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
            {activeCollection.name}
          </h1>
          <p className="text-body-base text-brand-gray-200 line-clamp-2 sm:line-clamp-none max-w-2xl font-light">
            {activeCollection.description}
          </p>
        </div>
      </div>

      {/* 3. Toolbar: Results Count, Mobile Filter Trigger, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-subdued-border">
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

        {/* Sorting selector */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ArrowUpDown size={14} className="text-brand-subdued-low" />
          <label htmlFor="collection-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="collection-sort"
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

      {/* 4. Body: Desktop Sidebar Filters + Product Grid */}
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
            <EmptyState
              title="No Matching Garments"
              description="No pieces currently match your selected filter criteria within this collection."
              action={
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" onClick={handleReset}>
                    Reset Collection Filters
                  </Button>
                  <Link to="/shop">
                    <Button variant="secondary" size="sm">
                      Browse All Garments
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
