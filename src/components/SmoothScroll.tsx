'use client';

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollContext } from '@/context/SmoothScrollContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

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

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis RAF with GSAP Ticker
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => {
      setLenisInstance(lenis);
    }, 0);

    // Clean up
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
      clearTimeout(timer);
      lenis.destroy();
      gsap.ticker.remove(tick);
      setLenisInstance(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisInstance}>
      <div className="w-full flex-grow">{children}</div>
    </SmoothScrollContext.Provider>
  );
}
