import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Breadcrumb, Button, PriceDisplay, EmptyState } from '@/components/ui';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrderStore();

  const order = useMemo(() => {
    if (!orderId) return null;
    return getOrder(orderId) || null;
  }, [orderId, getOrder]);

  if (!order) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 font-body">
        <EmptyState
          title="Order Not Found"
          description="We could not locate this order in our records. If you recently placed an order, please verify your order reference number."
          action={
            <Link to="/track-order">
              <Button variant="primary" size="md">
                Search Order Lookup
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 font-body">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/account/orders' },
          { label: order.orderNumber },
        ]}
        className="mb-8"
      />

      {/* 2. Celebration Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <div className="w-16 h-16 bg-brand-subdued-surface border border-brand-purple flex items-center justify-center mx-auto text-brand-purple">
          <CheckCircle2 size={32} />
        </div>

        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold flex items-center justify-center gap-1.5">
          <Sparkles size={14} />
          Thank You · Order Confirmed
        </p>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight">
          Your Bespoke Order is Placed
        </h1>

        <p className="text-body-base text-brand-subdued-medium leading-relaxed">
          Confirmation and dispatch updates have been logged for{' '}
          <strong className="text-brand-black">{order.customerId}</strong>. Our New Delhi artisans have begun preparing your garment with delicate care.
        </p>
      </div>

      {/* 3. Sandbox Notice Banner */}
      <div className="mb-10 p-4 bg-brand-subdued-surface border border-brand-subdued-border text-caption flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-purple inline-block" />
          <span>
            <strong>Sandbox Simulation Notice:</strong> This transaction was safely processed in non-production Sandbox mode (Transaction ID: <code className="font-mono">{order.payment.transactionId}</code>).
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="text-brand-purple hover:underline flex items-center gap-1 font-medium shrink-0"
        >
          <Printer size={13} />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* 4. Order Details Card */}
      <div className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border mb-10">
        {/* Top Summary Bar */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-subdued-surface/40">
          <div>
            <span className="text-caption text-brand-subdued-medium uppercase tracking-wider block">
              Order Reference
            </span>
            <span className="font-display text-2xl font-bold text-brand-black tracking-tight">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-body-sm">
            <div>
              <span className="text-caption text-brand-subdued-medium uppercase tracking-wider block">
                Payment Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold uppercase text-xs tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Verified & Captured
              </span>
            </div>

            <div>
              <span className="text-caption text-brand-subdued-medium uppercase tracking-wider block">
                Estimated Delivery
              </span>
              <span className="font-medium text-brand-black flex items-center gap-1">
                <Calendar size={14} className="text-brand-purple" />
                3–5 Business Days
              </span>
            </div>
          </div>
        </div>

        {/* Ordered Line Items */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl text-brand-black">
            Tailored Ensembles ({order.items.length})
          </h2>

          <div className="divide-y divide-brand-subdued-border">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 sm:w-20 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg text-brand-black">
                      {item.title}
                    </h3>
                    <p className="text-caption text-brand-subdued-medium mt-0.5">
                      {item.color} · Size: <span className="font-semibold text-brand-black">{item.size}</span> · Qty: {item.quantity}
                    </p>
                    <PriceDisplay price={item.price} size="sm" />
                  </div>
                </div>

                <span className="font-display text-lg font-semibold text-brand-black">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Financial Summary */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Details */}
          <div className="space-y-2 text-body-sm">
            <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
              <Truck size={14} className="text-brand-purple" />
              Delivery Destination
            </h3>
            <p className="font-semibold text-brand-black">{order.shippingAddress.fullName}</p>
            <p className="text-brand-subdued-high">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-brand-subdued-high">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-brand-subdued-high">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-brand-subdued-medium pt-1">
              Mobile Contact: +91 {order.shippingAddress.phone}
            </p>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-2.5 text-body-sm">
            <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
              <Package size={14} className="text-brand-purple" />
              Billing Summary
            </h3>
            <div className="flex justify-between text-brand-subdued-high">
              <span>Subtotal</span>
              <span className="font-medium text-brand-black">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-purple">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-subdued-high">
              <span>Shipping</span>
              <span className="font-medium text-brand-black">
                {order.shipping === 0 ? 'Complimentary' : `₹${order.shipping.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="pt-3 border-t border-brand-subdued-border flex justify-between items-baseline">
              <span className="font-display text-lg font-bold text-brand-black">Total Paid</span>
              <span className="font-display text-2xl font-bold text-brand-black">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}>
          <Button variant="secondary" size="md" leftIcon={<Truck size={15} />}>
            Track Order Status
          </Button>
        </Link>

        <Link to="/shop">
          <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
            Continue Exploring Wardrobe
          </Button>
        </Link>
      </div>

      {/* Trust Footnote */}
      <div className="mt-12 text-center text-caption text-brand-subdued-low flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-brand-purple" />
        <span>For order assistance, our New Delhi Atelier Concierge is reachable at care@vastramay.in</span>
      </div>
    </div>
  );
}
