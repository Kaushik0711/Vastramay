import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Breadcrumb, Button } from '@/components/ui';
import { SEO } from '@/components/common/SEO';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '@/data/faq';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    'faq-s1': true, // Open by default for immediate clarity
    'faq-r1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <SEO
        title="Frequently Asked Questions — Orders, Sizing, Delivery & Returns"
        description="Official answers to questions regarding Vastramay garments, bespoke alterations, domestic courier transit times, and return eligibility."
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Client Support' },
          { label: 'Frequently Asked Questions' },
        ]}
        className="mb-8"
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2 flex items-center justify-center gap-1.5">
          <HelpCircle size={14} /> Knowledge Repository
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight mb-3">
          Frequently Answered Questions
        </h1>
        <p className="text-body-base text-brand-subdued-medium">
          Comprehensive guidance regarding bespoke tailoring, insured dispatch, payment methods, and garment care.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-subdued-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords (e.g. shipping, returns, zardozi, sizing)..."
            className="w-full pl-11 pr-4 py-3 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-caption font-semibold uppercase tracking-wider transition-colors border ${
                isActive
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'bg-white text-brand-subdued-medium border-brand-subdued-border hover:border-brand-black hover:text-brand-black'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border shadow-sm mb-12">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isOpen = Boolean(openItemIds[item.id]);

            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-brand-subdued-surface/40 transition-colors"
                >
                  <span className="font-display text-lg sm:text-xl text-brand-black font-semibold">
                    {item.question}
                  </span>
                  <span
                    className={`p-1 text-brand-purple shrink-0 transition-transform duration-200 mt-0.5 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-0 text-body-base text-brand-subdued-medium leading-relaxed border-t border-brand-subdued-border/50 bg-brand-subdued-surface/20">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center space-y-3">
            <p className="font-display text-xl text-brand-black">No matching answers found</p>
            <p className="text-body-sm text-brand-subdued-medium max-w-sm mx-auto">
              We could not find an FAQ entry matching &ldquo;{search}&rdquo;. Try a different keyword or contact our concierge directly.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
            >
              Clear Search Query
            </Button>
          </div>
        )}
      </div>

      {/* Still Need Assistance CTA Banner */}
      <div className="border border-brand-subdued-border bg-brand-subdued-surface p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-white border border-brand-subdued-border flex items-center justify-center text-brand-purple mx-auto">
          <MessageSquare size={20} />
        </div>
        <h2 className="font-display text-2xl text-brand-black">Still Have Questions for the Atelier?</h2>
        <p className="text-body-sm text-brand-subdued-medium max-w-md mx-auto">
          Our styling concierge desk is available to assist with fabric choices, ceremonial timelines, and measurement reviews.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
            Contact Personal Concierge
          </Button>
        </Link>
      </div>
    </div>
  );
}
