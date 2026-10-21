import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, PaymentStatus } from '@/types';

interface OrderStoreState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string, carrier?: string) => void;
  getOrder: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  findOrderForGuest: (orderNumber: string, emailOrPhone: string) => Order | undefined;
}

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-seed-01',
    orderNumber: 'RO-2026-89412',
    customerId: 'guest-cust-01',
    items: [
      {
        productId: 'prod-1',
        variantId: 'var-1-m',
        title: 'Raw Silk Angrakha Kurta Set',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        color: 'Plum Purple',
        price: 5999,
        compareAtPrice: 7999,
        quantity: 1,
        slug: 'raw-silk-angrakha-kurta-plum',
      },
    ],
    shippingAddress: {
      id: 'addr-seed-1',
      fullName: 'Vikramaditya Singhania',
      phone: '9876543210',
      addressLine1: 'Villa 14, The Magnolias',
      addressLine2: 'Golf Course Road, Sector 42',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-seed-1',
      fullName: 'Vikramaditya Singhania',
      phone: '9876543210',
      addressLine1: 'Villa 14, The Magnolias',
      addressLine2: 'Golf Course Road, Sector 42',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
      isDefault: true,
    },
    subtotal: 5999,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 5999,
    status: 'delivered',
    payment: {
      status: 'captured',
      method: 'upi',
      transactionId: 'pay_rzp_mock_89412_test',
      amount: 5999,
      currency: 'INR',
      paidAt: '2026-10-12T14:32:00Z',
    },
    trackingNumber: 'BD-883920194IN',
    carrier: 'Blue Dart Express Luxury',
    accessToken: 'tok_sec_seed89412_alpha',
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-15T11:45:00Z',
  },
  {
    id: 'ord-seed-02',
    orderNumber: 'RO-2026-90214',
    customerId: 'guest-cust-02',
    items: [
      {
        productId: 'prod-2',
        variantId: 'var-2-40',
        title: 'Chanderi Silk Embroidered Sherwani',
        image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
        size: '40',
        color: 'Noir Black',
        price: 18499,
        compareAtPrice: 22999,
        quantity: 1,
        slug: 'chanderi-silk-embroidered-sherwani-noir',
      },
    ],
    shippingAddress: {
      id: 'addr-seed-2',
      fullName: 'Devrath Roy',
      phone: '9811122233',
      addressLine1: '12B, Alipore Park Place',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700027',
      country: 'India',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-seed-2',
      fullName: 'Devrath Roy',
      phone: '9811122233',
      addressLine1: '12B, Alipore Park Place',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700027',
      country: 'India',
      isDefault: true,
    },
    subtotal: 18499,
    discount: 1000,
    shipping: 0,
    tax: 0,
    total: 17499,
    couponCode: 'ROSE1000',
    status: 'processing',
    payment: {
      status: 'captured',
      method: 'card',
      transactionId: 'pay_rzp_mock_90214_test',
      amount: 17499,
      currency: 'INR',
      paidAt: '2026-10-19T09:12:00Z',
    },
    trackingNumber: 'DELH-44910291',
    carrier: 'Delhivery Surface Premium',
    accessToken: 'tok_sec_seed90214_beta',
    createdAt: '2026-10-19T09:10:00Z',
    updatedAt: '2026-10-19T09:15:00Z',
  },
];

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      addOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders.filter((o) => o.id !== newOrder.id)],
        })),

      updateOrderStatus: (orderId, status, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  payment: paymentStatus ? { ...o.payment, status: paymentStatus } : o.payment,
                  updatedAt: new Date().toISOString(),
                }
              : o,
          ),
        })),

      updateOrderTracking: (orderId, trackingNumber, carrier = 'Blue Dart Express Luxury') =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  trackingNumber,
                  carrier,
                  updatedAt: new Date().toISOString(),
                }
              : o,
          ),
        })),

      getOrder: (orderId) => get().orders.find((o) => o.id === orderId),

      getOrderByNumber: (orderNumber) =>
        get().orders.find(
          (o) => o.orderNumber.trim().toUpperCase() === orderNumber.trim().toUpperCase(),
        ),

      findOrderForGuest: (orderNumber, emailOrPhone) => {
        const cleanNumber = orderNumber.trim().toUpperCase();
        const cleanLookup = emailOrPhone.trim().toLowerCase();

        return get().orders.find((o) => {
          const numberMatches = o.orderNumber.toUpperCase() === cleanNumber;
          if (!numberMatches) return false;

          // Check if phone or email matches
          const cleanPhone = cleanLookup.replace(/\D/g, '');
          const phoneMatches = cleanPhone.length >= 4 && o.shippingAddress.phone.replace(/\D/g, '').includes(cleanPhone);
          const emailMatches = cleanLookup.includes('@') && (o.customerId.toLowerCase().includes(cleanLookup) || Boolean(o.notes?.toLowerCase().includes(cleanLookup)));
          return Boolean(phoneMatches || emailMatches);
        });
      },
    }),
    {
      name: 'vastramay-orders',
    },
  ),
);

export default useOrderStore;
