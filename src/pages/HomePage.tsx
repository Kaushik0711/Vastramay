import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  Scissors,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BRAND } from '@/config';
import { PRODUCTS, CATEGORIES, COLLECTIONS } from '@/data';
import { newsletterService } from '@/services';
import { ProductCard, Featured3DSlider } from '@/components/product';
import { Button, Badge, LoadingIndicator } from '@/components/ui';
import { SEO, EditorialTextReveal } from '@/components/common';

export default function HomePage() {
  const [journalEmail, setJournalEmail] = useState('');
  const [journalStatus, setJournalStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Parallax tracking references for editorial campaign imagery
  const heroImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroImageRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '10%']);

  const campaignRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: campaignProgress } = useScroll({
    target: campaignRef,
    offset: ['start end', 'end start'],
  });
  const campaignImageY = useTransform(campaignProgress, [0, 1], ['-6%', '6%']);

  // Product allocation ensuring ZERO duplicates across all homepage sections:
  // 1. New Arrivals: 4 newest products (sorted by createdAt)
  const newArrivals = PRODUCTS.filter((p) => p.isNew)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4); // [prod-10, prod-9, prod-12, prod-6]

  // 2. Runway Coverflow: 4 distinct statement ceremonial showpieces
  const runwayProducts = PRODUCTS.filter((p) =>
    ['prod-1', 'prod-2', 'prod-4', 'prod-8'].includes(p.id),
  );

  // 3. Signature Silhouettes (Best Sellers): 4 classic timeless staples
  const bestSellers = PRODUCTS.filter((p) =>
    ['prod-3', 'prod-5', 'prod-7', 'prod-11'].includes(p.id),
  );

  const featuredCollection = COLLECTIONS[0]; // Autumn/Winter Editorial

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJournalStatus(null);
    setIsSubscribing(true);

    try {
      const res = await newsletterService.subscribe(journalEmail);
      if (res.success) {
        setJournalStatus({ type: 'success', text: res.message });
        setJournalEmail('');
      } else {
        setJournalStatus({ type: 'error', text: res.message });
      }
    } catch {
      setJournalStatus({
        type: 'error',
        text: 'Unable to connect to the journal service. Please try again.',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="font-body text-brand-black bg-white overflow-hidden">
      <SEO
        title="Vastramay — Modern Indian Fashion & Contemporary Style"
        description="Atelier Vastramay crafts contemporary Indian fashion, artisanal handlooms, tailored kurtas, festive regalia, and fine handcrafted accessories."
      />

      {/* ─────────────────────────────────────────────────────────────
          2. Large Editorial Hero Section
      ───────────────────────────────────────────────────────────── */}
      <section
        id="editorial-hero"
        aria-label="New Season Campaign Hero"
        className="relative border-b border-brand-subdued-border bg-white"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-116px)] sm:min-h-[640px] lg:min-h-[720px]">
          {/* Left Text Column: Disciplined Whitespace & Clear Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-24 z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4 sm:mb-6">
                <Badge variant="purple" size="sm">
                  Autumn / Winter '26 Collection
                </Badge>
              </div>

              {/* Accessible Editorial Hero Title Reveal */}
              <EditorialTextReveal
                text="Contemporary Style. Distinctive by Design."
                italicIndices={[2, 3]}
                className="font-display text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.25rem] leading-[1.04] text-brand-black tracking-tight mb-6"
              />

              <p className="font-body text-body-base sm:text-body-lg text-brand-subdued-medium mb-8 sm:mb-10 max-w-md leading-relaxed">
                Handcrafted artisanal silhouettes, heritage handloom silks, and refined contemporary tailoring.
                Consciously designed for celebrations of timeless distinction.
              </p>

              {/* Primary & Secondary Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to="/shop?filter=new" id="hero-primary-cta">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                    className="w-full sm:w-auto"
                  >
                    Explore The New Season
                  </Button>
                </Link>
                <Link to="/collections" id="hero-secondary-cta">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    View Collections
                  </Button>
                </Link>
              </div>

              {/* Editorial provenance footnote */}
              <div className="mt-12 sm:mt-16 pt-6 border-t border-brand-subdued-border flex items-center justify-between text-caption text-brand-subdued-low">
                <span>Artisanal Craftsmanship</span>
                <span>Bengaluru · Varanasi · Kashmir</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image Column: Authentic Editorial Campaign Photography with Subtle Parallax */}
          <div
            ref={heroImageRef}
            className="lg:col-span-7 relative bg-brand-subdued-surface min-h-[380px] sm:min-h-[480px] lg:min-h-full overflow-hidden order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-brand-subdued-border"
          >
            <motion.div
              style={{ y: heroImageY }}
              className="w-full h-[112%] -top-[6%] relative will-change-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85"
                alt="Editorial campaign presentation of handcrafted Vastramay contemporary fashion"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </motion.div>

            {/* Subtle editorial watermark */}
            <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 text-[10px] uppercase font-semibold tracking-widest text-brand-black border border-brand-subdued-border z-10">
              Editorial '26
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Features & Trust Strip
      ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-brand-subdued-border bg-white" id="trust-strip">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-subdued-border">
          {[
            {
              icon: <Truck size={18} className="text-brand-purple" />,
              title: 'Complimentary Shipping',
              desc: 'On all domestic orders across India over ₹1,999',
            },
            {
              icon: <RefreshCw size={18} className="text-brand-purple" />,
              title: '7-Day Return & Size Exchange',
              desc: 'Seamless doorstep pick-up and instant exchanges',
            },
            {
              icon: <ShieldCheck size={18} className="text-brand-purple" />,
              title: 'Authentic Handloom Certified',
              desc: 'Pure silks, natural dyes, and GI-tagged weaves',
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-center gap-4 py-5 px-6 sm:px-8">
              <div className="shrink-0">{feature.icon}</div>
              <div>
                <p className="font-body text-body-sm font-semibold text-brand-black">
                  {feature.title}
                </p>
                <p className="font-body text-caption text-brand-subdued-medium mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. New Arrivals Product Section
      ───────────────────────────────────────────────────────────── */}
      <section
        id="new-arrivals"
        aria-label="New Arrivals"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto border-b border-brand-subdued-border"
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12"
        >
          <div>
            <p className="text-label uppercase tracking-widest text-brand-purple mb-2 flex items-center gap-1.5">
              <Sparkles size={13} />
              Fresh From The Loom
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-btn uppercase font-medium text-brand-black hover:text-brand-purple hover:underline transition-colors py-2"
          >
            <span>View All New Pieces ({PRODUCTS.filter((p) => p.isNew).length})</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* 4-Column Product Grid (3:4 ratio) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} aspectRatio="3/4" />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. Shop by Category Section (Legible Structured Placards)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="shop-by-category"
        aria-label="Shop by Category"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto border-b border-brand-subdued-border"
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
            The Silhouettes
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-3">
            Shop by Category
          </h2>
          <p className="text-body-base text-brand-subdued-medium">
            Explore curated sartorial silhouettes tailored in pure natural silks and breathable cottons.
          </p>
        </motion.div>

        {/* 5-Column Responsive Category Grid with Structured Bottom Placards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group block relative bg-white border border-brand-subdued-border hover:border-brand-purple transition-colors"
            >
              {/* Category Image (3:4 portrait) */}
              <div className="aspect-[3/4] w-full overflow-hidden bg-brand-subdued-surface">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-gray-100" />
                )}
              </div>

              {/* Bottom Structured Placard — High Legibility */}
              <div className="p-4 border-t border-brand-subdued-border bg-white flex flex-col justify-between min-h-[5.25rem]">
                <h3 className="font-display text-base sm:text-lg text-brand-black group-hover:text-brand-purple transition-colors tracking-tight leading-snug">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-brand-subdued-medium group-hover:text-brand-purple transition-colors mt-2">
                  <span>Explore</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. Featured Collection Section (Distinct Editorial Narrative & Craft Breakdown)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="featured-collection"
        aria-label="Featured Collection"
        className="border-b border-brand-subdued-border bg-brand-subdued-surface"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Large Editorial Campaign Photography */}
          <div className="lg:col-span-6 relative aspect-[4/5] lg:aspect-auto lg:min-h-[640px] overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-subdued-border">
            <img
              src={featuredCollection.image}
              alt={featuredCollection.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-6 left-6">
              <Badge variant="purple" size="sm">
                Curated Showcase
              </Badge>
            </div>
          </div>

          {/* Right: Editorial Narrative & Craft Provenance — Coherent composition without accidental gaps */}
          <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center gap-8 bg-white">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
                  Editorial Spotlight
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight leading-tight">
                  {featuredCollection.name}
                </h2>
              </div>

              <p className="text-body-base sm:text-body-lg text-brand-subdued-medium leading-relaxed max-w-lg">
                {featuredCollection.description} Designed for royal ceremonies and intimate soirées,
                celebrating the deep heritage of Indian loomcraft with a razor-sharp modern sensibility.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to={`/collections/${featuredCollection.slug}`}>
                  <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
                    Explore Collection
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="secondary" size="md">
                    Atelier Heritage
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Atelier Craftsmanship & Provenance Breakdown */}
            <div className="mt-8 pt-6 border-t border-brand-subdued-border grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-brand-subdued-border p-3.5 bg-brand-subdued-surface">
                <p className="text-[10px] uppercase tracking-widest text-brand-purple font-semibold">Provenance</p>
                <p className="font-display text-base text-brand-black mt-1">Varanasi Looms</p>
                <p className="text-caption text-brand-subdued-medium mt-0.5">Authentic Kadwa zari weave</p>
              </div>
              <div className="border border-brand-subdued-border p-3.5 bg-brand-subdued-surface">
                <p className="text-[10px] uppercase tracking-widest text-brand-purple font-semibold">Materiality</p>
                <p className="font-display text-base text-brand-black mt-1">Mulberry Silk</p>
                <p className="text-caption text-brand-subdued-medium mt-0.5">Hand-spun organic natural fibers</p>
              </div>
              <div className="border border-brand-subdued-border p-3.5 bg-brand-subdued-surface">
                <p className="text-[10px] uppercase tracking-widest text-brand-purple font-semibold">Tailoring</p>
                <p className="font-display text-base text-brand-black mt-1">Bespoke Fit</p>
                <p className="text-caption text-brand-subdued-medium mt-0.5">French seams & hand-stitched hem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5B. Featured Runway Edit (Responsive Swiper Coverflow Slider)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="featured-coverflow"
        aria-label="Seasonal Runway Coverflow Edit"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto border-b border-brand-subdued-border bg-white"
      >
        <Featured3DSlider
          products={runwayProducts}
          title="The Seasonal Runway Edit"
          subtitle="Experience the handcrafted silhouettes of our Autumn / Winter atelier in responsive coverflow perspective."
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. Best Sellers / Curated Signature Silhouettes
      ───────────────────────────────────────────────────────────── */}
      <section
        id="best-sellers"
        aria-label="Best Sellers"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto border-b border-brand-subdued-border"
      >
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12"
        >
          <div>
            <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
              Signature Silhouettes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-btn uppercase font-medium text-brand-black hover:text-brand-purple hover:underline transition-colors py-2"
          >
            <span>Explore Entire Wardrobe</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} aspectRatio="3/4" />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. Editorial Campaign Section (Contrasting Layout & Dedicated Zardozi Textile Imagery)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="editorial-campaign"
        aria-label="Editorial Campaign Manifesto"
        className="bg-brand-black text-white border-b border-brand-black py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-12"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Asymmetric Typography Column */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 lg:pr-8"
          >
            <span className="text-label uppercase tracking-widest text-brand-purple font-semibold">
              The Manifesto
            </span>
            <EditorialTextReveal
              as="blockquote"
              text="“Modern Indian elegance is not about looking back at tradition—it is about carving a timeless presence in the present.”"
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15]"
              staggerDelay={0.03}
              initialDelay={0.15}
            />
            <p className="text-body-base text-brand-gray-400 leading-relaxed max-w-lg">
              Every seam, placket, and zari thread in the {BRAND.name} atelier is drafted
              with zero compromise. We honor centuries-old weaving traditions by refusing to let them become museum relics.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/about">
                <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
                  Discover Our Heritage
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="ghost" size="md" className="text-white hover:text-brand-purple">
                  View Lookbook
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Asymmetric Image Showcase with Parallax — Distinct Campaign Velvet/Zardozi Visual */}
          <div
            ref={campaignRef}
            className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden border border-white/10"
          >
            <motion.div
              style={{ y: campaignImageY }}
              className="w-full h-[114%] -top-[7%] relative will-change-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="Artisanal Indian handloom silk and heritage zari craftsmanship in the Vastramay atelier"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. Brand Craftsmanship & Atelier Pillars
      ───────────────────────────────────────────────────────────── */}
      <section
        id="craftsmanship"
        aria-label="Atelier Craftsmanship"
        className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto border-b border-brand-subdued-border"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
            The Atelier Standard
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-4">
            Crafted with Intention
          </h2>
          <p className="text-body-base text-brand-subdued-medium leading-relaxed">
            From the hand-operated wooden charkhas of Kashmir to the centuries-old pit-looms of Varanasi,
            our textiles celebrate authentic master weavers.
          </p>
        </div>

        {/* 3 Pillars — Monograph Roman Numeral Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="border border-brand-subdued-border p-8 bg-brand-subdued-surface space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm tracking-widest text-brand-purple font-semibold">I. FIBER PROVENANCE</span>
              <Layers size={20} className="text-brand-purple" />
            </div>
            <h3 className="font-display text-2xl text-brand-black tracking-tight">
              Pure Natural Fibers
            </h3>
            <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
              We exclusively use 100% natural fibers: pure mulberry silk, high-thread-count organic mulmul,
              and authentic Ladakhi pashmina cashmere. Zero synthetic blends.
            </p>
          </div>

          <div className="border border-brand-subdued-border p-8 bg-brand-subdued-surface space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm tracking-widest text-brand-purple font-semibold">II. SARTORIAL RIGOR</span>
              <Scissors size={20} className="text-brand-purple" />
            </div>
            <h3 className="font-display text-2xl text-brand-black tracking-tight">
              Bespoke Seam Architecture
            </h3>
            <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
              Every garment is cut individually with clean French seams, reinforced canvas interlinings, and hand-stitched hem folds for generational drape.
            </p>
          </div>

          <div className="border border-brand-subdued-border p-8 bg-brand-subdued-surface space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm tracking-widest text-brand-purple font-semibold">III. ETHICAL WEAVING</span>
              <HeartHandshake size={20} className="text-brand-purple" />
            </div>
            <h3 className="font-display text-2xl text-brand-black tracking-tight">
              Artisanal Fair-Wage Dignity
            </h3>
            <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
              We partner directly with traditional weaving families across Varanasi, Kashmir, and Karnataka, guaranteeing fair living compensation and craft protection.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. Newsletter / Private Journal Section
      ───────────────────────────────────────────────────────────── */}
      <section
        id="private-journal"
        aria-label="Private Journal Salon"
        className="py-16 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1440px] mx-auto text-center"
      >
        <div className="max-w-2xl mx-auto border border-brand-subdued-border p-8 sm:p-12 bg-brand-subdued-surface">
          <Badge variant="purple" size="sm" className="mb-4">
            Exclusive Invitations
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl text-brand-black tracking-tight mb-3">
            The {BRAND.name} Salon
          </h2>
          <p className="text-body-sm text-brand-subdued-medium mb-8 max-w-md mx-auto leading-relaxed">
            Subscribe for early salon access, trunk show reservations, and seasonal editorial lookbooks.
          </p>

          <form onSubmit={handleJournalSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                value={journalEmail}
                onChange={(e) => setJournalEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isSubscribing}
                aria-label="Email address for Salon invitation"
                className="flex-1 bg-white border border-brand-subdued-border text-brand-black text-body-sm px-4 py-3 placeholder:text-brand-subdued-low rounded-none focus:outline-none focus:border-brand-purple"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubscribing}
                className="mt-2 sm:mt-0 shrink-0"
              >
                {isSubscribing ? (
                  <span className="flex items-center gap-2">
                    <LoadingIndicator size="sm" color="white" />
                    <span>Joining...</span>
                  </span>
                ) : (
                  <span>Request Invitation</span>
                )}
              </Button>
            </div>

            {journalStatus && (
              <p
                role="alert"
                className={`text-caption mt-2 ${
                  journalStatus.type === 'success'
                    ? 'text-brand-feedback-success font-medium'
                    : 'text-brand-feedback-error'
                }`}
              >
                {journalStatus.text}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
