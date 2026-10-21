import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const { register, isAuthenticated } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your full first and last name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the Atelier terms and privacy notice to continue.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });

      if (result.success) {
        // Update newsletter preference if checked
        if (newsletter) {
          useAuthStore.getState().updateProfile({ newsletterSubscribed: true });
        }
        navigate(redirectPath);
      } else {
        setError(result.error || 'Registration failed. Email may already be registered.');
      }
    } catch {
      setError('An unexpected error occurred during account registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Register' },
        ]}
        className="mb-8"
      />

      <div className="max-w-[520px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2">
            Client Registry
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-2">
            Create an Atelier Account
          </h1>
          <p className="text-body-sm text-brand-subdued-medium">
            Join the house of Vastramay for expedited checkouts, saved bridal measurements, and bespoke concierge updates.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="text-body-sm">
              <p className="font-semibold text-caption uppercase tracking-wider mb-0.5">Registration Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-first-name"
                className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
              >
                First Name <span className="text-brand-purple">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                <input
                  id="reg-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Vikram"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-last-name"
                className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
              >
                Last Name <span className="text-brand-purple">*</span>
              </label>
              <input
                id="reg-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Singhania"
                required
                className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="reg-email"
              className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
            >
              Email Address <span className="text-brand-purple">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxury.in"
                required
                className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="reg-phone"
              className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
            >
              Contact Number <span className="text-brand-subdued-low font-normal">(Optional for SMS delivery alerts)</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
            >
              Password <span className="text-brand-purple">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="reg-confirm-password"
              className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
            >
              Confirm Password <span className="text-brand-purple">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Preferences & T&C */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-none border-brand-subdued-border text-brand-purple focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-caption text-brand-subdued-medium leading-tight">
                Subscribe to private trunk show invitations, new festive arrivals, and bespoke atelier news.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-none border-brand-subdued-border text-brand-purple focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-caption text-brand-subdued-medium leading-tight">
                I agree to the Vastramay{' '}
                <Link to="/policies/terms" className="text-brand-black underline hover:text-brand-purple">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/policies/privacy" className="text-brand-black underline hover:text-brand-purple">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full justify-center mt-4"
            rightIcon={<ArrowRight size={16} />}
          >
            Complete Registration
          </Button>

          <div className="pt-2 text-center text-caption text-brand-subdued-medium flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-brand-purple" />
            <span>Guest bag items will automatically attach to your profile.</span>
          </div>
        </form>

        {/* Existing Account Link */}
        <div className="mt-8 text-center p-6 border border-brand-subdued-border bg-white">
          <p className="text-body-sm text-brand-black font-medium mb-2">
            Already have an Atelier account?
          </p>
          <Link to={`/account/login${redirectPath !== '/account' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}>
            <Button variant="secondary" size="md" className="w-full justify-center">
              Sign In Instead
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
