'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent scrolling during preloading
    document.documentElement.classList.add('lenis-prevent');
    document.body.style.overflow = 'hidden';

    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // Animation when preloading completes: slide up and fade out text
        const exitTl = gsap.timeline({
          onComplete: () => {
            document.documentElement.classList.remove('lenis-prevent');
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }
        });

        exitTl.to(textRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in'
        });

        exitTl.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut'
        }, '-=0.2');
      }
    });

    // Count up animation
    tl.to(obj, {
      value: 100,
      duration: 2.0,
      ease: 'power3.out',
      onUpdate: () => {
        setCount(Math.floor(obj.value));
      }
    });

    // Subtle entrance animations inside loader
    gsap.fromTo('.loader-fade-in', 
      { opacity: 0, y: 15 },
      { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 }
    );

    return () => {
      document.documentElement.classList.remove('lenis-prevent');
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[99999] flex flex-col justify-between p-8 md:p-16 select-none pointer-events-none"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full">
        <span className="loader-fade-in font-primary font-black text-sm tracking-[0.25em] text-white">
          NOINTRO
        </span>
        <span className="loader-fade-in font-secondary text-[10px] tracking-[0.2em] text-white/60 uppercase">
          [ CREATIVE MARKETING AGENCY ]
        </span>
      </div>

      {/* Main Counter */}
      <div className="flex items-center justify-center flex-grow">
        <h1
          ref={textRef}
          className="font-primary font-black text-[clamp(4.5rem,16vw,14rem)] leading-none text-white select-none tabular-nums"
        >
          {count}%
        </h1>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end w-full">
        <span className="loader-fade-in font-secondary text-[10px] tracking-[0.2em] text-white/50 uppercase">
          CINEMATIC SHOWCASE
        </span>
        <span className="loader-fade-in font-secondary text-[10px] tracking-[0.2em] text-white/50 uppercase">
          © 2026
        </span>
      </div>
    </div>
  );
}
