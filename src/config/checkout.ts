export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  pricePaise: number; // in integer paise
  freeAbovePaise?: number; // threshold for free delivery
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Atelier Delivery',
    description: 'Direct dispatch from our New Delhi atelier with protective garment sleeve.',
    estimatedDays: '3–5 business days',
    pricePaise: 25000, // ₹250
    freeAbovePaise: 199900, // Free on orders >= ₹1,999
  },
  {
    id: 'express',
    name: 'Express White-Glove Ceremonial Delivery',
    description: 'Priority courier, air transit, custom garment box and scheduled doorstep delivery.',
    estimatedDays: '1–2 business days',
    pricePaise: 65000, // ₹650
  },
];

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

export const DEMO_SAVED_ADDRESSES = [
  {
    id: 'addr-demo-1',
    fullName: 'Aditya Vardhan',
    phone: '9876543210',
    addressLine1: 'Flat 402, Royal Palms, Golf Course Road',
    addressLine2: 'DLF Phase 5',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
    isDefault: true,
  },
];
