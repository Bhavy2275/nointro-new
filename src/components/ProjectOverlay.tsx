'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from './projects';
import { useLenis } from '@/context/SmoothScrollContext';

import Hls from 'hls.js';

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  // Stop smooth scroll while open
  useEffect(() => {
    lenis?.stop();
    return () => { lenis?.start(); };
  }, [lenis]);

  // Auto-play video when overlay opens
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !project.video) return;

    let hls: Hls | null = null;

    if (project.video.includes('.m3u8')) {
      if (vid.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari/iOS)
        vid.src = project.video;
      } else if (Hls.isSupported()) {
        // hls.js support (Chrome/Firefox/etc.)
        const hlsInstance = new Hls({
          capLevelToPlayerSize: false,
        });
        hls = hlsInstance;
        hlsInstance.loadSource(project.video);
        hlsInstance.attachMedia(vid);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          // Force the highest quality level (1080p/720p)
          hlsInstance.currentLevel = hlsInstance.levels.length - 1;
        });
      }
    } else {
      // Normal video fallback (mp4/mov)
      vid.src = project.video;
    }

    vid.play().catch(() => {});

    return () => {
      vid.pause();
      if (hls) {
        hls.destroy();
      } else {
        vid.src = '';
        vid.load();
      }
    };
  }, [project.video]);

  // Zoom-in entrance animation
  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true, onReverseComplete: onClose })
      .fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      .fromTo(cardRef.current,
        { scale: 0.84, opacity: 0, y: 28 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.15'
      );
    tl.current.play();
  }, { scope: overlayRef });

  const handleClose = useCallback(() => {
    if (tl.current) {
      tl.current.reverse();
    } else {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
        onClick={handleClose}
      />

      {/* Card — wider to accommodate video */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.95)]"
        style={{ background: 'rgba(10,10,10,0.98)' }}
      >
        {/* ── Video player ───────────────────────────────────────── */}
        {project.video ? (
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              playsInline
              loop
              muted={false}
            />
          </div>
        ) : (
          /* No video — show a dark placeholder with title */
          <div className="w-full flex items-center justify-center bg-black/60" style={{ aspectRatio: '16/9' }}>
            <p className="font-primary font-black text-3xl uppercase text-white/15 tracking-widest">
              {project.title}
            </p>
          </div>
        )}

        {/* ── Info section ───────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">

          {/* Tag + title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-primary font-bold text-[9px] tracking-[0.3em] uppercase text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full w-fit">
                {project.tag}
              </span>
              <h2 className="font-primary font-black text-xl tracking-tight uppercase text-white leading-tight">
                {project.title}
              </h2>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/6 border border-white/10 text-white/50 hover:text-white hover:bg-white/12 transition-all duration-200"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/6" />

          {/* Description */}
          <p className="font-secondary text-white/55 text-sm leading-relaxed tracking-wide">
            {project.description}
          </p>

          {/* Metadata row */}
          <div className="flex gap-6 flex-wrap pt-1">
            {Object.entries(project.meta).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-0.5">
                <span className="font-secondary text-[9px] tracking-widest text-white/25 uppercase">{key}</span>
                <span className="font-primary font-bold text-[11px] uppercase text-white/75 tracking-wide">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
