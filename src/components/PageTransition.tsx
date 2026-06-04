'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="w-full flex-grow flex flex-col">
        {/* Wipe Overlay */}
        <motion.div
          className="fixed inset-0 bg-black z-[99999] pointer-events-none"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{ originY: 1 }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
