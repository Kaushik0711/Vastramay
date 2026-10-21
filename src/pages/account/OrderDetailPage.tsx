import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Truck,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrderStore();

  const order = orders.find(
    (o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId?.toLowerCase(),
  );

  if (!order) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center font-body">
        <div className="max-w-[480px] mx-auto border border-brand-subdued-border bg-white p-8">
          <Package size={40} className="mx-auto text-brand-purple mb-4" />
          <h1 className="font-display text-2xl text-brand-black mb-2">Order Not Found</h1>
          <p className="text-body-sm text-brand-subdued-medium mb-6">
            We could not locate an Atelier record matching reference &ldquo;{orderId}&rdquo;.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/account/orders">
              <Button variant="secondary" size="sm">
                View All Orders
              </Button>
            </Link>
            <Link to="/track-order">
              <Button variant="primary" size="sm">
                Track by Consignment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const statusMilestones = [
    { label: 'Order Placed', done: true, current: order.status === 'pending' },
    { label: 'Payment Confirmed', done: true, current: order.status === 'confirmed' },
    {
      label: 'Tailoring & QC',
      done: ['processing', 'shipped', 'delivered'].includes(order.status),
      current: order.status === 'processing',
    },
    {
      label: 'Dispatched via Courier',
      done: ['shipped', 'delivered'].includes(order.status),
      current: order.status === 'shipped',
    },
    {
      label: 'Delivered',
      done: order.status === 'delivered',
      current: order.status === 'delivered',
    },
  ];

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body print:p-0 print:max-w-none">
      <div className="print:hidden">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: order.orderNumber },
          ]}
          className="mb-8"
        />
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-brand-subdued-border">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <Link
              to="/account/orders"
              className="text-caption uppercase tracking-wider text-brand-subdued-medium hover:text-brand-purple flex items-center gap-1 print:hidden"
            >
              <ArrowLeft size={14} /> Back to Orders
            </Link>
            <span className="text-caption text-brand-subdued-border print:hidden">|</span>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-black text-white">
              {order.status}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1 flex items-center gap-2">
            <Calendar size={13} className="text-brand-purple" />
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer size={14} />}
          >
            Print Tax Invoice
          </Button>
          <Link to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}>
            <Button variant="primary" size="sm" leftIcon={<Truck size={14} />}>
              Live Courier Tracking
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="border border-brand-subdued-border bg-white p-6 mb-8">
        <p className="text-caption font-semibold uppercase tracking-wider text-brand-black mb-4">
          Fulfillment Journey
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusMilestones.map((m, idx) => (
            <div
              key={m.label}
              className={`p-3 border text-left transition-colors ${
                m.current
                  ? 'border-brand-purple bg-brand-purple/5'
                  : m.done
                  ? 'border-brand-black bg-brand-subdued-surface'
                  : 'border-brand-subdued-border opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-brand-subdued-medium uppercase tracking-wider">
                  Step 0{idx + 1}
                </span>
                {m.done ? (
                  <CheckCircle2 size={13} className="text-brand-purple" />
                ) : (
                  <Clock size={13} className="text-brand-subdued-medium" />
                )}
              </div>
              <p className="text-caption font-medium text-brand-black leading-snug">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Items & Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-brand-subdued-border bg-white">
            <div className="p-4 sm:p-5 border-b border-brand-subdued-border bg-brand-subdued-surface/50">
              <h2 className="font-display text-lg text-brand-black">
                Bespoke Line Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-brand-subdued-border">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 sm:w-20 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-lg text-brand-black">
                        {item.title}
                      </h3>
                      <p className="text-caption text-brand-subdued-medium mt-0.5">
                        Color: {item.color} · Size: {item.size}
                      </p>
                      <p className="text-caption text-brand-subdued-low mt-0.5">
                        SKU: {item.productId.toUpperCase()}
                      </p>
                      <p className="text-caption font-medium text-brand-black mt-2">
                        ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-display font-semibold text-body-sm text-brand-black text-right shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotals & Taxes breakdown */}
            <div className="p-5 bg-brand-subdued-surface/30 border-t border-brand-subdued-border space-y-2 text-caption">
              <div className="flex justify-between text-brand-subdued-medium">
                <span>Catalogue Subtotal</span>
                <span className="text-brand-black font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-subdued-medium">
                <span>Insured Courier Dispatch (Express Air)</span>
                <span className="text-brand-black font-medium">
                  {order.shipping === 0 ? 'Complimentary' : `₹${order.shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand-purple">
                  <span>Atelier Promo Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-subdued-medium">
                <span>Integrated GST (12% Apparel Duty)</span>
                <span className="text-brand-black font-medium">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-brand-subdued-border flex justify-between items-baseline">
                <span className="font-display text-lg text-brand-black font-bold">
                  Total Order Value
                </span>
                <span className="font-display text-2xl text-brand-black font-bold">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Delivery & Payment Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="border border-brand-subdued-border bg-white p-5 space-y-3">
            <h2 className="font-display text-lg text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-2.5">
              <MapPin size={16} className="text-brand-purple" /> Delivery Address
            </h2>
            <div className="text-caption space-y-1 text-brand-subdued-medium">
              <p className="font-semibold text-brand-black text-body-sm">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-1 text-brand-black">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border border-brand-subdued-border bg-white p-5 space-y-3">
            <h2 className="font-display text-lg text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-2.5">
              <CreditCard size={16} className="text-brand-purple" /> Payment Method
            </h2>
            <div className="text-caption space-y-1 text-brand-subdued-medium">
              <p className="font-medium text-brand-black uppercase tracking-wider">
                {order.payment?.method === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay / UPI / NetBanking'}
              </p>
              <p className="text-[11px]">
                Payment Status:{' '}
                <span className="font-semibold text-brand-black uppercase">
                  {order.payment?.status || 'Verified & Settled'}
                </span>
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-brand-purple text-[11px] font-medium">
                <ShieldCheck size={14} />
                <span>256-Bit Encrypted Transaction</span>
              </div>
            </div>
          </div>

          {/* Help box */}
          <div className="border border-brand-subdued-border bg-brand-subdued-surface p-5 text-caption space-y-2">
            <p className="font-semibold text-brand-black uppercase tracking-wider">
              Need assistance with this order?
            </p>
            <p className="text-brand-subdued-medium">
              Contact our concierge desk at <span className="text-brand-black font-medium">concierge@vastramay.in</span> or WhatsApp at <span className="text-brand-black font-medium">+91 98111 00000</span> quoting your order reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
