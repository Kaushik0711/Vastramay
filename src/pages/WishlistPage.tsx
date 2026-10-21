import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCTS } from '@/data';
import { useWishlistStore, useCartStore } from '@/stores';
import {
  Breadcrumb,
  Button,
  EmptyState,
} from '@/components/ui';
import { ProductCard, Featured3DSlider } from '@/components/product';

export default function WishlistPage() {
  const { productIds, clear, remove } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [addedAllFeedback, setAddedAllFeedback] = useState(false);

  // Retrieve products currently in the wishlist
  const savedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => productIds.includes(p.id));
  }, [productIds]);

  // Featured suggestions if wishlist is empty
  const featuredSuggestions = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, 5);
  }, []);

  const handleAddAllToCart = () => {
    let addedCount = 0;
    savedProducts.forEach((product) => {
      const defaultVariant = product.variants.find((v) => v.isAvailable && v.stock > 0);
      if (defaultVariant) {
        addItemToCart({
          productId: product.id,
          variantId: defaultVariant.id,
          title: product.title,
          image: product.images[0]?.url || '',
          size: defaultVariant.size,
          color: defaultVariant.color,
          price: defaultVariant.price,
          compareAtPrice: defaultVariant.compareAtPrice,
          quantity: 1,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setAddedAllFeedback(true);
      setTimeout(() => setAddedAllFeedback(false), 2500);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      {/* 1. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Wishlist', href: '/wishlist' },
        ]}
        className="mb-6"
      />

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple flex items-center gap-1.5 mb-1.5 font-semibold">
            <Heart size={14} className="fill-brand-purple" />
            Curated Private Wardrobe
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight">
            Saved Pieces
          </h1>
          <p className="text-body-base text-brand-subdued-medium mt-1">
            {savedProducts.length} silhouette{savedProducts.length === 1 ? '' : 's'} saved for your upcoming ceremonies and festive occasions.
          </p>
        </div>

        {/* Global Wishlist Actions */}
        {savedProducts.length > 0 && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={clear}
              leftIcon={<Trash2 size={14} />}
            >
              Clear All
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAllToCart}
              leftIcon={
                addedAllFeedback ? <Check size={14} /> : <ShoppingBag size={14} />
              }
            >
              {addedAllFeedback ? 'Added Available to Bag' : 'Add Available to Bag'}
            </Button>
          </div>
        )}
      </div>

      {/* 3. Main Content Grid or Empty State */}
      {savedProducts.length > 0 ? (
        <div className="space-y-12">
          {/* Product Grid (2 col mobile, 3 col tablet, 4 col desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence initial={false}>
              {savedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group flex flex-col justify-between"
                >
                  <ProductCard product={product} aspectRatio="3/4" />

                  {/* Direct Remove Action */}
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.title} from wishlist`}
                    className="mt-2 w-full py-1.5 text-caption uppercase tracking-wider text-brand-subdued-low hover:text-red-700 transition-colors flex items-center justify-center gap-1.5 border border-brand-subdued-border bg-white"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Continue Shopping Strip */}
          <div className="p-8 bg-brand-subdued-surface border border-brand-subdued-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-display text-2xl text-brand-black">
                Ready to Complete Your Order?
              </h3>
              <p className="text-body-sm text-brand-subdued-medium mt-0.5">
                Complimentary nationwide doorstep delivery and 7-day exchanges on all items.
              </p>
            </div>
            <Link to="/cart">
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
                Proceed to Shopping Bag
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State with Discovery Recommendations */
        <div className="space-y-16">
          <EmptyState
            title="Your Wishlist is Empty"
            description="You haven't saved any handcrafted silhouettes yet. Explore our seasonal collections or browse all kurtas, sherwanis, and jackets."
            action={
              <div className="flex gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="md">
                    Explore The Wardrobe
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

          {/* Featured 3D Showcase to inspire the guest user */}
          {featuredSuggestions.length > 0 && (
            <div className="pt-8 border-t border-brand-subdued-border">
              <Featured3DSlider
                products={featuredSuggestions}
                title="Curated Seasonal Inspirations"
                subtitle="Discover hallmark artisanal silks and festive ensembles to begin your private edit."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
