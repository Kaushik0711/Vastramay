import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  className = '',
  size = 'md',
}) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
    }
  };

  const isMinDisabled = disabled || value <= min;
  const isMaxDisabled = disabled || value >= max;

  const heightClass = size === 'sm' ? 'h-8' : 'h-11';
  const btnWidthClass = size === 'sm' ? 'w-8' : 'w-11';
  const inputWidthClass = size === 'sm' ? 'w-10 text-xs' : 'w-12 text-sm';

  return (
    <div
      className={`inline-flex items-center border border-brand-subdued-border bg-white rounded-none select-none ${heightClass} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`.trim()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMinDisabled}
        aria-label="Decrease quantity"
        className={`${btnWidthClass} h-full flex items-center justify-center text-brand-black hover:bg-brand-subdued-surface active:bg-brand-subdued-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-purple`}
      >
        <Minus size={14} />
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={handleInputChange}
        aria-label="Product quantity"
        className={`${inputWidthClass} h-full text-center font-body font-medium text-brand-black bg-transparent border-x border-brand-subdued-border focus:outline-none focus:bg-brand-subdued-surface [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMaxDisabled}
        aria-label="Increase quantity"
        className={`${btnWidthClass} h-full flex items-center justify-center text-brand-black hover:bg-brand-subdued-surface active:bg-brand-subdued-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-purple`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
