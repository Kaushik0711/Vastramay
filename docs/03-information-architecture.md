# 03 — Information Architecture and Routes

## 1. Global navigation

Desktop header:
- Vastramay wordmark
- Shop
- New Arrivals
- Collections
- About
- Search
- Account
- Wishlist
- Bag/cart

Mobile header:
- Menu
- Wordmark
- Search
- Bag/cart

The menu drawer must support touch, keyboard, Escape, focus management and scroll locking. Never rely on hover for essential navigation.

## 2. Storefront routes

| Page | Suggested route |
|---|---|
| Home | `/` |
| All products | `/shop` |
| Collection | `/collections/:slug` |
| Search results | `/search?q=...` |
| Product details | `/products/:slug` |
| Wishlist | `/wishlist` |
| Cart | `/cart` |
| Checkout information | `/checkout/information` |
| Checkout shipping | `/checkout/shipping` |
| Checkout payment | `/checkout/payment` |
| Order success | `/order/success/:orderId` |
| Payment failure | `/order/payment-failed/:orderId` |
| Guest order tracking | `/track-order` |
| Sign in | `/account/login` |
| Register | `/account/register` |
| Forgot password | `/account/forgot-password` |
| Account overview | `/account` |
| Order history | `/account/orders` |
| Order detail | `/account/orders/:orderId` |
| Addresses | `/account/addresses` |
| Account settings | `/account/settings` |
| About | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Size guide | `/size-guide` |
| Shipping | `/shipping` |
| Returns | `/returns` |
| Privacy | `/policies/privacy` |
| Terms | `/policies/terms` |
| Cancellation | `/policies/cancellation` |
| Not Found | Catch-all 404 |

Routes are proposed; inspect the actual router before adding or changing paths.

## 3. Admin routes

Suggested protected namespace:
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/:productId`
- `/admin/collections`
- `/admin/inventory`
- `/admin/orders`
- `/admin/orders/:orderId`
- `/admin/customers`
- `/admin/settings`

Client-side route guards are not security boundaries. Every sensitive operation must also be authorized by the backend.

## 4. Footer navigation groups

- Shop: All products, New Arrivals, Collections
- Help: Contact, FAQ, Size Guide, Shipping, Returns
- Brand: About
- Policies: Privacy, Terms, Cancellation
- Social: only verified official accounts
- Newsletter: only if a real submission integration or clearly labelled development adapter exists

## 5. Page-level states

Every route should account for:
- Loading
- Empty content
- Error
- Unavailable or removed product
- Invalid URL/404
- Mobile layout
- Keyboard interaction where relevant

Do not create duplicate static pages for every collection if a reusable collection template driven by data is sufficient.
