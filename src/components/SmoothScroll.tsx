'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    lenisInstance?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

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

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis RAF with GSAP Ticker
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Store lenis globally for optional anchor scrolls
    window.lenisInstance = lenis;

    // Clean up
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      delete window.lenisInstance;
    };
  }, []);

  return <div className="w-full flex-grow">{children}</div>;
}
