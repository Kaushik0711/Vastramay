import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCartStore, useCheckoutStore, useOrderStore } from '@/stores';
import {
  SHIPPING_METHODS,
  INDIAN_STATES,
  DEMO_SAVED_ADDRESSES,
  type ShippingMethod,
} from '@/config';
import { orderService } from '@/services';
import { Button, PriceDisplay, EmptyState } from '@/components/ui';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { items, subtotal, subtotalPaise, discount, couponCode } = useCartStore();
  const { orders } = useOrderStore();
  const {
    contact,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    shippingMethodId,
    paymentMethod,
    sandboxMode,
    sandboxOutcome,
    idempotencyKey,
    setContact,
    setShippingAddress,
    setSameAsShipping,
    setShippingMethodId,
    setPaymentMethod,
    setSandboxOutcome,
    regenerateIdempotencyKey,
  } = useCheckoutStore();

  // Determine current step based on URL path
  const currentStep = location.pathname.includes('/shipping')
    ? 'shipping'
    : location.pathname.includes('/payment')
    ? 'payment'
    : 'information';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Authoritative calculations in integer paise
  const currentSubtotalPaise = subtotalPaise();
  const currentSubtotal = subtotal();
  const currentDiscount = discount();

  const selectedShipping: ShippingMethod =
    SHIPPING_METHODS.find((m) => m.id === shippingMethodId) || SHIPPING_METHODS[0]!;

  const shippingCost =
    selectedShipping.freeAbovePaise && currentSubtotalPaise >= selectedShipping.freeAbovePaise
      ? 0
      : Math.round(selectedShipping.pricePaise / 100);

  const grandTotal = Math.max(0, currentSubtotal - currentDiscount + shippingCost);

  /* -------------------------------------------------------------
   * VALIDATION
   * ----------------------------------------------------------- */
  const validateInformationStep = (): boolean => {
    const errors: Record<string, string> = {};

    // Email
    if (!contact.email.trim()) {
      errors.email = 'Email address is required for order receipt and tracking.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      errors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    // Phone
    const cleanPhone = contact.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile number is required for delivery coordination.';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    // Full Name
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Recipient full name is required.';
    }

    // Address Line 1
    if (!shippingAddress.addressLine1.trim()) {
      errors.addressLine1 = 'House number, street name or flat details are required.';
    }

    // City
    if (!shippingAddress.city.trim()) {
      errors.city = 'City / Town is required.';
    }

    // Postal Code (6 digits in India)
    const cleanPin = shippingAddress.postalCode.replace(/\D/g, '');
    if (!cleanPin) {
      errors.postalCode = 'PIN code is required.';
    } else if (cleanPin.length !== 6) {
      errors.postalCode = 'Please enter a valid 6-digit Indian postal PIN code.';
    }

    // Billing validation if not same as shipping
    if (!sameAsShipping) {
      if (!billingAddress.fullName.trim()) errors.billingFullName = 'Billing full name is required.';
      if (!billingAddress.addressLine1.trim()) errors.billingAddressLine1 = 'Billing address line is required.';
      if (!billingAddress.city.trim()) errors.billingCity = 'Billing city is required.';
      if (!billingAddress.postalCode.trim() || billingAddress.postalCode.replace(/\D/g, '').length !== 6) {
        errors.billingPostalCode = 'Valid 6-digit billing PIN code required.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInformationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInformationStep()) {
      navigate('/checkout/shipping');
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout/payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const response = await orderService.submitOrder({
        items,
        contact,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        shippingMethodId,
        couponCode,
        paymentMethod,
        sandboxOutcome,
        idempotencyKey,
      });

      if (response.success && response.order) {
        regenerateIdempotencyKey();
        navigate(`/order/success/${response.order.id}`);
      } else {
        // Failed payment outcome
        regenerateIdempotencyKey();
        navigate(`/order/payment-failed/${response.orderId || 'unknown'}`);
      }
    } catch {
      setSubmissionError('An unexpected network error occurred while contacting the atelier server. Please retry.');
      setIsSubmitting(false);
    }
  };

  const handleQuickFillDemoAddress = () => {
    const demo = DEMO_SAVED_ADDRESSES[0]!;
    setContact({
      email: 'aditya.vardhan@vastramay.in',
      phone: demo.phone,
    });
    setShippingAddress({
      fullName: demo.fullName,
      phone: demo.phone,
      addressLine1: demo.addressLine1,
      addressLine2: demo.addressLine2,
      city: demo.city,
      state: demo.state,
      postalCode: demo.postalCode,
      country: demo.country,
    });
    setFormErrors({});
  };

  /* -------------------------------------------------------------
   * RENDER: EMPTY BAG REDIRECT
   * ----------------------------------------------------------- */
  if (items.length === 0 && orders.length > 0 && !location.pathname.includes('/order/')) {
    // If bag is empty, check if user has previous orders
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 font-body">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="You do not have any items ready for checkout. Explore our collection or track an existing order."
          action={
            <div className="flex gap-4">
              <Link to="/shop">
                <Button variant="primary" size="md">
                  Explore The Wardrobe
                </Button>
              </Link>
              <Link to="/track-order">
                <Button variant="secondary" size="md">
                  Track Existing Order
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 font-body">
      {/* 1. Sandbox Environment Notice */}
      {sandboxMode && (
        <div className="mb-8 p-3.5 bg-brand-black text-white border border-brand-purple flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-caption">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-purple-light animate-pulse shrink-0" />
            <strong className="uppercase tracking-wider text-brand-purple-light">
              Sandbox / Demo Mode:
            </strong>
            <span className="text-brand-gray-300">
              Transactions are simulated safely in development test mode. No real money or card charges occur.
            </span>
          </div>

          {currentStep === 'payment' && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-white/60">Simulate:</span>
              <button
                type="button"
                onClick={() => setSandboxOutcome('success')}
                className={`px-2 py-0.5 text-[11px] uppercase tracking-wider border transition-colors ${
                  sandboxOutcome === 'success'
                    ? 'border-brand-purple bg-brand-purple text-white font-semibold'
                    : 'border-white/30 text-white/70 hover:border-white'
                }`}
              >
                Success
              </button>
              <button
                type="button"
                onClick={() => setSandboxOutcome('failure')}
                className={`px-2 py-0.5 text-[11px] uppercase tracking-wider border transition-colors ${
                  sandboxOutcome === 'failure'
                    ? 'border-red-500 bg-red-600 text-white font-semibold'
                    : 'border-white/30 text-white/70 hover:border-white'
                }`}
              >
                Failure / Decline
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Step Breadcrumb Progress Strip */}
      <nav aria-label="Checkout Progress" className="mb-8 pb-4 border-b border-brand-subdued-border">
        <ol className="flex items-center gap-2 sm:gap-3 text-caption uppercase tracking-wider">
          <li>
            <Link to="/cart" className="text-brand-subdued-medium hover:text-brand-black transition-colors">
              Bag
            </Link>
          </li>
          <li className="text-brand-subdued-low">/</li>
          <li className={currentStep === 'information' ? 'text-brand-purple font-semibold' : 'text-brand-subdued-high'}>
            <Link to="/checkout/information">1. Delivery Address</Link>
          </li>
          <li className="text-brand-subdued-low">/</li>
          <li className={currentStep === 'shipping' ? 'text-brand-purple font-semibold' : 'text-brand-subdued-medium'}>
            <span>2. Shipping Method</span>
          </li>
          <li className="text-brand-subdued-low">/</li>
          <li className={currentStep === 'payment' ? 'text-brand-purple font-semibold' : 'text-brand-subdued-medium'}>
            <span>3. Payment</span>
          </li>
        </ol>
      </nav>

      {/* 3. Main Split Layout: Form Body (7 Cols) + Summary Sidebar (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Step Form Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {submissionError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-body-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{submissionError}</span>
            </div>
          )}

          {/* ========================================================
              STEP 1: INFORMATION & DELIVERY ADDRESS
             ======================================================== */}
          {currentStep === 'information' && (
            <form onSubmit={handleInformationSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl sm:text-3xl text-brand-black tracking-tight">
                  Contact & Delivery Details
                </h1>

                {/* Demo Quick Fill */}
                <button
                  type="button"
                  onClick={handleQuickFillDemoAddress}
                  className="text-caption uppercase tracking-wider text-brand-purple hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles size={12} />
                  <span>Fill Demo Address</span>
                </button>
              </div>

              {/* Contact Information */}
              <div className="p-5 border border-brand-subdued-border bg-white space-y-4">
                <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold">
                  Customer Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-email" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ email: e.target.value })}
                      placeholder="aditya@example.com"
                      className={`w-full bg-white border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple ${
                        formErrors.email ? 'border-red-500' : 'border-brand-subdued-border'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                      Phone Number (for courier updates) *
                    </label>
                    <div className="flex border border-brand-subdued-border">
                      <span className="px-3 py-2.5 bg-brand-subdued-surface text-body-sm text-brand-subdued-high border-r border-brand-subdued-border select-none">
                        +91
                      </span>
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full bg-white px-3 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-5 border border-brand-subdued-border bg-white space-y-4">
                <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold">
                  Shipping Address
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="ship-name" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                      Recipient Full Name *
                    </label>
                    <input
                      id="ship-name"
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ fullName: e.target.value })}
                      placeholder="Aditya Vardhan"
                      className={`w-full bg-white border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple ${
                        formErrors.fullName ? 'border-red-500' : 'border-brand-subdued-border'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label htmlFor="ship-addr1" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                      Flat / House No. / Street Address *
                    </label>
                    <input
                      id="ship-addr1"
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ addressLine1: e.target.value })}
                      placeholder="Flat 402, Royal Palms, Golf Course Road"
                      className={`w-full bg-white border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple ${
                        formErrors.addressLine1 ? 'border-red-500' : 'border-brand-subdued-border'
                      }`}
                    />
                    {formErrors.addressLine1 && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label htmlFor="ship-addr2" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      id="ship-addr2"
                      type="text"
                      value={shippingAddress.addressLine2 || ''}
                      onChange={(e) => setShippingAddress({ addressLine2: e.target.value })}
                      placeholder="DLF Phase 5, Near Horizon Center"
                      className="w-full bg-white border border-brand-subdued-border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  {/* City, State & PIN Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="ship-city" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                        City / Town *
                      </label>
                      <input
                        id="ship-city"
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ city: e.target.value })}
                        placeholder="Gurugram"
                        className={`w-full bg-white border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple ${
                          formErrors.city ? 'border-red-500' : 'border-brand-subdued-border'
                        }`}
                      />
                      {formErrors.city && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="ship-state" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                        State / Union Territory *
                      </label>
                      <select
                        id="ship-state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ state: e.target.value })}
                        className="w-full bg-white border border-brand-subdued-border px-3 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple cursor-pointer"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ship-pin" className="block text-caption uppercase tracking-wider text-brand-subdued-high mb-1.5 font-medium">
                        PIN Code (6 Digits) *
                      </label>
                      <input
                        id="ship-pin"
                        type="text"
                        maxLength={6}
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ postalCode: e.target.value })}
                        placeholder="122002"
                        className={`w-full bg-white border px-3.5 py-2.5 text-body-sm rounded-none focus:outline-none focus:border-brand-purple ${
                          formErrors.postalCode ? 'border-red-500' : 'border-brand-subdued-border'
                        }`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address Toggle */}
              <div className="p-4 border border-brand-subdued-border bg-white flex items-center gap-3">
                <input
                  id="same-bill-toggle"
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="w-4 h-4 rounded-none accent-brand-purple cursor-pointer"
                />
                <label htmlFor="same-bill-toggle" className="text-body-sm text-brand-black cursor-pointer">
                  Billing address is identical to delivery address
                </label>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-4">
                <Link to="/cart" className="text-body-sm text-brand-subdued-medium hover:text-brand-black transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={15} />
                  <span>Return to Shopping Bag</span>
                </Link>

                <Button type="submit" variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Continue to Shipping Method
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================
              STEP 2: SHIPPING METHOD SELECTION
             ======================================================== */}
          {currentStep === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <h1 className="font-display text-2xl sm:text-3xl text-brand-black tracking-tight">
                Select Shipping Method
              </h1>

              {/* Delivery Review Card */}
              <div className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border">
                <div className="p-4 flex items-center justify-between text-body-sm">
                  <div className="flex gap-4">
                    <span className="text-brand-subdued-medium w-16">Contact</span>
                    <span className="text-brand-black font-medium">{contact.email} ({contact.phone})</span>
                  </div>
                  <Link to="/checkout/information" className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium">
                    Edit
                  </Link>
                </div>
                <div className="p-4 flex items-center justify-between text-body-sm">
                  <div className="flex gap-4">
                    <span className="text-brand-subdued-medium w-16">Ship To</span>
                    <span className="text-brand-black font-medium">
                      {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                    </span>
                  </div>
                  <Link to="/checkout/information" className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium">
                    Edit
                  </Link>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="space-y-3 pt-2">
                <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold">
                  Available Delivery Options
                </h3>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = shippingMethodId === method.id;
                    const isFree = method.freeAbovePaise && currentSubtotalPaise >= method.freeAbovePaise;
                    const priceDisplay = isFree ? 'Free' : `₹${Math.round(method.pricePaise / 100)}`;

                    return (
                      <label
                        key={method.id}
                        className={`block p-4 border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-brand-purple bg-brand-subdued-surface'
                            : 'border-brand-subdued-border bg-white hover:border-brand-black'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={isSelected}
                              onChange={() => setShippingMethodId(method.id)}
                              className="mt-1 w-4 h-4 accent-brand-purple cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-brand-black text-body-sm">
                                  {method.name}
                                </span>
                                <span className="text-caption text-brand-purple font-medium">
                                  ({method.estimatedDays})
                                </span>
                              </div>
                              <p className="text-caption text-brand-subdued-medium mt-0.5">
                                {method.description}
                              </p>
                            </div>
                          </div>

                          <span className={`text-body-sm font-semibold ${isFree ? 'text-emerald-700 uppercase text-xs tracking-wider' : 'text-brand-black'}`}>
                            {priceDisplay}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-4">
                <Link to="/checkout/information" className="text-body-sm text-brand-subdued-medium hover:text-brand-black transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={15} />
                  <span>Back to Address</span>
                </Link>

                <Button type="submit" variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================
              STEP 3: SECURE PAYMENT
             ======================================================== */}
          {currentStep === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h1 className="font-display text-2xl sm:text-3xl text-brand-black tracking-tight">
                Payment & Order Confirmation
              </h1>

              {/* Review Card */}
              <div className="border border-brand-subdued-border bg-white divide-y divide-brand-subdued-border">
                <div className="p-4 flex items-center justify-between text-body-sm">
                  <div className="flex gap-4">
                    <span className="text-brand-subdued-medium w-16">Contact</span>
                    <span className="text-brand-black font-medium">{contact.email}</span>
                  </div>
                  <Link to="/checkout/information" className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium">
                    Edit
                  </Link>
                </div>
                <div className="p-4 flex items-center justify-between text-body-sm">
                  <div className="flex gap-4">
                    <span className="text-brand-subdued-medium w-16">Ship To</span>
                    <span className="text-brand-black font-medium">
                      {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                    </span>
                  </div>
                  <Link to="/checkout/information" className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium">
                    Edit
                  </Link>
                </div>
                <div className="p-4 flex items-center justify-between text-body-sm">
                  <div className="flex gap-4">
                    <span className="text-brand-subdued-medium w-16">Method</span>
                    <span className="text-brand-black font-medium">
                      {selectedShipping.name} ({shippingCost === 0 ? 'Free' : `₹${shippingCost}`})
                    </span>
                  </div>
                  <Link to="/checkout/shipping" className="text-caption uppercase tracking-wider text-brand-purple hover:underline font-medium">
                    Edit
                  </Link>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h3 className="text-label uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
                  <Lock size={13} className="text-brand-purple" />
                  Select Payment Method (INR)
                </h3>

                <div className="space-y-3">
                  {/* UPI */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-brand-purple bg-brand-subdued-surface'
                        : 'border-brand-subdued-border bg-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-4 h-4 accent-brand-purple cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <QrCode size={18} className="text-brand-purple" />
                          <span className="font-semibold text-brand-black text-body-sm">
                            UPI (Google Pay, PhonePe, Paytm, BHIM)
                          </span>
                        </div>
                      </div>
                      <span className="text-caption text-brand-purple font-medium">Instant Verification</span>
                    </div>
                  </label>

                  {/* Cards */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-brand-purple bg-brand-subdued-surface'
                        : 'border-brand-subdued-border bg-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 accent-brand-purple cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-brand-purple" />
                          <span className="font-semibold text-brand-black text-body-sm">
                            Credit / Debit Cards (Visa, Mastercard, RuPay, Amex)
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Netbanking */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'netbanking'
                        ? 'border-brand-purple bg-brand-subdued-surface'
                        : 'border-brand-subdued-border bg-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                          className="w-4 h-4 accent-brand-purple cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <Building size={18} className="text-brand-purple" />
                          <span className="font-semibold text-brand-black text-body-sm">
                            Net Banking (All Indian Major Banks)
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-brand-purple bg-brand-subdued-surface'
                        : 'border-brand-subdued-border bg-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 accent-brand-purple cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <Banknote size={18} className="text-brand-purple" />
                          <span className="font-semibold text-brand-black text-body-sm">
                            Cash on Delivery (Doorstep Verification)
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Idempotency & Submit CTA */}
              <div className="pt-4 border-t border-brand-subdued-border flex items-center justify-between">
                <Link to="/checkout/shipping" className="text-body-sm text-brand-subdued-medium hover:text-brand-black transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={15} />
                  <span>Back to Shipping</span>
                </Link>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  rightIcon={isSubmitting ? undefined : <Check size={16} />}
                  className="min-w-[220px]"
                >
                  {isSubmitting ? 'Verifying Atelier Order...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} Now`}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Order Summary Sidebar (5 Cols) */}
        <aside className="lg:col-span-5 border border-brand-subdued-border bg-white p-6 sm:p-8 space-y-6 sticky top-28">
          <h2 className="font-display text-xl sm:text-2xl text-brand-black pb-4 border-b border-brand-subdued-border">
            In Your Bag ({items.length})
          </h2>

          {/* Line items list */}
          <div className="divide-y divide-brand-subdued-border max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="py-3 flex items-center gap-3.5">
                <div className="w-14 aspect-[3/4] bg-brand-subdued-surface border border-brand-subdued-border shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-brand-black truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-brand-subdued-medium">
                    {item.color} · Size: {item.size} · Qty: {item.quantity}
                  </p>
                  <PriceDisplay price={item.price} size="sm" />
                </div>
                <span className="text-body-sm font-semibold text-brand-black whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations Breakdown */}
          <div className="space-y-3 pt-4 border-t border-brand-subdued-border text-body-sm">
            <div className="flex items-center justify-between text-brand-subdued-high">
              <span>Subtotal</span>
              <span className="font-medium text-brand-black">₹{currentSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {currentDiscount > 0 && (
              <div className="flex items-center justify-between text-brand-purple">
                <span>Coupon ({couponCode})</span>
                <span className="font-semibold">-₹{currentDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-brand-subdued-high">
              <span>Delivery</span>
              <span className={shippingCost === 0 ? 'text-emerald-700 font-semibold uppercase text-xs' : 'font-medium text-brand-black'}>
                {shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="pt-4 border-t border-brand-subdued-border flex items-baseline justify-between">
              <div>
                <span className="font-display text-xl font-bold text-brand-black">Total Due</span>
                <span className="block text-caption text-brand-subdued-low">(Inclusive of all GST)</span>
              </div>
              <span className="font-display text-2xl font-bold text-brand-black">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-brand-subdued-border space-y-2 text-caption text-brand-subdued-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-brand-purple shrink-0" />
              <span>Razorpay 256-Bit SSL Protected Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-brand-purple shrink-0" />
              <span>Dispatched from New Delhi within 24–48 hours</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
