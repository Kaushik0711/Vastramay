import { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Mail,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Badge,
  Breadcrumb,
  QuantitySelector,
  PriceDisplay,
  ProductSkeleton,
  EmptyState,
  ErrorState,
  LoadingIndicator,
  Modal,
  SideDrawer,
} from '@/components/ui';

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>('right');
  const [quantity, setQuantity] = useState(1);
  const [checkedBox, setCheckedBox] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState('standard');
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('m');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 font-body">
      {/* Header */}
      <div className="border-b border-brand-subdued-border pb-8 mb-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Design System', href: '/design-system' },
          ]}
          className="mb-4"
        />
        <div className="flex flex-wrap items-baseline gap-4 mb-2">
          <h1 className="font-display text-section-heading text-brand-black tracking-tight">
            Vastramay Design System
          </h1>
          <Badge variant="purple">Phase 2 Verification</Badge>
        </div>
        <p className="text-body-base text-brand-subdued-medium max-w-2xl">
          Locked brand tokens, editorial typography (EB Garamond & Sora), 0px
          border radius geometry, controlled black opacity, and accessible
          shared primitives.
        </p>
      </div>

      <div className="space-y-16">
        {/* 1. Brand Tokens & Color Palette */}
        <section id="colors" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            1. Locked Brand Palette & Balance (~60% White, ~30% Black, ~10% Purple)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-white border border-brand-subdued-border mb-2" />
              <p className="font-semibold text-xs text-brand-black">White (60%)</p>
              <p className="text-[11px] text-brand-subdued-low">#FFFFFF</p>
            </div>
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-brand-black mb-2" />
              <p className="font-semibold text-xs text-brand-black">Black (30%)</p>
              <p className="text-[11px] text-brand-subdued-low">#101010</p>
            </div>
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-brand-purple mb-2" />
              <p className="font-semibold text-xs text-brand-black">Purple (10%)</p>
              <p className="text-[11px] text-brand-subdued-low">#6D28D9</p>
            </div>
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-brand-purple-dark mb-2" />
              <p className="font-semibold text-xs text-brand-black">Purple Dark</p>
              <p className="text-[11px] text-brand-subdued-low">#5B21B6</p>
            </div>
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-brand-subdued-border mb-2" />
              <p className="font-semibold text-xs text-brand-black">Subdued Border</p>
              <p className="text-[11px] text-brand-subdued-low">rgba(16,16,16,0.15)</p>
            </div>
            <div className="border border-brand-subdued-border p-4 bg-white">
              <div className="w-full h-14 bg-brand-subdued-surface border border-brand-subdued-border mb-2" />
              <p className="font-semibold text-xs text-brand-black">Subdued Surface</p>
              <p className="text-[11px] text-brand-subdued-low">rgba(16,16,16,0.03)</p>
            </div>
          </div>
        </section>

        {/* 2. Responsive Typography Scale */}
        <section id="typography" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            2. Responsive Typography Scale
          </h2>
          <div className="space-y-6 bg-brand-subdued-surface p-6 border border-brand-subdued-border">
            <div>
              <p className="text-label text-brand-purple uppercase mb-1">
                Hero Heading (EB Garamond · 56-68px Desktop, 36-44px Mobile)
              </p>
              <h1 className="font-display text-hero-heading text-brand-black">
                Redefining Indian Fashion
              </h1>
            </div>
            <div>
              <p className="text-label text-brand-purple uppercase mb-1">
                Section Heading (EB Garamond · 28-40px)
              </p>
              <h2 className="font-display text-section-heading text-brand-black">
                Curated Autumn Collections
              </h2>
            </div>
            <div>
              <p className="text-label text-brand-purple uppercase mb-1">
                Sub-Heading / Card Title (EB Garamond · 20-24px)
              </p>
              <h3 className="font-display text-sub-heading text-brand-black">
                Raw Silk Angrakha Set
              </h3>
            </div>
            <div>
              <p className="text-label text-brand-purple uppercase mb-1">
                Body Large (Sora · 16px)
              </p>
              <p className="text-body-lg text-brand-subdued-high max-w-2xl">
                A seamless synthesis of heritage craftsmanship and modern editorial silhouette,
                designed for contemporary celebrations.
              </p>
            </div>
            <div>
              <p className="text-label text-brand-purple uppercase mb-1">
                Body Base / Product Title (Sora · 15px)
              </p>
              <p className="text-body-base text-brand-subdued-medium max-w-2xl">
                Hand-woven chanderi fabric with delicate zari accents and straight-cut trousers.
              </p>
            </div>
            <div className="flex flex-wrap gap-8 items-baseline">
              <div>
                <p className="text-label text-brand-purple uppercase mb-1">
                  Price Display (Sora · 16-20px)
                </p>
                <PriceDisplay price={4999} compareAtPrice={6999} size="lg" />
              </div>
              <div>
                <p className="text-label text-brand-purple uppercase mb-1">
                  Button Text (Sora · 13px)
                </p>
                <p className="text-btn uppercase font-medium tracking-wider text-brand-black">
                  Explore Catalog
                </p>
              </div>
              <div>
                <p className="text-label text-brand-purple uppercase mb-1">
                  Label / Caption (Sora · 11-12px)
                </p>
                <p className="text-label uppercase text-brand-subdued-medium">
                  Free Domestic Delivery
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons & Icon Buttons */}
        <section id="buttons" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            3. Buttons & IconButtons (Variants & States)
          </h2>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-3">
                Variants
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Primary Purple
                </Button>
                <Button variant="secondary">Secondary Black Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="tertiary">Tertiary Text Button</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-3">
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">
                  Small (36px)
                </Button>
                <Button variant="primary" size="md">
                  Medium (44px)
                </Button>
                <Button variant="primary" size="lg">
                  Large (50px)
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-3">
                States (Loading & Disabled)
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" isLoading>
                  Saving
                </Button>
                <Button variant="secondary" isLoading>
                  Processing
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>

            {/* IconButtons */}
            <div>
              <h3 className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-3">
                Icon Buttons (44px mobile touch target)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <IconButton
                  aria-label="Add to wishlist"
                  variant="ghost"
                  icon={<Heart size={20} />}
                />
                <IconButton
                  aria-label="View bag"
                  variant="outline"
                  icon={<ShoppingBag size={20} />}
                />
                <IconButton
                  aria-label="Search items"
                  variant="primary"
                  icon={<Search size={20} />}
                />
                <IconButton
                  aria-label="Filter products"
                  variant="black"
                  icon={<SlidersHorizontal size={20} />}
                />
                <IconButton
                  aria-label="Disabled icon"
                  variant="outline"
                  disabled
                  icon={<Heart size={20} />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Form Controls */}
        <section id="forms" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            4. Form Controls (Input, Textarea, Select, Checkbox, Radio)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Ananya Sharma"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Enter your name as it appears on your ID"
                required
              />

              <Input
                label="Email Address"
                placeholder="your.email@example.com"
                type="email"
                leftSlot={<Mail size={16} />}
                defaultValue="invalid-email"
                error="Please enter a valid email address"
              />

              <Select
                label="Size Selection"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 's', label: 'Small (36 Chest)' },
                  { value: 'm', label: 'Medium (38 Chest)' },
                  { value: 'l', label: 'Large (40 Chest)' },
                  { value: 'xl', label: 'Extra Large (42 Chest)' },
                ]}
              />

              <Textarea
                label="Order Notes / Delivery Instructions"
                placeholder="Special delivery notes or gifting request..."
                rows={3}
              />
            </div>

            <div className="space-y-6 bg-brand-subdued-surface p-6 border border-brand-subdued-border">
              <div>
                <p className="text-label text-brand-black uppercase mb-3">
                  Square Checkbox (0px geometry)
                </p>
                <div className="space-y-3">
                  <Checkbox
                    label="Save shipping address for future orders"
                    checked={checkedBox}
                    onChange={(e) => setCheckedBox(e.target.checked)}
                  />
                  <Checkbox
                    label="Subscribe to weekly editorial lookbook"
                    helperText="We never spam. Unsubscribe anytime."
                  />
                  <Checkbox
                    label="I accept terms and conditions"
                    required
                    error="You must agree before continuing"
                  />
                  <Checkbox label="Disabled option" disabled />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-subdued-border">
                <p className="text-label text-brand-black uppercase mb-3">
                  Square Radio (0px geometry)
                </p>
                <div className="space-y-3">
                  <Radio
                    name="shipping_method"
                    label="Standard Domestic Delivery (3-5 business days · Free)"
                    checked={selectedRadio === 'standard'}
                    onChange={() => setSelectedRadio('standard')}
                  />
                  <Radio
                    name="shipping_method"
                    label="Express Delivery (Next business day · ₹250)"
                    checked={selectedRadio === 'express'}
                    onChange={() => setSelectedRadio('express')}
                  />
                  <Radio
                    name="shipping_method"
                    label="Same-day Concierge (Metro only)"
                    disabled
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-subdued-border">
                <p className="text-label text-brand-black uppercase mb-3">
                  Quantity Selector
                </p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Badges, PriceDisplay & Breadcrumbs */}
        <section id="display" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            5. Badges, Pricing & Micro-components
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-2">
                Badges (0px Square Corners)
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="purple">New Arrival</Badge>
                <Badge variant="sale">25% OFF</Badge>
                <Badge variant="black">Limited Edition</Badge>
                <Badge variant="outline">Handcrafted</Badge>
                <Badge variant="subtle">Silk Blend</Badge>
                <Badge variant="purple" size="sm">
                  Mini
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-2">
                Price Display with INR Formatter
              </p>
              <div className="flex flex-wrap gap-6 items-baseline">
                <PriceDisplay price={2499} size="sm" />
                <PriceDisplay price={3999} compareAtPrice={4999} size="md" />
                <PriceDisplay price={8999} compareAtPrice={11999} size="lg" />
              </div>
            </div>

            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-2">
                Loading Indicators (Clean Spinners)
              </p>
              <div className="flex items-center gap-6">
                <LoadingIndicator size="sm" color="purple" />
                <LoadingIndicator size="md" color="purple" />
                <LoadingIndicator size="lg" color="black" />
              </div>
            </div>
          </div>
        </section>

        {/* 6. Overlays (Modal & SideDrawer) */}
        <section id="overlays" className="border-b border-brand-subdued-border pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            6. Accessible Overlay Primitives (Modal & SideDrawer)
          </h2>
          <p className="text-body-base text-brand-subdued-medium mb-6 max-w-xl">
            Fully accessible with keyboard trap, Escape dismiss, backdrop dismiss,
            body scroll lock, focus restoration, and at most 2px border radius.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open Test Modal
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDrawerPosition('right');
                setDrawerOpen(true);
              }}
            >
              Open Right Drawer (Cart)
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setDrawerPosition('left');
                setDrawerOpen(true);
              }}
            >
              Open Left Drawer (Filter)
            </Button>
          </div>
        </section>

        {/* 7. States & Skeletons */}
        <section id="states" className="pb-12">
          <h2 className="font-display text-2xl text-brand-black mb-6">
            7. Product Skeleton, Empty State & Error State
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Skeletons */}
            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-3">
                Editorial Skeleton (3:4 ratio)
              </p>
              <ProductSkeleton aspectRatio="3/4" />
            </div>

            {/* Empty State */}
            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-3">
                Empty State
              </p>
              <EmptyState
                title="Your Bag is Empty"
                description="Discover our newest curated editorial drop and find pieces you love."
                action={
                  <Button variant="primary" size="sm">
                    Shop New In
                  </Button>
                }
              />
            </div>

            {/* Error State */}
            <div>
              <p className="text-label text-brand-subdued-medium uppercase mb-3">
                Error State
              </p>
              <ErrorState
                title="Catalog Unavailable"
                message="Unable to reach the catalog service right now. Please check your connection."
                onRetry={() => alert('Retrying action...')}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Size & Fit Advisory"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-body-base text-brand-subdued-high">
            All garments are handcrafted according to standard Indian couture sizing.
            Our models wear size M (38).
          </p>
          <div className="border border-brand-subdued-border p-4 bg-brand-subdued-surface">
            <p className="text-label uppercase text-brand-black mb-1">Couture Cut</p>
            <p className="text-caption text-brand-subdued-medium">
              Chest: 38" · Shoulder: 17.5" · Length: 42"
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-brand-subdued-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Got It
            </Button>
          </div>
        </div>
      </Modal>

      {/* SideDrawer Demo */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerPosition === 'right' ? 'Shopping Bag (Preview)' : 'Refine Catalog'}
        position={drawerPosition}
        size="md"
        footer={
          <div className="space-y-3">
            <div className="flex justify-between text-body-base font-semibold">
              <span>Estimated Total</span>
              <span>₹4,999</span>
            </div>
            <Button variant="primary" fullWidth onClick={() => setDrawerOpen(false)}>
              Proceed to Checkout
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body-sm text-brand-subdued-medium">
            {drawerPosition === 'right'
              ? 'This drawer primitive will host the active slide-out cart in subsequent phases.'
              : 'This drawer primitive will host faceted search filters on mobile and tablet.'}
          </p>
          <div className="border border-brand-subdued-border p-4">
            <p className="font-display text-lg text-brand-black">
              Raw Silk Angrakha Set
            </p>
            <p className="text-caption text-brand-subdued-medium mb-3">
              Size: M · Color: Royal Plum
            </p>
            <PriceDisplay price={4999} compareAtPrice={6999} size="sm" />
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}
