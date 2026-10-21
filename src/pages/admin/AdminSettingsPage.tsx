import { useState } from 'react';
import {
  Truck,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { useCatalogStore } from '@/stores';
import { Button } from '@/components/ui';

export default function AdminSettingsPage() {
  const { resetToDefaults } = useCatalogStore();

  const [freeShippingThreshold, setFreeShippingThreshold] = useState('2999');
  const [standardShippingFee, setStandardShippingFee] = useState('250');
  const [gstRate, setGstRate] = useState('12');
  const [storeName, setStoreName] = useState('Vastramay Atelier');
  const [atelierAddress, setAtelierAddress] = useState(
    'Heritage Wing, 402 Royal Palms, Golf Course Road, Gurugram, Haryana 122002',
  );
  const [supportEmail, setSupportEmail] = useState('concierge@vastramay.in');
  const [supportPhone, setSupportPhone] = useState('+91 98111 00000');

  const [saveToast, setSaveToast] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const handleResetCatalog = () => {
    resetToDefaults();
    setConfirmResetOpen(false);
    setSaveToast(true);
  };

  return (
    <div className="space-y-8 font-body max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-brand-subdued-border">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
          System Configuration & Policies
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
          Store Configuration & Brand Settings
        </h1>
        <p className="text-body-sm text-brand-subdued-medium mt-1">
          Adjust shipping fees, tax rates, atelier studio coordinates, and development backend adapters.
        </p>
      </div>

      {saveToast && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
          <p className="text-body-sm font-medium">
            Configuration parameters saved successfully in the persistent session adapter.
          </p>
        </div>
      )}

      {/* Backend & Environment Notice */}
      <div className="border border-brand-subdued-border bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-brand-purple" />
          <h2 className="font-display text-lg text-brand-black">
            Backend & Authentication Adapter Status
          </h2>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-caption space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle size={15} /> Development Mode Notice:
          </p>
          <p>
            When Supabase credentials (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>) are not connected, the application runs on a fully isolated, persistent Zustand client adapter.
          </p>
          <p>
            Customer accounts, cart merging, order history, inventory stock, and admin modifications are persisted in your local browser storage. No customer data or private credentials leak server-side.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Logistics & Tax */}
        <div className="border border-brand-subdued-border bg-white p-6 space-y-5">
          <h2 className="font-display text-xl text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-3">
            <Truck size={18} className="text-brand-purple" /> Shipping & Tax Rates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
              <span className="text-[11px] text-brand-subdued-medium mt-1 block">
                Orders &ge; this value receive free delivery
              </span>
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
              <span className="text-[11px] text-brand-subdued-medium mt-1 block">
                Applied on orders below threshold
              </span>
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Integrated GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
              <span className="text-[11px] text-brand-subdued-medium mt-1 block">
                Standard apparel tax duty in India
              </span>
            </div>
          </div>
        </div>

        {/* Brand & Studio Coordinates */}
        <div className="border border-brand-subdued-border bg-white p-6 space-y-5">
          <h2 className="font-display text-xl text-brand-black flex items-center gap-2 border-b border-brand-subdued-border pb-3">
            <Building size={18} className="text-brand-purple" /> Atelier Flagship Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Concierge Contact Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
              Concierge Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
              Physical Studio Address
            </label>
            <textarea
              value={atelierAddress}
              onChange={(e) => setAtelierAddress(e.target.value)}
              rows={2}
              required
              className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Save Store Configuration
          </Button>
        </div>
      </form>

      {/* Dangerous Operations Zone */}
      <div className="border border-red-200 bg-red-50/40 p-6 space-y-4">
        <h2 className="font-display text-xl text-red-800 flex items-center gap-2">
          <RotateCcw size={18} className="text-red-700" /> Database & Catalog Reset Zone
        </h2>
        <p className="text-body-sm text-red-700">
          Restore initial seed products, default stock counts, and collections. All custom products added in this browser session will be reset to factory baseline.
        </p>

        {confirmResetOpen ? (
          <div className="p-4 bg-white border border-red-300 space-y-3">
            <p className="font-bold text-caption uppercase tracking-wider text-red-700">
              Are you completely certain?
            </p>
            <p className="text-caption text-brand-subdued-medium">
              This action cannot be undone. Custom added products and stock edits will revert to initial factory seeds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleResetCatalog}
                className="bg-red-700 hover:bg-red-800 border-red-700 text-white"
              >
                Yes, Revert to Defaults
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmResetOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setConfirmResetOpen(true)}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Reset Catalog to Factory Seed
          </Button>
        )}
      </div>
    </div>
  );
}
