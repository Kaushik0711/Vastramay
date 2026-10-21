import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore, FREE_SHIPPING_THRESHOLD_PAISE, STANDARD_SHIPPING_PAISE } from '../stores/cartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().removeCoupon();
  });

  it('initializes with an empty cart and closed drawer', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.itemCount()).toBe(0);
    expect(state.subtotalPaise()).toBe(0);
    expect(state.isDrawerOpen).toBe(false);
  });

  it('adds an item and opens the mini-cart drawer', () => {
    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-m',
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000, // ₹45,000 in Rupees
      size: 'M',
      color: 'Royal Plum',
      quantity: 1,
      image: '/images/sherwani.jpg',
      maxStock: 5,
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0]?.quantity).toBe(1);
    expect(state.itemCount()).toBe(1);
    expect(state.subtotalPaise()).toBe(4500000);
    expect(state.subtotal()).toBe(45000);
    expect(state.isDrawerOpen).toBe(true);
  });

  it('does NOT merge items with different variants', () => {
    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-m',
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000,
      size: 'M',
      color: 'Royal Plum',
      quantity: 1,
      image: '/images/sherwani.jpg',
      maxStock: 5,
    });

    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-l', // Different size/variant
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000,
      size: 'L',
      color: 'Royal Plum',
      quantity: 1,
      image: '/images/sherwani.jpg',
      maxStock: 5,
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(2);
    expect(state.itemCount()).toBe(2);
    expect(state.items[0]?.size).toBe('M');
    expect(state.items[1]?.size).toBe('L');
  });

  it('caps quantity at maxStock when adding duplicate variant', () => {
    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-m',
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000,
      size: 'M',
      color: 'Royal Plum',
      quantity: 2,
      image: '/images/sherwani.jpg',
      maxStock: 3,
    });

    // Attempt to add 2 more when maxStock is 3
    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-m',
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000,
      size: 'M',
      color: 'Royal Plum',
      quantity: 2,
      image: '/images/sherwani.jpg',
      maxStock: 3,
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0]?.quantity).toBe(3); // Capped at maxStock
  });

  it('computes free shipping when cart exceeds threshold', () => {
    // Add item below free shipping threshold (₹1,999 = 199,900 paise)
    useCartStore.getState().addItem({
      productId: 'prod-low',
      variantId: 'var-low',
      title: 'Silk Pocket Square',
      slug: 'silk-pocket-square',
      price: 1500, // ₹1,500 = 150,000 paise
      size: 'One Size',
      color: 'Purple',
      quantity: 1,
      image: '/images/square.jpg',
    });

    let state = useCartStore.getState();
    expect(state.subtotalPaise()).toBeLessThan(FREE_SHIPPING_THRESHOLD_PAISE);
    expect(state.shippingPaise()).toBe(STANDARD_SHIPPING_PAISE);

    // Add item exceeding threshold
    useCartStore.getState().addItem({
      productId: 'prod-high',
      variantId: 'var-high',
      title: 'Kurta',
      slug: 'kurta',
      price: 5000, // ₹5,000 = 500,000 paise
      size: 'M',
      color: 'Plum',
      quantity: 1,
      image: '/images/kurta.jpg',
    });

    state = useCartStore.getState();
    expect(state.subtotalPaise()).toBeGreaterThan(FREE_SHIPPING_THRESHOLD_PAISE);
    expect(state.shippingPaise()).toBe(0); // Free shipping
    expect(state.shipping()).toBe(0);
  });

  it('removes item properly', () => {
    useCartStore.getState().addItem({
      productId: 'prod-1',
      variantId: 'var-1-m',
      title: 'Silk Sherwani',
      slug: 'silk-sherwani',
      price: 45000,
      size: 'M',
      color: 'Royal Plum',
      quantity: 1,
      image: '/images/sherwani.jpg',
    });

    useCartStore.getState().removeItem('prod-1', 'var-1-m');
    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
    expect(state.itemCount()).toBe(0);
  });
});
