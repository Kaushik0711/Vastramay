import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Breadcrumb, Button } from '@/components/ui';
import type { Address } from '@/types';

interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const INITIAL_FORM: AddressFormData = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

export default function AddressesPage() {
  const { user, isAuthenticated, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center font-body">
        <div className="max-w-[480px] mx-auto border border-brand-subdued-border bg-white p-8">
          <MapPin size={40} className="mx-auto text-brand-purple mb-4" />
          <h1 className="font-display text-2xl text-brand-black mb-2">Sign In to View Addresses</h1>
          <p className="text-body-sm text-brand-subdued-medium mb-6">
            Saved delivery addresses allow single-click checkout and tailored delivery routing.
          </p>
          <Link to="/account/login?redirect=/account/addresses">
            <Button variant="primary" size="md" className="w-full justify-center">
              Sign In to Atelier
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const addresses = user.addresses || [];

  const handleOpenAdd = () => {
    setError(null);
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || '',
      isDefault: addresses.length === 0,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setError(null);
    setEditingId(addr.id);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: Boolean(addr.isDefault),
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      setError('Please complete all mandatory address fields marked with *');
      return;
    }

    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setError('Postal code must be a valid 6-digit Indian PIN code.');
      return;
    }

    if (editingId) {
      updateAddress(editingId, {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        isDefault: formData.isDefault,
      });
      if (formData.isDefault) {
        setDefaultAddress(editingId);
      }
    } else {
      addAddress({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        isDefault: formData.isDefault || addresses.length === 0,
      });
    }

    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Saved Addresses' },
        ]}
        className="mb-8"
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold flex items-center gap-1.5 mb-1.5">
            <MapPin size={14} /> Address Book
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Delivery Locations
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Manage your residential, office, and celebration venue addresses for insured courier dispatch.
          </p>
        </div>

        {!isEditing && (
          <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={<Plus size={14} />}>
            Add New Address
          </Button>
        )}
      </div>

      {/* Address Edit / Add Form */}
      {isEditing && (
        <div className="border border-brand-subdued-border bg-white p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-subdued-border">
            <h2 className="font-display text-xl text-brand-black">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-brand-subdued-medium hover:text-brand-black p-1"
              aria-label="Cancel"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-body-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Recipient Full Name <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full pl-10 pr-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Contact Phone <span className="text-brand-purple">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Flat, House No., Building, Apartment <span className="text-brand-purple">*</span>
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                required
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                placeholder="House / Apartment / Villa details"
              />
            </div>

            <div>
              <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                Area, Street, Sector, Village <span className="text-brand-subdued-low font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                placeholder="Street / Colony / Landmark"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  City <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                  placeholder="e.g. New Delhi"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  State / Province <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                  placeholder="e.g. Delhi NCR"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  PIN Code <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                  maxLength={6}
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                  placeholder="6 digits"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded-none border-brand-subdued-border text-brand-purple focus:ring-0"
                />
                <span className="text-caption text-brand-black font-medium">
                  Set this as my primary default delivery address
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subdued-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Address
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards Grid */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr: Address) => (
            <div
              key={addr.id}
              className={`border bg-white p-6 relative flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-brand-purple ring-1 ring-brand-purple'
                  : 'border-brand-subdued-border'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display text-lg text-brand-black font-semibold">
                      {addr.fullName}
                    </h3>
                    <p className="text-caption text-brand-subdued-medium flex items-center gap-1 mt-0.5">
                      <Phone size={12} className="text-brand-purple" /> {addr.phone}
                    </p>
                  </div>

                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-purple text-white">
                      <Check size={11} /> Default
                    </span>
                  )}
                </div>

                {/* Address lines */}
                <div className="text-body-sm text-brand-subdued-medium space-y-1 mb-6">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} — {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-brand-subdued-border flex flex-wrap items-center justify-between gap-3 text-caption">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-brand-purple hover:underline font-semibold uppercase tracking-wider text-[11px]"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-brand-subdued-low uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-brand-purple" /> Primary Location
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="text-brand-black hover:text-brand-purple font-medium flex items-center gap-1 uppercase tracking-wider text-[11px]"
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  {deleteConfirmId === addr.id ? (
                    <div className="flex items-center gap-2 bg-red-50 px-2 py-1 border border-red-200">
                      <span className="text-[11px] text-red-700">Confirm?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(addr.id)}
                        className="text-[11px] font-bold text-red-700 underline"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-[11px] text-brand-subdued-medium"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(addr.id)}
                      className="text-brand-subdued-medium hover:text-red-600 font-medium flex items-center gap-1 uppercase tracking-wider text-[11px]"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-brand-subdued-border bg-white p-12 text-center max-w-[480px] mx-auto">
          <MapPin size={40} className="mx-auto text-brand-purple mb-4" />
          <h2 className="font-display text-2xl text-brand-black mb-2">No Saved Addresses</h2>
          <p className="text-body-sm text-brand-subdued-medium mb-6">
            Add your primary residence or tailoring delivery destination to streamline future bespoke checkouts.
          </p>
          <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus size={15} />}>
            Add First Address
          </Button>
        </div>
      )}
    </div>
  );
}
