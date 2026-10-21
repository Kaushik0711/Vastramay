import React, { useState } from 'react';
import { Ruler, Sparkles, HelpCircle } from 'lucide-react';
import { Modal } from '@/components/ui';

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

interface MeasurementRow {
  size: string;
  collarIn: string;
  chestIn: string;
  waistIn: string;
  hipIn: string;
  lengthIn: string;
  collarCm: string;
  chestCm: string;
  waistCm: string;
  hipCm: string;
  lengthCm: string;
}

const MEASUREMENTS: MeasurementRow[] = [
  {
    size: 'S (38)',
    collarIn: '15.0',
    chestIn: '38.0 – 39.5',
    waistIn: '32.0 – 33.5',
    hipIn: '39.0 – 40.5',
    lengthIn: '42.0',
    collarCm: '38.1',
    chestCm: '96.5 – 100.3',
    waistCm: '81.3 – 85.1',
    hipCm: '99.1 – 102.9',
    lengthCm: '106.7',
  },
  {
    size: 'M (40)',
    collarIn: '15.5',
    chestIn: '40.0 – 41.5',
    waistIn: '34.0 – 35.5',
    hipIn: '41.0 – 42.5',
    lengthIn: '43.0',
    collarCm: '39.4',
    chestCm: '101.6 – 105.4',
    waistCm: '86.4 – 90.2',
    hipCm: '104.1 – 108.0',
    lengthCm: '109.2',
  },
  {
    size: 'L (42)',
    collarIn: '16.0',
    chestIn: '42.0 – 43.5',
    waistIn: '36.0 – 37.5',
    hipIn: '43.0 – 44.5',
    lengthIn: '44.0',
    collarCm: '40.6',
    chestCm: '106.7 – 110.5',
    waistCm: '91.4 – 95.3',
    hipCm: '109.2 – 113.0',
    lengthCm: '111.8',
  },
  {
    size: 'XL (44)',
    collarIn: '16.5',
    chestIn: '44.0 – 45.5',
    waistIn: '38.0 – 39.5',
    hipIn: '45.0 – 46.5',
    lengthIn: '45.0',
    collarCm: '41.9',
    chestCm: '111.8 – 115.6',
    waistCm: '96.5 – 100.3',
    hipCm: '114.3 – 118.1',
    lengthCm: '114.3',
  },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productTitle,
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <Ruler size={20} className="text-brand-purple" />
          <span>Sizing & Measurement Guide</span>
        </div>
      }
    >
      <div className="space-y-6 font-body text-brand-black">
        {/* Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-subdued-border">
          <div>
            <p className="text-body-sm text-brand-subdued-medium">
              {productTitle
                ? `Tailoring specifications for "${productTitle}"`
                : 'Standard garment measurements tailored for comfortable ceremonial ease.'}
            </p>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center border border-brand-subdued-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                unit === 'in'
                  ? 'bg-brand-black text-white'
                  : 'bg-white text-brand-subdued-high hover:text-brand-black'
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                unit === 'cm'
                  ? 'bg-brand-black text-white'
                  : 'bg-white text-brand-subdued-high hover:text-brand-black'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-brand-subdued-border">
          <table className="w-full text-left text-body-sm border-collapse">
            <thead>
              <tr className="bg-brand-subdued-surface border-b border-brand-subdued-border text-label uppercase tracking-wider text-brand-black">
                <th className="py-3 px-4 font-semibold">Standard Size</th>
                <th className="py-3 px-4 font-semibold">Collar</th>
                <th className="py-3 px-4 font-semibold">Chest</th>
                <th className="py-3 px-4 font-semibold">Waist</th>
                <th className="py-3 px-4 font-semibold">Hip</th>
                <th className="py-3 px-4 font-semibold">Garment Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-subdued-border">
              {MEASUREMENTS.map((row) => (
                <tr
                  key={row.size}
                  className="hover:bg-brand-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-brand-black whitespace-nowrap">
                    {row.size}
                  </td>
                  <td className="py-3 px-4 text-brand-subdued-high">
                    {unit === 'in' ? row.collarIn : row.collarCm}
                  </td>
                  <td className="py-3 px-4 text-brand-subdued-high">
                    {unit === 'in' ? row.chestIn : row.chestCm}
                  </td>
                  <td className="py-3 px-4 text-brand-subdued-high">
                    {unit === 'in' ? row.waistIn : row.waistCm}
                  </td>
                  <td className="py-3 px-4 text-brand-subdued-high">
                    {unit === 'in' ? row.hipIn : row.hipCm}
                  </td>
                  <td className="py-3 px-4 text-brand-subdued-high">
                    {unit === 'in' ? row.lengthIn : row.lengthCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Grid */}
        <div className="p-4 bg-brand-subdued-surface border border-brand-subdued-border space-y-3">
          <h4 className="text-label uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
            <HelpCircle size={14} className="text-brand-purple" />
            How to Measure For Ceremonial Fit
          </h4>
          <ul className="text-caption text-brand-subdued-medium space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-brand-black">Chest:</strong> Measure across the fullest part of your chest, keeping the tape level under your arms.
            </li>
            <li>
              <strong className="text-brand-black">Waist:</strong> Measure around your natural waistline where your trousers normally sit.
            </li>
            <li>
              <strong className="text-brand-black">Shoulder:</strong> Measure from the edge of one shoulder bone across the natural back curve to the other.
            </li>
            <li>
              <strong className="text-brand-black">Ease Allowance:</strong> Our Indian ethnic silhouettes include 3.5 to 4 inches of built-in easing over body measurements for fluid drape and movement.
            </li>
          </ul>
        </div>

        {/* Bespoke / Atelier Fit Note */}
        <div className="flex items-start gap-3 p-3 bg-white border border-brand-subdued-border text-caption text-brand-subdued-medium">
          <Sparkles size={16} className="text-brand-purple shrink-0 mt-0.5" />
          <p>
            <strong className="text-brand-black">Between Sizes?</strong> If your measurements fall between two sizes, we recommend selecting the larger size. All Vastramay garments feature generous 2-inch side margin seams for personalized bespoke alteration.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SizeGuideModal;
