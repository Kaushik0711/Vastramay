// ─── Customer & Authentication Types ──────────────────────────────────────────

export type UserRole = 'customer' | 'staff' | 'admin';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  wishlistProductIds?: string[];
  preferredSize?: string;
  newsletterSubscribed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  // Alias for backward compatibility
}
