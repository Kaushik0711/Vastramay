import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Breadcrumb, Button, EmptyState } from '@/components/ui';

export default function OrdersPage() {
  const { orders } = useOrderStore();

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      {/* 1. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Orders' },
        ]}
        className="mb-8"
      />

      {/* 2. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold flex items-center gap-1.5 mb-1.5">
            <Package size={14} />
            Order Archive & History
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            My Orders
          </h1>
          <p className="text-body-base text-brand-subdued-medium mt-1">
            Review past tailoring orders, download receipts, and view live tracking milestones.
          </p>
        </div>

        <Link to="/track-order">
          <Button variant="secondary" size="sm" leftIcon={<Truck size={14} />}>
            Track Any Order
          </Button>
        </Link>
      </div>

      {/* 3. Orders List or Empty State */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border shadow-sm"
            >
              {/* Order Meta Bar */}
              <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 bg-brand-subdued-surface/50">
                <div className="space-y-0.5">
                  <span className="text-caption text-brand-subdued-medium uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <span className="font-display text-lg font-bold text-brand-black">
                    {order.orderNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-caption">
                  <div>
                    <span className="text-brand-subdued-medium uppercase tracking-wider block">
                      Date Placed
                    </span>
                    <span className="font-medium text-brand-black flex items-center gap-1">
                      <Calendar size={13} className="text-brand-purple" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-brand-subdued-medium uppercase tracking-wider block">
                      Total
                    </span>
                    <span className="font-semibold text-brand-black font-display text-base">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-brand-subdued-medium uppercase tracking-wider block">
                      Status
                    </span>
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-black text-white">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Preview */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="divide-y divide-brand-subdued-border">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium text-brand-black">
                            {item.title}
                          </p>
                          <p className="text-caption text-brand-subdued-medium">
                            {item.color} · Size: {item.size} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="font-display font-semibold text-body-sm text-brand-black">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-4">
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-semibold"
                  >
                    View Order Details →
                  </Link>
                  <span className="text-brand-subdued-border">|</span>
                  <Link
                    to={`/order/success/${order.id}`}
                    className="text-caption uppercase tracking-wider text-brand-subdued-medium hover:text-brand-black font-medium"
                  >
                    Tax Invoice
                  </Link>
                </div>

                <Link to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Track Dispatch
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Orders Found"
          description="You haven't placed any ceremonial orders yet. Explore our handcrafted kurtas, regal sherwanis, and festive sets."
          action={
            <Link to="/shop">
              <Button variant="primary" size="md" rightIcon={<ShoppingBag size={15} />}>
                Explore The Wardrobe
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
