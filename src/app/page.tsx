'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

// Host your video externally (e.g. on Vercel Blob, Cloudinary, AWS S3) and paste the HTTPS URL below.
// Local '/videos/hero.mp4' will fall back to the poster image on the live Vercel site since it is gitignored.
const HERO_VIDEO_URL = 'https://9gza8xtd76zupxap.private.blob.vercel-storage.com/hero.mp4?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfOUd6QTh4dEQ3Nlp1UHhBcCIsIm93bmVySWQiOiJ0ZWFtX0Vhak1McXcxeU40ZENDUkRQRjNPWHFPZyIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgwNjUzOTQ3NzkyLCJpYXQiOjE3ODA2MTA3NDgyMzF9.k6yTitinbWwy3a5FDlpZHwlNXoyMd9bZCvBnWYN3mKc&vercel-blob-signature=Yfhg6yN7VJSGx0YbkrqSD2mSaGqEzaI7g1OqMsOiJxo';

// Mock Portfolio Items
const portfolioItems = [
  {
    id: 1,
    title: 'Echoes of Silence',
    subtitle: 'Cinematic Short Film',
    category: 'cinematic',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
  },
  {
    id: 2,
    title: 'The Future of Speed',
    subtitle: 'Nike Commercial Campaign',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 3,
    title: 'Urban Nomads',
    subtitle: 'Vogue Lifestyle Editorial',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Above the Ridge',
    subtitle: 'Dolomites Drone Showcase',
    category: 'aerial',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
  },
  {
    id: 5,
    title: 'Neon Nights',
    subtitle: 'Tokyo Fashion Week Promo',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
  },
  {
    id: 6,
    title: 'Pure Essence',
    subtitle: 'Luxury Perfume Commercial',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[4/3]',
  }
];

const categories = ['all', 'cinematic', 'commercial', 'lifestyle', 'aerial'];

interface PageProps {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function HomePage(props: PageProps) {
  // Unwrap the Next.js 15+ dynamic route/search parameters promises using React.use()
  use(props.params);
  use(props.searchParams);

  const [activeCategory, setActiveCategory] = useState('all');
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Filter items based on selected tab
  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

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

    // 3. Scroll Reveal for Work Section Grid Items
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.portfolio-card-wrap');
      cards.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }

    // 4. Marquee horizontal infinite scroll loop
    if (marqueeRef.current) {
      const marqueeInner = marqueeRef.current.querySelector('.marquee-inner');
      gsap.to(marqueeInner, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: 'linear',
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Re-run scroll animations for grid when activeCategory changes
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.portfolio-card-wrap');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 }
      );
    }
  }, [activeCategory]);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      const lenis = (window as unknown as { lenisInstance?: { scrollTo: (target: HTMLElement) => void } }).lenisInstance;
      if (lenis) {
        lenis.scrollTo(workSection);
      } else {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
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
            {/* Low-res poster image fallback */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200')` }}
            />
            {/* Background Loop Video - Self-hosted local video asset */}
            <video
              className="w-full h-full object-cover relative z-10"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={HERO_VIDEO_URL}
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

            {/* Description paragraph below the heading */}
            <div className="hero-desc-anim overflow-hidden max-w-[650px] text-center opacity-0">
              <p className="font-secondary text-white/80 text-xs md:text-sm tracking-wide leading-relaxed mb-8">
                we craft immersive visual identities with utmost care, empowering your brand to skip introductions and make noice everywhere.
              </p>
              <button
                onClick={scrollToWork}
                data-cursor="view"
                className="discover-work-btn"
              >
                Discover Work
              </button>
            </div>
          </div>

          {/* Stat 1: Top Right */}
          <div className="hero-stat-anim absolute right-[6%] top-[22%] flex flex-col items-end pointer-events-auto text-right font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative animate-pulse duration-[3000ms]">
              <div className="w-12 h-[1px] bg-white/20 absolute -left-14 top-4 -rotate-[30deg] origin-right" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">+150M</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">views generated</span>
            </div>
          </div>

          {/* Stat 2: Bottom Left */}
          <div className="hero-stat-anim absolute left-[6%] bottom-[7%] flex flex-col items-start pointer-events-auto text-left font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative">
              <div className="w-12 h-[1px] bg-white/20 absolute -right-14 top-4 rotate-[30deg] origin-left" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">+100+</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">campaigns delivered</span>
            </div>
          </div>

          {/* Stat 3: Bottom Right */}
          <div className="hero-stat-anim absolute right-[6%] bottom-[7%] flex flex-col items-end pointer-events-auto text-right font-primary z-40 hidden sm:flex opacity-0">
            <div className="relative">
              <div className="w-12 h-[1px] bg-white/20 absolute -left-14 top-4 -rotate-[30deg] origin-right" />
              <span className="block font-black text-xl md:text-2xl tracking-tight text-white">+15</span>
              <span className="block text-[8px] md:text-[9px] tracking-widest text-white/50 uppercase mt-0.5">global awards</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Arrow */}
        <button
          onClick={scrollToWork}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/60 hover:text-white transition-colors animate-bounce flex flex-col items-center gap-2"
        >
          <span className="font-primary font-bold text-[9px] tracking-[0.2em] uppercase">Scroll</span>
          <ArrowDown size={14} />
        </button>
      </section>

      {/* 2. Portfolio Grid Section */}
      <section id="work" className="bg-black py-24 px-6 md:px-12 w-full">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
          
          {/* Categories Tab Bar */}
          <div className="sticky top-16 md:top-20 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-primary font-black text-2xl md:text-3xl tracking-wider uppercase">
              Featured Work
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-primary font-bold text-[10px] tracking-[0.2em] uppercase transition-colors py-1 relative ${
                    activeCategory === cat ? 'text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Portfolio Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4"
          >
            {filteredItems.map((item, index) => {
              // Create asymmetric size classes dynamically
              const isLargeCard = index === 0 || index === 3;
              const gridClasses = isLargeCard 
                ? 'col-span-1 md:col-span-2' 
                : 'col-span-1';

              return (
                <div
                  key={item.id}
                  className={`portfolio-card-wrap flex flex-col gap-4 ${gridClasses}`}
                >
                  {/* Card Image Container */}
                  <Link
                    href={`/work`}
                    data-cursor="view"
                    className={`block relative overflow-hidden group w-full ${item.aspect} bg-neutral-900 border border-white/5`}
                  >
                    {/* Background Image with Scale Hover Effect */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    
                    {/* Dark Overlay Hover Effect */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Text reveal overlay for details */}
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                      <span className="font-primary font-bold text-[9px] tracking-[0.25em] text-white/60 uppercase mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-primary font-black text-lg md:text-xl tracking-wide uppercase">
                        {item.title}
                      </h3>
                    </div>
                  </Link>

                  {/* Out of Card Info (Always visible on mobile/default) */}
                  <div className="flex justify-between items-center px-1">
                    <div className="flex flex-col">
                      <h4 className="font-primary font-bold text-xs tracking-wider uppercase text-white">
                        {item.title}
                      </h4>
                      <span className="font-secondary text-[10px] text-white/50">
                        {item.subtitle}
                      </span>
                    </div>
                    <span className="font-primary font-bold text-[10px] tracking-widest text-white/40 uppercase">
                      / 2026
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Horizontal Scrolling Text / Marquee CTA */}
      <section className="bg-black py-28 border-t border-white/10 w-full overflow-hidden flex flex-col items-center">
        
        {/* Marquee Element */}
        <div ref={marqueeRef} className="w-full overflow-hidden select-none mb-12 py-4 bg-neutral-950 border-y border-white/5">
          <div className="marquee-inner flex whitespace-nowrap gap-12 text-[clamp(2.5rem,8vw,6.5rem)] font-primary font-black uppercase text-white/10 leading-none">
            <div className="flex items-center gap-12">
              <span>have a project? let&apos;s talk</span>
              <span className="text-stroke-gray">{"// NOINTRO //"}</span>
              <span>have a project? let&apos;s talk</span>
              <span className="text-stroke-gray">{"// NOINTRO //"}</span>
            </div>
            {/* Duplicate for seamless looping */}
            <div className="flex items-center gap-12" aria-hidden="true">
              <span>have a project? let&apos;s talk</span>
              <span className="text-stroke-gray">{"// NOINTRO //"}</span>
              <span>have a project? let&apos;s talk</span>
              <span className="text-stroke-gray">{"// NOINTRO //"}</span>
            </div>
          </div>
        </div>

        {/* Action Button & Contact Info */}
        <div className="flex flex-col items-center gap-8 text-center px-6">
          <Link
            href="/contact"
            data-cursor="view"
            className="border border-white px-10 py-4 font-primary font-bold text-xs tracking-[0.25em] text-white hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Get In Touch
          </Link>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-4 font-secondary text-xs text-white/60">
            <span>hello@nointro.agency</span>
            <span>Based in Paris, France</span>
          </div>
        </div>

      </section>
    </div>
  );
}
