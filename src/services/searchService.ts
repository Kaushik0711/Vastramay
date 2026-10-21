import { PRODUCTS } from '@/data';
import type { Product } from '@/types';

const RECENT_SEARCHES_KEY = 'vastramay-recent-searches';
const MAX_RECENT_SEARCHES = 6;

export const POPULAR_SEARCH_TERMS = [
  'Raw Silk',
  'Sherwani',
  'Angrakha Kurta',
  'Nehru Jacket',
  'Banarasi Brocade',
  'Pashmina Stole',
];

export interface SearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export const searchService = {
  /**
   * Search catalog products by text query with optional filters.
   */
  async search(query: string, filters?: SearchFilters): Promise<Product[]> {
    // Simulate slight asynchronous processing (50ms) to mirror real-world search behaviour
    await new Promise((resolve) => setTimeout(resolve, 50));

    const cleanQuery = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      // If query is provided, check title, description, tags
      if (cleanQuery) {
        const titleMatch = product.title.toLowerCase().includes(cleanQuery);
        const descMatch = product.description.toLowerCase().includes(cleanQuery);
        const tagsMatch = product.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));

        if (!titleMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      // Filter by category
      if (filters?.categoryId && product.categoryId !== filters.categoryId) {
        return false;
      }

      // Filter by price
      if (filters?.minPrice !== undefined && product.basePrice < filters.minPrice) {
        return false;
      }
      if (filters?.maxPrice !== undefined && product.basePrice > filters.maxPrice) {
        return false;
      }

      // Filter by tags
      if (filters?.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((t) => product.tags.includes(t));
        if (!hasTag) return false;
      }

      return true;
    });
  },

  /**
   * Retrieve recent search terms from localStorage.
   */
  getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Save a search term to recent searches.
   */
  saveRecentSearch(term: string): void {
    const clean = term.trim();
    if (!clean) return;

    try {
      const current = this.getRecentSearches();
      const filtered = current.filter((t) => t.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable or disabled
    }
  },

  /**
   * Clear all recent search terms.
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  },
};
