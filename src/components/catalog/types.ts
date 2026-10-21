export interface FilterState {
  category: string;
  size: string;
  color: string;
  priceTier: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}

export interface PriceTier {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_TIERS: PriceTier[] = [
  { id: 'under-5000', label: 'Under ₹5,000', min: 0, max: 4999 },
  { id: '5000-10000', label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { id: '10000-20000', label: '₹10,000 – ₹20,000', min: 10001, max: 20000 },
  { id: 'above-20000', label: 'Above ₹20,000', min: 20001, max: Infinity },
];

export const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '38', '40', '42', 'One Size'];

export interface ColorOption {
  name: string;
  hex: string;
}

export const AVAILABLE_COLORS: ColorOption[] = [
  { name: 'Plum Purple', hex: '#4C1D95' },
  { name: 'Noir Black', hex: '#101010' },
  { name: 'Amethyst', hex: '#6D28D9' },
  { name: 'Ivory White', hex: '#FDFBF7' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Lavender Silver', hex: '#7C3AED' },
];
