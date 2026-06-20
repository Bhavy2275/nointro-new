'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { AGENCY_CONFIG } from '@/config/agency';

const FluidGlass = dynamic(
  () => import('@/components/FluidGlass'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950/20 animate-pulse">
        <span className="font-primary font-bold text-xs tracking-widest text-white/40 uppercase animate-pulse">
          Loading Visual Lab...
        </span>
      </div>
    )
  }
);

export default function ServicesPage() {

  const [expandedService, setExpandedService] = useState<string | null>('production');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = containerRef.current?.querySelectorAll('.services-reveal');
    if (cards) {
      cards.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="bg-black pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 w-full text-white select-none">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="services-reveal flex flex-col gap-4 border-b border-white/10 pb-8">
          <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
            OUR OFFERINGS
          </span>
          <h1 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase leading-none">
            What We Deliver
          </h1>
        </div>

        {/* Services Expander Accordion list */}
        <div className="flex flex-col border-t border-white/15">
          {AGENCY_CONFIG.services.map((service) => {
            const isOpen = expandedService === service.id;

            return (
              <div
                key={service.id}
                className="services-reveal border-b border-white/15 transition-all duration-300"
              >
                {/* Header Selector */}
                <button
                  onClick={() => setExpandedService(isOpen ? null : service.id)}
                  className="w-full flex items-center justify-between py-8 text-left hover:bg-white/5 px-4 transition-all"
                >
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="font-primary font-bold text-xs md:text-sm text-white/30 tracking-widest">
                      {service.num}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="font-primary font-black text-lg md:text-2xl uppercase tracking-wider">
                        {service.title}
                      </h2>
                      <span className="font-secondary text-xs text-white/50">
                        {service.subtitle}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isOpen ? <ChevronDown size={20} className="text-white" /> : <ChevronRight size={20} className="text-white/40" />}
                  </div>
                </button>

                {/* Body Expandable Details */}
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.25, 0.46, 0.45, 0.94)] overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 py-8 px-4 md:pl-24' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Description Column */}
                    <div className="col-span-2 flex flex-col gap-4">
                      <p className="font-secondary text-sm md:text-base text-white/70 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bullets List Column */}
                    <div className="flex flex-col gap-4 p-6 bg-white/5 border border-white/10">
                      <h4 className="font-primary font-bold text-[9px] tracking-[0.25em] text-white/40 uppercase border-b border-white/10 pb-2">
                        Key Pillars
                      </h4>
                      <ul className="flex flex-col gap-2 font-secondary text-[11px] text-white/70 uppercase">
                        {service.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2 items-center">
                            <span className="w-1 h-1 bg-white" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Interactive Fluid Glass Visual Lab */}
        <div className="services-reveal flex flex-col gap-8 border-t border-white/10 pt-16 mt-8">
          <div className="flex flex-col gap-4">
            <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
              VISUAL LAB
            </span>
            <h2 className="font-primary font-black text-2xl md:text-4xl tracking-wider uppercase">
              Interactive Fluid Glass
            </h2>
          </div>
          <div className="relative w-full h-[600px] border border-white/10 overflow-hidden bg-zinc-950/20">
            <FluidGlass 
              mode="lens"
              lensProps={{
                scale: 0.25,
                ior: 1.15,
                thickness: 5,
                chromaticAberration: 0.1,
                anisotropy: 0.01  
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
