import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Gem } from 'lucide-react';
import { Breadcrumb, Button } from '@/components/ui';
import { SEO } from '@/components/common/SEO';

const BRAND_VALUES = [
  {
    icon: Gem,
    title: 'Textile Provenance',
    description:
      'Rooted in the timeless textile traditions of Chanderi, Varanasi, and Patan. We source pure raw silks and handwoven brocades with reverence for regional weaver cooperatives.',
  },
  {
    icon: Compass,
    title: 'Architectural Tailoring',
    description:
      'Crisp geometric lines, precise shoulder construction, and zero-excess silhouettes designed to lend ceremonial grandeur to the modern Indian gentleman.',
  },
  {
    icon: ShieldCheck,
    title: 'Artisanal Integrity',
    description:
      'Handcrafted needlework, aari embellishment, and fine zardozi detailing executed by hereditary craftspeople with uncompromising attention to durability and drape.',
  },
  {
    icon: Sparkles,
    title: 'Contemporary Restraint',
    description:
      'We strip away unnecessary ostentation in favor of editorial balance, tonal depth, and disciplined luxury that commands attention through quiet confidence.',
  },
];

export default function AboutPage() {
  return (
    <div className="font-body">
      <SEO
        title="About the Atelier — Contemporary Ceremonial Menswear"
        description="Vastramay is an Indian luxury menswear atelier crafting architectural silhouettes, handwoven silk sherwanis, and ceremonial kurtas for celebrations."
      />

      {/* Hero Section */}
      <section className="border-b border-brand-subdued-border bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Atelier' },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-3">
                Atelier Manifesto
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-black tracking-tight leading-[1.08] mb-6">
                The Architecture of Ceremonial Elegance
              </h1>
              <p className="text-body-base text-brand-subdued-medium leading-relaxed mb-4">
                Vastramay was established with a singular vision: to honor centuries of authentic Indian craftsmanship while redefining the silhouette for the contemporary man.
              </p>
              <p className="text-body-sm text-brand-subdued-low leading-relaxed mb-8">
                Every kurta, structured bandhgala, and regal sherwani is conceived as a dialogue between architectural precision and artisanal textile heritage — created for weddings, festivities, and milestones.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/shop">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
                    Explore The Wardrobe
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="md">
                    Book Bespoke Appointment
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-brand-subdued-surface border border-brand-subdued-border overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
                  alt="Vastramay Atelier Editorial Lookbook"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-brand-black text-white p-4 border border-brand-subdued-border hidden sm:block max-w-xs">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-brand-purple mb-1">
                  Atelier Production Note
                </p>
                <p className="text-caption text-zinc-300 leading-snug">
                  Every garment is cut from individual pattern master drafts to ensure anatomical ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Grid */}
      <section className="py-16 sm:py-24 bg-brand-subdued-surface/40 border-b border-brand-subdued-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2">
              Our Principles
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
              Values That Define Our Handcraft
            </h2>
            <p className="text-body-sm text-brand-subdued-medium mt-2">
              We decline mass-manufactured shortcuts in favor of deliberate patience, ethical fabric sourcing, and honest pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="border border-brand-subdued-border bg-white p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 bg-brand-subdued-surface border border-brand-subdued-border flex items-center justify-center text-brand-purple mb-6">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display text-xl text-brand-black mb-3 font-semibold">
                      {val.title}
                    </h3>
                    <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Atelier Craftsmanship Story */}
      <section className="py-16 sm:py-24 bg-white border-b border-brand-subdued-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan Needlework Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <p className="text-label uppercase tracking-widest text-brand-purple font-semibold">
                Textile & Technique
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
                From Loom to Ceremonial Grandeur
              </h2>
              <div className="space-y-4 text-body-base text-brand-subdued-medium leading-relaxed">
                <p>
                  Each Vastramay creation begins in the historic handloom clusters of northern and central India. Here, master weavers intertwine spun silk threads with gilded zari to yield textiles of rare weight, luminous drape, and supple softness.
                </p>
                <p>
                  In our tailoring atelier, master patternmakers drape and construct each garment according to rigorous bespoke standards. Collars are lined with natural canvas to retain crisp posture; buttons are hand-turned from natural horn or brass; and seams are reinforced for effortless movement during hours of celebration.
                </p>
              </div>

              {/* Editable placeholder disclosure note as mandated */}
              <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border text-caption text-brand-subdued-low space-y-1">
                <p className="font-semibold text-brand-black uppercase tracking-wider text-[10px]">
                  [Configurable Brand Lore Placeholder]
                </p>
                <p className="text-[11px] leading-relaxed">
                  Specific studio founding dates, regional artisan cluster affiliations, and founder biographies can be customized in <code>src/config/brand.ts</code> without modifying component structure.
                </p>
              </div>

              <div className="pt-2">
                <Link to="/collections">
                  <Button variant="secondary" size="md" rightIcon={<ArrowRight size={14} />}>
                    View Seasonal Lookbooks
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-brand-black text-white text-center">
        <div className="max-w-[720px] mx-auto px-4">
          <p className="text-label uppercase tracking-widest text-purple-400 font-semibold mb-3">
            Bespoke Concierge
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4 text-white">
            Ready to Dress for Your Milestone?
          </h2>
          <p className="text-body-base text-zinc-400 mb-8 max-w-lg mx-auto">
            Explore ready-to-wear kurta sets, regal sherwanis, or reserve a private consultation with our master drapers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore All Ensembles
              </Button>
            </Link>
            <Link to="/size-guide">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-transparent text-white border-zinc-600 hover:bg-zinc-800"
              >
                Inspect Measurement Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
