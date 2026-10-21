import type { CartItem } from './cart';
import type { Address } from './customer';

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod' | 'wallet';

export interface PaymentState {
  status: PaymentStatus;
  method?: PaymentMethod;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  payment: PaymentState;
  trackingNumber?: string;
  carrier?: string;
  accessToken?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
