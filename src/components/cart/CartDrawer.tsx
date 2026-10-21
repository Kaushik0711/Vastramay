import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Truck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCartStore, FREE_SHIPPING_THRESHOLD_PAISE } from '@/stores';
import { SideDrawer, Button, PriceDisplay } from '@/components/ui';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    subtotalPaise,
  } = useCartStore();

  const count = itemCount();
  const currentSubtotal = subtotal();
  const currentSubtotalPaise = subtotalPaise();

  // Free shipping calculations (Threshold: ₹1,999)
  const isFreeShipping = currentSubtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const remainingForFreeShipping = Math.max(
    0,
    Math.round((FREE_SHIPPING_THRESHOLD_PAISE - currentSubtotalPaise) / 100),
  );
  const progressPercent = Math.min(
    100,
    Math.round((currentSubtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100),
  );

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewBag = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <SideDrawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      position="right"
      size="md"
      title={
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-brand-purple" />
          <span>Shopping Bag</span>
          <span className="text-body-sm font-mono text-brand-subdued-medium">
            ({count})
          </span>
        </div>
      }
      footer={
        items.length > 0 ? (
          <div className="space-y-4">
            {/* Subtotal row */}
            <div className="flex items-center justify-between text-body-base">
              <span className="font-medium text-brand-black">Estimated Subtotal</span>
              <span className="font-semibold text-brand-black">
                ₹{currentSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-brand-subdued-low leading-relaxed">
              Taxes and final shipping calculated at checkout. Express atelier dispatch within 24–48 hours.
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                rightIcon={<ArrowRight size={16} />}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleViewBag}
              >
                View Full Bag
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      <div className="flex flex-col h-full -mx-2">
        {/* 1. Free Shipping Progress Ticker */}
        {items.length > 0 && (
          <div className="mb-6 p-3 bg-brand-subdued-surface border border-brand-subdued-border">
            <div className="flex items-center gap-2 text-caption mb-1.5 font-medium">
              <Truck size={14} className="text-brand-purple shrink-0" />
              {isFreeShipping ? (
                <span className="text-brand-purple font-semibold">
                  You have unlocked Complimentary Express Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-brand-black">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for Complimentary Delivery
                </span>
              )}
            </div>
            <div className="w-full h-1 bg-brand-subdued-border overflow-hidden">
              <div
                className="h-full bg-brand-purple transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* 2. Items List / AnimatePresence */}
        {items.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 p-3 border border-brand-subdued-border bg-white"
                >
                  {/* Thumbnail (3:4 ratio) */}
                  <Link
                    to={item.slug ? `/products/${item.slug}` : `/shop`}
                    onClick={closeDrawer}
                    className="w-20 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden block"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={item.slug ? `/products/${item.slug}` : `/shop`}
                          onClick={closeDrawer}
                          className="text-body-sm font-medium text-brand-black hover:text-brand-purple transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          aria-label={`Remove ${item.title} from bag`}
                          className="text-brand-subdued-low hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <p className="text-caption text-brand-subdued-medium mt-0.5">
                        {item.color} · Size: <span className="font-semibold text-brand-black">{item.size}</span>
                      </p>

                      <div className="mt-1">
                        <PriceDisplay
                          price={item.price}
                          compareAtPrice={item.compareAtPrice}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-subdued-border">
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
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-brand-gray-100 transition-colors text-brand-black"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-medium">
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
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center hover:bg-brand-gray-100 transition-colors text-brand-black"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-caption font-semibold text-brand-black">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 border border-brand-subdued-border flex items-center justify-center bg-brand-subdued-surface">
              <ShoppingBag size={28} className="text-brand-subdued-medium" />
            </div>
            <div>
              <h3 className="font-display text-xl text-brand-black">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-caption text-brand-subdued-medium mt-1 max-w-xs">
                Explore our artisanal kurtas, regal sherwanis, and festive sets to begin your order.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                closeDrawer();
                navigate('/shop');
              }}
              rightIcon={<Sparkles size={14} />}
            >
              Explore Collection
            </Button>
          </div>
        )}
      </div>
    </SideDrawer>
  );
};

export default CartDrawer;
