import { describe, it, expect } from 'vitest';
import { searchService } from '../services/searchService';
import { PRODUCTS, CATEGORIES } from '../data';

describe('Catalog & Search Service', () => {
  it('returns all products when search query is empty', async () => {
    const results = await searchService.search('');
    expect(results.length).toBe(PRODUCTS.length);
  });

  it('matches products by title keyword', async () => {
    const results = await searchService.search('Sherwani');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.title.toLowerCase().includes('sherwani') || p.tags.some((t) => t.toLowerCase().includes('sherwani')))).toBe(true);
  });

  it('filters results by category ID', async () => {
    const sherwaniCategory = CATEGORIES.find((c) => c.slug === 'sherwanis');
    expect(sherwaniCategory).toBeDefined();

    if (sherwaniCategory) {
      const results = await searchService.search('', { categoryId: sherwaniCategory.id });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.categoryId === sherwaniCategory.id)).toBe(true);
    }
  });

  it('filters results by price boundaries', async () => {
    const minPrice = 5000;
    const maxPrice = 20000;
    const results = await searchService.search('', { minPrice, maxPrice });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.basePrice >= minPrice && p.basePrice <= maxPrice)).toBe(true);
  });
});
