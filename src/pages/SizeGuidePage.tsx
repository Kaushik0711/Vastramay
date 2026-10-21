import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, ArrowRight, AlertTriangle, Compass } from 'lucide-react';
import { Breadcrumb, Button } from '@/components/ui';
import { SEO } from '@/components/common/SEO';

type Unit = 'in' | 'cm';

interface SizeRow {
  size: string;
  label: string;
  chestIn: number;
  waistIn: number;
  shoulderIn: number;
  lengthIn: number;
  neckIn: number;
}

const KURTA_SIZES: SizeRow[] = [
  { size: '36', label: 'Extra Small (XS)', chestIn: 38, waistIn: 34, shoulderIn: 17.0, lengthIn: 40, neckIn: 15.0 },
  { size: '38', label: 'Small (S)', chestIn: 40, waistIn: 36, shoulderIn: 17.5, lengthIn: 41, neckIn: 15.5 },
  { size: '40', label: 'Medium (M)', chestIn: 42, waistIn: 38, shoulderIn: 18.0, lengthIn: 42, neckIn: 16.0 },
  { size: '42', label: 'Large (L)', chestIn: 44, waistIn: 40, shoulderIn: 18.5, lengthIn: 43, neckIn: 16.5 },
  { size: '44', label: 'Extra Large (XL)', chestIn: 46, waistIn: 42, shoulderIn: 19.0, lengthIn: 44, neckIn: 17.0 },
  { size: '46', label: 'Double Extra Large (XXL)', chestIn: 48, waistIn: 44, shoulderIn: 19.5, lengthIn: 44, neckIn: 17.5 },
];

const SHERWANI_SIZES: SizeRow[] = [
  { size: '36', label: '36 (XS Chest)', chestIn: 39, waistIn: 34, shoulderIn: 17.5, lengthIn: 42, neckIn: 15.0 },
  { size: '38', label: '38 (S Chest)', chestIn: 41, waistIn: 36, shoulderIn: 18.0, lengthIn: 43, neckIn: 15.5 },
  { size: '40', label: '40 (M Chest)', chestIn: 43, waistIn: 38, shoulderIn: 18.5, lengthIn: 44, neckIn: 16.0 },
  { size: '42', label: '42 (L Chest)', chestIn: 45, waistIn: 40, shoulderIn: 19.0, lengthIn: 45, neckIn: 16.5 },
  { size: '44', label: '44 (XL Chest)', chestIn: 47, waistIn: 42, shoulderIn: 19.5, lengthIn: 46, neckIn: 17.0 },
  { size: '46', label: '46 (XXL Chest)', chestIn: 49, waistIn: 44, shoulderIn: 20.0, lengthIn: 46, neckIn: 17.5 },
];

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<Unit>('in');
  const [activeTab, setActiveTab] = useState<'kurta' | 'sherwani'>('kurta');

  const formatDimension = (valInInches: number): string => {
    if (unit === 'in') return `${valInInches}"`;
    return `${Math.round(valInInches * 2.54 * 10) / 10} cm`;
  };

  const currentSizes = activeTab === 'kurta' ? KURTA_SIZES : SHERWANI_SIZES;

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 font-body">
      <SEO
        title="Anatomical Size Guide & Measurement Standard — Vastramay"
        description="Comprehensive sizing chart for ceremonial kurtas, bandhgala suits, and silk sherwanis with step-by-step anatomical measurement guidance."
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Size & Fit Guide' },
        ]}
        className="mb-8"
      />

      {/* Header */}
      <div className="max-w-2xl mb-8">
        <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-2 flex items-center gap-1.5">
          <Ruler size={14} /> Master Grading Standard
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight">
          Anatomical Measurement & Sizing Guide
        </h1>
        <p className="text-body-base text-brand-subdued-medium mt-2">
          Vastramay garments are engineered with calculated ease to drape naturally over the body without clinging or restricting movement during celebration rituals.
        </p>
      </div>

      {/* Required Sample Measurement Disclaimer Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-caption mb-8 flex items-start gap-3">
        <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5">
            [Sample Brand Grading Standard — Owner Sizing Confirmation Notice]
          </p>
          <p className="text-amber-800 leading-relaxed">
            The table dimensions below represent standard Indian atelier bespoke grading formulas (+4 inches chest ease for Kurta Sets; +3 inches ease for Sherwanis). Final production tolerances and custom chest-to-hip drops can be customized in <code>src/pages/SizeGuidePage.tsx</code>.
          </p>
        </div>
      </div>

      {/* Tabs and Unit Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-brand-subdued-border">
        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('kurta')}
            className={`px-4 py-2 text-caption font-semibold uppercase tracking-wider border transition-colors ${
              activeTab === 'kurta'
                ? 'bg-brand-black text-white border-brand-black'
                : 'bg-white text-brand-subdued-medium border-brand-subdued-border hover:text-brand-black'
            }`}
          >
            Kurta Sets & Bundis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sherwani')}
            className={`px-4 py-2 text-caption font-semibold uppercase tracking-wider border transition-colors ${
              activeTab === 'sherwani'
                ? 'bg-brand-black text-white border-brand-black'
                : 'bg-white text-brand-subdued-medium border-brand-subdued-border hover:text-brand-black'
            }`}
          >
            Sherwanis & Achkans
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-brand-subdued-surface border border-brand-subdued-border">
          <span className="text-[11px] text-brand-subdued-medium uppercase tracking-wider px-2 font-semibold">
            Unit:
          </span>
          <button
            type="button"
            onClick={() => setUnit('in')}
            className={`px-3 py-1 text-caption font-semibold uppercase tracking-wider transition-colors ${
              unit === 'in' ? 'bg-white text-brand-black shadow-sm' : 'text-brand-subdued-medium hover:text-brand-black'
            }`}
          >
            Inches
          </button>
          <button
            type="button"
            onClick={() => setUnit('cm')}
            className={`px-3 py-1 text-caption font-semibold uppercase tracking-wider transition-colors ${
              unit === 'cm' ? 'bg-white text-brand-black shadow-sm' : 'text-brand-subdued-medium hover:text-brand-black'
            }`}
          >
            Centimeters
          </button>
        </div>
      </div>

      {/* Measurement Table */}
      <div className="border border-brand-subdued-border bg-white overflow-x-auto shadow-sm mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-subdued-border bg-brand-subdued-surface text-caption uppercase tracking-wider text-brand-subdued-medium">
              <th className="p-4">Standard Size</th>
              <th className="p-4">To Fit Body Chest</th>
              <th className="p-4">Garment Chest (With Ease)</th>
              <th className="p-4">Waist Circumference</th>
              <th className="p-4">Shoulder Width</th>
              <th className="p-4">Standard Length</th>
              <th className="p-4">Collar / Neck</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-subdued-border text-body-sm">
            {currentSizes.map((row) => (
              <tr key={row.size} className="hover:bg-brand-subdued-surface/40 transition-colors">
                <td className="p-4">
                  <span className="font-display font-bold text-brand-black text-base block">
                    Size {row.size}
                  </span>
                  <span className="text-caption text-brand-subdued-medium">{row.label}</span>
                </td>

                <td className="p-4 font-semibold text-brand-purple">
                  {formatDimension(Number(row.size))}
                </td>

                <td className="p-4 font-bold text-brand-black">
                  {formatDimension(row.chestIn)}
                </td>

                <td className="p-4 text-brand-subdued-medium">
                  {formatDimension(row.waistIn)}
                </td>

                <td className="p-4 text-brand-subdued-medium">
                  {formatDimension(row.shoulderIn)}
                </td>

                <td className="p-4 text-brand-subdued-medium">
                  {formatDimension(row.lengthIn)}
                </td>

                <td className="p-4 text-brand-subdued-medium">
                  {formatDimension(row.neckIn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to Measure Anatomical Guidance */}
      <div className="border border-brand-subdued-border bg-white p-6 sm:p-10 mb-12">
        <div className="max-w-2xl mb-8">
          <p className="text-label uppercase tracking-widest text-brand-purple font-semibold mb-1">
            Precision Measuring
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-brand-black">
            How to Take Your Measurements
          </h2>
          <p className="text-body-sm text-brand-subdued-medium mt-1">
            Use a flexible fabric tailor&apos;s measuring tape. Keep the tape comfortably snug without pulling too tight, standing in a relaxed natural posture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-brand-subdued-border p-5 space-y-2 bg-brand-subdued-surface/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple block">
              Step 01
            </span>
            <h3 className="font-display text-lg text-brand-black font-semibold">1. Chest Circumference</h3>
            <p className="text-caption text-brand-subdued-medium leading-relaxed">
              Measure around the fullest part of your chest, keeping the tape horizontal under your armpits and across your shoulder blades.
            </p>
          </div>

          <div className="border border-brand-subdued-border p-5 space-y-2 bg-brand-subdued-surface/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple block">
              Step 02
            </span>
            <h3 className="font-display text-lg text-brand-black font-semibold">2. Across Shoulder</h3>
            <p className="text-caption text-brand-subdued-medium leading-relaxed">
              Measure straight across the back from the tip of the left shoulder bone horizontally across to the tip of the right shoulder bone.
            </p>
          </div>

          <div className="border border-brand-subdued-border p-5 space-y-2 bg-brand-subdued-surface/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple block">
              Step 03
            </span>
            <h3 className="font-display text-lg text-brand-black font-semibold">3. Garment Length</h3>
            <p className="text-caption text-brand-subdued-medium leading-relaxed">
              Measure from the prominent base of the back of your neck vertically down to the knee (for standard kurtas) or mid-calf (for sherwanis).
            </p>
          </div>
        </div>
      </div>

      {/* Bespoke Fitting Consultation Banner */}
      <div className="border border-brand-subdued-border bg-brand-subdued-surface p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass size={18} className="text-brand-purple" />
            <span className="text-label uppercase tracking-widest text-brand-purple font-semibold">
              Between Standard Sizes?
            </span>
          </div>
          <h3 className="font-display text-2xl text-brand-black">
            Request Master Draper Bespoke Sizing
          </h3>
          <p className="text-body-sm text-brand-subdued-medium mt-1 max-w-xl">
            If you fall between sizes or have athletic, broad-shoulder proportions, our master drapers will draft an individualized pattern tailored to your exact posture.
          </p>
        </div>
        <Link to="/contact">
          <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />}>
            Book Sizing Session
          </Button>
        </Link>
      </div>
    </div>
  );
}
