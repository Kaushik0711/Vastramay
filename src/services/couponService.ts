export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10 for 10%) or fixed amount in rupees
  minOrderValuePaise: number;
  maxDiscountPaise?: number;
}

export const VALID_COUPONS: Record<string, Coupon> = {
  WELCOME10: {
    code: 'WELCOME10',
    description: '10% off your first luxury order (Min. ₹2,000)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValuePaise: 200000, // ₹2,000 in paise
    maxDiscountPaise: 200000, // Max ₹2,000 discount
  },
  ROSE1000: {
    code: 'ROSE1000',
    description: 'Flat ₹1,000 off on ceremonial orders above ₹10,000',
    discountType: 'fixed',
    discountValue: 1000,
    minOrderValuePaise: 1000000, // ₹10,000 in paise
  },
  FESTIVE15: {
    code: 'FESTIVE15',
    description: '15% celebratory festive discount (Min. ₹5,000, Max ₹3,000)',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValuePaise: 500000, // ₹5,000 in paise
    maxDiscountPaise: 300000, // Max ₹3,000 discount
  },
};

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  coupon?: Coupon;
  discountPaise: number;
}

export const couponService = {
  /**
   * Validate coupon code and calculate safe integer discount in paise.
   */
  validateCoupon(code: string, subtotalPaise: number): CouponValidationResult {
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      return {
        isValid: false,
        message: 'Please enter a valid promotion code.',
        discountPaise: 0,
      };
    }

    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      return {
        isValid: false,
        message: `Promotion code "${cleanCode}" is invalid or expired.`,
        discountPaise: 0,
      };
    }

    if (subtotalPaise < coupon.minOrderValuePaise) {
      const minRupees = Math.round(coupon.minOrderValuePaise / 100);
      return {
        isValid: false,
        message: `Code "${cleanCode}" requires a minimum order value of ₹${minRupees.toLocaleString('en-IN')}.`,
        discountPaise: 0,
      };
    }

    let calculatedDiscountPaise = 0;
    if (coupon.discountType === 'percentage') {
      calculatedDiscountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
      if (coupon.maxDiscountPaise && calculatedDiscountPaise > coupon.maxDiscountPaise) {
        calculatedDiscountPaise = coupon.maxDiscountPaise;
      }
    } else {
      calculatedDiscountPaise = coupon.discountValue * 100;
    }

    // Discount cannot exceed subtotal
    calculatedDiscountPaise = Math.min(calculatedDiscountPaise, subtotalPaise);

    return {
      isValid: true,
      message: `Coupon "${cleanCode}" applied: ${coupon.description}`,
      coupon,
      discountPaise: calculatedDiscountPaise,
    };
  },
};

export default couponService;
