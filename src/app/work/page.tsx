'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';

// Expanded Portfolio Mock Data
const allWorkItems = [
  {
    id: 1,
    title: 'Echoes of Silence',
    subtitle: 'Cinematic Short Film',
    category: 'creative',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
    year: '2026'
  },
  {
    id: 2,
    title: 'The Future of Speed',
    subtitle: 'Nike Commercial Campaign',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[4/3]',
    year: '2026'
  },
  {
    id: 3,
    title: 'Urban Nomads',
    subtitle: 'Vogue Lifestyle Editorial',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[3/4]',
    year: '2025'
  },
  {
    id: 4,
    title: 'Above the Ridge',
    subtitle: 'Dolomites Drone Showcase',
    category: 'aerial',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
    year: '2026'
  },
  {
    id: 5,
    title: 'Neon Nights',
    subtitle: 'Tokyo Fashion Week Promo',
    category: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
    year: '2025'
  },
  {
    id: 6,
    title: 'Pure Essence',
    subtitle: 'Luxury Perfume Commercial',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[4/3]',
    year: '2026'
  },
  {
    id: 7,
    title: 'Midnight Chronicles',
    subtitle: 'Sci-Fi Film Concept',
    category: 'creative',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-video',
    year: '2025'
  },
  {
    id: 8,
    title: 'Decade of Sound',
    subtitle: 'Electronic Music Festival Aftermovie',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[4/3]',
    year: '2026'
  },
  {
    id: 9,
    title: 'Cloud Nine Peak',
    subtitle: 'Mountain Ridge Drone Run',
    category: 'aerial',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
    aspect: 'aspect-[3/4]',
    year: '2026'
  }
];

const categories = ['all', 'creative', 'corporate', 'lifestyle', 'events', 'aerial'];

function WorkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || 'all';
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredItems = categoryParam === 'all'
    ? allWorkItems
    : allWorkItems.filter(item => item.category === categoryParam);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      router.push('/work');
    } else {
      router.push(`/work?category=${category}`);
    }
  };

  useEffect(() => {
    // Reveal grid items smoothly
    const cards = gridRef.current?.querySelectorAll('.work-card-item');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 }
      );
    }
  }, [categoryParam]);

  return (
    <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
        <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
          NoIntro Portfolio
        </span>
        <h1 className="font-primary font-black text-4xl md:text-6xl tracking-tight uppercase leading-none">
          Selected Projects
        </h1>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`font-primary font-bold text-[11px] tracking-[0.2em] uppercase py-1 relative transition-colors ${
              categoryParam === cat ? 'text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {cat}
            {categoryParam === cat && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* Grid of Work */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="work-card-item flex flex-col gap-4"
          >
            <Link
              href="/work"
              data-cursor="view"
              className={`block relative overflow-hidden group w-full ${item.aspect} bg-neutral-900 border border-white/5`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                <span className="font-primary font-bold text-[8px] tracking-[0.25em] text-white/60 uppercase mb-1">
                  {item.category}
                </span>
                <h3 className="font-primary font-black text-md md:text-lg tracking-wide uppercase">
                  {item.title}
                </h3>
              </div>
            </Link>

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
                / {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkPage() {

  return (
    <section className="bg-black pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 w-full">
      <Suspense fallback={
        <div className="min-h-[500px] flex items-center justify-center text-white/40 font-primary font-bold text-xs tracking-widest uppercase">
          Loading Portfolio...
        </div>
      }>
        <WorkContent />
      </Suspense>
    </section>
  );
}
