import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { login, isAuthenticated, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'staff') {
      navigate('/admin', { replace: true });
    } else {
      navigate(redirectPath, { replace: true });
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect will happen on re-render, or trigger directly:
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role === 'admin' || currentUser?.role === 'staff') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'customer' | 'admin') => {
    setError(null);
    if (type === 'customer') {
      setEmail('aditya@vastramay.in');
      setPassword('password123');
    } else {
      setEmail('admin@vastramay.in');
      setPassword('admin123');
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Sign In' },
        ]}
        className="mb-8"
      />

      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2">
            The Atelier Portal
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-2">
            Sign In to Your Account
          </h1>
          <p className="text-body-sm text-brand-subdued-medium">
            Access bespoke bespoke orders, saved measurements, address book, and synchronized wishlist.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="mb-8 p-4 bg-brand-subdued-surface border border-brand-subdued-border space-y-3">
          <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-brand-black">
            <Sparkles size={14} className="text-brand-purple" />
            <span>Development Demo Access</span>
          </div>
          <p className="text-[12px] text-brand-subdued-medium leading-relaxed">
            One-click populate credentials to inspect client features or administrative controls:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="text-left p-2.5 bg-white border border-brand-subdued-border hover:border-brand-purple hover:bg-brand-purple/5 transition-colors"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-purple">
                Customer Demo
              </span>
              <span className="block text-caption text-brand-black truncate">aditya@atelier...</span>
              <span className="block text-[10px] text-brand-subdued-low">pass: password123</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="text-left p-2.5 bg-white border border-brand-subdued-border hover:border-brand-purple hover:bg-brand-purple/5 transition-colors"
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-black">
                Staff Admin
              </span>
              <span className="block text-caption text-brand-black truncate">admin@atelier...</span>
              <span className="block text-[10px] text-brand-subdued-low">pass: admin123</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="text-body-sm">
              <p className="font-semibold text-caption uppercase tracking-wider mb-0.5">Authentication Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
            >
              Email Address <span className="text-brand-purple">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-caption font-semibold uppercase tracking-wider text-brand-black"
              >
                Password <span className="text-brand-purple">*</span>
              </label>
              <Link
                to="/account/forgot-password"
                className="text-[11px] uppercase tracking-wider text-brand-purple hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium hover:text-brand-black transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full justify-center"
            rightIcon={<ArrowRight size={16} />}
          >
            Sign In to Atelier
          </Button>

          {/* Notice */}
          <div className="pt-2 text-center text-caption text-brand-subdued-medium">
            <span className="flex items-center justify-center gap-1.5 mb-1 text-[11px] text-brand-black uppercase tracking-wider font-semibold">
              <ShieldCheck size={14} className="text-brand-purple" />
              Cart & Wishlist Auto-Sync
            </span>
            <p className="text-[11px] text-brand-subdued-low leading-relaxed">
              Items currently in your guest bag will be seamlessly merged into your verified account.
            </p>
          </div>
        </form>

        {/* Create Account Link */}
        <div className="mt-8 text-center p-6 border border-brand-subdued-border bg-white">
          <p className="text-body-sm text-brand-black font-medium mb-2">
            New to Vastramay?
          </p>
          <p className="text-caption text-brand-subdued-medium mb-4">
            Create an account to gain bespoke sizing consultations, order tracking, and private collection previews.
          </p>
          <Link to={`/account/register${redirectPath !== '/account' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>
            <Button variant="secondary" size="md" className="w-full justify-center">
              Create Atelier Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
