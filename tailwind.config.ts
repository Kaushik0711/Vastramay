import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          black: '#101010',
          purple: {
            DEFAULT: '#6D28D9',
            dark: '#5B21B6',
            active: '#4C1D95',
            light: '#7C3AED',
            subtle: 'rgba(109, 40, 217, 0.08)',
          },
          // Subdued opacities of #101010 (no arbitrary extra color palettes)
          subdued: {
            high: 'rgba(16, 16, 16, 0.88)',
            medium: 'rgba(16, 16, 16, 0.65)',
            low: 'rgba(16, 16, 16, 0.45)',
            border: 'rgba(16, 16, 16, 0.15)',
            subtle: 'rgba(16, 16, 16, 0.08)',
            surface: 'rgba(16, 16, 16, 0.03)',
            hover: 'rgba(16, 16, 16, 0.06)',
          },
          feedback: {
            error: '#DC2626',
            'error-subtle': 'rgba(220, 38, 38, 0.08)',
            'error-border': 'rgba(220, 38, 38, 0.3)',
            success: '#059669',
            'success-subtle': 'rgba(5, 150, 105, 0.08)',
            'success-border': 'rgba(5, 150, 105, 0.3)',
          },
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
      fontFamily: {
        display: ['"EB Garamond"', 'Georgia', 'serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
        sm: '2px', // at most 2px for modal per locked design tokens
      },
      fontSize: {
        // Fluid responsive typography scale
        'hero-heading': ['clamp(2.25rem, 5vw, 4.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section-heading': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'sub-heading': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.25' }],
        'product-title': ['0.9375rem', { lineHeight: '1.4' }],
        'price': ['1rem', { lineHeight: '1.3' }],
        'price-lg': ['1.25rem', { lineHeight: '1.2' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-base': ['0.9375rem', { lineHeight: '1.6' }],
        'body-lg': ['1rem', { lineHeight: '1.65' }],
        'btn': ['0.8125rem', { lineHeight: '1', letterSpacing: '0.08em' }],
        'label': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.12em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        // Legacy display scales
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['2rem', { lineHeight: '1.2' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3' }],
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/5': '4 / 5',
      },
      maxWidth: {
        'site': '1440px',
        'content-narrow': '768px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
