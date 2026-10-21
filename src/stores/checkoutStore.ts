import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaymentMethod } from '@/types';

export interface CheckoutContact {
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutState {
  // Step tracker
  step: 'information' | 'shipping' | 'payment';

  // Contact & Delivery
  contact: CheckoutContact;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  sameAsShipping: boolean;

  // Shipping & Payment selection
  shippingMethodId: string;
  paymentMethod: PaymentMethod;

  // Sandbox simulation controls
  sandboxMode: boolean;
  sandboxOutcome: 'success' | 'failure';

  // Idempotency token to guard against duplicate payment submissions
  idempotencyKey: string;

  // Setters
  setStep: (step: 'information' | 'shipping' | 'payment') => void;
  setContact: (contact: Partial<CheckoutContact>) => void;
  setShippingAddress: (address: Partial<CheckoutAddress>) => void;
  setBillingAddress: (address: Partial<CheckoutAddress>) => void;
  setSameAsShipping: (same: boolean) => void;
  setShippingMethodId: (id: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSandboxOutcome: (outcome: 'success' | 'failure') => void;
  regenerateIdempotencyKey: () => void;
  resetCheckout: () => void;
}

const generateIdempotencyKey = () =>
  `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const initialAddress: CheckoutAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Delhi (NCT)',
  postalCode: '',
  country: 'India',
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 'information',
      contact: {
        email: '',
        phone: '',
      },
      shippingAddress: { ...initialAddress },
      billingAddress: { ...initialAddress },
      sameAsShipping: true,
      shippingMethodId: 'standard',
      paymentMethod: 'upi',
      sandboxMode: true, // Non-production sandbox environment
      sandboxOutcome: 'success',
      idempotencyKey: generateIdempotencyKey(),

      setStep: (step) => set({ step }),

      setContact: (contact) =>
        set((state) => ({
          contact: { ...state.contact, ...contact },
        })),

      setShippingAddress: (address) =>
        set((state) => {
          const updatedShipping = { ...state.shippingAddress, ...address };
          return {
            shippingAddress: updatedShipping,
            billingAddress: state.sameAsShipping ? updatedShipping : state.billingAddress,
          };
        }),

      setBillingAddress: (address) =>
        set((state) => ({
          billingAddress: { ...state.billingAddress, ...address },
        })),

      setSameAsShipping: (sameAsShipping) =>
        set((state) => ({
          sameAsShipping,
          billingAddress: sameAsShipping ? { ...state.shippingAddress } : state.billingAddress,
        })),

      setShippingMethodId: (shippingMethodId) => set({ shippingMethodId }),

      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      setSandboxOutcome: (sandboxOutcome) => set({ sandboxOutcome }),

      regenerateIdempotencyKey: () => set({ idempotencyKey: generateIdempotencyKey() }),

      resetCheckout: () =>
        set({
          step: 'information',
          contact: { email: '', phone: '' },
          shippingAddress: { ...initialAddress },
          billingAddress: { ...initialAddress },
          sameAsShipping: true,
          shippingMethodId: 'standard',
          paymentMethod: 'upi',
          sandboxOutcome: 'success',
          idempotencyKey: generateIdempotencyKey(),
        }),
    }),
    {
      name: 'vastramay-checkout-session',
    },
  ),
);

export default useCheckoutStore;
