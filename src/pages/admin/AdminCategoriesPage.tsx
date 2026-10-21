import { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import { useCatalogStore } from '@/stores';
import { Button } from '@/components/ui';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { categories, products, collections, addCategory, updateCategory, deleteCategory } =
    useCatalogStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
  );

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    addCategory({
      id: slug,
      name: name.trim(),
      slug,
      description: description.trim() || 'Curated luxury handcrafted ceremonial wear.',
      image: image.trim(),
      sortOrder: categories.length + 1,
    });

    setIsAddOpen(false);
    setName('');
    setDescription('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      image: editingCategory.image,
    });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-subdued-border">
        <div>
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
            Taxonomy & Groupings
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
            Categories & Collections
          </h1>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Organize catalog hierarchies, department landing pages, and campaign narratives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus size={14} />}
        >
          Add New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-brand-black flex items-center gap-2">
          <FolderTree size={18} className="text-brand-purple" /> Active Storefront Categories ({categories.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;

            return (
              <div
                key={c.id}
                className="border border-brand-subdued-border bg-white flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="h-40 bg-brand-subdued-surface relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-brand-black text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                      {count} Garments
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl text-brand-black">{c.name}</h3>
                    <p className="text-caption text-brand-subdued-low font-mono mt-0.5">
                      slug: /{c.slug}
                    </p>
                    <p className="text-body-sm text-brand-subdued-medium mt-2 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-brand-subdued-border bg-brand-subdued-surface/30 flex items-center justify-between text-caption">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(c)}
                    className="text-brand-purple hover:underline font-semibold flex items-center gap-1 uppercase tracking-wider text-[11px]"
                  >
                    <Edit2 size={12} /> Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(c.id)}
                    className="text-brand-subdued-medium hover:text-red-600 flex items-center gap-1 uppercase tracking-wider text-[11px]"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Editorial Collections */}
      <div className="space-y-4 pt-4 border-t border-brand-subdued-border">
        <h2 className="font-display text-xl text-brand-black flex items-center gap-2">
          <Sparkles size={18} className="text-brand-purple" /> Editorial Campaign Collections ({collections.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="border border-brand-subdued-border bg-white p-5 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-purple block">
                Editorial Campaign
              </span>
              <h3 className="font-display text-lg text-brand-black font-semibold">{col.name}</h3>
              <p className="text-caption text-brand-subdued-medium">{col.description}</p>
              <div className="pt-2 text-caption font-mono text-[11px] text-brand-subdued-low">
                route: /collections/{col.slug}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-lg text-brand-black">Add New Category</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Category Name <span className="text-brand-purple">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bandhgala Suits"
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Summary of this department..."
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subdued-border max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-subdued-border">
              <h2 className="font-display text-lg text-brand-black">Edit Category</h2>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-brand-subdued-medium hover:text-brand-black"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1">
                  Description
                </label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-subdued-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingCategory(null)}
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
