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
  /** Optional local video file path */
  video?: string;
  /** Arbitrary key-value editorial metadata (client, year, role, location …) */
  meta: Record<string, string>;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Slowed Visualizer',
    tag: 'Ambient Art',
    description:
      'An atmospheric visualizer project designed to accompany low-tempo audio tracks with a focus on dreamlike color palettes and fluid movement.',
    gradient: 'linear-gradient(160deg, #1a1a2e 0%, #0a0a0a 100%)',
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    video: 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/2%20Part%20Slowed%20visualizer.mp4',
    meta: { Client: 'LowKey Records', Year: '2025', Role: 'Post Production' },
  },
  {
    id: '2',
    title: 'Blangywood Aftermovie',
    tag: 'Festival Aftermovie',
    description:
      'An energetic, fast-paced aftermovie capturing the raw emotions, festival lights, and vibrant crowd energy at Blangywood.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    video: 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/Blangywood%20Aftermovie.mp4',
    meta: { Client: 'Blangywood Festival', Year: '2024', Role: 'Cinematography & Editing' },
  },
  {
    id: '3',
    title: 'C02681 Creative Clip',
    tag: 'Creative Clip',
    description:
      'A raw, editorial camera test showcasing extreme resolution, natural lighting, and organic skin tones in a studio setting.',
    gradient: 'linear-gradient(160deg, #111111 0%, #1a1a1a 100%)',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    video: 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/C02681_04083960.mov',
    meta: { Client: 'NoIntro Studios', Year: '2026', Role: 'DP & Color Grading' },
  },
  {
    id: '4',
    title: 'LV Campaign',
    tag: 'Fashion Commercial',
    description:
      'A luxury brand visual showcase focusing on high-fashion aesthetics, macro texture details, and fluid camera movement.',
    gradient: 'linear-gradient(160deg, #0d1117 0%, #161b22 100%)',
    image:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    video: 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/LV%203.mp4',
    meta: { Client: 'LV Europe', Year: '2025', Role: 'Creative Direction' },
  },
  {
    id: '5',
    title: 'OP Music Video 2023',
    tag: 'Music Video',
    description:
      'A high-concept, visually stunning music video campaign featuring cinematic color grading, dynamic transitions, and strobe pacing.',
    gradient: 'linear-gradient(160deg, #0a0a1a 0%, #12121a 100%)',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    video: '/videos/OP MUSIC VIDEO 2023.mp4',
    meta: { Client: 'OP Artist', Year: '2023', Role: 'Direction & Editing' },
  },
  {
    id: '6',
    title: 'Timeline I',
    tag: 'Director Cut',
    description:
      'A comprehensive montage showing the flow of time and rhythm in storytelling through juxtaposition of contrasting settings.',
    gradient: 'linear-gradient(160deg, #1a1510 0%, #0a0a0a 100%)',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    video: 'https://22icqgouubbjklkh.public.blob.vercel-storage.com/Timeline%20l.mov',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
];
