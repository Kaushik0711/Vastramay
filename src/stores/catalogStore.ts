import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Category, Collection } from '@/types';
import { PRODUCTS, CATEGORIES, COLLECTIONS } from '@/data/products';

interface CatalogStoreState {
  products: Product[];
  categories: Category[];
  collections: Collection[];

  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateVariantStock: (productId: string, variantId: string, newStock: number) => void;

  // Category Actions
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  // Reset to initial seeds
  resetToDefaults: () => void;
}

export const useCatalogStore = create<CatalogStoreState>()(
  persist(
    (set) => ({
      products: PRODUCTS,
      categories: CATEGORIES,
      collections: COLLECTIONS,

      addProduct: (newProduct) =>
        set((state) => ({
          products: [newProduct, ...state.products.filter((p) => p.id !== newProduct.id)],
        })),

      updateProduct: (productId, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p,
          ),
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),

      updateVariantStock: (productId, variantId, newStock) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId
                  ? {
                      ...v,
                      stock: Math.max(0, newStock),
                      isAvailable: newStock > 0,
                    }
                  : v,
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories.filter((c) => c.id !== category.id), category],
        })),

      updateCategory: (categoryId, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, ...updates } : c,
          ),
        })),

      deleteCategory: (categoryId) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
        })),

      resetToDefaults: () =>
        set({
          products: PRODUCTS,
          categories: CATEGORIES,
          collections: COLLECTIONS,
        }),
    }),
    {
      name: 'vastramay-catalog-state',
    },
  ),
);

export default useCatalogStore;
