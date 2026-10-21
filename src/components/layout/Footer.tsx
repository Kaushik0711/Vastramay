import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { BRAND, FOOTER_NAV } from '@/config';
import { Button } from '@/components/ui';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {

  return (
    <footer className="bg-brand-black text-white border-t border-brand-black" id="site-footer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 font-body">
        {/* Top Section: Brand Manifesto + Newsletter Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Manifesto & Concierge */}
          <div className="lg:col-span-6 space-y-6">
            <Link to="/" className="font-display text-3xl sm:text-4xl tracking-tight block">
              {BRAND.name}
            </Link>
            <p className="text-body-base text-brand-gray-400 max-w-lg leading-relaxed">
              {BRAND.tagline}. An editorial celebration of Indian textile heritage,
              reimagined for modern celebrations, contemporary soirées, and effortless daily grace.
            </p>

            <div className="space-y-2.5 text-body-sm text-brand-gray-400 pt-2">
              <p className="flex items-center gap-2.5">
                <MapPin size={15} className="text-brand-purple shrink-0" />
                <span>{BRAND.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand-purple shrink-0" />
                <span>{BRAND.phone} · Mon–Sat 10:00 to 19:00 IST</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand-purple shrink-0" />
                <span>{BRAND.email}</span>
              </p>
            </div>
          </div>

          {/* Atelier Concierge & Private Styling Showcase (Repurposed to eliminate duplicate newsletter) */}
          <div className="lg:col-span-6 lg:pl-8 flex flex-col justify-center">
            <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.02]">
              <p className="text-label uppercase tracking-widest text-brand-purple mb-2">
                Bespoke Services
              </p>
              <h3 className="font-display text-2xl text-white mb-2 tracking-tight">
                Private Styling & Consultations
              </h3>
              <p className="text-body-sm text-brand-gray-400 mb-6 leading-relaxed">
                Experience personal draping sessions, custom measurement consultations, and ceremonial curation
                with our master sartorial artisans at the Bengaluru flagship or via virtual concierge.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />} fullWidth>
                    Book Consultation
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="border-white/20 text-white hover:border-brand-purple hover:text-brand-purple" fullWidth>
                    Our Atelier Story
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-caption text-brand-gray-400">
                <span>Direct Concierge: {BRAND.phone}</span>
                <span>Flagship: Indiranagar, Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Multi-Column Navigation Hierarchy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 py-16 border-b border-white/10">
          {/* Shop Column */}
          <div>
            <h4 className="text-label uppercase tracking-widest text-brand-gray-400 mb-5 font-semibold">
              The Wardrobe
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-sm text-brand-gray-300 hover:text-white transition-colors duration-150 inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-label uppercase tracking-widest text-brand-gray-400 mb-5 font-semibold">
              Concierge
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-sm text-brand-gray-300 hover:text-white transition-colors duration-150 inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The Brand Column */}
          <div>
            <h4 className="text-label uppercase tracking-widest text-brand-gray-400 mb-5 font-semibold">
              The Atelier
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.brand.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-sm text-brand-gray-300 hover:text-white transition-colors duration-150 inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policy Column */}
          <div>
            <h4 className="text-label uppercase tracking-widest text-brand-gray-400 mb-5 font-semibold">
              Policy & Terms
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-body-sm text-brand-gray-300 hover:text-white transition-colors duration-150 inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Currency & Social Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-brand-gray-500">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <p>© {CURRENT_YEAR} {BRAND.name}. All rights reserved.</p>
            <span className="hidden sm:inline text-brand-gray-700">|</span>
            <p className="flex items-center gap-1.5">
              <span>Currency:</span>
              <span className="text-white font-medium">Indian Rupee (INR ₹) · India</span>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BRAND.name} on Instagram`}
              className="text-brand-gray-400 hover:text-white transition-colors p-1"
            >
              <Instagram size={18} />
            </a>
            <a
              href={BRAND.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BRAND.name} on Facebook`}
              className="text-brand-gray-400 hover:text-white transition-colors p-1"
            >
              <Facebook size={18} />
            </a>
            <a
              href={BRAND.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BRAND.name} on Twitter`}
              className="text-brand-gray-400 hover:text-white transition-colors p-1"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
