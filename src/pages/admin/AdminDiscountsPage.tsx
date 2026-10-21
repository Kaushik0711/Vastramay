import { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui';

interface PromoDiscount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
  isActive: boolean;
  usageCount: number;
}

const INITIAL_DISCOUNTS: PromoDiscount[] = [
  {
    id: 'disc-01',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minSpend: 0,
    description: '10% welcome privilege on initial atelier order',
    isActive: true,
    usageCount: 42,
  },
  {
    id: 'disc-02',
    code: 'ROSE1000',
    type: 'fixed',
    value: 1000,
    minSpend: 10000,
    description: '₹1,000 off luxury orders exceeding ₹10,000',
    isActive: true,
    usageCount: 28,
  },
  {
    id: 'disc-03',
    code: 'FESTIVE15',
    type: 'percentage',
    value: 15,
    minSpend: 15000,
    description: '15% seasonal festive celebration privilege',
    isActive: true,
    usageCount: 19,
  },
  {
    id: 'disc-04',
    code: 'ROYAL500',
    type: 'fixed',
    value: 500,
    minSpend: 5000,
    description: '₹500 privilege voucher for registered patrons',
    isActive: false,
    usageCount: 65,
  },
];

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<PromoDiscount[]>(INITIAL_DISCOUNTS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('10');
  const [minSpend, setMinSpend] = useState('5000');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)),
    );
  };

  const handleDelete = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Promo code is required.');
      return;
    }

    if (discounts.some((d) => d.code === cleanCode)) {
      setError('A promo code with this name already exists.');
      return;
    }

    const valNum = Number(value);
    if (isNaN(valNum) || valNum <= 0) {
      setError('Please provide a valid positive discount value.');
      return;
    }

    const newDisc: PromoDiscount = {
      id: `disc-${Date.now()}`,
      code: cleanCode,
      type,
      value: valNum,
      minSpend: minSpend ? Number(minSpend) : 0,
      description: description.trim() || `${cleanCode} promotional offer`,
      isActive: true,
      usageCount: 0,
    };

    setDiscounts([newDisc, ...discounts]);
    setIsAddOpen(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Promotions & Campaigns
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Discount Rules & Vouchers
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Configure bridal promo codes, cart threshold reductions, and seasonal campaign incentives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus size={14} />}
        >
          Create Promo Code
        </Button>
      </div>

      {/* Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">Voucher Code</th>
              <th className="p-4">Type & Benefit</th>
              <th className="p-4">Minimum Cart Value</th>
              <th className="p-4">Times Redeemed</th>
              <th className="p-4">Rule Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-brand-subdued-surface/40 transition-colors">
                <td className="p-4">
                  <span className="font-mono font-bold text-brand-purple text-base block">
                    {d.code}
                  </span>
                  <span className="text-caption text-brand-subdued-medium line-clamp-1">
                    {d.description}
                  </span>
                </td>

                <td className="p-4">
                  <span className="font-display font-semibold text-brand-black text-base">
                    {d.type === 'percentage' ? `${d.value}% Off` : `₹${d.value.toLocaleString('en-IN')} Flat`}
                  </span>
                  <span className="text-[10px] text-brand-subdued-low uppercase tracking-wider block">
                    {d.type} concession
                  </span>
                </td>

                <td className="p-4 text-caption text-brand-black">
                  {d.minSpend && d.minSpend > 0 ? (
                    <span>₹{d.minSpend.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-brand-subdued-medium">No minimum</span>
                  )}
                </td>

                <td className="p-4 text-caption font-semibold text-brand-black">
                  {d.usageCount} checkouts
                </td>

                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => handleToggle(d.id)}
                    className={`px-2.5 py-0.5 text-caption font-semibold uppercase tracking-wider border cursor-pointer ${
                      d.isActive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    {d.isActive ? 'Active' : 'Paused'}
                  </button>
                </td>

                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 text-brand-subdued-medium hover:text-red-600 border border-brand-subdued-border bg-white"
                    title="Delete promo code"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-lg text-brand-black flex items-center gap-2">
                <Tag size={16} className="text-brand-purple" /> Add Promo Code
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-caption flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Voucher Code <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  required
                  className="w-full px-3 py-2 text-body-sm font-mono border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                    Concession Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                    Value {type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    min={1}
                    className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Minimum Cart Subtotal (₹)
                </label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Campaign Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Exclusive 20% festive privilege"
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Activate Voucher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
