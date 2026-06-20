'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from './projects';

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

function getLenis() {
  if (typeof window === 'undefined') return null;
  return window.lenisInstance ?? null;
}

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // ── Pause scroll behavior of background on overlay mount, resume on unmount ──
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, []);

  // ── GSAP Entrance Animation Timeline ──
  useGSAP(
    () => {
      // Build animation sequence. On reverse complete, trigger the onClose unmount callback.
      tl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: onClose,
        })
        // 1. Fade overlay backdrop and apply blur
        .fromTo(overlayRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.35, ease: 'power2.out' }
        )
        // 2. Slide content panel up from y: 40 with duration 0.5 and power3.out ease
        .fromTo(panelRef.current, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 
          '-=0.15'
        )
        // 3. Stagger entrance of typography blocks and key values
        .fromTo(
          textRef.current ? Array.from(textRef.current.children) : [],
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.07 },
          '-=0.35'
        );

      // Play sequence immediately on mount
      tl.current.play();
    },
    { scope: overlayRef }
  );

  // Reverses the GSAP timeline and unmounts upon completion
  const handleClose = useCallback(() => {
    if (tl.current) {
      tl.current.reverse();
    } else {
      onClose();
    }
  }, [onClose]);

  // ── Close overlay on ESC key ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      // Fixed full viewport positioned overlay at z-index 50
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-6 md:p-16 select-none"
      onClick={(e) => {
        // Closes modal only if the backdrop element itself was clicked
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 md:top-10 md:right-12 px-6 py-2.5 font-primary font-bold text-[10px] tracking-[0.22em] uppercase text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-250 hover:bg-white hover:text-black hover:border-white z-50 cursor-pointer"
        aria-label="Close project modal"
      >
        Close
      </button>

      {/* Main panel container */}
      <div
        ref={panelRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl w-full mx-auto items-center"
      >
        {/* Left: Gradient Hero Area with Blended Project Image or Video */}
        <div
          ref={heroRef}
          style={{ 
            '--hero-gradient': project.gradient,
            '--hero-image': `url('${project.image}')`
          } as React.CSSProperties}
          className={`relative w-full ${project.video ? 'aspect-video' : 'aspect-[3/4]'} max-h-[50vh] md:max-h-[65vh] bg-[var(--hero-gradient)] rounded-2xl border border-white/10 overflow-hidden shadow-2xl`}
        >
          {project.video ? (
            <video
              src={project.video}
              controls
              autoPlay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          ) : (
            <>
              {/* Background image overlay with mix-blend-mode for cinematic depth */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: 'var(--hero-image)' }}
                aria-hidden="true"
              />
              {/* Soft vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" aria-hidden="true" />
            </>
          )}
        </div>

        {/* Right: Editorial Information Column */}
        <div ref={textRef} className="flex flex-col text-left">
          {/* Tag */}
          <span className="font-primary font-bold text-[10px] tracking-[0.25em] text-white/50 uppercase mb-3">
            {project.tag}
          </span>

          {/* Title */}
          <h2 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase text-white mb-6 pr-[0.15em] leading-none">
            {project.title}
          </h2>

          {/* Description */}
          <p className="font-secondary text-white/65 text-sm md:text-base tracking-wide leading-relaxed mb-10 max-w-lg">
            {project.description}
          </p>

          {/* 2-Column Editorial Metadata Grid */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-white/10 max-w-lg">
            {Object.entries(project.meta).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0.5">
                <dt className="font-secondary text-[10px] tracking-widest text-white/40 uppercase">
                  {key}
                </dt>
                <dd className="font-primary font-bold text-xs uppercase text-white tracking-wide">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
