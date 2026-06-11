'use client';

/**
 * PortfolioMarquee — Brady Perron-style dual-row infinite scrolling ticker.
 *
 * Architecture:
 * - Pure CSS @keyframes drives the scroll — no GSAP, no JS animation frame.
 *   This keeps the loop on the compositor thread, avoiding React re-render cost.
 * - Seamless loop: each row's DOM contains the cards array duplicated once.
 *   We animate translateX(0) → translateX(-50%) on Row 1. When the element
 *   has scrolled exactly half its own width, it's back to the visual start —
 *   creating a perfect infinite loop with zero visible jump.
 * - Row 2 is reversed: it starts at translateX(-50%) and ends at translateX(0).
 * - Hover pauses only the hovered row via `animation-play-state: paused` on the
 *   inner flex container, leaving the other row untouched.
 * - @media (prefers-reduced-motion) disables animation for accessibility users.
 */

import React from 'react';
import type { Project } from './projects';

interface PortfolioMarqueeProps {
  projects: Project[];
  onCardClick: (project: Project) => void;
}

/** A single portrait card rendered inside the marquee rows. */
function MarqueeCard({
  project,
  onCardClick,
}: {
  project: Project;
  onCardClick: (p: Project) => void;
}) {
  return (
    <article
      // Each card is a fixed-size portrait — same as bradyperron.com proportions
      className="marquee-card relative flex-shrink-0 w-[180px] h-[240px] overflow-hidden cursor-pointer group"
      style={{ background: project.gradient }}
      onClick={() => onCardClick(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open project: ${project.title}`}
      // Allow keyboard activation (Enter / Space)
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(project);
        }
      }}
    >
      {/* Background image — scales slightly on hover for depth */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url('${project.image}')` }}
        aria-hidden="true"
      />

      {/* Permanent dark vignette so the bottom text is always readable */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* Hover info panel — fades up from bottom */}
      <div
        className="
          absolute inset-x-0 bottom-0 p-4 flex flex-col gap-0.5
          translate-y-3 opacity-0
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-300 ease-out
          z-10
        "
      >
        <span className="font-primary font-bold text-[8px] tracking-[0.22em] text-white/60 uppercase">
          {project.tag}
        </span>
        <h3 className="font-primary font-black text-sm tracking-wide uppercase text-white leading-tight">
          {project.title}
        </h3>
      </div>
    </article>
  );
}

export default function PortfolioMarquee({ projects, onCardClick }: PortfolioMarqueeProps) {
  // Duplicate each row so the seamless translateX(-50%) trick works.
  // Row 2 is the reversed array for visual variety.
  const row1 = [...projects, ...projects];
  const row2 = [...[...projects].reverse(), ...[...projects].reverse()];

  return (
    <div className="relative w-full h-screen min-h-[600px] flex flex-col justify-center gap-6 overflow-hidden bg-[#0a0a0a] select-none">
      {/* ── Embedded keyframes + utility classes ── */}
      <style>{`
        /* Only animate when the user has no motion preference */
        @media (prefers-reduced-motion: no-preference) {
          .marquee-row-left {
            animation: marqueeLeft var(--marquee-duration, 35s) linear infinite;
          }
          .marquee-row-right {
            animation: marqueeRight var(--marquee-duration, 35s) linear infinite;
          }
        }

        /* Row 1: scroll left — 0% to -50% of the doubled-width container */
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Row 2: scroll right — start at -50% so it mirrors Row 1 direction */
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* Pause animation only on the wrapper that is hovered */
        .marquee-track:hover .marquee-row-left,
        .marquee-track:hover .marquee-row-right {
          animation-play-state: paused;
        }

        /* Slightly scale the card on hover for tactile feel */
        .marquee-card:hover {
          z-index: 10;
          transform: scale(1.04);
          transition: transform 0.35s ease;
        }
      `}</style>

      {/* ── Row 1: scrolls left ── */}
      <div
        className="marquee-track w-full overflow-hidden"
        // Custom property lets us tweak speed per row via inline style if needed
        style={{ '--marquee-duration': '38s' } as React.CSSProperties}
      >
        {/* Inner flex container is what the @keyframes transform targets */}
        <div className="marquee-row-left flex gap-4 w-max px-2">
          {row1.map((project, idx) => (
            <MarqueeCard
              key={`r1-${project.id}-${idx}`}
              project={project}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>

      {/* ── Row 2: scrolls right (reversed direction + reversed card order) ── */}
      <div
        className="marquee-track w-full overflow-hidden"
        style={{ '--marquee-duration': '42s' } as React.CSSProperties}
      >
        <div className="marquee-row-right flex gap-4 w-max px-2">
          {row2.map((project, idx) => (
            <MarqueeCard
              key={`r2-${project.id}-${idx}`}
              project={project}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
