'use client';

import React from 'react';
import { Project } from './projects';

interface PortfolioMarqueeProps {
  projects: Project[];
  onCardClick: (project: Project) => void;
}

export default function PortfolioMarquee({ projects, onCardClick }: PortfolioMarqueeProps) {
  // Split into row 1 and row 2 for visual variety
  const row1 = projects;
  const row2 = [...projects].reverse();

  // Double the arrays for seamless loop translation
  const doubledRow1 = [...row1, ...row1];
  const doubledRow2 = [...row2, ...row2];

  return (
    <div className="relative w-full py-16 bg-black overflow-hidden flex flex-col gap-8 select-none">
      {/* Self-contained CSS for marquee scroll */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: scrollRight 35s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Row 1: Left Ticker */}
      <div className="w-full overflow-hidden">
        <div className="animate-marquee-left gap-4 md:gap-6 px-2 md:px-3">
          {doubledRow1.map((project, index) => (
            <div
              key={`row1-${project.id}-${index}`}
              onClick={() => onCardClick(project)}
              data-cursor="view"
              className="relative w-[150px] sm:w-[180px] h-[200px] sm:h-[240px] bg-zinc-900 border border-white/5 cursor-pointer overflow-hidden group transition-transform duration-500 hover:scale-[1.03] pointer-events-auto"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              {/* Info Layer */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20">
                <span className="font-primary font-bold text-[8px] tracking-[0.2em] text-white/50 uppercase mb-0.5">
                  {project.tag}
                </span>
                <h3 className="font-primary font-black text-sm tracking-wider uppercase text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right Ticker */}
      <div className="w-full overflow-hidden">
        <div className="animate-marquee-right gap-4 md:gap-6 px-2 md:px-3">
          {doubledRow2.map((project, index) => (
            <div
              key={`row2-${project.id}-${index}`}
              onClick={() => onCardClick(project)}
              data-cursor="view"
              className="relative w-[150px] sm:w-[180px] h-[200px] sm:h-[240px] bg-zinc-900 border border-white/5 cursor-pointer overflow-hidden group transition-transform duration-500 hover:scale-[1.03] pointer-events-auto"
            >
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              {/* Info Layer */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20">
                <span className="font-primary font-bold text-[8px] tracking-[0.2em] text-white/50 uppercase mb-0.5">
                  {project.tag}
                </span>
                <h3 className="font-primary font-black text-sm tracking-wider uppercase text-white">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
