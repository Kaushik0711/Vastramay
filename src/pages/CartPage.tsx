import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Heart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  AlertCircle,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCartStore, useWishlistStore, FREE_SHIPPING_THRESHOLD_PAISE } from '@/stores';
import {
  Breadcrumb,
  Button,
  PriceDisplay,
  EmptyState,
} from '@/components/ui';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    itemCount,
    subtotal,
    subtotalPaise,
    discount,
    shipping,
    total,
  } = useCartStore();

  const { toggle: toggleWishlist, has: isInWishlist } = useWishlistStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [validationIssues] = useState<string[]>(() => {
    const report = useCartStore.getState().revalidateCart();
    return report.issues.map((i) => i.message);
  });

  const count = itemCount();
  const currentSubtotal = subtotal();
  const currentSubtotalPaise = subtotalPaise();
  const currentDiscount = discount();
  const currentShipping = shipping();
  const currentTotal = total();

  // Free shipping tracker
  const isFreeShipping = currentSubtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const remainingForFree = Math.max(
    0,
    Math.round((FREE_SHIPPING_THRESHOLD_PAISE - currentSubtotalPaise) / 100),
  );
  const progressPercent = Math.min(
    100,
    Math.round((currentSubtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100),
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  const handleMoveToWishlist = (productId: string, variantId: string) => {
    if (!isInWishlist(productId)) {
      toggleWishlist(productId);
    }
    removeItem(productId, variantId);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shopping Bag', href: '/cart' },
        ]}
        className="mb-6"
      />

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple flex items-center gap-1.5 mb-1.5 font-semibold">
            <ShoppingBag size={14} />
            Your Ceremonial Order
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-body-base text-brand-subdued-medium mt-1">
            Review your chosen garments and bespoke ensembles ({count} item{count === 1 ? '' : 's'}).
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCart}
              className="text-caption uppercase tracking-wider text-brand-subdued-low hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} />
              <span>Clear Bag</span>
            </button>
            <Link
              to="/shop"
              className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium"
            >
              Continue Shopping →
            </Link>
          </div>
        )}
      </div>

      {/* Inventory & Price Adjustment Banner (if any item was updated) */}
      {validationIssues.length > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-body-sm space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-950">
            <AlertCircle size={16} />
            <span>Bag Inventory Notice</span>
          </div>
          {validationIssues.map((msg, i) => (
            <p key={i} className="text-caption pl-6 text-amber-800">
              • {msg}
            </p>
          ))}
        </div>
      )}

      {/* 3. Main Layout: Items Table (7 Cols) + Summary Card (5 Cols) */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Items List (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Free Shipping Progress Strip */}
            <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border">
              <div className="flex items-center justify-between text-body-sm mb-2 font-medium">
                <span className="flex items-center gap-2 text-brand-black">
                  <Truck size={16} className="text-brand-purple" />
                  {isFreeShipping
                    ? 'Complimentary Express Nationwide Delivery Unlocked'
                    : `Add ₹${remainingForFree.toLocaleString('en-IN')} more for Complimentary Delivery`}
                </span>
                <span className="text-caption font-mono text-brand-subdued-medium">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-brand-subdued-border overflow-hidden">
                <div
                  className="h-full bg-brand-purple transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Line Items List with AnimatePresence */}
            <div className="border border-brand-subdued-border divide-y divide-brand-subdued-border bg-white">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  const itemInWishlist = isInWishlist(item.productId);

                  return (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between"
                    >
                      {/* Product Media & Info */}
                      <div className="flex gap-4 sm:gap-5 flex-1 min-w-0">
                        {/* 3:4 Thumbnail */}
                        <Link
                          to={item.slug ? `/products/${item.slug}` : `/shop`}
                          className="w-24 sm:w-28 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden group block"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </Link>

                        {/* Metadata */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <Link
                            to={item.slug ? `/products/${item.slug}` : `/shop`}
                            className="font-display text-lg sm:text-xl text-brand-black hover:text-brand-purple transition-colors truncate block"
                          >
                            {item.title}
                          </Link>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-brand-subdued-medium">
                            <span>
                              Color: <strong className="text-brand-black">{item.color}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Size: <strong className="text-brand-black">{item.size}</strong>
                            </span>
                          </div>

                          <div className="pt-1">
                            <PriceDisplay
                              price={item.price}
                              compareAtPrice={item.compareAtPrice}
                              size="sm"
                            />
                          </div>

                          {/* Secondary actions: Save to Wishlist & Remove */}
                          <div className="pt-3 flex items-center gap-4 text-caption">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveToWishlist(item.productId, item.variantId)
                              }
                              className={`flex items-center gap-1 transition-colors ${
                                itemInWishlist
                                  ? 'text-brand-purple font-medium'
                                  : 'text-brand-subdued-medium hover:text-brand-black'
                              }`}
                            >
                              <Heart
                                size={13}
                                className={itemInWishlist ? 'fill-brand-purple' : ''}
                              />
                              <span>
                                {itemInWishlist ? 'Saved in Wishlist' : 'Save for Later'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-brand-subdued-low hover:text-red-700 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Line Total */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-brand-subdued-border">
                        {/* Stepper */}
                        <div className="flex items-center border border-brand-subdued-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity - 1,
                              )
                            }
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100 transition-colors text-brand-black"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-xs font-mono font-medium text-brand-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity + 1,
                              )
                            }
                            aria-label={`Increase quantity of ${item.title}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100 transition-colors text-brand-black"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Calculated Line Total */}
                        <div className="text-right">
                          <span className="font-display text-lg sm:text-xl font-semibold text-brand-black">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-6">
              <h2 className="font-display text-2xl text-brand-black pb-4 border-b border-brand-subdued-border">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label htmlFor="coupon-code" className="text-caption uppercase tracking-wider text-brand-black font-semibold flex items-center gap-1.5">
                    <Tag size={13} className="text-brand-purple" />
                    Promotional Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon-code"
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME10, ROSE1000"
                      className="flex-1 bg-white border border-brand-subdued-border px-3.5 py-2 text-body-sm uppercase rounded-none focus:outline-none focus:border-brand-purple"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </div>
                </form>

                {/* Applied Coupon Tag */}
                {couponCode && (
                  <div className="mt-3 p-2.5 bg-brand-subdued-surface border border-brand-purple/40 flex items-center justify-between text-body-sm">
                    <span className="flex items-center gap-1.5 text-brand-purple font-medium">
                      <Check size={14} />
                      Code applied: <strong className="font-mono">{couponCode}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      aria-label="Remove applied coupon"
                      className="text-brand-subdued-low hover:text-brand-black p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Coupon Feedback Message */}
                {couponFeedback && !couponCode && (
                  <p
                    className={`mt-2 text-caption ${
                      couponFeedback.type === 'success'
                        ? 'text-emerald-700'
                        : 'text-red-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-brand-subdued-border text-body-sm">
                <div className="flex items-center justify-between text-brand-subdued-high">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-brand-black">
                    ₹{currentSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {currentDiscount > 0 && (
                  <div className="flex items-center justify-between text-brand-purple">
                    <span>Promotional Discount</span>
                    <span className="font-semibold">
                      -₹{currentDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-brand-subdued-high">
                  <div className="flex items-center gap-1.5">
                    <span>Nationwide Express Delivery</span>
                  </div>
                  <span>
                    {currentShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">
                        Free
                      </span>
                    ) : (
                      <span className="font-medium text-brand-black">
                        ₹{currentShipping.toLocaleString('en-IN')}
                      </span>
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-brand-subdued-border flex items-baseline justify-between">
                  <div>
                    <span className="font-display text-xl sm:text-2xl font-semibold text-brand-black">
                      Total Due
                    </span>
                    <span className="block text-caption text-brand-subdued-low">
                      (Includes GST & applicable taxes)
                    </span>
                  </div>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
                    ₹{currentTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Proceed to Secure Checkout
                </Button>
              </div>

              {/* Reassurance Strip */}
              <div className="pt-4 border-t border-brand-subdued-border space-y-2.5 text-caption text-brand-subdued-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-brand-purple shrink-0" />
                  <span>256-Bit SSL Encrypted & Verified Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-brand-purple shrink-0" />
                  <span>Dispatched from New Delhi within 24–48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={15} className="text-brand-purple shrink-0" />
                  <span>Complimentary 7-day doorstep exchange assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Bag State */
        <div className="py-12">
          <EmptyState
            title="Your Shopping Bag is Empty"
            description="You currently have no pieces in your shopping bag. Explore our artisanal kurtas, regal sherwanis, and festive sets to begin your order."
            action={
              <div className="flex gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="md" rightIcon={<Sparkles size={14} />}>
                    Explore Full Wardrobe
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="secondary" size="md" leftIcon={<Heart size={14} />}>
                    View Saved Wishlist
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
