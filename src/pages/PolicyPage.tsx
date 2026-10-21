import { useParams, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, AlertTriangle, Scale, Ban } from 'lucide-react';
import { Breadcrumb } from '@/components/ui';
import { SEO } from '@/components/common/SEO';

interface PolicyData {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: Array<{
    heading: string;
    content: string[];
    todo?: string;
  }>;
}

const POLICIES: Record<string, PolicyData> = {
  shipping: {
    title: 'Insured Shipping & Delivery Policy',
    subtitle: 'Transparent domestic courier timescales, insured packaging, and white-glove transit.',
    effectiveDate: 'October 2026',
    sections: [
      {
        heading: '1. Domestic Dispatch Timescales',
        content: [
          'Ready-to-wear kurta sets, nehru jackets, and accessories are dispatched from our Gurugram atelier within 24 to 48 hours of order confirmation (Monday through Saturday, excluding public holidays).',
          'Custom tailored ensembles, embroidered bridal sherwanis, and bespoke orders undergo artisan hand-embroidery and precision fitting, requiring 7 to 10 business days prior to logistics dispatch.',
        ],
      },
      {
        heading: '2. Shipping Charges & Free Delivery Threshold',
        content: [
          'Complimentary standard insured delivery is extended to all domestic orders with a settled subtotal of ₹2,999 or above.',
          'For orders below ₹2,999, a nominal flat courier fee of ₹250 is applied at checkout to cover air transit and tamper-evident packaging.',
          'Express ceremonial air delivery is available for select metropolitan postal codes at a flat rate of ₹650 (1–2 business days transit).',
        ],
      },
      {
        heading: '3. Courier Partners & Consignment Tracking',
        content: [
          'All shipments are handled by premier logistics partners including Blue Dart Express Luxury, Delhivery Air, and DTDC Premium.',
          'Upon consignment handover, clients receive automated tracking waybills (AWB) via SMS and email. Shipments can also be tracked in real time at /track-order.',
        ],
        todo: 'Confirm logistics API credentials and automated tracking webhook carrier agreements.',
      },
      {
        heading: '4. Transit Insurance & Damaged Shipments',
        content: [
          'Every Vastramay package is fully insured against theft, loss, or damage during transit.',
          'In the rare event of outer package tampering, clients are requested to reject delivery from the courier representative or report within 24 hours with photographic evidence to concierge@vastramay.in.',
        ],
      },
    ],
  },

  returns: {
    title: 'Returns, Exchanges & Bespoke Alterations',
    subtitle: 'Client-first 7-day return policy and complimentary master draper alterations.',
    effectiveDate: 'October 2026',
    sections: [
      {
        heading: '1. 7-Day Return Eligibility',
        content: [
          'Standard ready-to-wear ensembles are eligible for return or exchange within 7 calendar days from the verified date of delivery.',
          'To qualify for a refund or replacement, garments must remain in pristine, unworn, unwashed condition with all original atelier security tags, protective sleeves, and brass hangers intact.',
        ],
      },
      {
        heading: '2. Bespoke & Made-to-Measure Exclusions',
        content: [
          'Garments tailored to custom individual measurements, altered lengths, or personalized monograms are crafted specifically for the patron and are exempt from standard cash returns.',
          'In place of return, our atelier extends complimentary fitting alterations by our master draper within 14 days of delivery to guarantee an anatomical fit.',
        ],
        todo: 'Define maximum allowable complimentary alteration rounds (e.g. up to 2 fittings per custom garment).',
      },
      {
        heading: '3. Reverse Pickup & Inspection Protocol',
        content: [
          'Complimentary reverse courier pickup is arranged for eligible return requests across most domestic PIN codes.',
          'Upon receipt at our atelier quality-control desk, garments undergo inspection within 48 hours. Approved refunds are credited directly to the original payment source within 5 to 7 business days.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Client Privacy & Data Protection Policy',
    subtitle: 'Transparent disclosures regarding client data storage, payment tokenization, and privacy rights.',
    effectiveDate: 'October 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        content: [
          'We collect client contact information (name, email, mobile phone), shipping addresses, and personal garment sizing measurements to fulfill ceremonial orders and deliver tailored bespoke garments.',
          'When navigating our portal, local browser storage is utilized solely to persist guest shopping bag line items, wishlist selections, and authenticated session tokens.',
        ],
      },
      {
        heading: '2. Payment Security & RBI Tokenization Compliance',
        content: [
          'Vastramay does not store, process, or view client credit/debit card numbers or security CVVs on our servers.',
          'All transactions are handled through Reserve Bank of India (RBI) compliant payment partners (Razorpay) utilizing 256-bit AES encryption, card tokenization, and multi-factor authentication (UPI MPIN / OTP).',
        ],
        todo: 'Insert registered legal entity name and Data Protection Officer (DPO) contact email.',
      },
      {
        heading: '3. Data Retention & Client Rights',
        content: [
          'In accordance with the Digital Personal Data Protection (DPDP) Act of India, clients have the right to inspect, update, or request the deletion of their stored profile data and address books at any time via /account/settings or by contacting concierge@vastramay.in.',
          'We strictly never sell, license, or monetize client personal records to third-party marketing brokers.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of Service & Atelier Conditions',
    subtitle: 'Legal framework governing digital purchases, bespoke tailoring agreements, and intellectual property.',
    effectiveDate: 'October 2026',
    sections: [
      {
        heading: '1. Commercial Agreement & Acceptance',
        content: [
          'By placing an order on vastramay.in, you agree to these Terms of Service. An order confirmation constitutes an offer to purchase, subject to material stock verification and anti-fraud payment validation.',
        ],
      },
      {
        heading: '2. Pricing, Taxes & Catalog Accuracy',
        content: [
          'All catalogue prices are listed in Indian Rupees (INR) and are exclusive of applicable 12% Integrated Goods and Services Tax (GST). Invoicing is provided with each verified dispatch.',
          'We strive for absolute photographic color accuracy; however, subtle textile shade variations may occur due to hand-dyeing processes and monitor calibrations.',
        ],
        todo: 'Specify exact registered corporate identification number (CIN) and registered office address.',
      },
      {
        heading: '3. Intellectual Property Rights',
        content: [
          'All editorial lookbook photography, campaign narratives, trademark wordmarks, and silhouette designs displayed on this website are the proprietary intellectual property of Vastramay Atelier.',
        ],
      },
      {
        heading: '4. Governing Law & Judicial Jurisdiction',
        content: [
          'These Terms shall be interpreted and governed by the laws of the Republic of India. Any legal dispute or claim arising out of atelier transactions shall be subject to the exclusive jurisdiction of the competent courts in Gurugram / New Delhi.',
        ],
      },
    ],
  },

  cancellation: {
    title: 'Order Cancellation & Refund Policy',
    subtitle: 'Clear rules for pre-dispatch cancellations, bespoke tailoring holds, and refund processing.',
    effectiveDate: 'October 2026',
    sections: [
      {
        heading: '1. Pre-Dispatch Cancellation Window',
        content: [
          'Orders for ready-to-wear ensembles may be cancelled without penalty within 12 hours of placement, or prior to logistics waybill assignment (whichever occurs first).',
          'Cancellations can be submitted directly through the Client Portal at /account/orders or by notifying our concierge desk quoting your order reference.',
        ],
      },
      {
        heading: '2. Custom Bespoke Tailoring Cancellations',
        content: [
          'For made-to-measure sherwanis and bespoke ensembles, cancellations are accepted within 24 hours of order placement. Once hand-embroidery or fabric cutting has commenced, cancellations incur a 25% restocking and material preparation fee.',
        ],
        todo: 'Verify material preparation fee percentage with atelier business operations.',
      },
      {
        heading: '3. Refund Turnaround Timelines',
        content: [
          'Once a cancellation is confirmed by our concierge desk, refunds are initiated immediately.',
          'The credit will reflect in your original payment method (Bank Account, Credit Card, or UPI) within 5 to 7 business days, depending on your card issuer or banking network.',
        ],
      },
    ],
  },
};

const NAV_POLICIES = [
  { slug: 'shipping', label: 'Shipping & Delivery', icon: Truck },
  { slug: 'returns', label: 'Returns & Alterations', icon: RotateCcw },
  { slug: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { slug: 'terms', label: 'Terms of Service', icon: Scale },
  { slug: 'cancellation', label: 'Cancellation Policy', icon: Ban },
];

export default function PolicyPage() {
  const location = useLocation();
  const { policySlug } = useParams<{ policySlug: string }>();

  // Determine active slug, supporting direct /shipping or /returns paths
  let resolvedSlug = policySlug;
  if (!resolvedSlug) {
    if (location.pathname.startsWith('/shipping')) resolvedSlug = 'shipping';
    else if (location.pathname.startsWith('/returns')) resolvedSlug = 'returns';
    else resolvedSlug = 'shipping';
  }

  const activeSlug = resolvedSlug && POLICIES[resolvedSlug] ? resolvedSlug : 'shipping';
  const policy = POLICIES[activeSlug]!;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <SEO
        title={`${policy.title} — Vastramay`}
        description={policy.subtitle}
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Client Policies', href: '/shipping' },
          { label: policy.title },
        ]}
        className="mb-8"
      />

      {/* Main Grid: Policy Nav Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 border border-brand-subdued-border bg-white p-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-subdued-medium px-3 py-2 border-b border-brand-subdued-border mb-2">
            Policy Documents
          </p>
          <nav className="space-y-1">
            {NAV_POLICIES.map((nav) => {
              const Icon = nav.icon;
              const isCurrent = activeSlug === nav.slug;

              return (
                <Link
                  key={nav.slug}
                  to={`/policies/${nav.slug}`}
                  className={`flex items-center gap-3 px-3 py-2.5 text-caption font-medium uppercase tracking-wider transition-colors ${
                    isCurrent
                      ? 'bg-brand-black text-white font-semibold'
                      : 'text-brand-subdued-medium hover:bg-brand-subdued-surface hover:text-brand-black'
                  }`}
                >
                  <Icon size={16} className={isCurrent ? 'text-brand-purple' : ''} />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 mt-6 border-t border-brand-subdued-border px-3 space-y-2">
            <p className="font-semibold text-brand-black text-caption uppercase tracking-wider">
              Concierge Assistance
            </p>
            <p className="text-[11px] text-brand-subdued-medium leading-relaxed">
              For questions regarding custom tailoring timelines or specific return exceptions, connect with our concierge desk.
            </p>
            <Link
              to="/contact"
              className="text-[11px] font-semibold text-brand-purple hover:underline inline-block pt-1 uppercase tracking-wider"
            >
              Contact Support Desk →
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="border-b border-brand-subdued-border pb-6">
            <span className="text-label uppercase tracking-widest text-brand-purple font-semibold block mb-2">
              Official Atelier Policy
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight mb-2">
              {policy.title}
            </h1>
            <p className="text-body-base text-brand-subdued-medium">
              {policy.subtitle}
            </p>
            <p className="text-caption text-brand-subdued-low mt-2">
              Effective Date: {policy.effectiveDate} · Document Version 2.4
            </p>
          </div>

          {/* Legal Notice & Business Disclaimer Box as mandated */}
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-caption flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5">
                Legal Notice & Business Disclaimer
              </p>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                This policy has been drafted as a development operational standard for the Vastramay luxury storefront. It does not constitute formal legal counsel and should be reviewed and customized by licensed legal counsel prior to commercial transaction execution.
              </p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="border border-brand-subdued-border bg-white p-6 sm:p-10 space-y-8">
            {policy.sections.map((sec) => (
              <div key={sec.heading} className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-brand-black font-semibold">
                  {sec.heading}
                </h2>
                <div className="space-y-2 text-body-base text-brand-subdued-medium leading-relaxed">
                  {sec.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Explicit TODO Marker for Owner Confirmation */}
                {sec.todo && (
                  <div className="mt-3 p-3 bg-brand-subdued-surface border border-brand-subdued-border text-[11px] text-brand-subdued-low font-mono">
                    <strong className="text-brand-purple">[TODO — Owner Confirmation Required]:</strong> {sec.todo}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
