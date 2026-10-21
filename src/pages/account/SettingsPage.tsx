import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';

const SIZES = [
  { value: '36', label: '36 — XS (Chest 38")' },
  { value: '38', label: '38 — S (Chest 40")' },
  { value: '40', label: '40 — M (Chest 42")' },
  { value: '42', label: '42 — L (Chest 44")' },
  { value: '44', label: '44 — XL (Chest 46")' },
  { value: '46', label: '46 — XXL (Chest 48")' },
  { value: 'custom', label: 'Custom Master Bespoke Sizing' },
];

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredSize, setPreferredSize] = useState(user?.preferredSize || '40');
  const [newsletter, setNewsletter] = useState(user?.newsletterSubscribed ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center font-body">
        <div className="max-w-[480px] mx-auto border border-brand-subdued-border bg-white p-8">
          <SettingsIcon size={40} className="mx-auto text-brand-purple mb-4" />
          <h1 className="font-display text-2xl text-brand-black mb-2">Sign In to Edit Settings</h1>
          <p className="text-body-sm text-brand-subdued-medium mb-6">
            Configure your client profile, tailoring measurements, and communication channels.
          </p>
          <Link to="/account/login?redirect=/account/settings">
            <Button variant="primary" size="md" className="w-full justify-center">
              Sign In to Atelier
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      preferredSize,
      newsletterSubscribed: newsletter,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Profile & Settings' },
        ]}
        className="mb-8"
      />

      {/* Header bar */}
      <div className="pb-6 mb-8 border-b border-brand-subdued-border">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold flex items-center gap-1.5 mb-1.5">
          <SettingsIcon size={14} /> Account Preferences
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
          Client Profile & Sizing
        </h1>
        <p className="text-body-sm text-brand-subdued-medium mt-1">
          Manage your personal details, bespoke garment fitting preferences, and security settings.
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
          <p className="text-body-sm font-medium">
            Your client profile changes have been successfully saved to your Atelier record.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Personal Details Form */}
        <form onSubmit={handleSaveProfile} className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-3">
            <UserIcon size={18} className="text-brand-purple" /> Personal Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                First Name <span className="text-brand-purple">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Last Name <span className="text-brand-purple">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-3 py-2 text-body-sm border border-brand-subdued-border bg-brand-subdued-surface text-brand-subdued-medium cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-brand-subdued-low mt-1">
                To modify your primary account email, contact the Atelier Concierge.
              </p>
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Mobile Number (for Courier SMS)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sizing Preference */}
          <div className="pt-4 border-t border-brand-subdued-border">
            <h3 className="font-display text-lg text-brand-black flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-brand-purple" /> Preferred Garment Size
            </h3>
            <p className="text-caption text-brand-subdued-medium mb-3">
              We pre-select this size on all kurtas, bandhgalas, and sherwanis for seamless shopping.
            </p>
            <div className="max-w-[360px]">
              <select
                value={preferredSize}
                onChange={(e) => setPreferredSize(e.target.value)}
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
              >
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="pt-4 border-t border-brand-subdued-border space-y-3">
            <h3 className="font-display text-lg text-brand-black mb-2">
              Communication & Privileges
            </h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-none border-brand-subdued-border text-brand-purple focus:ring-0"
              />
              <div>
                <span className="text-body-sm font-medium text-brand-black block">
                  Atelier Dispatch & Exclusive Collections
                </span>
                <span className="text-caption text-brand-subdued-medium">
                  Receive private invitations to bridal trunk shows, seasonal launch previews, and VIP discounts.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Save Preferences
            </Button>
          </div>
        </form>

        {/* Security & Password */}
        <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-3">
            <Lock size={18} className="text-brand-purple" /> Security Credentials
          </h2>
          <p className="text-body-sm text-brand-subdued-medium">
            Your login password protects your stored addresses, order archive, and billing history.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-brand-black">Password</p>
              <p className="text-caption text-brand-subdued-low">Last changed during account creation</p>
            </div>
            <Link to="/account/forgot-password">
              <Button variant="secondary" size="sm">
                Request Password Reset
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
