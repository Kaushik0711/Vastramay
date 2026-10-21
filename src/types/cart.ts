// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  slug?: string;
  maxStock?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}
