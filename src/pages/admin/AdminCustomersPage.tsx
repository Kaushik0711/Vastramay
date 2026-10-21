import { useState } from 'react';
import {
  Search,
  Shield,
  Eye,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, useOrderStore } from '@/stores';
import { Button } from '@/components/ui';
import type { User, Address } from '@/types';

export default function AdminCustomersPage() {
  const { registeredUsers } = useAuthStore();
  const { orders } = useOrderStore();

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = registeredUsers.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const query = search.toLowerCase();
    return fullName.includes(query) || u.email.toLowerCase().includes(query) || (u.phone && u.phone.includes(query));
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Client Registry & Access Controls
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Customer Records & Profiles
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Review registered clientele, ceremonial order portfolios, saved delivery locations, and staff authorization boundaries.
          </p>
        </div>

        <div className="text-caption font-semibold text-brand-black">
          {registeredUsers.length} Registered Accounts
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border border-brand-subdued-border">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email address, or phone..."
            className="w-full pl-10 pr-4 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">Client Name</th>
              <th className="p-4">Contact Coordinates</th>
              <th className="p-4">Role & Access</th>
              <th className="p-4">Bespoke Size</th>
              <th className="p-4">Orders Placed</th>
              <th className="p-4">Member Since</th>
              <th className="p-4 text-right">Portfolio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {filteredUsers.map((u) => {
              // Count orders matching customer email or id
              const userOrders = orders.filter(
                (o) => o.customerId === u.id || o.shippingAddress.fullName.toLowerCase().includes(u.lastName.toLowerCase()),
              );

              return (
                <tr key={u.id} className="hover:bg-brand-subdued-surface/40 transition-colors">
                  <td className="p-4 font-display font-semibold text-brand-black text-base">
                    {u.firstName} {u.lastName}
                  </td>

                  <td className="p-4">
                    <p className="text-body-sm text-brand-black">{u.email}</p>
                    <p className="text-caption text-brand-subdued-medium">{u.phone || 'Phone not provided'}</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-caption uppercase tracking-wider font-semibold ${
                        u.role === 'admin'
                          ? 'bg-brand-purple text-white'
                          : u.role === 'staff'
                          ? 'bg-brand-black text-white'
                          : 'bg-brand-subdued-surface text-brand-black border border-brand-subdued-border'
                      }`}
                    >
                      {u.role === 'admin' && <Shield size={10} />}
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-caption font-medium text-brand-black">
                    {u.preferredSize ? (
                      <span className="flex items-center gap-1">
                        <Sparkles size={11} className="text-brand-purple" />
                        Size {u.preferredSize}
                      </span>
                    ) : (
                      <span className="text-brand-subdued-low">Standard</span>
                    )}
                  </td>

                  <td className="p-4 text-caption text-brand-black font-semibold">
                    {userOrders.length} order(s)
                  </td>

                  <td className="p-4 text-caption text-brand-subdued-medium">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                      className="p-1.5"
                      title="Inspect Portfolio"
                    >
                      <Eye size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer Portfolio Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <div>
                <p className="text-caption uppercase tracking-wider text-brand-purple font-semibold">
                  Client Record
                </p>
                <h2 className="font-display text-2xl text-brand-black">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-caption">
              <div className="border border-brand-subdued-border p-4 space-y-2 bg-brand-subdued-surface/30">
                <p className="font-semibold text-brand-black uppercase tracking-wider">Coordinates</p>
                <p>Email: <strong className="text-brand-black">{selectedUser.email}</strong></p>
                <p>Phone: <strong className="text-brand-black">{selectedUser.phone || 'N/A'}</strong></p>
                <p>Account Role: <span className="uppercase font-bold text-brand-purple">{selectedUser.role}</span></p>
                <p>Newsletter Subscription: <strong>{selectedUser.newsletterSubscribed ? 'Opted In' : 'Opted Out'}</strong></p>
              </div>

              <div>
                <p className="font-semibold text-brand-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={13} className="text-brand-purple" /> Saved Delivery Addresses ({selectedUser.addresses?.length || 0})
                </p>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((a: Address) => (
                      <div key={a.id} className="p-3 border border-brand-subdued-border space-y-0.5">
                        <p className="font-semibold text-brand-black">{a.fullName} {a.isDefault ? '(Default)' : ''}</p>
                        <p>{a.addressLine1}</p>
                        <p>{a.city}, {a.state} {a.postalCode}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-subdued-medium italic">No addresses saved in address book.</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-brand-subdued-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedUser(null)}>
                Close Portfolio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
