import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalogStore } from '@/stores';
import { Button } from '@/components/ui';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useCatalogStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.id || 'kurta-sets');
  const [newPrice, setNewPrice] = useState('8999');
  const [newComparePrice, setNewComparePrice] = useState('11999');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
  );
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim()) {
      setFormError('Product title is required.');
      return;
    }

    const priceNum = Number(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid base price.');
      return;
    }

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = `prod-${Date.now().toString().slice(-4)}`;

    const product: Product = {
      id,
      title: newTitle.trim(),
      slug,
      description:
        newDescription.trim() ||
        'Handcrafted with pristine heritage craftsmanship and tailored for royal celebrations.',
      basePrice: priceNum,
      compareAtPrice: newComparePrice ? Number(newComparePrice) : undefined,
      categoryId: newCategory,
      collectionIds: ['imperial-velvet'],
      images: [
        {
          id: `${id}-img-1`,
          url: newImage.trim(),
          alt: newTitle.trim(),
          sortOrder: 0,
        },
      ],
      variants: [
        {
          id: `${id}-var-m`,
          sku: `${slug.slice(0, 4).toUpperCase()}-M`,
          color: 'Imperial Royal',
          size: 'M',
          price: priceNum,
          stock: 12,
          isAvailable: true,
        },
        {
          id: `${id}-var-l`,
          sku: `${slug.slice(0, 4).toUpperCase()}-L`,
          color: 'Imperial Royal',
          size: 'L',
          price: priceNum,
          stock: 8,
          isAvailable: true,
        },
      ],
      tags: ['New Arrival', 'Festive Exclusive'],
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(product);
    setIsAddOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      title: editingProduct.title,
      basePrice: editingProduct.basePrice,
      compareAtPrice: editingProduct.compareAtPrice,
    });
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Merchandise & SKUs
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Create, update pricing, and adjust live visibility across all atelier collections.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus size={14} />}
        >
          Add New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-brand-subdued-border">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or SKU..."
            className="w-full pl-10 pr-4 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">Product & Visual</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base Price (INR)</th>
              <th className="p-4">Variants</th>
              <th className="p-4">Total Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {filteredProducts.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

              return (
                <tr key={p.id} className="hover:bg-brand-subdued-surface/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                        <img
                          src={p.images[0]?.url || ''}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="font-display font-semibold text-brand-black hover:text-brand-purple flex items-center gap-1.5"
                        >
                          {p.title}
                          <ExternalLink size={12} className="text-brand-subdued-medium" />
                        </Link>
                        <p className="text-caption text-brand-subdued-medium">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 text-caption uppercase tracking-wider bg-brand-subdued-surface border border-brand-subdued-border text-brand-black">
                      {p.categoryId}
                    </span>
                  </td>

                  <td className="p-4 font-display font-semibold text-brand-black">
                    ₹{p.basePrice.toLocaleString('en-IN')}
                    {p.compareAtPrice && (
                      <span className="text-caption text-brand-subdued-medium line-through block font-normal">
                        ₹{p.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-caption text-brand-subdued-medium">
                    {p.variants.length} sizes / colors
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-caption font-bold ${
                        totalStock > 10
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : totalStock > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {totalStock} units
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-brand-subdued-medium hover:text-brand-black border border-brand-subdued-border bg-white"
                        title="Edit Price & Details"
                      >
                        <Edit2 size={14} />
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="flex items-center gap-1 bg-red-50 px-2 py-1 border border-red-200">
                          <span className="text-[11px] text-red-700">Delete?</span>
                          <button
                            type="button"
                            onClick={() => {
                              deleteProduct(p.id);
                              setDeleteConfirmId(null);
                            }}
                            className="text-[11px] font-bold text-red-700 underline"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[11px] text-brand-subdued-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-brand-subdued-medium hover:text-red-600 border border-brand-subdued-border bg-white"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-xl text-brand-black flex items-center gap-2">
                <Sparkles size={18} className="text-brand-purple" /> Add Atelier Garment
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-caption flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Garment Title <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Nawabi Silk Kurta Set"
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                    Base Price (₹) <span className="text-brand-purple">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    min={1}
                    className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Compare At / MRP (₹)
                </label>
                <input
                  type="number"
                  value={newComparePrice}
                  onChange={(e) => setNewComparePrice(e.target.value)}
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Hero Editorial Image URL
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Editorial Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Artisan hand-embroidery details, weave provenance, silhouette description..."
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Edit Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-lg text-brand-black">Edit Garment</h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Garment Title
                </label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Selling Base Price (₹)
                </label>
                <input
                  type="number"
                  value={editingProduct.basePrice}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })
                  }
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Original MRP / Compare Price (₹)
                </label>
                <input
                  type="number"
                  value={editingProduct.compareAtPrice || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      compareAtPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
