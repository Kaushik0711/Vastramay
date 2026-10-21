import type { Product } from '@/types';
import { type FilterState, PRICE_TIERS } from '@/components/catalog';

export const catalogService = {
  /**
   * Filter and sort products deterministically based on provided filter state and search query.
   */
  filterAndSort(
    products: Product[],
    filters: FilterState,
    query: string = '',
  ): Product[] {
    const cleanQuery = query.trim().toLowerCase();

    // 1. Filtering
    const filtered = products.filter((product) => {
      // Query filter
      if (cleanQuery) {
        const titleMatch = product.title.toLowerCase().includes(cleanQuery);
        const descMatch = product.description.toLowerCase().includes(cleanQuery);
        const tagMatch = product.tags.some((t) => t.toLowerCase().includes(cleanQuery));
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }

      // Category filter (match categoryId or category slug)
      if (filters.category) {
        const catMatch =
          product.categoryId === filters.category ||
          product.categoryId.replace('cat-', '') === filters.category.replace('cat-', '');
        if (!catMatch) return false;
      }

      // Size filter
      if (filters.size) {
        const hasSize = product.variants.some(
          (v) => v.size.toLowerCase() === filters.size.toLowerCase() && v.isAvailable,
        );
        if (!hasSize) return false;
      }

      // Color filter
      if (filters.color) {
        const hasColor = product.variants.some((v) =>
          v.color.toLowerCase().includes(filters.color.toLowerCase()),
        );
        if (!hasColor) return false;
      }

      // Price tier filter
      if (filters.priceTier) {
        const tier = PRICE_TIERS.find((t) => t.id === filters.priceTier);
        if (tier) {
          if (product.basePrice < tier.min || product.basePrice > tier.max) {
            return false;
          }
        }
      }

      // In stock only filter
      if (filters.inStockOnly) {
        const hasStock = product.variants.some((v) => v.stock > 0 && v.isAvailable);
        if (!hasStock) return false;
      }

      return true;
    });

    // 2. Deterministic Sorting
    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'featured':
        default: {
          const featDiff = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          if (featDiff !== 0) return featDiff;
          return a.title.localeCompare(b.title);
        }
      }
    });
  },
};

export default catalogService;
