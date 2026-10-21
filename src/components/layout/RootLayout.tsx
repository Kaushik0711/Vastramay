import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import { CartDrawer } from '@/components/cart';
import { CustomCursor, ScrollProgress, SmoothScroll } from '@/components/common';

export default function RootLayout() {
  const location = useLocation();

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen relative selection:bg-brand-purple selection:text-white">
        {/* Scroll-Driven Reading Progress Bar (Fixed Top) */}
        <ScrollProgress />

        {/* Custom Desktop Contextual Cursor (Fine Pointer Only) */}
        <CustomCursor />

        {/* Global Fixed Header */}
        <Header />

        {/* Offset for fixed header: announcement bar (36px) + main header (64px mobile / 80px desktop) */}
        <main className="flex-1 mt-[100px] sm:mt-[116px] flex flex-col">
          {/* Page Transition: Fast fade & subtle lift without delayed navigation or stale route content */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Mini-Cart Slide-out Drawer */}
        <CartDrawer />
      </div>
    </SmoothScroll>
  );
}
