// Centralized Agency Configuration
// Allows dynamic overriding via environment variables with safe defaults.

export const AGENCY_CONFIG = {
  heroVideoUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL || 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/hero.mp4',
  
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@nointro.agency',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+33 6 62 60 64 82',
    phoneDial: process.env.NEXT_PUBLIC_CONTACT_PHONE_DIAL || '+33662606482',
    location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || 'Paris, France',
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/33662606482',
  },

  socials: [
    { platform: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/nointro.agency' },
    { platform: 'TikTok', url: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@nointro.agency' },
    { platform: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/nointro-agency' }
  ],

  stats: [
    { value: '+150M', label: 'views generated' },
    { value: '+100+', label: 'campaigns delivered' },
    { value: '+15', label: 'global awards' }
  ],

  team: [
    { 
      name: 'Alexandre Gambier', 
      role: 'Founder & Director', 
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      name: 'Sophie Laurent', 
      role: 'Head of Brand Strategy', 
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      name: 'Marc Dupuis', 
      role: 'Chief Cinematographer', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' 
    }
  ],

  gear: [
    { category: 'Camera Bodies', items: ['RED V-Raptor 8K VV', 'Sony FX6 Cinema Camera', 'Sony FX3 B-Cam'] },
    { category: 'Lenses', items: ['ARRI Signature Primes (18mm, 35mm, 50mm, 85mm)', 'Cooke S4/i Cine Lenses', 'Angenieux EZ Zooms'] },
    { category: 'Stabilization & Aerial', items: ['DJI Inspire 3 (X9-8K Air)', 'DJI Ronin 2 Gimbal', 'Freefly Systems MōVI Pro'] },
    { category: 'Post Production', items: ['DaVinci Resolve Studio Suite', 'Adobe Creative Cloud Suite', 'LTO Archive Systems'] }
  ],

  projectsVideos: {
    project5: process.env.NEXT_PUBLIC_PROJECT_5_VIDEO || '/videos/hero.mp4',
  },

  homepageCategories: ['all', 'cinematic', 'commercial', 'lifestyle', 'aerial'],

  workCategories: ['all', 'creative', 'corporate', 'lifestyle', 'events', 'aerial'],

  workItems: [
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
  ],

  services: [
    {
      id: 'production',
      num: '01',
      title: 'Cinematography & Art Direction',
      subtitle: 'Concepts & Visual Language',
      description: 'We develop custom conceptual scripts, artistic guides, and cinematic treatments that capture your brand DNA. We manage everything from narrative pacing and creative treatments to storyboarding and casting.',
      bullets: ['Creative Treatments', 'Scriptwriting & Storyboards', 'Art Direction', 'Production Design']
    },
    {
      id: 'commercial',
      num: '02',
      title: 'Commercial Film & Ads',
      subtitle: 'High-Performance Marketing Campaigns',
      description: 'Crafting premium, high-impact commercials designed to stop users in their tracks. We focus on commercial video optimized for social platforms, TV, and high-performance digital advertisement spaces.',
      bullets: ['Brand Commercials', 'Social Media Video Ads', 'Product Showcases', 'Content Frameworks']
    },
    {
      id: 'lifestyle',
      num: '03',
      title: 'Lifestyle Photo & Video',
      subtitle: 'Authentic Brand Narratives',
      description: 'Capturing dynamic, human-centric visual content. Our lifestyle capture specializes in fashion editorials, high-profile interviews, and lifestyle video production representing authentic stories.',
      bullets: ['Fashion Editorials', 'Brand Ambassadors', 'Corporate Portraits', 'Lifestyle Clips']
    },
    {
      id: 'drone',
      num: '04',
      title: 'Aerial & Drone Cinematography',
      subtitle: 'Unrestricted Perspectives',
      description: 'Licensed, high-resolution aerial cinematography. We use heavy-lift custom drones capable of carrying Hollywood-grade cameras to capture stunning aerial landscapes and dynamic action trackers.',
      bullets: ['Certified UAV Pilots', '8K Raw Aerial Video', 'Precision FPV Tracking', 'Topographical Surveys']
    },
    {
      id: 'strategy',
      num: '05',
      title: 'Digital & Social Strategy',
      subtitle: 'End-to-End Content Amplification',
      description: 'A great video only works if it reaches the right eyes. We configure platform-specific campaigns, content layouts, hooks, and data trackers to ensure your cinematic content translates to measurable sales.',
      bullets: ['Distribution Architecture', 'Audience Funnel Setup', 'Hook Optimization', 'Performance Analytics']
    }
  ]
};
