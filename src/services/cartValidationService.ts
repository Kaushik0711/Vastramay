import { PRODUCTS } from '@/data';
import type { CartItem } from '@/types';

export interface CartValidationIssue {
  productId: string;
  variantId: string;
  itemTitle: string;
  type: 'out_of_stock' | 'price_changed' | 'quantity_clamped' | 'item_discontinued';
  message: string;
  oldPrice?: number;
  newPrice?: number;
  oldQuantity?: number;
  newQuantity?: number;
}

export interface CartValidationReport {
  isValid: boolean;
  issues: CartValidationIssue[];
  validatedItems: CartItem[];
  subtotalPaise: number;
}

export const cartValidationService = {
  /**
   * Revalidate all line items against current catalog inventory, variant state, and authoritative pricing.
   * Calculations done in integer paise (1 INR = 100 paise).
   */
  validateCart(items: CartItem[]): CartValidationReport {
    const issues: CartValidationIssue[] = [];
    const validatedItems: CartItem[] = [];
    let subtotalPaise = 0;

    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);

      // 1. Check if product exists
      if (!product) {
        issues.push({
          productId: item.productId,
          variantId: item.variantId,
          itemTitle: item.title,
          type: 'item_discontinued',
          message: `"${item.title}" is no longer available in our collection and was removed from your bag.`,
        });
        continue;
      }

      // 2. Check if variant exists
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        issues.push({
          productId: item.productId,
          variantId: item.variantId,
          itemTitle: item.title,
          type: 'item_discontinued',
          message: `Selected variant (${item.color} / ${item.size}) of "${item.title}" is no longer available.`,
        });
        continue;
      }

      // 3. Check availability & stock
      if (!variant.isAvailable || variant.stock <= 0) {
        issues.push({
          productId: item.productId,
          variantId: item.variantId,
          itemTitle: item.title,
          type: 'out_of_stock',
          message: `"${item.title}" (${item.size}) is currently out of stock.`,
        });
        // Still keep in cart with quantity 0 or keep as unavailable indicator
        continue;
      }

      // 4. Quantity clamping against available stock
      let finalQuantity = Math.max(1, item.quantity);
      if (finalQuantity > variant.stock) {
        issues.push({
          productId: item.productId,
          variantId: item.variantId,
          itemTitle: item.title,
          type: 'quantity_clamped',
          oldQuantity: item.quantity,
          newQuantity: variant.stock,
          message: `Quantity for "${item.title}" (${item.size}) was adjusted to ${variant.stock} (available workshop inventory).`,
        });
        finalQuantity = variant.stock;
      }

      // 5. Price verification
      const authoritativePrice = variant.price;
      if (item.price !== authoritativePrice) {
        issues.push({
          productId: item.productId,
          variantId: item.variantId,
          itemTitle: item.title,
          type: 'price_changed',
          oldPrice: item.price,
          newPrice: authoritativePrice,
          message: `Price for "${item.title}" updated to reflect current seasonal pricing.`,
        });
      }

      const itemPricePaise = Math.round(authoritativePrice * 100);
      subtotalPaise += itemPricePaise * finalQuantity;

      validatedItems.push({
        ...item,
        title: product.title,
        price: authoritativePrice,
        compareAtPrice: variant.compareAtPrice,
        image: product.images[0]?.url || item.image,
        quantity: finalQuantity,
        slug: product.slug,
      });
    }

    return {
      isValid: issues.length === 0,
      issues,
      validatedItems,
      subtotalPaise,
    };
  },
};

export default cartValidationService;
