# 04 — Customer Journey, Cart and Checkout

## 1. Primary customer journey

Home → Shop/Collection/Search → Product Details → Cart → Checkout Information → Delivery → Payment → Verified Order Confirmation → Order Tracking.

Customers should be able to check out as guests. Account creation can be offered after the order, without forcing it before purchase.

## 2. Product detail journey

1. Customer opens a product.
2. Product images, title, actual price, description and available variants render.
3. Required size/color is selected.
4. Unavailable variants are disabled with a clear status.
5. Add to Bag validates required selections.
6. A mini-cart drawer confirms the selected variant and provides “Continue Shopping” and “View Bag”.
7. Cart state updates and persists.

## 3. Cart states

- Empty cart with a working Continue Shopping link.
- Cart with items and variant details.
- Quantity change and remove item.
- Coupon applied/invalid/expired/ineligible.
- Stock reduced or variant unavailable.
- Network error and retry.
- Cart restored after refresh.
- Guest cart merged after login using defined rules.

The backend is authoritative for prices, discounts, stock and final totals. The frontend must not be trusted to set payable amounts.

## 4. Checkout steps

### Information
- Email/phone as required by the business.
- Delivery address.
- Field-level validation.
- Guest checkout.
- Optional saved-address selection for authenticated customers.

### Delivery
- Available shipping methods and fees from a real configured service.
- Accurate delivery estimates only when available.
- Clear handling if no shipping option is available.

### Payment
- Final order summary.
- Server-calculated totals.
- Supported payment methods only.
- Prevent repeated submission.
- Show processing/pending state until verified result is available.

## 5. Payment states

- Not started
- Initiated
- Pending
- Succeeded/verified
- Failed
- Cancelled
- Expired or abandoned where supported

A frontend redirect alone is not proof of payment. Verify payment server-side and process provider webhooks safely. Use idempotency controls to avoid duplicate orders or charges.

## 6. Order lifecycle

Possible order states:
- Pending payment
- Confirmed
- Processing
- Shipped
- Out for delivery
- Delivered
- Cancelled
- Return requested
- Refund processing
- Refunded

Not all states apply to every order. Validate allowed transitions in the backend. Shipping events should reflect real carrier data or the actual recorded status—not fabricated tracking updates.

## 7. Confirmation and tracking

Order success page should show:
- Order reference
- Purchased items and variants
- Total
- Delivery destination summary
- Recorded order/payment status
- Estimated delivery only if supplied by the shipping service
- Link to tracking/account order details

Guest tracking must use a secure lookup or signed token. Do not expose private orders through predictable IDs alone.

## 8. Essential failure cases

Test:
- Invalid address
- Empty cart
- Product becomes unavailable
- Price changes before checkout
- Shipping calculation failure
- Payment pending
- Payment failure and retry
- Duplicate submit
- Browser refresh during payment
- Webhook retry
- Expired session
- Unauthorized order lookup
