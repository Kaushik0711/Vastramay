import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { couponService, cartValidationService, type CartValidationIssue } from '@/services';

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  isDrawerOpen: boolean;

  // Drawer Controls
  openDrawer: () => void;
  closeDrawer: () => void;

  // Item Operations
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;

  // Coupon Operations
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Cart Validation
  revalidateCart: () => { isValid: boolean; issues: CartValidationIssue[] };

  // Calculations (Integer Paise & Customer Rupees)
  itemCount: () => number;
  subtotalPaise: () => number;
  subtotal: () => number;
  discountPaise: () => number;
  discount: () => number;
  shippingPaise: () => number;
  shipping: () => number;
  totalPaise: () => number;
  total: () => number;
}

// Free shipping threshold: ₹1,999 in paise (199,900 paise)
export const FREE_SHIPPING_THRESHOLD_PAISE = 199900;
// Flat standard delivery: ₹250 in paise (25,000 paise)
export const STANDARD_SHIPPING_PAISE = 25000;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (item) =>
        set((state) => {
          // Strictly match on BOTH productId and variantId
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId,
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const current = updated[existingIndex];
            if (current) {
              const maxAllowed = item.maxStock || current.maxStock || 99;
              const newQty = Math.min(current.quantity + item.quantity, maxAllowed);
              updated[existingIndex] = {
                ...current,
                quantity: newQty,
                price: item.price, // ensure authoritative price
                maxStock: maxAllowed,
              };
            }
            return { items: updated, isDrawerOpen: true };
          }

          return { items: [...state.items, item], isDrawerOpen: true };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => {
          // Quantity cannot fall below 1
          if (quantity < 1) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && i.variantId === variantId),
              ),
            };
          }

          return {
            items: state.items.map((i) => {
              if (i.productId === productId && i.variantId === variantId) {
                const max = i.maxStock || 99;
                return { ...i, quantity: Math.min(quantity, max) };
              }
              return i;
            }),
          };
        }),

      clearCart: () => set({ items: [], couponCode: null }),

      applyCoupon: (code) => {
        const subtotalPaise = get().subtotalPaise();
        const result = couponService.validateCoupon(code, subtotalPaise);
        if (result.isValid && result.coupon) {
          set({ couponCode: result.coupon.code });
          return { success: true, message: result.message };
        }
        return { success: false, message: result.message };
      },

      removeCoupon: () => set({ couponCode: null }),

      revalidateCart: () => {
        const report = cartValidationService.validateCart(get().items);
        if (report.issues.length > 0) {
          set({ items: report.validatedItems });
        }
        return { isValid: report.isValid, issues: report.issues };
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalPaise: () =>
        get().items.reduce(
          (sum, i) => sum + Math.round(i.price * 100) * Math.max(1, i.quantity),
          0,
        ),

      subtotal: () => Math.round(get().subtotalPaise() / 100),

      discountPaise: () => {
        const { couponCode } = get();
        if (!couponCode) return 0;
        const subtotalPaise = get().subtotalPaise();
        const result = couponService.validateCoupon(couponCode, subtotalPaise);
        return result.isValid ? result.discountPaise : 0;
      },

      discount: () => Math.round(get().discountPaise() / 100),

      shippingPaise: () => {
        const subtotalPaise = get().subtotalPaise();
        if (subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) {
          return 0; // Free delivery
        }
        return STANDARD_SHIPPING_PAISE;
      },

      shipping: () => Math.round(get().shippingPaise() / 100),

      totalPaise: () => {
        const sub = get().subtotalPaise();
        if (sub === 0) return 0;
        const disc = get().discountPaise();
        const ship = get().shippingPaise();
        return Math.max(0, sub - disc + ship);
      },

      total: () => Math.round(get().totalPaise() / 100),
    }),
    {
      name: 'vastramay-cart',
      // Only persist customer items and promo code, NOT UI drawer state
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
    },
  ),
);

export default useCartStore;
