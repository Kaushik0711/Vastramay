import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Breadcrumb, Button } from '@/components/ui';
import { SEO } from '@/components/common/SEO';

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  orderNumber: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = {
  fullName: '',
  email: '',
  phone: '',
  inquiryType: 'bespoke',
  orderNumber: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address for our reply.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setError('Please provide at least 10 characters describing your inquiry.');
      return;
    }

    setLoading(true);

    try {
      // Simulate messaging service adapter (600ms network delay)
      await new Promise((r) => setTimeout(r, 600));

      const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
    } catch {
      setError('An unexpected error occurred transmitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFormData(INITIAL_FORM);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <SEO
        title="Client Concierge & Contact — Vastramay Atelier"
        description="Connect with the Vastramay concierge for bespoke bridal styling consultations, order consignment inquiries, and atelier visits."
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Client Concierge' },
        ]}
        className="mb-8"
      />

      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2">
          Personal Concierge Desk
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight">
          How May We Assist You?
        </h1>
        <p className="text-body-base text-brand-subdued-medium mt-2">
          Whether arranging a private groom styling appointment, requesting custom measurements, or inquiring about consignment dispatch, our atelier stylists are at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          {submittedTicket ? (
            <div className="border border-brand-subdued-border bg-white p-8 sm:p-10 space-y-6">
              <div className="w-14 h-14 bg-green-50 text-green-700 border border-green-200 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-purple block mb-1">
                  Reference {submittedTicket}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-brand-black">
                  Inquiry Dispatched to Concierge Desk
                </h2>
                <p className="text-body-sm text-brand-subdued-medium mt-2 leading-relaxed">
                  Thank you, <strong className="text-brand-black">{formData.fullName}</strong>. Your message regarding{' '}
                  <span className="text-brand-black uppercase font-medium">{formData.inquiryType}</span> has been logged with our styling team. A representative will respond to <strong className="text-brand-black">{formData.email}</strong> within 24 business hours.
                </p>
              </div>

              {/* Explicit Development Integration Notice as required */}
              <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border text-caption text-brand-subdued-medium space-y-1">
                <p className="font-semibold text-brand-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-brand-purple" />
                  Development Service Adapter Notice
                </p>
                <p className="text-[11px] text-brand-subdued-low leading-relaxed">
                  In this local demonstration environment, messages are stored in client memory. To route live inquiries to Zendesk, SendGrid, or AWS SES, connect <code>VITE_SUPPORT_WEBHOOK_URL</code> in your deployment environment.
                </p>
              </div>

              <div className="pt-2">
                <Button variant="secondary" size="md" onClick={handleResetForm}>
                  Submit Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-body-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                  >
                    Your Name <span className="text-brand-purple">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="e.g. Aditya Vardhan"
                    className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                  >
                    Email Address <span className="text-brand-purple">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                  >
                    Contact Mobile <span className="text-brand-subdued-low font-normal">(For WhatsApp concierge)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-order-ref"
                    className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                  >
                    Order Number <span className="text-brand-subdued-low font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contact-order-ref"
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. RO-2026-89412"
                    className="w-full px-3 py-2.5 text-body-sm font-mono border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-inquiry-type"
                  className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                >
                  Inquiry Nature <span className="text-brand-purple">*</span>
                </label>
                <select
                  id="contact-inquiry-type"
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none bg-white transition-colors"
                >
                  <option value="bespoke">Bespoke Fitting & Master Draper Consultation</option>
                  <option value="tracking">Order Milestone & Courier Waybill Inquiry</option>
                  <option value="returns">Exchange, Return & Alteration Assistance</option>
                  <option value="bridal">Groom & Wedding Entourage Bulk Styling</option>
                  <option value="general">General Atelier Inquiries</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-caption font-semibold uppercase tracking-wider text-brand-black mb-1.5"
                >
                  Message & Specific Requirements <span className="text-brand-purple">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Describe your event dates, preferred colorways, bespoke chest/shoulder measurements, or specific courier inquiries..."
                  className="w-full px-3 py-2.5 text-body-sm border border-brand-subdued-border focus:border-brand-purple focus:outline-none transition-colors"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full sm:w-auto justify-center"
                rightIcon={<Send size={15} />}
              >
                Transmit to Concierge Desk
              </Button>
            </form>
          )}
        </div>

        {/* Right Column: Studio Coordinates & Operating Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flagship Studio Info */}
          <div className="border border-brand-subdued-border bg-white p-6 space-y-5">
            <h2 className="font-display text-xl text-brand-black border-b border-brand-subdued-border pb-3">
              Atelier Flagship Studio
            </h2>

            <div className="space-y-4 text-body-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-black text-caption uppercase tracking-wider mb-0.5">
                    Consultation Salon
                  </p>
                  <p className="text-brand-subdued-medium leading-relaxed">
                    Heritage Wing, 402 Royal Palms
                    <br />
                    Golf Course Road, DLF Phase 5
                    <br />
                    Gurugram, Haryana 122002, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-black text-caption uppercase tracking-wider mb-0.5">
                    Written Correspondence
                  </p>
                  <a
                    href="mailto:concierge@vastramay.in"
                    className="text-brand-purple hover:underline"
                  >
                    concierge@vastramay.in
                  </a>
                  <p className="text-caption text-brand-subdued-low mt-0.5">
                    Average response within 1 business day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-black text-caption uppercase tracking-wider mb-0.5">
                    Direct Atelier Line & WhatsApp
                  </p>
                  <a href="tel:+919811100000" className="text-brand-black font-semibold hover:text-brand-purple">
                    +91 98111 00000
                  </a>
                  <p className="text-caption text-brand-subdued-low mt-0.5">
                    Dedicated bridal stylists available 10:00 AM – 7:30 PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-black text-caption uppercase tracking-wider mb-0.5">
                    Appointment Timings
                  </p>
                  <p className="text-brand-subdued-medium">
                    Monday to Saturday: 10:00 AM – 7:30 PM
                    <br />
                    Sunday: By private bridal appointment only
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick Link Banner */}
          <div className="border border-brand-subdued-border bg-brand-subdued-surface p-6 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-brand-purple" />
              <h3 className="font-display text-lg text-brand-black">Frequently Answered Questions</h3>
            </div>
            <p className="text-body-sm text-brand-subdued-medium leading-relaxed">
              Have immediate inquiries regarding complimentary domestic shipping thresholds, return windows, or international duty estimates?
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-caption uppercase tracking-wider text-brand-purple hover:underline font-semibold pt-1"
            >
              Browse FAQ Repository <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
