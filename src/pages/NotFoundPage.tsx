import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Compass, ShoppingBag, Truck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui';
import { SEO } from '@/components/common/SEO';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 font-body text-center">
      <SEO
        title="Page Not Found (404) — Vastramay Atelier"
        description="The ceremonial archive or editorial page you are seeking is unlisted."
        noIndex={true}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
          Error 404 · Unlisted Archive
        </p>

        <h1 className="font-display text-4xl sm:text-6xl text-brand-black tracking-tight leading-tight">
          The Silhouette You Seek Has Transitioned
        </h1>

        <p className="text-body-base text-brand-subdued-medium leading-relaxed max-w-lg mx-auto">
          The ceremonial ensemble, campaign lookbook, or portfolio record you are seeking does not exist or has been curated into a new seasonal collection.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by garment title, fabric, or colorway..."
              className="w-full pl-4 pr-12 py-3 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-purple hover:text-brand-black transition-colors"
              aria-label="Search Catalog"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Primary Return to Shop CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop">
            <Button variant="primary" size="lg" rightIcon={<ShoppingBag size={16} />}>
              Explore Full Wardrobe
            </Button>
          </Link>
          <Link to="/collections">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={16} />}>
              View Campaign Collections
            </Button>
          </Link>
        </div>

        {/* Suggested Helpful Links */}
        <div className="pt-12 mt-12 border-t border-brand-subdued-border">
          <p className="text-caption font-semibold uppercase tracking-wider text-brand-black mb-6">
            Suggested Navigation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link
              to="/track-order"
              className="p-4 border border-brand-subdued-border bg-white hover:border-brand-purple hover:bg-brand-purple/5 transition-colors group"
            >
              <Truck size={18} className="text-brand-purple mb-2" />
              <h3 className="font-display font-semibold text-brand-black text-base group-hover:text-brand-purple">
                Track An Order
              </h3>
              <p className="text-caption text-brand-subdued-medium mt-1">
                Lookup live milestones using your order reference.
              </p>
            </Link>

            <Link
              to="/size-guide"
              className="p-4 border border-brand-subdued-border bg-white hover:border-brand-purple hover:bg-brand-purple/5 transition-colors group"
            >
              <Compass size={18} className="text-brand-purple mb-2" />
              <h3 className="font-display font-semibold text-brand-black text-base group-hover:text-brand-purple">
                Size & Fit Guide
              </h3>
              <p className="text-caption text-brand-subdued-medium mt-1">
                Anatomical measurements and grading charts.
              </p>
            </Link>

            <Link
              to="/contact"
              className="p-4 border border-brand-subdued-border bg-white hover:border-brand-purple hover:bg-brand-purple/5 transition-colors group"
            >
              <MessageSquare size={18} className="text-brand-purple mb-2" />
              <h3 className="font-display font-semibold text-brand-black text-base group-hover:text-brand-purple">
                Client Concierge
              </h3>
              <p className="text-caption text-brand-subdued-medium mt-1">
                Connect directly with a master draper.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
