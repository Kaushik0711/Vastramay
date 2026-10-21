import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & SKUs', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Inventory Control', href: '/admin/inventory', icon: Boxes },
  { label: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customer Archive', href: '/admin/customers', icon: Users },
  { label: 'Discounts & Codes', href: '/admin/discounts', icon: Tag },
  { label: 'Store Configuration', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authorization Check: Must be authenticated and have role 'admin' or 'staff'
  const isAuthorized = isAuthenticated && user && (user.role === 'admin' || user.role === 'staff');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-brand-subdued-surface flex items-center justify-center p-4 font-body">
        <div className="max-w-md w-full bg-white border border-brand-subdued-border p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
            <Shield size={32} />
          </div>
          <div>
            <p className="text-label uppercase tracking-widest text-red-600 font-semibold mb-1">
              Access Restricted
            </p>
            <h1 className="font-display text-2xl text-brand-black">
              Administrative Console
            </h1>
            <p className="text-body-sm text-brand-subdued-medium mt-2">
              The <code>/admin</code> area is strictly reserved for authorized atelier directors and operational staff. Ordinary customer accounts cannot access administrative operations.
            </p>
          </div>

          <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border text-left text-caption space-y-2">
            <p className="font-semibold text-brand-black flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-purple" /> Staff Demo Credentials:
            </p>
            <p className="text-brand-subdued-medium">
              Email: <code className="text-brand-purple font-mono">admin@vastramay.in</code>
              <br />
              Password: <code className="text-brand-purple font-mono">admin123</code>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link to="/account/login?redirect=/admin">
              <Button variant="primary" size="md" className="w-full justify-center">
                Sign In as Staff Director
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="md" className="w-full justify-center" leftIcon={<ArrowLeft size={14} />}>
                Return to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/account/login');
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex flex-col font-body">
      {/* Top Banner: Local Development Adapter Notice */}
      <div className="bg-brand-black text-white px-4 py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 border-b border-brand-subdued-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-purple-300">STAFF DIRECTOR CONSOLE</span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-300">
            Authenticated as: <strong className="text-white">{user.email}</strong> ({user.role.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-300">
          <span className="hidden md:inline text-amber-300 flex items-center gap-1">
            <AlertTriangle size={12} /> Local Session Adapter Active (Changes sync live with storefront)
          </span>
          <Link
            to="/"
            target="_blank"
            className="text-white underline hover:text-purple-300 flex items-center gap-1 font-body text-caption"
          >
            Storefront Preview ↗
          </Link>
        </div>
      </div>

      {/* Admin Navbar Header */}
      <header className="bg-white border-b border-brand-subdued-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-black hover:bg-brand-subdued-surface border border-brand-subdued-border"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="font-display text-xl font-bold tracking-tight text-brand-black">
              VASTRAMAY
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-brand-purple text-white px-2 py-0.5">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-caption text-brand-subdued-medium hover:text-brand-black hidden sm:flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <span className="hidden sm:inline text-brand-subdued-border">|</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut size={14} />}
            className="text-caption uppercase tracking-wider text-brand-subdued-medium hover:text-red-600"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 bg-white border-r border-brand-subdued-border flex-shrink-0 p-4 space-y-1 ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="pb-3 mb-2 border-b border-brand-subdued-border">
            <p className="text-[10px] uppercase tracking-wider text-brand-subdued-medium font-semibold px-3">
              Management Modules
            </p>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-caption font-medium uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-brand-black text-white font-semibold'
                      : 'text-brand-subdued-medium hover:bg-brand-subdued-surface hover:text-brand-black'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-brand-purple' : ''} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 mt-8 border-t border-brand-subdued-border space-y-3 px-3">
            <div className="text-[11px] text-brand-subdued-low">
              <p className="font-semibold text-brand-black mb-1">Architecture Note</p>
              <p>
                All actions made here mutate the persistent Zustand data stores in real time. Open the storefront in an incognito or split window to verify instant reactivity.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
