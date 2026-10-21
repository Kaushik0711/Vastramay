import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address } from '@/types';
import { useWishlistStore } from './wishlistStore';
import { useCartStore } from './cartStore';

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];

  // Auth Operations
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;

  // Profile Operations
  updateProfile: (profile: Partial<User>) => void;

  // Address Operations
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

const SEED_USERS: User[] = [
  {
    id: 'usr-cust-01',
    email: 'aditya@vastramay.in',
    firstName: 'Aditya',
    lastName: 'Vardhan',
    phone: '9876543210',
    role: 'customer',
    preferredSize: 'M',
    newsletterSubscribed: true,
    addresses: [
      {
        id: 'addr-aditya-1',
        fullName: 'Aditya Vardhan',
        phone: '9876543210',
        addressLine1: 'Flat 402, Royal Palms, Golf Course Road',
        addressLine2: 'DLF Phase 5',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
        isDefault: true,
      },
    ],
    wishlistProductIds: ['prod-1', 'prod-2'],
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
  },
  {
    id: 'usr-admin-01',
    email: 'admin@vastramay.in',
    firstName: 'Royal Atelier',
    lastName: 'Director',
    phone: '9811100000',
    role: 'admin',
    preferredSize: '40',
    newsletterSubscribed: false,
    addresses: [],
    wishlistProductIds: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-20T00:00:00Z',
  },
];

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: SEED_USERS,

      login: async (email, password = '') => {
        // Simulate network handshake (200ms)
        await new Promise((r) => setTimeout(r, 200));

        const cleanEmail = email.trim().toLowerCase();
        const found = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail,
        );

        // Demo credential validation
        if (cleanEmail === 'admin@vastramay.in' && password && password !== 'admin123') {
          return { success: false, error: 'Invalid password. (Demo admin password is "admin123")' };
        }

        if (cleanEmail === 'aditya@vastramay.in' && password && password !== 'password123') {
          return { success: false, error: 'Invalid password. (Demo customer password is "password123")' };
        }

        // If user exists in registry
        let targetUser = found;
        if (!targetUser) {
          // If first-time demo login with any email, auto-create customer account
          targetUser = {
            id: `usr_${Date.now()}`,
            email: cleanEmail,
            firstName: cleanEmail.split('@')[0]?.replace(/[._]/g, ' ') || 'Patron',
            lastName: '',
            role: 'customer',
            addresses: [],
            wishlistProductIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((s) => ({ registeredUsers: [...s.registeredUsers, targetUser!] }));
        }

        // 1. Wishlist Sync on Login (merge guest wishlist with user's saved wishlist)
        const guestWishlistIds = useWishlistStore.getState().productIds;
        const mergedWishlist = Array.from(
          new Set([...(targetUser.wishlistProductIds || []), ...guestWishlistIds]),
        );
        targetUser.wishlistProductIds = mergedWishlist;
        mergedWishlist.forEach((id) => useWishlistStore.getState().add(id));

        // 2. Guest-cart merge & revalidation
        useCartStore.getState().revalidateCart();

        set({
          user: targetUser,
          isAuthenticated: true,
        });

        return { success: true };
      },

      register: async (data) => {
        await new Promise((r) => setTimeout(r, 200));
        const cleanEmail = data.email.trim().toLowerCase();

        const exists = get().registeredUsers.some(
          (u) => u.email.toLowerCase() === cleanEmail,
        );

        if (exists) {
          return { success: false, error: 'An account with this email address already exists. Please sign in.' };
        }

        const now = new Date().toISOString();
        const newUser: User = {
          id: `usr_${Date.now()}`,
          email: cleanEmail,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone?.trim(),
          role: 'customer',
          addresses: [],
          wishlistProductIds: useWishlistStore.getState().productIds,
          createdAt: now,
          updatedAt: now,
        };

        set((s) => ({
          registeredUsers: [...s.registeredUsers, newUser],
          user: newUser,
          isAuthenticated: true,
        }));

        // Revalidate cart after register
        useCartStore.getState().revalidateCart();

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      forgotPassword: async (email) => {
        await new Promise((r) => setTimeout(r, 300));
        const cleanEmail = email.trim().toLowerCase();
        return {
          success: true,
          message: `If an account exists for ${cleanEmail}, password reset instructions have been dispatched.`,
        };
      },

      updateProfile: (profileUpdates) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = {
            ...state.user,
            ...profileUpdates,
            updatedAt: new Date().toISOString(),
          };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updatedUser.id ? updatedUser : u,
            ),
          };
        }),

      addAddress: (addressData) =>
        set((state) => {
          if (!state.user) return state;
          const newAddress: Address = {
            ...addressData,
            id: `addr_${Date.now()}`,
            isDefault: state.user.addresses.length === 0 ? true : addressData.isDefault,
          };

          const updatedAddresses = newAddress.isDefault
            ? [...state.user.addresses.map((a: Address) => ({ ...a, isDefault: false })), newAddress]
            : [...state.user.addresses, newAddress];

          const updatedUser = { ...state.user, addresses: updatedAddresses };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updatedUser.id ? updatedUser : u,
            ),
          };
        }),

      updateAddress: (addressId, addressUpdates) =>
        set((state) => {
          if (!state.user) return state;
          const updatedAddresses = state.user.addresses.map((a: Address) => {
            if (a.id === addressId) {
              return { ...a, ...addressUpdates };
            }
            if (addressUpdates.isDefault) {
              return { ...a, isDefault: false };
            }
            return a;
          });

          const updatedUser = { ...state.user, addresses: updatedAddresses };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updatedUser.id ? updatedUser : u,
            ),
          };
        }),

      deleteAddress: (addressId) =>
        set((state) => {
          if (!state.user) return state;
          const filtered = state.user.addresses.filter((a: Address) => a.id !== addressId);
          // If deleted default and others exist, make first default
          if (filtered.length > 0 && !filtered.some((a: Address) => a.isDefault)) {
            filtered[0]!.isDefault = true;
          }
          const updatedUser = { ...state.user, addresses: filtered };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updatedUser.id ? updatedUser : u,
            ),
          };
        }),

      setDefaultAddress: (addressId) =>
        set((state) => {
          if (!state.user) return state;
          const updatedAddresses = state.user.addresses.map((a: Address) => ({
            ...a,
            isDefault: a.id === addressId,
          }));
          const updatedUser = { ...state.user, addresses: updatedAddresses };
          return {
            user: updatedUser,
            registeredUsers: state.registeredUsers.map((u) =>
              u.id === updatedUser.id ? updatedUser : u,
            ),
          };
        }),
    }),
    {
      name: 'vastramay-auth-session',
    },
  ),
);

export default useAuthStore;
