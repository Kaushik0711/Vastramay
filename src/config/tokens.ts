/**
 * Vastramay Design System Tokens
 * Locked Brand Identity:
 * - White: #FFFFFF
 * - Black: #101010
 * - Purple: #6D28D9
 * - Radius: 0px (modals at most 2px)
 * - Typography: EB Garamond (headings) & Sora (interface)
 */

export const COLOR_TOKENS = {
  white: '#FFFFFF',
  black: '#101010',
  purple: {
    DEFAULT: '#6D28D9',
    dark: '#5B21B6',
    active: '#4C1D95',
    light: '#7C3AED',
    subtle: 'rgba(109, 40, 217, 0.08)',
    border: 'rgba(109, 40, 217, 0.25)',
  },
  // Subdued text & borders via controlled opacity of #101010
  blackOpacity: {
    high: 'rgba(16, 16, 16, 0.88)',      // Primary body text
    medium: 'rgba(16, 16, 16, 0.65)',    // Subdued/secondary text
    low: 'rgba(16, 16, 16, 0.45)',       // Placeholder & tertiary captions
    border: 'rgba(16, 16, 16, 0.15)',    // Standard editorial border
    borderSubtle: 'rgba(16, 16, 16, 0.08)', // Subtle divider
    surface: 'rgba(16, 16, 16, 0.03)',   // Very subtle card/section wash
    hover: 'rgba(16, 16, 16, 0.06)',     // Subtle hover state
  },
  whiteOpacity: {
    high: 'rgba(255, 255, 255, 0.95)',
    medium: 'rgba(255, 255, 255, 0.70)',
    low: 'rgba(255, 255, 255, 0.40)',
    border: 'rgba(255, 255, 255, 0.20)',
  },
  feedback: {
    error: '#DC2626',
    errorSubtle: 'rgba(220, 38, 38, 0.08)',
    errorBorder: 'rgba(220, 38, 38, 0.3)',
    success: '#059669',
    successSubtle: 'rgba(5, 150, 105, 0.08)',
    successBorder: 'rgba(5, 150, 105, 0.3)',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  fonts: {
    display: '"EB Garamond", Georgia, serif',
    interface: 'Sora, system-ui, sans-serif',
  },
  sizes: {
    hero: {
      desktop: '3.75rem', // 60px
      mobile: '2.375rem', // 38px
      fluid: 'clamp(2.375rem, 5vw, 3.75rem)',
    },
    section: {
      desktop: '2.5rem',  // 40px
      mobile: '1.75rem',  // 28px
      fluid: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    },
    subheading: {
      desktop: '1.5rem',  // 24px
      mobile: '1.25rem',  // 20px
      fluid: 'clamp(1.25rem, 2vw, 1.5rem)',
    },
    productTitle: '0.9375rem', // 15px
    price: '1rem',             // 16px
    priceLarge: '1.25rem',     // 20px
    body: '0.9375rem',         // 15px
    bodyLarge: '1rem',         // 16px
    button: '0.8125rem',       // 13px
    caption: '0.75rem',        // 12px
    label: '0.6875rem',        // 11px
  },
} as const;

export const SPACING_TOKENS = {
  baseUnit: 4, // 4px rhythm
  rhythm: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  container: {
    maxWidth: '1440px',
    narrowWidth: '768px',
  },
  gutters: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
    wide: '48px',
  },
  aspectRatios: {
    editorialPortrait: '3/4',
    productCard: '4/5',
    square: '1/1',
    wide: '16/9',
  },
} as const;

export const RADIUS_TOKENS = {
  base: '0px',
  modal: '2px', // at most 2px per locked design identity
} as const;
