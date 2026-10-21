import type { CartItem, Order, PaymentMethod, Address } from '@/types';
import { SHIPPING_METHODS } from '@/config';
import { couponService, cartValidationService, paymentService } from '@/services';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import type { CheckoutContact, CheckoutAddress } from '@/stores/checkoutStore';

export interface CreateOrderParams {
  items: CartItem[];
  contact: CheckoutContact;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingMethodId: string;
  couponCode: string | null;
  paymentMethod: PaymentMethod;
  sandboxOutcome: 'success' | 'failure';
  idempotencyKey: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  orderId?: string;
  error?: string;
  isDuplicate?: boolean;
}

// Track recent processed idempotency keys to prevent duplicate clicks
const processedIdempotencyKeys = new Set<string>();

export const orderService = {
  /**
   * Authoritative order creation with server-side validation, safe integer paise calculations,
   * idempotency prevention, and simulated sandbox payment execution.
   */
  async submitOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    // 1. Idempotency guard: prevent duplicate submission on double clicks
    if (processedIdempotencyKeys.has(params.idempotencyKey)) {
      return {
        success: false,
        error: 'A transaction with this reference is already being processed. Please wait.',
        isDuplicate: true,
      };
    }
    processedIdempotencyKeys.add(params.idempotencyKey);

    // 2. Revalidate all items, variants, and stock
    const validationReport = cartValidationService.validateCart(params.items);
    if (!validationReport.isValid && validationReport.validatedItems.length === 0) {
      processedIdempotencyKeys.delete(params.idempotencyKey);
      return {
        success: false,
        error: 'Your bag contains unavailable or out-of-stock items. Please review your cart.',
      };
    }

    const subtotalPaise = validationReport.subtotalPaise;

    // 3. Re-verify coupon discount
    let discountPaise = 0;
    if (params.couponCode) {
      const couponResult = couponService.validateCoupon(params.couponCode, subtotalPaise);
      if (couponResult.isValid) {
        discountPaise = couponResult.discountPaise;
      }
    }

    // 4. Calculate authoritative shipping method charge
    const selectedMethod =
      SHIPPING_METHODS.find((m) => m.id === params.shippingMethodId) || SHIPPING_METHODS[0]!;

    let shippingPaise = selectedMethod.pricePaise;
    if (selectedMethod.freeAbovePaise && subtotalPaise >= selectedMethod.freeAbovePaise) {
      shippingPaise = 0;
    }

    // 5. Total calculation in integer paise
    const totalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);
    const totalRupees = Math.round(totalPaise / 100);

    // 6. Generate order identifiers
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `RO-2026-${randomDigits}`;
    const orderId = `ord_${Date.now()}_${randomDigits}`;
    const accessToken = `tok_sec_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const shippingAddr: Address = {
      id: `addr_ship_${Date.now()}`,
      fullName: params.shippingAddress.fullName,
      phone: params.shippingAddress.phone,
      addressLine1: params.shippingAddress.addressLine1,
      addressLine2: params.shippingAddress.addressLine2,
      city: params.shippingAddress.city,
      state: params.shippingAddress.state,
      postalCode: params.shippingAddress.postalCode,
      country: params.shippingAddress.country,
      isDefault: true,
    };

    const billingAddr: Address = {
      id: `addr_bill_${Date.now()}`,
      fullName: params.billingAddress.fullName,
      phone: params.billingAddress.phone,
      addressLine1: params.billingAddress.addressLine1,
      addressLine2: params.billingAddress.addressLine2,
      city: params.billingAddress.city,
      state: params.billingAddress.state,
      postalCode: params.billingAddress.postalCode,
      country: params.billingAddress.country,
      isDefault: true,
    };

    // 7. Execute payment via payment adapter
    const paymentResult = await paymentService.processSandboxPayment({
      amountPaise: totalPaise,
      orderReference: orderNumber,
      customerEmail: params.contact.email,
      customerPhone: params.contact.phone,
      outcome: params.sandboxOutcome,
      paymentMethod: params.paymentMethod,
    });

    const nowIso = new Date().toISOString();

    const createdOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: params.contact.email,
      items: validationReport.validatedItems,
      shippingAddress: shippingAddr,
      billingAddress: billingAddr,
      subtotal: Math.round(subtotalPaise / 100),
      discount: Math.round(discountPaise / 100),
      shipping: Math.round(shippingPaise / 100),
      tax: 0, // Inclusive of taxes
      total: totalRupees,
      couponCode: params.couponCode || undefined,
      status: paymentResult.success ? 'confirmed' : 'pending',
      payment: {
        status: paymentResult.success ? 'captured' : 'failed',
        method: params.paymentMethod,
        transactionId: paymentResult.transactionId,
        amount: totalRupees,
        currency: 'INR',
        paidAt: paymentResult.success ? nowIso : undefined,
      },
      trackingNumber: paymentResult.success ? `DELH-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      carrier: 'Delhivery Surface Premium Express',
      accessToken,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 8. Persist order in order store
    useOrderStore.getState().addOrder(createdOrder);

    // 9. Handle outcome
    if (paymentResult.success) {
      // Clear shopping bag only when payment succeeds
      useCartStore.getState().clearCart();
      return { success: true, order: createdOrder, orderId };
    }

    return {
      success: false,
      orderId,
      error: paymentResult.errorMessage || 'Payment failed during processing.',
    };
  },
};

export default orderService;
