'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Project } from './projects';

interface ProjectOverlayProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when overlay is open using Lenis global instance
  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (lenis) lenis.stop();
    return () => {
      if (lenis) lenis.start();
    };
  }, []);

  const { contextSafe } = useGSAP(() => {
    if (!project) return;

    // Entrance animation
    gsap.timeline()
      .fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      .fromTo(containerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo(imageRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(textRef.current ? textRef.current.children : [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
        '-=0.4'
      );
  }, { scope: overlayRef, dependencies: [project] });

  // Clean close animation before unmounting
  const handleClose = contextSafe(() => {
    gsap.timeline({
      onComplete: onClose
    })
      .to(containerRef.current, { y: 30, opacity: 0, duration: 0.4, ease: 'power3.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
  });

  if (!project) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[1000] bg-zinc-950/98 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
    >
      {/* Floating Close Button */}
      <button
        onClick={handleClose}
        data-cursor="view"
        className="absolute top-6 right-6 md:top-8 md:right-12 px-6 py-2.5 font-primary font-bold text-[10px] tracking-[0.2em] uppercase text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:border-white z-[1010] cursor-pointer pointer-events-auto"
      >
        Close
      </button>

      {/* Main Container */}
      <div 
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl w-full mx-auto select-none pointer-events-auto items-center"
      >
        {/* Left Side: Large Portrait Image */}
        <div 
          ref={imageRef}
          className="relative aspect-[3/4] md:aspect-[4/5] w-full max-h-[50vh] md:max-h-[70vh] bg-zinc-900 border border-white/5 overflow-hidden"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${project.image}')` }}
          />
          {/* Overlay grain/noise pattern */}
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay" />
        </div>

        {/* Right Side: Editorial Info */}
        <div ref={textRef} className="flex flex-col text-left">
          <span className="font-primary font-bold text-[10px] tracking-[0.25em] text-white/50 uppercase mb-2">
            {project.tag}
          </span>
          <h2 className="font-primary font-black text-3xl md:text-5xl tracking-tight uppercase text-white mb-6 pr-[0.15em]">
            <span className="pr-[0.1em]">{project.title}</span>
          </h2>
          <p className="font-secondary text-white/70 text-sm md:text-base tracking-wide leading-relaxed mb-8 max-w-lg">
            {project.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
            <div>
              <span className="block font-secondary text-[9px] tracking-widest text-white/40 uppercase mb-1">Client</span>
              <span className="font-primary font-bold text-xs uppercase text-white">{project.client}</span>
            </div>
            <div>
              <span className="block font-secondary text-[9px] tracking-widest text-white/40 uppercase mb-1">Year</span>
              <span className="font-primary font-bold text-xs uppercase text-white">{project.year}</span>
            </div>
            <div>
              <span className="block font-secondary text-[9px] tracking-widest text-white/40 uppercase mb-1">Role</span>
              <span className="font-primary font-bold text-xs uppercase text-white">{project.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
