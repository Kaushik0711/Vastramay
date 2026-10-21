import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data';
import { useCartStore, useWishlistStore } from '@/stores';
import {
  Breadcrumb,
  Button,
  PriceDisplay,
  QuantitySelector,
  EmptyState,
} from '@/components/ui';
import {
  ProductGallery,
  SizeGuideModal,
  Featured3DSlider,
} from '@/components/product';
import { SEO } from '@/components/common/SEO';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  // Find product by slug or id
  const product = useMemo(() => {
    if (!slug) return null;
    return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
  }, [slug]);

  // Cart and Wishlist stores
  const addItemToCart = useCartStore((s) => s.addItem);
  const { productIds: wishlistIds, toggle: toggleWishlist } = useWishlistStore();

  const isSavedInWishlist = product ? wishlistIds.includes(product.id) : false;

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    fit: false,
    care: false,
    shipping: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract unique available colors
  const availableColors = useMemo(() => {
    if (!product) return [];
    const colorMap = new Map<string, { name: string; hex?: string }>();
    product.variants.forEach((v) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, { name: v.color, hex: v.colorHex });
      }
    });
    return Array.from(colorMap.values());
  }, [product]);

  // Sync initial color if unset
  const currentColor = selectedColor || availableColors[0]?.name || '';

  // Variants matching currently selected color
  const colorFilteredVariants = useMemo(() => {
    if (!product) return [];
    if (!currentColor) return product.variants;
    return product.variants.filter((v) => v.color === currentColor);
  }, [product, currentColor]);

  // Active selected variant
  const activeVariant = useMemo(() => {
    if (!product) return null;
    if (selectedSize) {
      return (
        colorFilteredVariants.find((v) => v.size === selectedSize) ||
        product.variants.find((v) => v.size === selectedSize) ||
        null
      );
    }
    return null;
  }, [product, selectedSize, colorFilteredVariants]);

  // Dynamic pricing based on active variant
  const currentPrice = activeVariant ? activeVariant.price : product?.basePrice ?? 0;
  const currentCompareAt = activeVariant
    ? activeVariant.compareAtPrice
    : product?.compareAtPrice;

  // Maximum orderable stock for active variant
  const maxStock = activeVariant?.isAvailable ? activeVariant.stock : 0;
  const isOutOfStock = Boolean(selectedSize && activeVariant && (!activeVariant.isAvailable || activeVariant.stock === 0));

  // Category matching
  const category = useMemo(() => {
    if (!product) return null;
    return CATEGORIES.find((c) => c.id === product.categoryId);
  }, [product]);

  // Related products from same category or complementary collections
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.categoryId === product.categoryId || p.collectionIds.some((cid) => product.collectionIds.includes(cid))),
    ).slice(0, 6);
  }, [product]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    // If the currently selected size isn't available in this color, reset size
    const sizeExists = product?.variants.some(
      (v) => v.color === colorName && v.size === selectedSize && v.isAvailable,
    );
    if (!sizeExists) {
      setSelectedSize('');
    }
    setSizeError(false);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Validation: Size must be selected if product has variants
    if (!selectedSize && product.variants.length > 0) {
      setSizeError(true);
      return;
    }

    if (!activeVariant || !activeVariant.isAvailable || activeVariant.stock <= 0) {
      return;
    }

    addItemToCart({
      productId: product.id,
      variantId: activeVariant.id,
      title: product.title,
      image: product.images[0]?.url || '',
      size: activeVariant.size,
      color: activeVariant.color,
      price: activeVariant.price,
      compareAtPrice: activeVariant.compareAtPrice,
      quantity,
      slug: product.slug,
      maxStock: activeVariant.stock,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  };

  /* -------------------------------------------------------------
   * RENDER: NOT FOUND / ERROR STATE
   * ----------------------------------------------------------- */
  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 font-body">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'Not Found' },
          ]}
          className="mb-8"
        />
        <EmptyState
          title="Silhouette Not Found"
          description={`We could not locate the requested piece "${slug}". It may have been archived or moved to another seasonal capsule.`}
          action={
            <div className="flex gap-4">
              <Link to="/shop">
                <Button variant="primary" size="md">
                  Explore Wardrobe
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="secondary" size="md">
                  View Collections
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  /* -------------------------------------------------------------
   * RENDER: PRODUCT PURCHASE PAGE
   * ----------------------------------------------------------- */
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 font-body">
      <SEO
        title={`${product.title} — Ceremonial Wear`}
        description={product.description}
        ogImage={product.images[0]?.url}
        ogType="product"
      />

      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: product.title },
        ]}
        className="mb-8"
      />

      {/* 2. Main Product Grid (Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productTitle={product.title}
            isNew={product.isNew}
            hasDiscount={Boolean(currentCompareAt && currentCompareAt > currentPrice)}
          />
        </div>

        {/* Right: Purchase Controls & Product Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-7">
          {/* Title & Category Tag */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-label uppercase tracking-widest text-brand-purple font-semibold">
                {product.tags[0] || 'Artisanal Collection'}
              </span>
              {product.isNew && (
                <span className="bg-brand-black text-white text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 select-none">
                  New Arrival
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price Display */}
            <div className="mt-3 flex items-baseline gap-3">
              <PriceDisplay
                price={currentPrice}
                compareAtPrice={currentCompareAt}
                size="lg"
              />
              <span className="text-caption text-brand-subdued-low">
                (Inclusive of all taxes)
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-body-base text-brand-subdued-medium leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <hr className="border-brand-subdued-border" />

          {/* Color Selection (if multiple colors) */}
          {availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-label uppercase tracking-widest text-brand-black font-semibold">
                  Color Family:
                </span>
                <span className="text-body-sm text-brand-subdued-high font-medium">
                  {currentColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((c) => {
                  const isSelected = c.name === currentColor;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorChange(c.name)}
                      aria-label={`Select color ${c.name}`}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-body-sm transition-all ${
                        isSelected
                          ? 'border-brand-purple bg-brand-subdued-surface font-medium'
                          : 'border-brand-subdued-border hover:border-brand-black bg-white'
                      }`}
                    >
                      {c.hex && (
                        <span
                          className="w-3.5 h-3.5 border border-brand-subdued-border"
                          style={{ backgroundColor: c.hex }}
                        />
                      )}
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-label uppercase tracking-widest text-brand-black font-semibold">
                  Select Size:
                </span>
                {selectedSize && (
                  <span className="text-body-sm font-semibold text-brand-purple">
                    {selectedSize}
                  </span>
                )}
              </div>

              {/* Size Guide Trigger */}
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-caption uppercase tracking-wider text-brand-purple hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler size={13} />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size Options Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {colorFilteredVariants.map((variant) => {
                const isSelected = selectedSize === variant.size;
                const isAvailable = variant.isAvailable && variant.stock > 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleSizeChange(variant.size)}
                    aria-label={`Size ${variant.size}${!isAvailable ? ' - Out of Stock' : ''}`}
                    className={`relative py-3 px-2 text-center text-btn uppercase tracking-wider border transition-all ${
                      isSelected
                        ? 'border-brand-purple bg-brand-black text-white font-semibold'
                        : isAvailable
                        ? 'border-brand-subdued-border bg-white text-brand-black hover:border-brand-black'
                        : 'border-brand-gray-200 bg-brand-gray-50 text-brand-gray-400 cursor-not-allowed line-through'
                    }`}
                  >
                    <span>{variant.size}</span>
                  </button>
                );
              })}
            </div>

            {/* Validation error if tried to purchase without selecting size */}
            {sizeError && (
              <p className="text-caption text-red-600 flex items-center gap-1.5 pt-1 animate-fade-in font-medium">
                <AlertCircle size={14} />
                Please select an available size to proceed with your order.
              </p>
            )}

            {/* Live Stock & Availability Status */}
            <div className="pt-1 flex items-center gap-2 text-caption">
              {selectedSize ? (
                isOutOfStock ? (
                  <span className="text-brand-subdued-low flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-gray-400 inline-block" />
                    Currently Sold Out — Join Waitlist
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    In Stock ({maxStock} handcrafted piece{maxStock === 1 ? '' : 's'} available at our Atelier)
                  </span>
                )
              ) : (
                <span className="text-brand-subdued-medium">
                  Select a size to verify immediate workshop availability.
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label htmlFor="pdp-qty" className="sr-only">
                Quantity
              </label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={Math.max(1, maxStock)}
                disabled={isOutOfStock || !selectedSize}
              />

              {/* Add to Bag Primary CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 !h-12 relative overflow-hidden"
              >
                {addedFeedback ? (
                  <span className="flex items-center gap-2 text-white">
                    <Check size={16} />
                    Added to Bag
                  </span>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={16} />
                    Add to Bag
                  </span>
                )}
              </Button>
            </div>

            {/* Save to Wishlist Toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-full py-3 px-4 border text-btn uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                isSavedInWishlist
                  ? 'border-brand-purple bg-brand-subdued-surface text-brand-purple font-semibold'
                  : 'border-brand-subdued-border text-brand-black hover:border-brand-black bg-white'
              }`}
            >
              <Heart
                size={16}
                className={isSavedInWishlist ? 'fill-brand-purple text-brand-purple' : ''}
              />
              <span>
                {isSavedInWishlist ? 'Saved in Wishlist' : 'Save to Wishlist'}
              </span>
            </button>
          </div>

          {/* Reassurance Strip */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-brand-subdued-border text-center text-caption text-brand-subdued-medium">
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-brand-purple" />
              <span>Complimentary Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-brand-subdued-border">
              <RotateCcw size={16} className="text-brand-purple" />
              <span>7-Day Doorstep Exchange</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-brand-purple" />
              <span>Authentic Handloom Certified</span>
            </div>
          </div>

          {/* Structured Product Details Accordions */}
          <div className="space-y-3 pt-2 divide-y divide-brand-subdued-border">
            {/* 1. Fabric & Craftsmanship */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleSection('details')}
                className="w-full flex items-center justify-between py-2 text-left text-body-sm font-semibold text-brand-black"
              >
                <span>Fabric & Artisanal Details</span>
                <ChevronDown
                  size={16}
                  className={`text-brand-subdued-medium transition-transform duration-200 ${
                    openSections.details ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.details && (
                <div className="py-2 text-body-sm text-brand-subdued-high space-y-2 animate-fade-in">
                  <p>{product.description}</p>
                  <ul className="list-disc list-inside space-y-1 text-caption text-brand-subdued-medium pt-1">
                    <li>Fabric: 100% Pure Mulberry Raw Silk & Banarasi Brocade</li>
                    <li>Weave Origin: Handloomed in Varanasi & Chanderi clusters</li>
                    <li>Embellishment: Delicate hand-embroidered resham and pewter metallic hardware</li>
                    <li>Lining: Lightweight breathable organic mulmul</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Fit & Silhouette */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleSection('fit')}
                className="w-full flex items-center justify-between py-2 text-left text-body-sm font-semibold text-brand-black"
              >
                <span>Silhouette & Tailoring</span>
                <ChevronDown
                  size={16}
                  className={`text-brand-subdued-medium transition-transform duration-200 ${
                    openSections.fit ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.fit && (
                <div className="py-2 text-body-sm text-brand-subdued-high space-y-1 animate-fade-in">
                  <p>
                    Engineered with structured shoulder pads and built-in 3.5-inch ease allowance over natural body contours for fluid grace during long ceremonial banquets.
                  </p>
                  <p className="text-caption text-brand-subdued-medium pt-1">
                    Model is 6&apos;1&quot; (185 cm) with a 40&quot; chest and is wearing size M (40).
                  </p>
                </div>
              )}
            </div>

            {/* 3. Care Instructions */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between py-2 text-left text-body-sm font-semibold text-brand-black"
              >
                <span>Garment Preservation & Care</span>
                <ChevronDown
                  size={16}
                  className={`text-brand-subdued-medium transition-transform duration-200 ${
                    openSections.care ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.care && (
                <div className="py-2 text-body-sm text-brand-subdued-high space-y-1 animate-fade-in">
                  <p>Professional dry clean only to preserve natural silk luster and delicate zari threads.</p>
                  <p className="text-caption text-brand-subdued-medium">
                    Store flat or hung in the supplied breathable cotton garment bag away from direct sunlight.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Delivery & Returns */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between py-2 text-left text-body-sm font-semibold text-brand-black"
              >
                <span>Shipping, Dispatch & Returns</span>
                <ChevronDown
                  size={16}
                  className={`text-brand-subdued-medium transition-transform duration-200 ${
                    openSections.shipping ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.shipping && (
                <div className="py-2 text-body-sm text-brand-subdued-high space-y-2 animate-fade-in">
                  <p>
                    Dispatched from our New Delhi atelier within 24 to 48 hours. Nationwide express delivery typically arrives in 3 to 5 business days.
                  </p>
                  <p className="text-caption text-brand-subdued-medium">
                    Complimentary 7-day doorstep exchange and return service. Return items must remain unworn with original security ribbons intact.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Featured 3D Slider Showcase (Complementary Ensembles) */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-brand-subdued-border mb-12">
          <Featured3DSlider
            products={relatedProducts}
            title="Complementary Silhouettes"
            subtitle="Curated pairings from our seasonal ateliers to complete your ceremonial wardrobe."
          />
        </div>
      )}

      {/* 4. Brand Atelier Manifesto Strip */}
      <div className="p-8 sm:p-12 bg-brand-black text-white text-center space-y-4">
        <Sparkles size={20} className="text-brand-purple mx-auto" />
        <h3 className="font-display text-2xl sm:text-3xl tracking-tight">
          Bespoke Indian Tailoring
        </h3>
        <p className="text-body-base text-brand-gray-300 max-w-xl mx-auto font-light leading-relaxed">
          Every Vastramay garment is crafted in limited batches of no more than 100 pieces per edition, upholding artisanal heritage and fair weaver livelihoods.
        </p>
      </div>

      {/* 5. Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        productTitle={product.title}
      />
    </div>
  );
}
