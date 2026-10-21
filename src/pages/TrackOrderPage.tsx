import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';
import type { OrderStatus } from '@/types';

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [lookupQuery, setLookupQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderNumber));
  const [searchError, setSearchError] = useState<string | null>(null);

  const { findOrderForGuest, getOrderByNumber } = useOrderStore();

  const foundOrder = useMemo(() => {
    if (!orderQuery.trim()) return null;
    if (lookupQuery.trim()) {
      return findOrderForGuest(orderQuery, lookupQuery) || null;
    }
    return getOrderByNumber(orderQuery) || null;
  }, [orderQuery, lookupQuery, findOrderForGuest, getOrderByNumber]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setHasSearched(true);

    if (!orderQuery.trim()) {
      setSearchError('Please provide an order number.');
      return;
    }

    setSearchParams({ orderNumber: orderQuery.trim() });
  };

  const getStepState = (currentStatus: OrderStatus, step: 'confirmed' | 'processing' | 'shipped' | 'delivered') => {
    const order: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
      returned: -1,
    };

    const currentRank = order[currentStatus] || 0;
    const stepRank = {
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
    }[step];

    if (currentRank > stepRank) return 'completed';
    if (currentRank === stepRank) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Track Order', href: '/track-order' },
          ...(foundOrder ? [{ label: foundOrder.orderNumber }] : []),
        ]}
        className="mb-8"
      />

      {/* 2. Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold flex items-center justify-center gap-1.5">
          <Truck size={14} />
          Atelier Logistics & Delivery
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
          Track Your Ceremonial Order
        </h1>
        <p className="text-body-base text-brand-subdued-medium">
          Enter your order reference number and associated email or phone number to view live atelier tailoring and dispatch milestones.
        </p>
      </div>

      {/* 3. Secure Lookup Box */}
      <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 mb-12 max-w-3xl mx-auto shadow-sm">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="track-order-num" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                Order Reference *
              </label>
              <input
                id="track-order-num"
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. RO-2026-89412"
                className="w-full bg-white border border-brand-subdued-border px-3.5 py-2.5 text-body-sm font-mono uppercase rounded-none focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label htmlFor="track-auth-info" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                Phone Number or Email *
              </label>
              <input
                id="track-auth-info"
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="9876543210 or email"
                className="w-full bg-white border border-brand-subdued-border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {searchError && (
            <p className="text-caption text-red-600 flex items-center gap-1.5">
              <AlertCircle size={14} />
              {searchError}
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-brand-subdued-low">
              Demo records available: Try <code className="font-mono text-brand-black">RO-2026-89412</code> (Delivered) or <code className="font-mono text-brand-black">RO-2026-90214</code> (Processing).
            </span>

            <Button type="submit" variant="primary" size="md" leftIcon={<Search size={15} />}>
              Locate Order
            </Button>
          </div>
        </form>
      </div>

      {/* 4. Tracking Results Display */}
      {hasSearched && foundOrder ? (
        <div className="space-y-8 animate-fade-in">
          {/* Status & Carrier Banner */}
          <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-caption uppercase tracking-wider text-brand-purple font-semibold">
                Order #{foundOrder.orderNumber}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-brand-black tracking-tight capitalize">
                Current Status: {foundOrder.status}
              </h2>
              <p className="text-caption text-brand-subdued-medium">
                Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 text-body-sm border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-subdued-border">
              {foundOrder.trackingNumber && (
                <>
                  <span className="text-caption text-brand-subdued-medium uppercase tracking-wider">
                    Courier Consignment
                  </span>
                  <span className="font-mono font-semibold text-brand-black">
                    {foundOrder.trackingNumber}
                  </span>
                  <span className="text-caption text-brand-subdued-low">
                    {foundOrder.carrier}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Milestone Step Indicator */}
          <div className="border border-brand-subdued-border bg-white p-6 sm:p-8">
            <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold mb-6">
              Tailoring & Transit Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {/* Step 1: Confirmed */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                    getStepState(foundOrder.status, 'confirmed') === 'completed' || getStepState(foundOrder.status, 'confirmed') === 'current'
                      ? 'border-brand-purple bg-brand-purple text-white'
                      : 'border-brand-subdued-border text-brand-subdued-low bg-white'
                  }`}
                >
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-body-sm text-brand-black">Order Placed</h4>
                  <p className="text-caption text-brand-subdued-medium">Artisan specs allocated</p>
                </div>
              </div>

              {/* Step 2: Processing */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                    getStepState(foundOrder.status, 'processing') === 'completed' || getStepState(foundOrder.status, 'processing') === 'current'
                      ? 'border-brand-purple bg-brand-purple text-white'
                      : 'border-brand-subdued-border text-brand-subdued-low bg-white'
                  }`}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-body-sm text-brand-black">Quality Inspection</h4>
                  <p className="text-caption text-brand-subdued-medium">Handloom seam finishing</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                    getStepState(foundOrder.status, 'shipped') === 'completed' || getStepState(foundOrder.status, 'shipped') === 'current'
                      ? 'border-brand-purple bg-brand-purple text-white'
                      : 'border-brand-subdued-border text-brand-subdued-low bg-white'
                  }`}
                >
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-body-sm text-brand-black">Dispatched</h4>
                  <p className="text-caption text-brand-subdued-medium">New Delhi transit facility</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-10 h-10 border flex items-center justify-center shrink-0 ${
                    getStepState(foundOrder.status, 'delivered') === 'completed' || getStepState(foundOrder.status, 'delivered') === 'current'
                      ? 'border-brand-purple bg-brand-purple text-white'
                      : 'border-brand-subdued-border text-brand-subdued-low bg-white'
                  }`}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-body-sm text-brand-black">Delivered</h4>
                  <p className="text-caption text-brand-subdued-medium">Doorstep arrival</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items & Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Items (7 Cols) */}
            <div className="md:col-span-7 border border-brand-subdued-border bg-white p-6 space-y-4">
              <h3 className="font-display text-xl text-brand-black pb-2 border-b border-brand-subdued-border">
                Items in This Shipment ({foundOrder.items.length})
              </h3>
              <div className="divide-y divide-brand-subdued-border">
                {foundOrder.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="py-3 flex items-center gap-3.5">
                    <div className="w-16 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-body-sm text-brand-black truncate">{item.title}</p>
                      <p className="text-caption text-brand-subdued-medium">
                        {item.color} · Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-display font-semibold text-body-base text-brand-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Summary (5 Cols) */}
            <div className="md:col-span-5 border border-brand-subdued-border bg-white p-6 space-y-4">
              <h3 className="font-display text-xl text-brand-black pb-2 border-b border-brand-subdued-border">
                Delivery Destination
              </h3>
              <div className="text-body-sm space-y-1 text-brand-subdued-high">
                <p className="font-semibold text-brand-black">{foundOrder.shippingAddress.fullName}</p>
                <p>{foundOrder.shippingAddress.addressLine1}</p>
                {foundOrder.shippingAddress.addressLine2 && <p>{foundOrder.shippingAddress.addressLine2}</p>}
                <p>
                  {foundOrder.shippingAddress.city}, {foundOrder.shippingAddress.state} - {foundOrder.shippingAddress.postalCode}
                </p>
                <p className="text-caption text-brand-subdued-medium pt-2">
                  Contact: +91 {foundOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-subdued-border flex justify-between items-baseline">
                <span className="text-caption uppercase tracking-wider text-brand-subdued-medium">
                  Grand Total
                </span>
                <span className="font-display text-2xl font-bold text-brand-black">
                  ₹{foundOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="border border-brand-subdued-border bg-white p-8 text-center space-y-3">
          <AlertCircle size={28} className="text-brand-purple mx-auto" />
          <h3 className="font-display text-xl text-brand-black">
            Order Not Found
          </h3>
          <p className="text-body-sm text-brand-subdued-medium max-w-md mx-auto">
            We could not find an order matching reference &ldquo;{orderQuery}&rdquo; and your provided credentials. Please check for typographical errors or contact our atelier concierge.
          </p>
        </div>
      ) : null}
    </div>
  );
}
