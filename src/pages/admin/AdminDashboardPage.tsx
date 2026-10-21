import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Boxes,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useOrderStore, useCatalogStore } from '@/stores';
import { Button } from '@/components/ui';

export default function AdminDashboardPage() {
  const { orders } = useOrderStore();
  const { products } = useCatalogStore();

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);

  // Find all low-stock variants across all products
  const lowStockItems: Array<{
    productId: string;
    productTitle: string;
    variantId: string;
    color: string;
    size: string;
    stock: number;
    sku: string;
  }> = [];

  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock < 5) {
        lowStockItems.push({
          productId: p.id,
          productTitle: p.title,
          variantId: v.id,
          color: v.color,
          size: v.size,
          stock: v.stock,
          sku: v.sku,
        });
      }
    });
  });

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 font-body">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Executive Summary
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Atelier Command Center
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Real-time telemetry across revenue, bespoke garment stock, and fulfillment queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/products">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Add Garment SKU
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="secondary" size="sm" leftIcon={<ShoppingBag size={14} />}>
              Fulfillment Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Key Performance Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Gross Revenue</span>
            <TrendingUp size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <Sparkles size={11} /> Settled across {orders.length} orders
          </p>
        </div>

        {/* Metric 2 */}
        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Total Orders</span>
            <ShoppingBag size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {orders.length}
          </p>
          <Link to="/admin/orders" className="text-[11px] text-brand-purple hover:underline mt-2 inline-block font-medium">
            Manage dispatch queue →
          </Link>
        </div>

        {/* Metric 3 */}
        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Active SKUs</span>
            <Package size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {products.length}
          </p>
          <p className="text-[11px] text-brand-subdued-medium mt-2">
            {totalVariants} tailored size/color variants
          </p>
        </div>

        {/* Metric 4 */}
        <div className={`border p-5 ${lowStockItems.length > 0 ? 'border-amber-400 bg-amber-50/40' : 'border-brand-subdued-border bg-white'}`}>
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Low Stock Alerts</span>
            <AlertTriangle size={16} className={lowStockItems.length > 0 ? 'text-amber-600' : 'text-brand-subdued-low'} />
          </div>
          <p className={`font-display text-3xl font-bold ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-brand-black'}`}>
            {lowStockItems.length}
          </p>
          <Link to="/admin/inventory" className="text-[11px] text-amber-700 hover:underline mt-2 inline-block font-medium">
            Replenish inventory →
          </Link>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Queue */}
        <div className="border border-brand-subdued-border bg-white">
          <div className="p-5 border-b border-brand-subdued-border flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-black flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-purple" /> Recent Customer Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-semibold flex items-center gap-1"
            >
              All Orders ({orders.length}) <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-brand-subdued-border">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex items-center justify-between gap-4 hover:bg-brand-subdued-surface/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-brand-black">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-brand-black text-white">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-caption text-brand-subdued-medium mt-0.5">
                      {ord.shippingAddress.fullName} · {ord.items.length} item(s)
                    </p>
                    <p className="text-[11px] text-brand-subdued-low flex items-center gap-1">
                      <Clock size={11} /> {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-display font-semibold text-brand-black text-base">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </p>
                    <Link
                      to="/admin/orders"
                      className="text-[11px] uppercase tracking-wider text-brand-purple hover:underline font-medium"
                    >
                      Update status →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-body-sm text-brand-subdued-medium">
              No orders received yet. Place a test order via the public storefront checkout.
            </div>
          )}
        </div>

        {/* Low Stock Warning Table */}
        <div className="border border-brand-subdued-border bg-white">
          <div className="p-5 border-b border-brand-subdued-border flex items-center justify-between">
            <h2 className="font-display text-xl text-brand-black flex items-center gap-2">
              <Boxes size={18} className="text-amber-600" /> Critical Stock Levels (&lt; 5 units)
            </h2>
            <Link
              to="/admin/inventory"
              className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-semibold flex items-center gap-1"
            >
              Inventory Manager <ArrowRight size={12} />
            </Link>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="divide-y divide-brand-subdued-border">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-medium text-brand-black text-body-sm">
                      {item.productTitle}
                    </p>
                    <p className="text-caption text-brand-subdued-medium">
                      Color: {item.color} · Size: {item.size} · SKU: {item.sku}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-caption font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {item.stock} left
                    </span>
                    <Link to="/admin/inventory">
                      <Button variant="secondary" size="sm" className="text-caption">
                        Adjust
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-body-sm text-brand-subdued-medium">
              All variant stocks are healthy and above the safety buffer (&ge; 5 units).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
