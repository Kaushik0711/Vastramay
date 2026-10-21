/**
 * Central brand configuration.
 * All store identity, navigation structures, and metadata are centralized here.
 */

export const BRAND = {
  /** Display wordmark shown in the header, footer and metadata. */
  name: 'Vastramay',

  /** Short tagline for SEO and social sharing. */
  tagline: 'Modern Indian Fashion',

  /** Default currency code. */
  currency: 'INR' as const,

  /** Currency symbol rendered next to prices. */
  currencySymbol: '₹',

  /** Locale used for Intl formatting. */
  locale: 'en-IN',

  /** Contact email displayed on the site. */
  email: 'concierge@vastramay.in',

  /** Contact phone displayed on the site. */
  phone: '+91 98765 43210',

  /** Address / Flagship store */
  address: 'No. 18, Couture Row, Indiranagar, Bengaluru 560038, India',

  /** Social media links. */
  social: {
    instagram: 'https://instagram.com/vastramay',
    facebook: 'https://facebook.com/vastramay',
    twitter: 'https://twitter.com/vastramay',
    pinterest: 'https://pinterest.com/vastramay',
  },
} as const;

/** Rotating announcement bar banners */
export const ANNOUNCEMENTS = [
  { id: '1', text: 'Complimentary shipping across India on orders exceeding ₹1,999' },
  { id: '2', text: 'Autumn / Winter Haute Couture Editorial Now Live' },
  { id: '3', text: '7-Day seamless doorstep returns & complimentary size exchanges' },
] as const;

/** Primary desktop & mobile navigation links */
export const NAV_LINKS = [
  {
    label: 'Shop',
    path: '/shop',
    sublinks: [
      { label: 'All Products', path: '/shop' },
      { label: 'Kurtas & Tunics', path: '/shop?category=kurtas' },
      { label: 'Sherwanis & Achkans', path: '/shop?category=sherwanis' },
      { label: 'Nehru Jackets & Bundis', path: '/shop?category=nehru-jackets' },
      { label: 'Festive Co-ord Sets', path: '/shop?category=festive-sets' },
      { label: 'Accessories', path: '/shop?category=accessories' },
    ],
  },
  {
    label: 'New Arrivals',
    path: '/shop?filter=new',
  },
  {
    label: 'Collections',
    path: '/collections',
    sublinks: [
      { label: 'All Collections', path: '/collections' },
      { label: 'Autumn / Winter Editorial', path: '/collections?col=autumn-winter-26' },
      { label: 'Festive Regalia', path: '/collections?col=festive-regalia' },
      { label: 'Minimalist Silk Edit', path: '/collections?col=minimalist-silk' },
    ],
  },
  {
    label: 'About',
    path: '/about',
  },
] as const;

/** Structured footer navigation groups */
export const FOOTER_NAV = {
  shop: [
    { label: 'All Garments', path: '/shop' },
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Festive Collections', path: '/collections' },
    { label: 'Silk Kurtas', path: '/shop?category=kurtas' },
    { label: 'Nehru Jackets', path: '/shop?category=nehru-jackets' },
    { label: 'Size & Fit Guide', path: '/size-guide' },
  ],
  support: [
    { label: 'Concierge & FAQ', path: '/faq' },
    { label: 'Shipping & Delivery', path: '/shipping' },
    { label: 'Returns & Exchanges', path: '/returns' },
    { label: 'Track Order', path: '/track-order' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Design System', path: '/design-system' },
  ],
  brand: [
    { label: 'Our Story', path: '/about' },
    { label: 'Artisanal Craftsmanship', path: '/about' },
    { label: 'My Account', path: '/account' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Shopping Bag', path: '/cart' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/policies/privacy' },
    { label: 'Terms of Service', path: '/policies/terms' },
    { label: 'Cancellation & Refunds', path: '/policies/cancellation' },
  ],
} as const;

/** Format a price in the brand currency. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(BRAND.locale, {
    style: 'currency',
    currency: BRAND.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
