import { useState } from 'react';
import {
  Search,
  Truck,
  Eye,
  Calendar,
  X,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Button } from '@/components/ui';
import type { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; color: string }> = [
  { value: 'pending', label: 'Payment Pending', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
  { value: 'confirmed', label: 'Order Confirmed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'processing', label: 'Tailoring & QC', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'shipped', label: 'Dispatched in Transit', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'cancelled', label: 'Cancelled / Refunded', color: 'bg-red-50 text-red-700 border-red-200' },
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking } = useOrderStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('Blue Dart Express Luxury');
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.phone.includes(search);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'cancelled') {
      setCancelConfirmId(orderId);
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const confirmCancel = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    setCancelConfirmId(null);
  };

  const handleOpenTrackingModal = (order: Order) => {
    setTrackingOrder(order);
    const orderDigits = order.orderNumber.replace(/\D/g, '') || '883920194';
    setTrackingNumberInput(order.trackingNumber || `BD-${orderDigits}IN`);
    setCarrierInput(order.carrier || 'Blue Dart Express Luxury');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrder || !trackingNumberInput.trim()) return;

    updateOrderTracking(trackingOrder.id, trackingNumberInput.trim(), carrierInput.trim());
    if (trackingOrder.status !== 'shipped' && trackingOrder.status !== 'delivered') {
      updateOrderStatus(trackingOrder.id, 'shipped');
    }
    setTrackingOrder(null);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Fulfillment & Consignments
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Order Fulfillment Desk
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Progress ceremonial orders through tailoring, assign courier waybills, and update live tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-caption">
          <span className="font-semibold text-brand-black">{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-brand-subdued-border">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number (e.g. RO-2026-...), customer name, or phone..."
            className="w-full pl-10 pr-4 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">Order Ref & Date</th>
              <th className="p-4">Recipient</th>
              <th className="p-4">Garments</th>
              <th className="p-4">Total (INR)</th>
              <th className="p-4">Tracking Consignment</th>
              <th className="p-4">Fulfillment Status</th>
              <th className="p-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {filteredOrders.map((ord) => {
              const currentStatusSpec =
                STATUS_OPTIONS.find((s) => s.value === ord.status) || STATUS_OPTIONS[0];

              return (
                <tr key={ord.id} className="hover:bg-brand-subdued-surface/40 transition-colors">
                  <td className="p-4">
                    <span className="font-display font-bold text-brand-black block text-base">
                      {ord.orderNumber}
                    </span>
                    <span className="text-caption text-brand-subdued-medium flex items-center gap-1 mt-0.5">
                      <Calendar size={11} className="text-brand-purple" />
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-medium text-brand-black">{ord.shippingAddress.fullName}</p>
                    <p className="text-caption text-brand-subdued-medium">{ord.shippingAddress.phone}</p>
                    <p className="text-[11px] text-brand-subdued-low">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                  </td>

                  <td className="p-4 text-caption text-brand-black">
                    <span className="font-semibold">{ord.items.length} item(s)</span>
                    <span className="text-brand-subdued-medium block truncate max-w-xs text-[11px]">
                      {ord.items.map((i) => `${i.title} (${i.size})`).join(', ')}
                    </span>
                  </td>

                  <td className="p-4 font-display font-semibold text-brand-black text-base">
                    ₹{ord.total.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-brand-subdued-medium uppercase font-normal font-body">
                      {ord.payment?.method === 'cod' ? 'Cash on Delivery' : 'Prepaid (UPI / Card)'}
                    </span>
                  </td>

                  <td className="p-4">
                    {ord.trackingNumber ? (
                      <div>
                        <span className="font-mono text-caption text-brand-black block font-semibold">
                          {ord.trackingNumber}
                        </span>
                        <span className="text-[10px] text-brand-subdued-medium block">
                          {ord.carrier}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenTrackingModal(ord)}
                          className="text-[11px] text-brand-purple hover:underline"
                        >
                          Edit Waybill
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenTrackingModal(ord)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold border border-dashed border-brand-purple text-brand-purple hover:bg-brand-purple/5"
                      >
                        <Truck size={12} /> Assign Waybill
                      </button>
                    )}
                  </td>

                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`text-caption font-semibold uppercase tracking-wider px-2.5 py-1 border focus:outline-none bg-white cursor-pointer ${currentStatusSpec.color}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    {cancelConfirmId === ord.id && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 text-[11px] space-y-1">
                        <p className="font-bold text-red-700">Confirm Order Cancellation?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => confirmCancel(ord.id)}
                            className="text-red-700 underline font-bold"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelConfirmId(null)}
                            className="text-zinc-600"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5"
                      title="Inspect Order"
                    >
                      <Eye size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <div>
                <p className="text-caption uppercase tracking-wider text-brand-purple font-semibold">
                  Inspection Drawer
                </p>
                <h2 className="font-display text-2xl text-brand-black">
                  Order {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-display text-lg text-brand-black">Bespoke Garments</h3>
              <div className="border border-brand-subdued-border divide-y divide-brand-subdued-border">
                {selectedOrder.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-16 object-cover border" />
                      <div>
                        <p className="font-medium text-brand-black text-body-sm">{item.title}</p>
                        <p className="text-caption text-brand-subdued-medium">
                          Color: {item.color} · Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-brand-black text-body-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-caption">
              <div className="border border-brand-subdued-border p-4 space-y-1">
                <p className="font-semibold text-brand-black uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <MapPin size={13} className="text-brand-purple" /> Shipping Address
                </p>
                <p className="font-medium text-brand-black">{selectedOrder.shippingAddress.fullName}</p>
                <p>{selectedOrder.shippingAddress.addressLine1}</p>
                {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                <p>Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="border border-brand-subdued-border p-4 space-y-1">
                <p className="font-semibold text-brand-black uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <CreditCard size={13} className="text-brand-purple" /> Financial Summary
                </p>
                <div className="flex justify-between text-brand-subdued-medium">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-brand-subdued-medium">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-brand-subdued-medium">
                  <span>Taxes (12% GST)</span>
                  <span>₹{selectedOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-bold text-brand-black text-body-sm">
                  <span>Settled Total</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-brand-subdued-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-lg text-brand-black flex items-center gap-2">
                <Truck size={18} className="text-brand-purple" /> Assign Courier Waybill
              </h2>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Logistics Carrier Partner
                </label>
                <select
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
                >
                  <option value="Blue Dart Express Luxury">Blue Dart Express Luxury</option>
                  <option value="Delhivery Premium Air">Delhivery Premium Air</option>
                  <option value="DTDC Royal Express">DTDC Royal Express</option>
                  <option value="DHL Express International">DHL Express International</option>
                </select>
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Consignment Waybill Number (AWB)
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  required
                  placeholder="e.g. BD-892184910IN"
                  className="w-full px-3 py-2 text-body-sm font-mono border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="p-3 bg-brand-subdued-surface border border-brand-subdued-border text-[11px] text-brand-subdued-low">
                Saving will set order status to <strong>Dispatched in Transit</strong> and update customer live tracking.
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button type="button" variant="secondary" size="sm" onClick={() => setTrackingOrder(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save & Notify Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
