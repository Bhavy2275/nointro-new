'use client';

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { SmoothScrollContext } from '@/context/SmoothScrollContext';
import { useLoaderStore } from '@/store/useLoaderStore';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const isLoaderFinished = useLoaderStore((state) => state.isLoaderFinished);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Force scroll to top on refresh/mount
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Use lenis tick method directly for RAF syncing
    let rafId: number;
    const tick = () => {
      lenis.raf(Date.now());
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const timer = setTimeout(() => {
      setLenisInstance(lenis);
    }, 0);

    // Clean up
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  // Lock and unlock scroll based on loader state
  useEffect(() => {
    if (!lenisInstance) return;
    if (isLoaderFinished) {
      lenisInstance.start();
    } else {
      lenisInstance.stop();
    }
  }, [lenisInstance, isLoaderFinished]);

  return (
    <SmoothScrollContext.Provider value={lenisInstance}>
      <div className="w-full flex-grow">{children}</div>
    </SmoothScrollContext.Provider>
  );
}
