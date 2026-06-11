export interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  color: string;
  image: string;
  client: string;
  year: string;
  role: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Echoes of Silence',
    tag: 'Cinematic Short',
    description: 'An experimental short film exploring the visual boundaries of silence in dense urban environments. Shot entirely on anamorphic lenses during the twilight hours.',
    color: 'from-zinc-900 to-black',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    client: 'NoIntro Studios',
    year: '2026',
    role: 'Direction & Cinematography'
  },
  {
    id: '2',
    title: 'The Future of Speed',
    tag: 'Nike Commercial',
    description: 'A fast-paced, high-energy commercial campaign celebrating the launch of Nike\'s latest running technology. Focuses on raw athleticism and liquid lighting effects.',
    color: 'from-zinc-800 to-zinc-950',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    client: 'Nike France',
    year: '2025',
    role: 'Creative Direction'
  },
  {
    id: '3',
    title: 'Urban Nomads',
    tag: 'Vogue Lifestyle',
    description: 'A striking editorial campaign capturing the intersection of high fashion and street culture across European metropolises.',
    color: 'from-neutral-900 to-black',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    client: 'Vogue Europe',
    year: '2026',
    role: 'Cinematography'
  },
  {
    id: '4',
    title: 'Above the Ridge',
    tag: 'Dolomites Drone',
    description: 'A breathtaking aerial perspective showcasing the rugged peaks and deep valleys of the Dolomites. Emphasizes geological grandness and natural geometry.',
    color: 'from-stone-900 to-neutral-950',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    client: 'Alpine Tourism',
    year: '2025',
    role: 'Drone Cinematography'
  },
  {
    id: '5',
    title: 'Neon Nights',
    tag: 'Tokyo Fashion',
    description: 'A nocturnal exploration of Tokyo\'s iconic neon streets, capturing the vibrant nightlife and cyberpunk-inspired aesthetic of the city.',
    color: 'from-zinc-900 to-stone-950',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    client: 'Tokyo Tourism',
    year: '2026',
    role: 'Post Production'
  },
  {
    id: '6',
    title: 'Pure Essence',
    tag: 'Luxury Commercial',
    description: 'A sensory journey through the world of high-end perfumery, highlighting the raw materials and craftsmanship behind luxury fragrances.',
    color: 'from-neutral-950 to-zinc-900',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    client: 'Chanel Fragrance',
    year: '2026',
    role: 'Directing & Color Grading'
  }
];
