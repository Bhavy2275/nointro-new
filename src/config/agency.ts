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

  // Fallback videos/images for showcase projects (especially large or local ones)
  projectsVideos: {
    project5: process.env.NEXT_PUBLIC_PROJECT_5_VIDEO || 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/Blangywood%20Aftermovie.mp4', // Safe CDN fallback for the gitignored local 1.6GB video
  }
};
