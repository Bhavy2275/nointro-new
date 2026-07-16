'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useLoaderStore } from '@/store/useLoaderStore';

interface PreloaderProps {
   onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
   const [count, setCount] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);
   
   // Keep a ref to the current animated value to avoid jumping
   const currentValRef = useRef({ value: 0 });
   const completedRef = useRef(false);

   const loadedCount = useLoaderStore((state) => state.loadedCount);
   const targetVideos = useLoaderStore((state) => state.targetVideos);
   const setLoaderFinished = useLoaderStore((state) => state.setLoaderFinished);

   useEffect(() => {
     if (typeof window === 'undefined') return;

     document.body.style.overflow = 'hidden';

     // Subtle entrance animations inside loader
     gsap.fromTo('.loader-fade-in', 
       { opacity: 0, y: 15 },
       { opacity: 0.5, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 }
     );
     
     return () => {
       document.body.style.overflow = '';
     };
   }, []);

   // Safety net: force-finish the preloader after 12s regardless of loaded count.
   // Prevents the user from being stuck at 0% if videos fail to report readiness
   // (e.g. iOS Safari not firing canplay on hidden elements, CDN outage, etc.)
   useEffect(() => {
     if (typeof window === 'undefined') return;
     const timer = setTimeout(() => {
       if (!completedRef.current) {
         completedRef.current = true;
         setLoaderFinished();
         onComplete?.();
       }
     }, 12000);
     return () => clearTimeout(timer);
   }, [setLoaderFinished, onComplete]);

   useEffect(() => {
     if (typeof window === 'undefined') return;

     const targetPercentage = Math.floor((loadedCount / targetVideos) * 100);
     const isComplete = loadedCount >= targetVideos;

     gsap.to(currentValRef.current, {
       value: targetPercentage,
       duration: 1.5,
       ease: 'power3.out',
       onUpdate: () => {
         setCount(Math.floor(currentValRef.current.value));
       },
       onComplete: () => {
         if (isComplete && currentValRef.current.value >= 99) {
           if (completedRef.current) return; // safety timeout already fired
           completedRef.current = true;

           // Animation when preloading completes: slide up and fade out text
           const exitTl = gsap.timeline({
             onComplete: () => {
               setLoaderFinished();
               onComplete?.();
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
       }
     });

   }, [loadedCount, targetVideos, setLoaderFinished, onComplete]);

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
