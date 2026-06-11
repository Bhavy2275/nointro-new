// Typed project data for the Anti Gravity portfolio marquee section.
// The `gradient` field is a full CSS gradient string used as card background.
// The `meta` field is an open key-value record for editorial metadata (client, year, role, etc.).

export interface Project {
  id: string;
  title: string;
  /** Short display tag shown above the title on hover (e.g. "Nike Commercial") */
  tag: string;
  description: string;
  /** Full CSS gradient string injected as `background` on the card */
  gradient: string;
  image: string;
  /** Arbitrary key-value editorial metadata (client, year, role, location …) */
  meta: Record<string, string>;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Echoes of Silence',
    tag: 'Cinematic Short',
    description:
      'An experimental short film exploring the visual boundaries of silence in dense urban environments. Shot entirely on anamorphic lenses during the twilight hours.',
    gradient: 'linear-gradient(160deg, #1a1a2e 0%, #0a0a0a 100%)',
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'NoIntro Studios', Year: '2026', Role: 'Direction & Cinematography' },
  },
  {
    id: '2',
    title: 'The Future of Speed',
    tag: 'Nike Commercial',
    description:
      'A fast-paced, high-energy commercial campaign celebrating the launch of Nike\'s latest running technology. Raw athleticism meets liquid lighting.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Nike France', Year: '2025', Role: 'Creative Direction' },
  },
  {
    id: '3',
    title: 'Urban Nomads',
    tag: 'Vogue Lifestyle',
    description:
      'A striking editorial campaign capturing the intersection of high fashion and street culture across European metropolises.',
    gradient: 'linear-gradient(160deg, #111111 0%, #1a1a1a 100%)',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Vogue Europe', Year: '2026', Role: 'Cinematography' },
  },
  {
    id: '4',
    title: 'Above the Ridge',
    tag: 'Dolomites Drone',
    description:
      'A breathtaking aerial perspective showcasing the rugged peaks and deep valleys of the Dolomites. Pure geological grandeur.',
    gradient: 'linear-gradient(160deg, #0d1117 0%, #161b22 100%)',
    image:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Alpine Tourism', Year: '2025', Role: 'Drone Cinematography' },
  },
  {
    id: '5',
    title: 'Neon Nights',
    tag: 'Tokyo Fashion',
    description:
      'A nocturnal exploration of Tokyo\'s iconic neon streets — vibrant nightlife and cyberpunk-inspired aesthetics, frame by frame.',
    gradient: 'linear-gradient(160deg, #0a0a1a 0%, #12121a 100%)',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Tokyo Tourism', Year: '2026', Role: 'Post Production' },
  },
  {
    id: '6',
    title: 'Pure Essence',
    tag: 'Luxury Commercial',
    description:
      'A sensory journey through high-end perfumery — raw materials, craftsmanship, and the invisible architecture of scent.',
    gradient: 'linear-gradient(160deg, #1a1510 0%, #0a0a0a 100%)',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Chanel Fragrance', Year: '2026', Role: 'Directing & Color Grading' },
  },
  {
    id: '7',
    title: 'Voltage',
    tag: 'Music Video',
    description:
      'High-voltage visual storytelling for a Berlin-based electronic act. Strobe cuts, industrial settings, and surreal compositing.',
    gradient: 'linear-gradient(160deg, #0a0010 0%, #100018 100%)',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Voltage Records', Year: '2025', Role: 'Director' },
  },
  {
    id: '8',
    title: 'Atlas',
    tag: 'Brand Identity Film',
    description:
      'A sweeping brand manifesto film for a global logistics company — tracing shipments across continents with cinematic drone footage.',
    gradient: 'linear-gradient(160deg, #0a1020 0%, #0a0a0a 100%)',
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    meta: { Client: 'Atlas Logistics', Year: '2026', Role: 'Director & DP' },
  },
];
