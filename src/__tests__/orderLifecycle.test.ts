import { describe, it, expect } from 'vitest';
import { useOrderStore } from '../stores/orderStore';
import type { Order } from '../types';

describe('Order Lifecycle & Tracking', () => {
  it('retrieves seeded orders by order number', () => {
    const order = useOrderStore.getState().getOrderByNumber('RO-2026-89412');
    expect(order).toBeDefined();
    expect(order?.status).toBe('delivered');
    expect(order?.trackingNumber).toBe('BD-883920194IN');
  });

  it('allows guests to look up an order with matching phone or postal code', () => {
    const order = useOrderStore.getState().findOrderForGuest('RO-2026-89412', '9876543210');
    expect(order).toBeDefined();
    expect(order?.shippingAddress.fullName).toBe('Vikramaditya Singhania');
  });

  it('rejects guest lookup with wrong credentials', () => {
    const order = useOrderStore.getState().findOrderForGuest('RO-2026-89412', '9999999999');
    expect(order).toBeUndefined();
  });

  it('creates and tracks a new simulated demo order', () => {
    const newOrder: Order = {
      id: 'ord-test-new-01',
      orderNumber: 'RO-2026-99999',
      customerId: 'guest-cust-test',
      items: [
        {
          productId: 'prod-test',
          variantId: 'var-test',
          title: 'Silk Bandhgala Jacket',
          image: '/images/bandhgala.jpg',
          size: '42',
          color: 'Midnight Indigo',
          price: 12500,
          quantity: 1,
          slug: 'silk-bandhgala-jacket',
        },
      ],
      shippingAddress: {
        id: 'addr-test',
        fullName: 'Aarav Malhotra',
        phone: '9820012345',
        addressLine1: 'Flat 402, Sea Green Apartments',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400005',
        country: 'India',
        isDefault: true,
      },
      billingAddress: {
        id: 'addr-test',
        fullName: 'Aarav Malhotra',
        phone: '9820012345',
        addressLine1: 'Flat 402, Sea Green Apartments',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400005',
        country: 'India',
        isDefault: true,
      },
      subtotal: 12500,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 12500,
      status: 'confirmed',
      payment: {
        status: 'authorized',
        method: 'card',
        transactionId: 'pay_test_sandbox_123',
        amount: 12500,
        currency: 'INR',
        paidAt: new Date().toISOString(),
      },
      accessToken: 'tok_test_sec_99999',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useOrderStore.getState().addOrder(newOrder);

    const fetched = useOrderStore.getState().getOrder('ord-test-new-01');
    expect(fetched).toBeDefined();
    expect(fetched?.status).toBe('confirmed');

    // Progress status to shipped and attach tracking
    useOrderStore.getState().updateOrderTracking('ord-test-new-01', 'DELHIVERY-778899IN', 'Delhivery Express');
    useOrderStore.getState().updateOrderStatus('ord-test-new-01', 'shipped');

    const updated = useOrderStore.getState().getOrder('ord-test-new-01');
    expect(updated?.status).toBe('shipped');
    expect(updated?.trackingNumber).toBe('DELHIVERY-778899IN');
    expect(updated?.carrier).toBe('Delhivery Express');
  });
});
