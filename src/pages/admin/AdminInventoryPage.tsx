import { useState } from 'react';
import {
  Search,
  AlertTriangle,
  Minus,
  Plus,
} from 'lucide-react';
import { useCatalogStore } from '@/stores';
import { Button } from '@/components/ui';

export default function AdminInventoryPage() {
  const { products, updateVariantStock } = useCatalogStore();

  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Flatten all variants with their parent product info
  const variantRows = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productTitle: p.title,
      productSlug: p.slug,
      image: p.images[0]?.url || '',
      variantId: v.id,
      sku: v.sku,
      color: v.color,
      size: v.size,
      price: v.price,
      stock: v.stock,
      isAvailable: v.isAvailable,
    })),
  );

  const filteredRows = variantRows.filter((r) => {
    const matchesSearch =
      r.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.color.toLowerCase().includes(search.toLowerCase());

    const matchesLowStock = !filterLowStock || r.stock < 5;

    return matchesSearch && matchesLowStock;
  });

  const handleStockDelta = (productId: string, variantId: string, currentStock: number, delta: number) => {
    updateVariantStock(productId, variantId, currentStock + delta);
  };

  const handleStockDirect = (productId: string, variantId: string, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      updateVariantStock(productId, variantId, num);
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Warehouse & Atelier Stock
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Inventory Control & Replenishment
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Real-time variant-level unit management. Modifications instantly synchronize with customer cart validations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={filterLowStock ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterLowStock(!filterLowStock)}
            leftIcon={<AlertTriangle size={14} className={filterLowStock ? 'text-white' : 'text-amber-600'} />}
          >
            {filterLowStock ? 'Showing Low Stock (< 5)' : 'Filter Low Stock Only'}
          </Button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex items-center gap-4 bg-white p-4 border border-brand-subdued-border">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, garment title, or colorway..."
            className="w-full pl-10 pr-4 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
          />
        </div>
        <span className="text-caption text-brand-subdued-medium whitespace-nowrap">
          {filteredRows.length} variant(s) found
        </span>
      </div>

      {/* Inventory Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">SKU / Code</th>
              <th className="p-4">Garment</th>
              <th className="p-4">Variant Spec</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {filteredRows.map((r) => {
              const isLow = r.stock < 5;
              const isOut = r.stock === 0;

              return (
                <tr key={`${r.productId}-${r.variantId}`} className="hover:bg-brand-subdued-surface/40 transition-colors">
                  <td className="p-4 font-mono text-caption text-brand-black font-semibold">
                    {r.sku}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                        <img src={r.image} alt={r.productTitle} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-display font-medium text-brand-black line-clamp-1 max-w-xs">
                        {r.productTitle}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-caption text-brand-black">
                    <span className="font-semibold">{r.color}</span> · Size: <span className="font-semibold">{r.size}</span>
                  </td>

                  <td className="p-4 font-display font-semibold text-brand-black">
                    ₹{r.price.toLocaleString('en-IN')}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-caption font-bold ${
                        isOut
                          ? 'bg-red-50 text-red-700 border border-red-300'
                          : isLow
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-green-50 text-green-700 border border-green-300'
                      }`}
                    >
                      {r.stock} units {isOut ? '(Out of Stock)' : isLow ? '(Low)' : ''}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => handleStockDelta(r.productId, r.variantId, r.stock, -1)}
                        disabled={r.stock <= 0}
                        className="p-1.5 border border-brand-subdued-border bg-white hover:bg-brand-subdued-surface disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Reduce 1"
                      >
                        <Minus size={13} />
                      </button>

                      <input
                        type="number"
                        value={r.stock}
                        onChange={(e) => handleStockDirect(r.productId, r.variantId, e.target.value)}
                        className="w-16 text-center py-1 border border-brand-subdued-border text-caption font-bold text-brand-black focus:border-brand-purple focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleStockDelta(r.productId, r.variantId, r.stock, 1)}
                        className="p-1.5 border border-brand-subdued-border bg-white hover:bg-brand-subdued-surface"
                        title="Add 1"
                      >
                        <Plus size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStockDelta(r.productId, r.variantId, r.stock, 5)}
                        className="px-2 py-1 text-[11px] font-semibold border border-brand-subdued-border bg-brand-subdued-surface hover:bg-white text-brand-purple"
                        title="Quick Restock +5"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
