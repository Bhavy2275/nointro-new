'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects as marqueeProjects } from '@/components/projects';
import dynamic from 'next/dynamic';
import { AGENCY_CONFIG } from '@/config/agency';
import ContactStrip from '@/components/ContactStrip';

const BradyShowcase = dynamic(
  () => import('@/components/BradyShowcase'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="font-primary font-bold text-xs tracking-widest text-white/40 uppercase animate-pulse">
          Loading Showcase...
        </span>
      </div>
    )
  }
);

import { useHlsVideo } from '@/hooks/useHlsVideo';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const { videoRef: heroVideoRef } = useHlsVideo(AGENCY_CONFIG.heroVideoUrl, {
    autoplay: true,
    muted: true,
    loop: true,
    playsInline: true,
  });

  useEffect(() => {
    // 1. Hero Tagline Animation (Clip Path / Word reveal on load)
    if (taglineRef.current) {
      const words = taglineRef.current.querySelectorAll('.word-inner');
      gsap.to(words, {
        y: '0%',
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15,
        delay: 2.2, // Let the preloader complete first
      });

      // Animate description and stats fade-in
      const desc = taglineRef.current.querySelector('.hero-desc-anim');
      const stats = taglineRef.current.querySelectorAll('.hero-stat-anim');
      
      gsap.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 2.8 }
      );
      
      gsap.fromTo(stats,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 2.5 }
      );
    }

    // 2. Parallax effect on Hero Video
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelector('.hero-bg-media'), {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full bg-black text-white flex flex-col">
      {/* 1. Full Screen Video Hero */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] w-full overflow-hidden select-none"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-bg-media w-full h-[130%] absolute -top-[15%] left-0">
            {/* Background Loop Video - Self-hosted local video asset */}
            <video
              ref={heroVideoRef}
              className="w-full h-full object-cover relative z-10"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          {/* Bottom Dark Gradient Overlay */}
          <div className="absolute inset-0 z-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }} />
        </div>

        {/* Hero Content - Centered Layout */}
        <div ref={taglineRef} className="absolute inset-0 z-30 w-full h-full flex flex-col justify-center items-center select-none">
          
          {/* Centered Content Block */}
          <div className="relative z-30 flex flex-col items-center max-w-[850px] w-full mx-auto px-6 text-center pt-20 pointer-events-auto">
            {/* Small Category Pre-header */}
            <div className="overflow-hidden mb-6">
              <span 
                className="inline-block font-primary font-bold uppercase"
                style={{
                  letterSpacing: '0.3em',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                NoIntro Creative Agency
              </span>
            </div>

            <h1 className="font-primary font-black text-[clamp(1.2rem,5.5vw,5.5rem)] leading-[1.05] tracking-tight text-white flex flex-nowrap whitespace-nowrap justify-center mb-8 pr-[0.15em]">
              {["Where", "passion", "meets", "precision"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-2 md:mr-4">
                  <span className="word-inner inline-block translate-y-[100%] pr-[0.1em]">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <div className="hero-desc-anim overflow-hidden max-w-[650px] text-center opacity-0">
              <p className="font-secondary text-white/80 text-xs md:text-sm tracking-wide leading-relaxed mb-8">
                we craft immersive visual identities with utmost care, empowering your brand to skip introductions and make noise everywhere.
              </p>
            </div>
          </div>

          {/* Stat 1: Top Right */}
          <div className="hero-stat-anim absolute right-[6%] top-[22%] flex flex-col items-end pointer-events-auto text-right font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative">
              <div className="w-12 h-[1px] bg-white/20 absolute -left-14 top-4 -rotate-[30deg] origin-right" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">{AGENCY_CONFIG.stats[0].value}</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">{AGENCY_CONFIG.stats[0].label}</span>
            </div>
          </div>

          {/* Stat 2: Bottom Left */}
          <div className="hero-stat-anim absolute left-[6%] bottom-[7%] flex flex-col items-start pointer-events-auto text-left font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative">
              <div className="w-12 h-[1px] bg-white/20 absolute -right-14 top-4 rotate-[30deg] origin-left" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">{AGENCY_CONFIG.stats[1].value}</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">{AGENCY_CONFIG.stats[1].label}</span>
            </div>
          </div>

          {/* Stat 3: Bottom Right */}
          <div className="hero-stat-anim absolute right-[6%] bottom-[7%] flex flex-col items-end pointer-events-auto text-right font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative">
              <div className="w-12 h-[1px] bg-white/20 absolute -left-14 top-4 -rotate-[30deg] origin-right" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">{AGENCY_CONFIG.stats[2].value}</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">{AGENCY_CONFIG.stats[2].label}</span>
            </div>
          </div>
        </div>

        {/* Blurry gradient transition overlay */}
        <div 
          className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-20" 
          style={{
            background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10, 10, 10, 0.8) 40%, rgba(10, 10, 10, 0) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
          }}
        />
      </section>

      {/* 2. Portfolio Marquee Section — full-viewport, edge-to-edge */}
      <section id="work" className="w-full bg-[#0a0a0a]">
        {/* Edge-to-edge Brady Perron 3D stack / list showcase */}
        <BradyShowcase
          projects={marqueeProjects}
          viewMode="grid"
        />
      </section>

      {/* Contact strip — full-width footer */}
      <ContactStrip />

    </div>
  );
}
