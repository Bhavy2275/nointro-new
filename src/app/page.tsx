'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectOverlay from '@/components/ProjectOverlay';
import { projects as marqueeProjects, Project } from '@/components/projects';
import dynamic from 'next/dynamic';
import { AGENCY_CONFIG } from '@/config/agency';

const Agentation = dynamic(
  () => import('agentation').then((mod) => mod.Agentation),
  { ssr: false }
);

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

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cinematic' | 'commercial' | 'lifestyle' | 'aerial'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  // Filter marquee projects based on selected tab
  const filteredMarqueeProjects = activeCategory === 'all'
    ? marqueeProjects
    : marqueeProjects.filter(project => {
        const tag = project.tag.toLowerCase();
        if (activeCategory === 'cinematic') return tag.includes('cinematic') || tag.includes('short') || tag.includes('art');
        if (activeCategory === 'commercial') return tag.includes('commercial') || tag.includes('brand') || tag.includes('tech');
        if (activeCategory === 'lifestyle') return tag.includes('lifestyle') || tag.includes('fashion') || tag.includes('scenes');
        if (activeCategory === 'aerial') return tag.includes('drone') || tag.includes('aerial');
        return false;
      });

  useEffect(() => {
    // Register ScrollTrigger plugin on client mount
    gsap.registerPlugin(ScrollTrigger);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setFormMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormState('success');
        setFormMessage('Your inquiry has been sent successfully. We will contact you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
    } catch (err: unknown) {
      setFormState('error');
      setFormMessage(err instanceof Error ? err.message : 'An error occurred while sending your inquiry.');
    }
  };

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
              ref={(el) => {
                if (el) {
                  el.muted = true;
                  el.play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover relative z-10"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={AGENCY_CONFIG.heroVideoUrl}
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
      <section id="work" className="w-full bg-[#0a0a0a] relative">
        {/* Edge-to-edge Brady Perron 3D stack / list showcase */}
        <BradyShowcase
          projects={filteredMarqueeProjects}
          onCardClick={(project) => setSelectedProject(project)}
          viewMode={viewMode}
        />

        {/* Floating Controls Dock */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl md:rounded-full shadow-2xl hover:border-white/20 transition-all duration-300">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {(['all', 'cinematic', 'commercial', 'lifestyle', 'aerial'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-primary font-bold text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden md:block w-px h-5 bg-white/10" />

          {/* View Mode Selectors */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                viewMode === 'grid' ? 'text-white bg-white/10' : 'text-white/35 hover:text-white'
              }`}
              aria-label="Grid View"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                viewMode === 'list' ? 'text-white bg-white/10' : 'text-white/35 hover:text-white'
              }`}
              aria-label="List View"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Contact Section */}
      <section id="contact" className="w-full bg-black py-24 md:py-32 px-6 border-t border-white/5 relative z-30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Left Column: Info Block */}
          <div className="flex flex-col justify-between gap-12">
            <div className="flex flex-col gap-6">
              <span className="font-primary font-bold text-[9px] tracking-[0.3em] uppercase text-white/40">
                Get In Touch
              </span>
              <h2 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase text-white leading-none">
                Skip<br />Introductions.
              </h2>
              <p className="font-secondary text-white/50 text-xs md:text-sm leading-relaxed tracking-wide max-w-md mt-2">
                We are always looking for bold brands, visionary artists, and innovative teams to collaborate on cinematic projects. Let's create something unforgettable.
              </p>
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-secondary text-[9px] tracking-widest text-white/20 uppercase">Email Us</span>
                <a href={`mailto:${AGENCY_CONFIG.contact.email}`} className="font-primary font-bold text-base md:text-lg text-white hover:text-white/60 transition-all duration-300">
                  {AGENCY_CONFIG.contact.email}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-secondary text-[9px] tracking-widest text-white/20 uppercase">Call or WhatsApp</span>
                <a href={AGENCY_CONFIG.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-primary font-bold text-base md:text-lg text-white hover:text-white/60 transition-all duration-300">
                  {AGENCY_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-secondary text-[9px] tracking-widest text-white/20 uppercase">Location</span>
                <span className="font-primary font-bold text-base md:text-lg text-white/80 uppercase">
                  {AGENCY_CONFIG.contact.location}
                </span>
              </div>
            </div>
            
            {/* Social Links & Copyright */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                {AGENCY_CONFIG.socials.map((soc) => (
                  <a
                    key={soc.platform}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-primary font-bold text-[9px] tracking-widest uppercase text-white/40 hover:text-white transition-all duration-300"
                  >
                    {soc.platform}
                  </a>
                ))}
              </div>
              <span className="font-secondary text-[9px] text-white/20">
                © {new Date().getFullYear()} NoIntro. All rights reserved.
              </span>
            </div>
          </div>

          {/* Right Column: Glassmorphic Contact Form */}
          <div className="bg-[#050505] border border-white/5 p-8 md:p-10 rounded-2xl relative shadow-2xl">
            <h3 className="font-primary font-black text-lg tracking-wider uppercase text-white mb-8">
              Send an Inquiry
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-secondary text-[9px] tracking-widest uppercase text-white/30">Your Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-black border border-white/10 px-4 py-3 rounded-lg font-secondary text-sm text-white placeholder-white/20 focus:border-white focus:outline-none transition-all duration-300"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-secondary text-[9px] tracking-widest uppercase text-white/30">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-black border border-white/10 px-4 py-3 rounded-lg font-secondary text-sm text-white placeholder-white/20 focus:border-white focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-secondary text-[9px] tracking-widest uppercase text-white/30">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project, timeline, and goals..."
                  className="bg-black border border-white/10 px-4 py-3 rounded-lg font-secondary text-sm text-white placeholder-white/20 focus:border-white focus:outline-none resize-none transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="discover-work-btn w-full mt-2 font-primary font-bold text-xs tracking-[0.2em] text-center uppercase border border-white bg-transparent text-white py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === 'idle' && 'Submit Inquiry'}
                {formState === 'submitting' && 'Sending...'}
                {formState === 'success' && 'Message Sent!'}
                {formState === 'error' && 'Failed to Send'}
              </button>

              {formMessage && (
                <p className={`font-secondary text-[10px] text-center mt-2 tracking-wide ${
                  formState === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formMessage}
                </p>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* Cinematic Detail Overlay */}
      {selectedProject && (
        <ProjectOverlay 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          aria-hidden={!selectedProject}
        />
      )}

      {/* Agentation visual annotation feedback toolbar */}
      <Agentation />
    </div>
  );
}
