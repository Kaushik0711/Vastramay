// ─── Product ────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  collectionIds: string[];
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
}

// ─── Collection ─────────────────────────────────────────────────────────────

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  productIds: string[];
  isFeatured: boolean;
}
