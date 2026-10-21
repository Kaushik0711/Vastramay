import React from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from '@/data';
import { Checkbox, Button } from '@/components/ui';

import {
  type FilterState,
  PRICE_TIERS,
  AVAILABLE_SIZES,
  AVAILABLE_COLORS,
} from './types';

export interface CatalogFiltersProps {
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  onReset: () => void;
  hideCategoryFilter?: boolean;
  className?: string;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onChange,
  onReset,
  hideCategoryFilter = false,
  className = '',
}) => {
  const handleCategoryToggle = (catId: string) => {
    onChange({
      ...filters,
      category: filters.category === catId ? '' : catId,
    });
  };

  const handleSizeToggle = (size: string) => {
    onChange({
      ...filters,
      size: filters.size === size ? '' : size,
    });
  };

  const handleColorToggle = (colorName: string) => {
    onChange({
      ...filters,
      color: filters.color === colorName ? '' : colorName,
    });
  };

  const handlePriceTierToggle = (tierId: string) => {
    onChange({
      ...filters,
      priceTier: filters.priceTier === tierId ? '' : tierId,
    });
  };

  const hasActiveFilters = Boolean(
    (!hideCategoryFilter && filters.category) ||
      filters.size ||
      filters.color ||
      filters.priceTier ||
      filters.inStockOnly,
  );

  return (
    <div className={`space-y-8 font-body text-left ${className}`.trim()}>
      {/* Active Filter Chips / Reset */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-brand-subdued-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label uppercase tracking-widest text-brand-subdued-medium font-semibold">
              Active Filters
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-caption text-brand-purple hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {!hideCategoryFilter && filters.category && (
              <span className="inline-flex items-center gap-1 bg-brand-subdued-surface border border-brand-subdued-border px-2 py-0.5 text-xs">
                {CATEGORIES.find((c) => c.id === filters.category || c.slug === filters.category)?.name || filters.category}
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, category: '' })}
                  aria-label="Remove category filter"
                  className="hover:text-brand-purple"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.size && (
              <span className="inline-flex items-center gap-1 bg-brand-subdued-surface border border-brand-subdued-border px-2 py-0.5 text-xs">
                Size: {filters.size}
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, size: '' })}
                  aria-label="Remove size filter"
                  className="hover:text-brand-purple"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center gap-1 bg-brand-subdued-surface border border-brand-subdued-border px-2 py-0.5 text-xs">
                Color: {filters.color}
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, color: '' })}
                  aria-label="Remove color filter"
                  className="hover:text-brand-purple"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.priceTier && (
              <span className="inline-flex items-center gap-1 bg-brand-subdued-surface border border-brand-subdued-border px-2 py-0.5 text-xs">
                {PRICE_TIERS.find((p) => p.id === filters.priceTier)?.label || filters.priceTier}
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, priceTier: '' })}
                  aria-label="Remove price filter"
                  className="hover:text-brand-purple"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-brand-subdued-surface border border-brand-subdued-border px-2 py-0.5 text-xs">
                In Stock Only
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, inStockOnly: false })}
                  aria-label="Remove in stock filter"
                  className="hover:text-brand-purple"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 1. Category Filter */}
      {!hideCategoryFilter && (
        <div>
          <h3 className="text-label uppercase tracking-widest text-brand-black mb-3 font-semibold">
            Garment Category
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.id || filters.category === cat.slug;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`w-full flex items-center justify-between text-body-sm py-1 transition-colors text-left ${
                      isSelected
                        ? 'text-brand-purple font-semibold'
                        : 'text-brand-subdued-high hover:text-brand-black'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check size={14} className="text-brand-purple" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 2. Size Filter */}
      <div className="pt-4 border-t border-brand-subdued-border">
        <h3 className="text-label uppercase tracking-widest text-brand-black mb-3 font-semibold">
          Size
        </h3>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.size === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`py-2 px-1 text-center text-xs font-medium uppercase tracking-wider rounded-none border transition-colors ${
                  isSelected
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'bg-white text-brand-black border-brand-subdued-border hover:border-brand-black'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Color Palette Filter */}
      <div className="pt-4 border-t border-brand-subdued-border">
        <h3 className="text-label uppercase tracking-widest text-brand-black mb-3 font-semibold">
          Color Family
        </h3>
        <div className="space-y-2">
          {AVAILABLE_COLORS.map((c) => {
            const isSelected = filters.color === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorToggle(c.name)}
                className="w-full flex items-center justify-between py-1 text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-none border border-brand-subdued-border shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span
                    className={`text-body-sm ${
                      isSelected
                        ? 'text-brand-purple font-semibold'
                        : 'text-brand-subdued-high group-hover:text-brand-black'
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
                {isSelected && <Check size={14} className="text-brand-purple" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Tier Filter */}
      <div className="pt-4 border-t border-brand-subdued-border">
        <h3 className="text-label uppercase tracking-widest text-brand-black mb-3 font-semibold">
          Price Range
        </h3>
        <div className="space-y-2">
          {PRICE_TIERS.map((tier) => {
            const isSelected = filters.priceTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handlePriceTierToggle(tier.id)}
                className={`w-full flex items-center justify-between text-body-sm py-1 transition-colors text-left ${
                  isSelected
                    ? 'text-brand-purple font-semibold'
                    : 'text-brand-subdued-high hover:text-brand-black'
                }`}
              >
                <span>{tier.label}</span>
                {isSelected && <Check size={14} className="text-brand-purple" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. In Stock Checkbox */}
      <div className="pt-4 border-t border-brand-subdued-border">
        <Checkbox
          label="In Stock Only"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
        />
      </div>

      {/* Reset Action */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" fullWidth onClick={onReset}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogFilters;
