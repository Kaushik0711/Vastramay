import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { useOrderStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

export default function PaymentFailedPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrder } = useOrderStore();

  const order = useMemo(() => {
    if (!orderId) return null;
    return getOrder(orderId) || null;
  }, [orderId, getOrder]);

  return (
    <div className="max-w-[840px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 font-body">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Checkout', href: '/checkout/payment' },
          { label: 'Payment Notice' },
        ]}
        className="mb-8"
      />

      {/* 2. Failure Hero Container */}
      <div className="border border-red-200 bg-white p-6 sm:p-10 space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-brand-subdued-border">
          <div className="w-16 h-16 bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-red-600">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2 flex-1">
            <span className="text-caption uppercase tracking-widest text-red-700 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <ShieldAlert size={14} />
              Payment Unsuccessful
            </span>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-black tracking-tight">
              Transaction Could Not Be Completed
            </h1>
            <p className="text-body-base text-brand-subdued-medium leading-relaxed">
              Your issuing bank or payment gateway declined this attempt. No funds were captured for this order. Your garment selections remain reserved in your shopping bag.
            </p>
          </div>
        </div>

        {/* Attempt Summary */}
        {order && (
          <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border text-body-sm flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-caption text-brand-subdued-medium block uppercase tracking-wider">
                Attempt Reference
              </span>
              <strong className="font-mono text-brand-black">{order.orderNumber}</strong>
            </div>

            <div>
              <span className="text-caption text-brand-subdued-medium block uppercase tracking-wider">
                Total Due
              </span>
              <strong className="font-display text-lg text-brand-black">
                ₹{order.total.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        )}

        {/* Remediation Tips */}
        <div className="space-y-3 pt-2">
          <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
            <HelpCircle size={14} className="text-brand-purple" />
            Recommended Next Steps
          </h3>
          <ul className="text-caption text-brand-subdued-high space-y-2 list-disc list-inside">
            <li>
              <strong>Try UPI or Alternative Method:</strong> UPI (Google Pay, PhonePe, Paytm) provides instant verification with near-zero bank timeout rates.
            </li>
            <li>
              <strong>Check Online Transaction Limits:</strong> Ensure e-commerce and high-value transactions are enabled on your banking application.
            </li>
            <li>
              <strong>Switch Browser or Network:</strong> VPN connections occasionally trigger strict fraud prevention triggers on Indian banking portals.
            </li>
          </ul>
        </div>

        {/* Retry & Cart Action Strip */}
        <div className="pt-4 border-t border-brand-subdued-border flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/checkout/payment')}
            leftIcon={<RotateCcw size={16} />}
            className="w-full sm:w-auto"
          >
            Retry Payment Method
          </Button>

          <Link to="/cart" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<ShoppingBag size={16} />}
              fullWidth
            >
              Return to Shopping Bag
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
