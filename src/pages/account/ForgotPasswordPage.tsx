import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email.trim());
      setMessage(result.message);
      setSubmitted(true);
    } catch {
      setError('Unable to process recovery request. Please try again.');
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
          { label: 'Password Recovery' },
        ]}
        className="mb-8"
      />

      <div className="max-w-[480px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2 flex items-center justify-center gap-1.5">
            <KeyRound size={14} />
            Security & Recovery
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-body-sm text-brand-subdued-medium">
            Enter your registered Atelier email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-display text-2xl text-brand-black">Dispatch Successful</h2>
            <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
              {message}
            </p>
            <div className="p-3 bg-brand-subdued-surface border border-brand-subdued-border text-[11px] text-brand-subdued-low text-left">
              <strong>Simulated Adapter Notice:</strong> In local demo mode, check your browser console or use our demo credentials directly:
              <br />
              <code className="text-brand-purple">aditya@vastramay.in / password123</code>
            </div>
            <div className="pt-2">
              <Link to="/account/login">
                <Button variant="primary" size="md" className="w-full justify-center" leftIcon={<ArrowLeft size={16} />}>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-body-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="forgot-email"
                className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
              >
                Registered Email Address <span className="text-brand-purple">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full justify-center"
              rightIcon={<ArrowRight size={16} />}
            >
              Send Recovery Instructions
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/account/login"
                className="inline-flex items-center gap-1.5 text-caption uppercase tracking-wider text-brand-subdued-medium hover:text-brand-purple transition-colors font-medium"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
