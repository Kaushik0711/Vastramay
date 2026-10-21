import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  MapPin,
  Settings,
  LogOut,
  Shield,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Heart,
  Calendar,
} from 'lucide-react';
import { useAuthStore, useOrderStore, useWishlistStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';
import type { Address } from '@/types';

export default function AccountDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { orders } = useOrderStore();
  const { productIds } = useWishlistStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center font-body">
        <div className="max-w-[480px] mx-auto border border-brand-subdued-border bg-white p-8">
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2">
            Client Authentication Required
          </p>
          <h1 className="font-display text-3xl text-brand-black mb-3">
            Atelier Portal
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mb-6">
            Please sign in to access your bespoke orders, saved delivery addresses, and personal wardrobe preferences.
          </p>
          <div className="space-y-3">
            <Link to="/account/login">
              <Button variant="primary" size="md" className="w-full justify-center">
                Sign In to Account
              </Button>
            </Link>
            <Link to="/account/register">
              <Button variant="secondary" size="md" className="w-full justify-center">
                Register New Client
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultAddress = user.addresses?.find((a: Address) => a.isDefault) || user.addresses?.[0];
  const recentOrders = orders.slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account' },
        ]}
        className="mb-8"
      />

      {/* Account Header with Welcome and Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-brand-subdued-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
              Client Portfolio
            </p>
            {user.role === 'admin' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-purple text-white">
                <Shield size={10} /> Atelier Director (Admin)
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Member of Vastramay Atelier since {new Date(user.createdAt).getFullYear()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.role === 'admin' && (
            <Link to="/admin">
              <Button variant="primary" size="sm" leftIcon={<Shield size={14} />}>
                Open Admin Panel
              </Button>
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut size={14} />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-brand-subdued-border mb-8 overflow-x-auto pb-px">
        <Link
          to="/account"
          className="px-4 py-2.5 text-caption font-semibold uppercase tracking-wider border-b-2 border-brand-purple text-brand-purple shrink-0"
        >
          Overview
        </Link>
        <Link
          to="/account/orders"
          className="px-4 py-2.5 text-caption font-semibold uppercase tracking-wider border-b-2 border-transparent text-brand-subdued-medium hover:text-brand-black shrink-0 transition-colors"
        >
          Orders ({orders.length})
        </Link>
        <Link
          to="/account/addresses"
          className="px-4 py-2.5 text-caption font-semibold uppercase tracking-wider border-b-2 border-transparent text-brand-subdued-medium hover:text-brand-black shrink-0 transition-colors"
        >
          Saved Addresses ({user.addresses?.length || 0})
        </Link>
        <Link
          to="/account/settings"
          className="px-4 py-2.5 text-caption font-semibold uppercase tracking-wider border-b-2 border-transparent text-brand-subdued-medium hover:text-brand-black shrink-0 transition-colors"
        >
          Profile & Preferences
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Total Orders</span>
            <Package size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {orders.length}
          </p>
          <Link to="/account/orders" className="text-[11px] text-brand-purple hover:underline mt-2 inline-block font-medium">
            View history →
          </Link>
        </div>

        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Saved Wishlist</span>
            <Heart size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {productIds.length}
          </p>
          <Link to="/wishlist" className="text-[11px] text-brand-purple hover:underline mt-2 inline-block font-medium">
            Explore items →
          </Link>
        </div>

        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Saved Addresses</span>
            <MapPin size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {user.addresses?.length || 0}
          </p>
          <Link to="/account/addresses" className="text-[11px] text-brand-purple hover:underline mt-2 inline-block font-medium">
            Manage locations →
          </Link>
        </div>

        <div className="border border-brand-subdued-border bg-white p-5">
          <div className="flex items-center justify-between text-caption text-brand-subdued-medium uppercase tracking-wider mb-2">
            <span>Bespoke Size</span>
            <Sparkles size={16} className="text-brand-purple" />
          </div>
          <p className="font-display text-3xl font-bold text-brand-black">
            {user.preferredSize || 'Not Set'}
          </p>
          <Link to="/account/settings" className="text-[11px] text-brand-purple hover:underline mt-2 inline-block font-medium">
            Edit sizing →
          </Link>
        </div>
      </div>

      {/* Main Grid: Orders & Profile/Address Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-brand-subdued-border bg-white">
            <div className="p-5 border-b border-brand-subdued-border flex items-center justify-between">
              <h2 className="font-display text-xl text-brand-black">
                Recent Atelier Orders
              </h2>
              <Link
                to="/account/orders"
                className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium inline-flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="divide-y divide-brand-subdued-border">
                {recentOrders.map((ord) => (
                  <div key={ord.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-brand-black text-base">
                          {ord.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-black text-white">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-caption text-brand-subdued-medium flex items-center gap-1.5">
                        <Calendar size={12} className="text-brand-purple" />
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })} · {ord.items.length} item(s)
                      </p>
                      <p className="text-body-sm font-semibold text-brand-black">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/account/orders/${ord.id}`}>
                        <Button variant="secondary" size="sm">
                          Order Details
                        </Button>
                      </Link>
                      <Link to={`/track-order?orderNumber=${encodeURIComponent(ord.orderNumber)}`}>
                        <Button variant="ghost" size="sm" className="text-caption uppercase tracking-wider">
                          Track
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-body-sm text-brand-subdued-medium mb-4">
                  No orders placed yet. Browse the latest seasonal festive and wedding collections.
                </p>
                <Link to="/shop">
                  <Button variant="primary" size="sm">
                    Explore Catalogue
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Concierge & Sizing Assistance */}
          <div className="border border-brand-subdued-border bg-brand-subdued-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-1">
                Personal Atelier Concierge
              </p>
              <h3 className="font-display text-xl text-brand-black">
                Need Bespoke Fitting or Bridal Styling?
              </h3>
              <p className="text-body-sm text-brand-subdued-medium mt-1">
                Our master drapers and stylists are available via WhatsApp or private appointment.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="secondary" size="sm" rightIcon={<ExternalLink size={14} />}>
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Col: Client Summary & Default Address */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="border border-brand-subdued-border bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-subdued-border pb-3">
              <h2 className="font-display text-lg text-brand-black flex items-center gap-2">
                <UserIcon size={16} className="text-brand-purple" /> Profile
              </h2>
              <Link to="/account/settings" className="text-[11px] uppercase tracking-wider text-brand-purple hover:underline font-medium">
                Edit
              </Link>
            </div>

            <div className="space-y-2 text-caption">
              <div>
                <span className="text-brand-subdued-medium uppercase tracking-wider block">Full Name</span>
                <span className="font-medium text-brand-black text-body-sm">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div>
                <span className="text-brand-subdued-medium uppercase tracking-wider block">Email Address</span>
                <span className="text-brand-black">{user.email}</span>
              </div>
              <div>
                <span className="text-brand-subdued-medium uppercase tracking-wider block">Contact Phone</span>
                <span className="text-brand-black">{user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-brand-subdued-medium uppercase tracking-wider block">Newsletter Subscription</span>
                <span className="text-brand-black">
                  {user.newsletterSubscribed ? 'Subscribed to Trunk Shows' : 'Unsubscribed'}
                </span>
              </div>
            </div>
          </div>

          {/* Default Address Card */}
          <div className="border border-brand-subdued-border bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-subdued-border pb-3">
              <h2 className="font-display text-lg text-brand-black flex items-center gap-2">
                <MapPin size={16} className="text-brand-purple" /> Primary Address
              </h2>
              <Link to="/account/addresses" className="text-[11px] uppercase tracking-wider text-brand-purple hover:underline font-medium">
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <div className="text-caption space-y-1 text-brand-subdued-medium">
                <p className="font-medium text-brand-black text-body-sm">{defaultAddress.fullName}</p>
                <p>{defaultAddress.addressLine1}</p>
                {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                <p>{defaultAddress.country}</p>
                <p className="pt-1 text-brand-black">Phone: {defaultAddress.phone}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-brand-subdued-surface border border-brand-subdued-border text-brand-black">
                  Default Delivery Location
                </span>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-caption text-brand-subdued-medium mb-3">No addresses saved yet.</p>
                <Link to="/account/addresses">
                  <Button variant="secondary" size="sm">
                    Add Address
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border">
            <Link
              to="/account/settings"
              className="p-4 flex items-center justify-between hover:bg-brand-subdued-surface transition-colors"
            >
              <span className="text-caption font-semibold uppercase tracking-wider text-brand-black flex items-center gap-2">
                <Settings size={15} className="text-brand-purple" /> Account Settings
              </span>
              <ArrowRight size={14} className="text-brand-subdued-medium" />
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="p-4 flex items-center justify-between hover:bg-brand-subdued-surface transition-colors bg-brand-purple/5"
              >
                <span className="text-caption font-semibold uppercase tracking-wider text-brand-purple flex items-center gap-2">
                  <Shield size={15} /> Atelier Admin Console
                </span>
                <ArrowRight size={14} className="text-brand-purple" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
