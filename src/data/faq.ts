export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'products' | 'ordering' | 'shipping' | 'returns' | 'sizing' | 'account';
}

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'products', label: 'Garments & Craft' },
  { id: 'ordering', label: 'Ordering & Payment' },
  { id: 'shipping', label: 'Insured Delivery' },
  { id: 'returns', label: 'Returns & Alterations' },
  { id: 'sizing', label: 'Sizing & Bespoke' },
  { id: 'account', label: 'Client Accounts' },
] as const;

export const FAQ_ITEMS: FAQItem[] = [
  // Garments & Craft
  {
    id: 'faq-g1',
    category: 'products',
    question: 'What textiles and weaving techniques does Vastramay utilize?',
    answer:
      'Our ceremonial ensembles are crafted from artisan handwoven Chanderi silks, pure raw silk, Banarasi brocades, and structured imperial velvets. Each embroidery motif is completed by master artisans employing zardozi, aari, and resham needlework. Every garment includes detailed fabric composition and dry-cleaning directives on its product dossier.',
  },
  {
    id: 'faq-g2',
    category: 'products',
    question: 'Are garment colors accurately represented in editorial photography?',
    answer:
      'We photograph all pieces under balanced natural daylight to portray true saturation, sheen, and textile drape. However, subtle variations may occur across display calibrations and individual smartphone color profiles. You may request high-resolution fabric swatch close-ups via our concierge.',
  },

  // Ordering & Payment
  {
    id: 'faq-o1',
    category: 'ordering',
    question: 'What payment options are supported at checkout?',
    answer:
      'We accept all major credit and debit cards (Visa, MasterCard, RuPay, American Express), UPI (Google Pay, PhonePe, Paytm), Net Banking across all premier Indian banks, and Cash on Delivery (COD) for eligible domestic postal codes up to ₹25,000.',
  },
  {
    id: 'faq-o2',
    category: 'ordering',
    question: 'Are listed prices inclusive of goods and services taxes (GST)?',
    answer:
      'All product prices displayed on the catalogue are exclusive of the 12% Integrated GST levied on luxury apparel. The exact tax breakdown is transparently calculated and presented at checkout and on your official tax invoice.',
  },
  {
    id: 'faq-o3',
    category: 'ordering',
    question: 'Can I apply promotional voucher codes on my ceremonial order?',
    answer:
      'Yes, valid promotional codes (such as WELCOME10 or festive vouchers) can be entered during the Payment step of checkout. Disocunts are applied immediately to eligible line items, provided the cart meets the minimum subtotal threshold.',
  },

  // Insured Delivery
  {
    id: 'faq-s1',
    category: 'shipping',
    question: 'What are the domestic delivery rates and free shipping qualifications?',
    answer:
      'Standard insured delivery is completely complimentary on all domestic orders of ₹2,999 and above. For orders below this threshold, a flat courier dispatch fee of ₹250 is applied at checkout. Express ceremonial air delivery is also available at ₹650.',
  },
  {
    id: 'faq-s2',
    category: 'shipping',
    question: 'How long does dispatch and delivery take across India?',
    answer:
      'Ready-to-wear kurtas, nehru jackets, and accessory sets dispatch within 24 to 48 hours. Custom tailored and made-to-order bridal sherwanis require 7 to 10 business days for hand-embroidery and tailoring. Once dispatched via Blue Dart or Delhivery Air, delivery typically arrives within 3 to 5 business days.',
  },
  {
    id: 'faq-s3',
    category: 'shipping',
    question: 'How can I track my shipment once dispatched?',
    answer:
      'Upon handover to our logistics partner, an automated SMS and email containing your consignment waybill (AWB) is dispatched. You can track live milestones directly on our portal via /track-order or through your client account under /account/orders.',
  },

  // Returns & Alterations
  {
    id: 'faq-r1',
    category: 'returns',
    question: 'What is the return and exchange window for unworn garments?',
    answer:
      'Standard ready-to-wear ensembles are eligible for return or exchange within 7 days of delivery, provided the garment is in original pristine condition with security tags attached, unwashed, and in its protective garment bag. Initiations can be submitted via /contact or directly through the client portal.',
  },
  {
    id: 'faq-r2',
    category: 'returns',
    question: 'Are custom bespoke or monogrammed pieces eligible for return?',
    answer:
      'Custom bespoke garments tailored to non-standard client measurements are crafted exclusively for the individual and cannot be returned for a cash refund. However, our atelier offers complimentary alteration adjustments by our master draper to ensure your fit is immaculate.',
  },

  // Sizing & Bespoke
  {
    id: 'faq-z1',
    category: 'sizing',
    question: 'How do I identify my ideal kurta or sherwani size?',
    answer:
      'Please consult our detailed interactive chart on /size-guide, which provides chest, shoulder, waist, and garment length dimensions in both inches and centimeters. For kurta sets, we recommend selecting based primarily on your actual chest circumference with 4 inches of comfortable ease.',
  },
  {
    id: 'faq-z2',
    category: 'sizing',
    question: 'Does Vastramay provide personalized bridal and groom consultations?',
    answer:
      'Yes. Our styling atelier offers private digital consultations via WhatsApp and in-person appointments at our flagship studio. You can reserve a session with a master draper through the Book Consultation action on /contact.',
  },

  // Client Accounts
  {
    id: 'faq-a1',
    category: 'account',
    question: 'What are the privileges of creating an Atelier Client Account?',
    answer:
      'A registered account enables single-click express checkout, saved multi-destination delivery addresses, comprehensive order history with downloadable tax invoices, persistent wishlist synchronization, and private invitations to festive trunk shows.',
  },
  {
    id: 'faq-a2',
    category: 'account',
    question: 'Will items in my guest bag be saved if I sign in later?',
    answer:
      'Yes. Our state architecture automatically merges guest cart items and active variant selections into your authenticated customer profile the moment you sign in or complete registration.',
  },
];
