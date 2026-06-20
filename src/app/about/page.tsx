'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '@/config/agency';

export default function AboutPage() {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = containerRef.current?.querySelectorAll('.about-reveal');
    if (sections) {
      sections.forEach((sec) => {
        gsap.fromTo(sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
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
      <div className="max-w-[1400px] mx-auto flex flex-col gap-24">
        
        {/* Section 1: Intro Title */}
        <div className="about-reveal flex flex-col gap-4 border-b border-white/10 pb-8">
          <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
            WHO WE ARE
          </span>
          <h1 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase leading-none">
            WE MAKE VISUALS THAT SHATTER CONVENTIONS.
          </h1>
        </div>

        {/* Section 2: Story split */}
        <div className="about-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="font-primary font-black text-xl md:text-2xl tracking-wide uppercase leading-normal">
            NoIntro is a full-service creative agency and video production house crafting raw, authentic, and high-impact visual stories.
          </div>
          <div className="flex flex-col gap-6 font-secondary text-sm text-white/60 leading-relaxed">
            <p>
              We believe in skipping the introductions. In a world saturated with digital noise, brands only have a split-second to capture attention. Our philosophy is rooted in creating immediate visual resonance. No fluff. No compromises. Just pure cinematic power.
            </p>
            <p>
              From global commercial campaigns to intimate independent documentaries, we collaborate with brands that dare to push boundaries. We specialize in end-to-end production: concept development, visual branding, cinematography, drone operations, and high-end post-production color grading.
            </p>
          </div>
        </div>

        {/* Section 3: Team Showcase */}
        <div className="about-reveal flex flex-col gap-12">
          <h2 className="font-primary font-black text-2xl md:text-3xl tracking-wider uppercase border-b border-white/10 pb-4">
            Core Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AGENCY_CONFIG.team.map((member) => (
              <div key={member.name} className="flex flex-col gap-4 group">
                <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900 border border-white/5">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${member.image}')` }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-primary font-black text-sm tracking-wider uppercase">
                    {member.name}
                  </span>
                  <span className="font-secondary text-xs text-white/50">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Technical Gear / Kit List */}
        <div className="about-reveal flex flex-col gap-12">
          <h2 className="font-primary font-black text-2xl md:text-3xl tracking-wider uppercase border-b border-white/10 pb-4">
            Production Arsenal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {AGENCY_CONFIG.gear.map((category) => (
              <div key={category.category} className="flex flex-col gap-4 p-6 bg-white/5 border border-white/10">
                <h3 className="font-primary font-black text-xs tracking-[0.2em] text-white uppercase border-b border-white/10 pb-2">
                  {category.category}
                </h3>
                <ul className="flex flex-col gap-2 font-secondary text-[11px] text-white/70 leading-relaxed uppercase">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-white/40">{"//"}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
