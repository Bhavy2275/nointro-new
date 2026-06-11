'use client';

/**
 * ProjectOverlay — full-screen cinematic detail view.
 *
 * Architecture:
 * - GSAP handles entrance (opacity+y tween) and exit (reverse tween then onComplete unmount).
 * - Lenis is already running globally in SmoothScroll.tsx — we access it via the window
 *   reference and call lenis.stop() / lenis.start() instead of creating a new instance.
 * - ESC key support via a useEffect keydown listener that triggers the animated close flow.
 * - useGSAP is called unconditionally at top-level so hook order never changes between renders.
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from './projects';

interface ProjectOverlayProps {
  /** The project to display — guaranteed non-null when component mounts. */
  project: Project;
  onClose: () => void;
}

/** Lenis type shim — only the methods we need, avoids importing the full Lenis package type. */
interface LenisInstance {
  stop: () => void;
  start: () => void;
}

function getLenis(): LenisInstance | null {
  // Lenis is initialised in SmoothScroll.tsx and stored on window by layout.tsx
  return (window as Window & { lenisInstance?: LenisInstance }).lenisInstance ?? null;
}

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);

  // ── Pause Lenis while overlay is open ─────────────────────────────────────
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    return () => { lenis?.start(); };
  }, []); // runs once on mount / cleans up on unmount

  // ── GSAP entrance animation ───────────────────────────────────────────────
  // useGSAP is called unconditionally — logic is conditional *inside* the callback.
  const { contextSafe } = useGSAP(
    () => {
      gsap
        .timeline()
        // 1. Backdrop fades in
        .fromTo(overlayRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        // 2. Content panel slides up from y=40
        .fromTo(panelRef.current,    { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.15')
        // 3. Image scales in from slight under-size
        .fromTo(imageRef.current,    { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        // 4. Text children stagger up one by one
        .fromTo(
          textRef.current ? Array.from(textRef.current.children) : [],
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.07 },
          '-=0.35',
        );
    },
    { scope: overlayRef, dependencies: [] }, // deps empty — runs only on mount
  );

  // ── Animated close ────────────────────────────────────────────────────────
  const handleClose = contextSafe(useCallback(() => {
    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current,   { y: 30, opacity: 0, duration: 0.35, ease: 'power3.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.15');
  }, [onClose]));

  // ── ESC key closes overlay ────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      // Fixed full-viewport backdrop — above everything (z-[1000])
      className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-6 md:p-16"
      // Clicking the raw backdrop (not the panel) also closes
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* ── Close button ── */}
      <button
        onClick={handleClose}
        data-cursor="view"
        className="
          absolute top-6 right-6 md:top-10 md:right-12
          px-6 py-2.5
          font-primary font-bold text-[10px] tracking-[0.22em] uppercase
          text-white border border-white/20 bg-white/5 backdrop-blur-sm
          transition-all duration-250 hover:bg-white hover:text-black hover:border-white
          z-[1010] cursor-pointer
        "
        aria-label="Close overlay"
      >
        Close
      </button>

      {/* ── Main content panel ── */}
      <div
        ref={panelRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl w-full mx-auto items-center"
      >
        {/* Left: portrait image */}
        <div
          ref={imageRef}
          className="relative w-full aspect-[3/4] max-h-[65vh] bg-zinc-900 border border-white/5 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${project.image}')` }}
          />
        </div>

        {/* Right: editorial text */}
        <div ref={textRef} className="flex flex-col text-left">
          {/* Tag */}
          <span className="font-primary font-bold text-[10px] tracking-[0.25em] text-white/50 uppercase mb-3">
            {project.tag}
          </span>

          {/* Title — pr-[0.15em] prevents tracking-tight glyph clipping */}
          <h2 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase text-white mb-6 pr-[0.15em] leading-none">
            {project.title}
          </h2>

          {/* Description */}
          <p className="font-secondary text-white/65 text-sm md:text-base tracking-wide leading-relaxed mb-10 max-w-lg">
            {project.description}
          </p>

          {/* Meta grid — renders all key-value pairs from project.meta */}
          <dl className="grid grid-cols-3 gap-x-6 gap-y-4 pt-6 border-t border-white/10 max-w-lg">
            {Object.entries(project.meta).map(([key, value]) => (
              <div key={key}>
                <dt className="font-secondary text-[9px] tracking-widest text-white/40 uppercase mb-1">
                  {key}
                </dt>
                <dd className="font-primary font-bold text-xs uppercase text-white">
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
