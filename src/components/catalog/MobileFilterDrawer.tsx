import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SideDrawer, Button, Badge } from '@/components/ui';
import CatalogFilters from './CatalogFilters';
import type { FilterState } from './types';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  hideCategoryFilter?: boolean;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  hideCategoryFilter = false,
}) => {
  // Maintain draft filters while drawer is open
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Synchronize draft filters when drawer opens per React compiler best practice
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setDraftFilters(filters);
    }
  }

  const activeCount = [
    (!hideCategoryFilter && draftFilters.category) ? 1 : 0,
    draftFilters.size ? 1 : 0,
    draftFilters.color ? 1 : 0,
    draftFilters.priceTier ? 1 : 0,
    draftFilters.inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  const handleDraftReset = () => {
    const clean: FilterState = {
      category: '',
      size: '',
      color: '',
      priceTier: '',
      inStockOnly: false,
      sortBy: draftFilters.sortBy,
    };
    setDraftFilters(clean);
    onReset();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      size="md"
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <span>Filter Wardrobe</span>
          {activeCount > 0 && (
            <Badge variant="purple" size="sm">
              {activeCount}
            </Badge>
          )}
        </div>
      }
      footer={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleDraftReset}
              disabled={activeCount === 0}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleApply}
            >
              Apply ({activeCount})
            </Button>
          </div>
        </div>
      }
    >
      <div className="py-2">
        <CatalogFilters
          filters={draftFilters}
          onChange={setDraftFilters}
          onReset={handleDraftReset}
          hideCategoryFilter={hideCategoryFilter}
        />
      </div>
    </SideDrawer>
  );
};

export default MobileFilterDrawer;
