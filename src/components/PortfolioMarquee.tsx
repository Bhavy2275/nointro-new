'use client';

import React from 'react';
import type { Project } from './projects';

interface PortfolioMarqueeProps {
  projects: Project[];
  onCardClick: (project: Project) => void;
}

function MarqueeCard({
  project,
  onCardClick,
}: {
  project: Project;
  onCardClick: (p: Project) => void;
}) {
  return (
    <article
      // Set the background gradient using a CSS custom property to comply with constraints.
      style={{ 
        '--card-gradient': project.gradient,
        '--card-image': `url('${project.image}')`
      } as React.CSSProperties}
      className="relative flex-shrink-0 w-[180px] h-[240px] bg-[var(--card-gradient)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out group hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      onClick={() => onCardClick(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open project details for ${project.title}`}
      onKeyDown={(e) => {
        // Accessibility: allow Enter key to activate the overlay details
        if (e.key === 'Enter') {
          e.preventDefault();
          onCardClick(project);
        }
      }}
    >
      {/* Background image which blends with the gradient below, and scales slightly on hover */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 mix-blend-normal"
        style={{ backgroundImage: 'var(--card-image)' }}
        aria-hidden="true"
      />

      {/* Dark vignette bottom overlay that fades in on hover showing tag and title */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-primary font-bold text-[9px] tracking-[0.2em] text-white/70 uppercase mb-0.5">
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
  // Duplicate the array of projects to ensure a seamless looping visual structure when translating left or right.
  const row1 = [...projects, ...projects];
  const row2 = [...[...projects].reverse(), ...[...projects].reverse()];

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-[#0a0a0a] flex flex-col justify-center gap-[14px] select-none">
      {/* Embedded keyframes stylesheet */}
      <style>{`
        /* Only apply horizontal animation tracks if users have not requested reduced motion */
        @media (prefers-reduced-motion: no-preference) {
          .animate-marquee-left {
            animation: scrollLeft var(--marquee-duration, 40s) linear infinite;
          }
          .animate-marquee-right {
            animation: scrollRight var(--marquee-duration, 52s) linear infinite;
          }
        }

        /* Keyframes translating the container 0% to -50% for standard left direction */
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Keyframes translating the container -50% to 0% for right direction scrolling */
        @keyframes scrollRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* Pauses scroll loop only on the hovered marquee-track */
        .marquee-track:hover .animate-marquee-left,
        .marquee-track:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Row 1 scrolls LEFT (translateX 0 -> -50%) in 40s */}
      <div className="marquee-track w-full overflow-hidden">
        <div 
          className="animate-marquee-left flex gap-[14px] w-max px-[7px]"
          style={{ '--marquee-duration': '40s' } as React.CSSProperties}
        >
          {row1.map((project, idx) => (
            <MarqueeCard
              key={`row1-${project.id}-${idx}`}
              project={project}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>

      {/* Row 2 scrolls RIGHT (translateX -50% -> 0) in 52s */}
      <div className="marquee-track w-full overflow-hidden">
        <div 
          className="animate-marquee-right flex gap-[14px] w-max px-[7px]"
          style={{ '--marquee-duration': '52s' } as React.CSSProperties}
        >
          {row2.map((project, idx) => (
            <MarqueeCard
              key={`row2-${project.id}-${idx}`}
              project={project}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
