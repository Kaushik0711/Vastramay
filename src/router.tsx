import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import HomePage from '@/pages/HomePage';

export const router = createBrowserRouter([
  // Public Storefront with Header & Footer Shell
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'shop',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ShopPage');
          return { Component };
        },
      },
      {
        path: 'categories/:slug',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ShopPage');
          return { Component };
        },
      },
      {
        path: 'collections',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CollectionsPage');
          return { Component };
        },
      },
      {
        path: 'collections/:slug',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CollectionsPage');
          return { Component };
        },
      },
      {
        path: 'search',
        lazy: async () => {
          const { default: Component } = await import('@/pages/SearchPage');
          return { Component };
        },
      },
      {
        path: 'product/:slug',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ProductPage');
          return { Component };
        },
      },
      {
        path: 'products/:slug',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ProductPage');
          return { Component };
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ShopPage');
          return { Component };
        },
      },
      {
        path: 'wishlist',
        lazy: async () => {
          const { default: Component } = await import('@/pages/WishlistPage');
          return { Component };
        },
      },
      {
        path: 'cart',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CartPage');
          return { Component };
        },
      },
      {
        path: 'checkout',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CheckoutPage');
          return { Component };
        },
      },
      {
        path: 'checkout/information',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CheckoutPage');
          return { Component };
        },
      },
      {
        path: 'checkout/shipping',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CheckoutPage');
          return { Component };
        },
      },
      {
        path: 'checkout/payment',
        lazy: async () => {
          const { default: Component } = await import('@/pages/CheckoutPage');
          return { Component };
        },
      },
      {
        path: 'order/success/:orderId',
        lazy: async () => {
          const { default: Component } = await import('@/pages/OrderSuccessPage');
          return { Component };
        },
      },
      {
        path: 'order/payment-failed/:orderId',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PaymentFailedPage');
          return { Component };
        },
      },
      {
        path: 'track-order',
        lazy: async () => {
          const { default: Component } = await import('@/pages/TrackOrderPage');
          return { Component };
        },
      },

      // Customer Account Portal
      {
        path: 'account',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/AccountDashboardPage');
          return { Component };
        },
      },
      {
        path: 'account/login',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/LoginPage');
          return { Component };
        },
      },
      {
        path: 'account/register',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/RegisterPage');
          return { Component };
        },
      },
      {
        path: 'account/forgot-password',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/ForgotPasswordPage');
          return { Component };
        },
      },
      {
        path: 'account/orders',
        lazy: async () => {
          const { default: Component } = await import('@/pages/OrdersPage');
          return { Component };
        },
      },
      {
        path: 'account/orders/:orderId',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/OrderDetailPage');
          return { Component };
        },
      },
      {
        path: 'account/addresses',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/AddressesPage');
          return { Component };
        },
      },
      {
        path: 'account/settings',
        lazy: async () => {
          const { default: Component } = await import('@/pages/account/SettingsPage');
          return { Component };
        },
      },

      // Brand Content
      {
        path: 'about',
        lazy: async () => {
          const { default: Component } = await import('@/pages/AboutPage');
          return { Component };
        },
      },
      {
        path: 'contact',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ContactPage');
          return { Component };
        },
      },
      {
        path: 'faq',
        lazy: async () => {
          const { default: Component } = await import('@/pages/FaqPage');
          return { Component };
        },
      },
      {
        path: 'size-guide',
        lazy: async () => {
          const { default: Component } = await import('@/pages/SizeGuidePage');
          return { Component };
        },
      },
      {
        path: 'shipping',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'returns',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/privacy',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/terms',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/cancellation',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/shipping',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/returns',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'policies/:policySlug',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PolicyPage');
          return { Component };
        },
      },
      {
        path: 'design-system',
        lazy: async () => {
          const { default: Component } = await import('@/pages/DesignSystemPage');
          return { Component };
        },
      },
      {
        path: 'not-found',
        lazy: async () => {
          const { default: Component } = await import('@/pages/NotFoundPage');
          return { Component };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { default: Component } = await import('@/pages/NotFoundPage');
          return { Component };
        },
      },
    ],
  },

  // Protected Admin Portal
  {
    path: 'admin',
    lazy: async () => {
      const { default: Component } = await import('@/pages/admin/AdminLayout');
      return { Component };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminDashboardPage');
          return { Component };
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminProductsPage');
          return { Component };
        },
      },
      {
        path: 'categories',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminCategoriesPage');
          return { Component };
        },
      },
      {
        path: 'inventory',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminInventoryPage');
          return { Component };
        },
      },
      {
        path: 'orders',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminOrdersPage');
          return { Component };
        },
      },
      {
        path: 'customers',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminCustomersPage');
          return { Component };
        },
      },
      {
        path: 'discounts',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminDiscountsPage');
          return { Component };
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { default: Component } = await import('@/pages/admin/AdminSettingsPage');
          return { Component };
        },
      },
    ],
  },
]);
