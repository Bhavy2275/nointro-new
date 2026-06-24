// Centralized Agency Configuration
// Allows dynamic overriding via environment variables with safe defaults.

export const AGENCY_CONFIG = {
  heroVideoUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL || 'https://stream.nointroproductions.com/e4801572bf93baceff7d122c9be95434/downloads/default.mp4',

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

  projectsVideos: {
    project5: process.env.NEXT_PUBLIC_PROJECT_5_VIDEO || '/videos/hero.mp4',
  },

};
