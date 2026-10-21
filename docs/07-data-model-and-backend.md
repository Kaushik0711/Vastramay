# 07 — Data Model and Backend Plan

## 1. Important distinction

This document proposes a model. It does not mean these tables or services already exist. Inspect the actual backend and migrations before implementing or documenting them as complete.

## 2. Core entities

### Product
- `id`
- `slug`
- `name`
- `description`
- `categoryId`
- `status` (draft/active/archived)
- `createdAt`
- `updatedAt`

### ProductVariant
- `id`
- `productId`
- `sku`
- `size`
- `color`
- `priceMinor` (integer minor currency units, e.g. paise)
- `compareAtPriceMinor` when applicable
- `stockQuantity`
- `isActive`
- image association if variants have different imagery

### ProductImage
- `id`
- `productId`
- optional `variantId`
- `url`
- `alt`
- `sortOrder`

### Category / Collection
- `id`
- `name`
- `slug`
- `description`
- image/asset references
- active state and sort order

### Cart
- Guest/cart identifier or authenticated user association
- Cart line items with variant ID and quantity
- Do not treat client-submitted price as authoritative

### Customer / Address
- Auth provider ID
- Customer profile fields needed by the business
- Address fields
- Created/updated timestamps
- Strict access control

### Order
- `id`
- secure public order reference
- customer ID when authenticated
- contact and delivery snapshot
- currency
- item subtotal
- discounts
- shipping fee
- tax if applicable
- final total
- order status
- payment status
- created/updated timestamps

### OrderItem
- order ID
- product and variant reference
- immutable name/SKU/variant/price snapshot
- quantity
- line total

Keep an order's item and address snapshot stable even if a product or customer address changes later.

### Payment
- order ID
- provider
- provider order/payment references
- amount and currency
- status
- verification timestamps
- safe failure metadata

Never store card PAN/CVV or provider secret credentials in application tables or client storage.

### Shipment
- order ID
- carrier/provider
- tracking reference
- actual status and event history
- estimated delivery only when supplied by the carrier/provider

### Coupon (optional)
- code
- validity period
- usage rules and limits
- eligibility
- server-side validation logic

## 3. Backend responsibilities

- Validate product, variant, price, stock and coupon eligibility.
- Calculate totals on the server.
- Create payment intents/orders with the provider.
- Verify payment signatures/webhooks.
- Use idempotency to prevent duplicate orders/charges.
- Update stock consistently.
- Authorize every private customer/admin operation.
- Record order status changes.
- Provide a secure guest order lookup.
- Send notifications through a configured provider.

## 4. Supabase option

If Supabase is selected:
- Use Auth for account identity.
- Use Postgres tables and migrations.
- Enable and test Row Level Security on private tables.
- Keep service-role credentials on the server only.
- Use Edge Functions or a trusted server for payment verification and privileged actions.
- Never expose unrestricted tables or storage buckets.
- Write policies that restrict a customer to their own records.

If another backend already exists, extend it rather than adding a second source of truth.

## 5. Payment integration

The target currency is INR. Razorpay may be a suitable India-focused candidate, but confirm merchant eligibility, supported payment methods, current fees, API documentation and account requirements before implementation.

Use sandbox credentials until all payment and webhook cases pass. A frontend success redirect must never independently mark an order as paid.

## 6. Development data

Demo fixtures must be clearly separated from live data. Do not invent ratings, sales counts, inventory urgency or customer reviews. Keep placeholder image states visibly intentional.
