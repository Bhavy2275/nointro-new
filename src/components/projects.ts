// Typed project data for the Anti Gravity portfolio marquee section.
// The `gradient` field is a full CSS gradient string used as card background.
// The `meta` field is an open key-value record for editorial metadata (client, year, role, etc.).

import { AGENCY_CONFIG } from '../config/agency';

export interface Project {
  id: string;
  title: string;
  /** Short display tag shown above the title on hover (e.g. "Nike Commercial") */
  tag: string;
  description: string;
  /** Full CSS gradient string injected as `background` on the card */
  gradient: string;
  image: string;
  /** Optional local video file path or CDN URL */
  video?: string;
  /** Optional YouTube video URL for the Watch on YouTube CTA */
  youtubeUrl?: string;
  /** Arbitrary key-value editorial metadata (client, year, role, location …) */
  meta: Record<string, string>;
}

/**
 * Dynamically resolves the video URL.
 * If NEXT_PUBLIC_VIDEO_BASE_URL is set, it strips the local "/videos/" prefix,
 * URL-encodes the filename, and prefixes it with the CDN base.
 * Otherwise, it falls back to the local file path.
 */
const videoUrl = (localPath: string): string => {
  const base = process.env.NEXT_PUBLIC_VIDEO_BASE_URL;
  if (base) {
    const filename = localPath.replace(/^\/videos\//, '');
    const encodedFilename = encodeURIComponent(filename).replace(/%2F/g, '/');
    return `${base.replace(/\/$/, '')}/${encodedFilename}`;
  }
  return localPath;
};

export const projects: Project[] = [
  {
    id: '1',
    title: 'Slowed Visualizer',
    tag: 'Ambient Art',
    description: 'An atmospheric visualizer project designed to accompany low-tempo audio tracks with a focus on dreamlike color palettes and fluid movement.',
    gradient: 'linear-gradient(160deg, #1a1a2e 0%, #0a0a0a 100%)',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/2 Part Slowed visualizer.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    meta: { Client: 'LowKey Records', Year: '2025', Role: 'Post Production' },
  },
  {
    id: '2',
    title: 'Blangywood Aftermovie',
    tag: 'Festival Aftermovie',
    description: 'An energetic, fast-paced aftermovie capturing the raw emotions, festival lights, and vibrant crowd energy at Blangywood.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Blangywood Aftermovie.MP4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    meta: { Client: 'Blangywood Festival', Year: '2024', Role: 'Cinematography & Editing' },
  },
  {
    id: '3',
    title: 'C02681 Creative Clip',
    tag: 'Creative Clip',
    description: 'A raw, editorial camera test showcasing extreme resolution, natural lighting, and organic skin tones in a studio setting.',
    gradient: 'linear-gradient(160deg, #111111 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/C02681_04083960.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
    meta: { Client: 'NoIntro Studios', Year: '2026', Role: 'DP & Color Grading' },
  },
  {
    id: '4',
    title: 'LV Campaign',
    tag: 'Fashion Commercial',
    description: 'A luxury brand visual showcase focusing on high-fashion aesthetics, macro texture details, and fluid camera movement.',
    gradient: 'linear-gradient(160deg, #0d1117 0%, #161b22 100%)',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/LV 3.MP4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=uelHwf8o7_U',
    meta: { Client: 'LV Europe', Year: '2025', Role: 'Creative Direction' },
  },
  {
    id: '5',
    title: 'OP Music Video 2023',
    tag: 'Music Video',
    description: 'A high-concept, visually stunning music video campaign featuring cinematic color grading, dynamic transitions, and strobe pacing.',
    gradient: 'linear-gradient(160deg, #0a0a1a 0%, #12121a 100%)',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl(AGENCY_CONFIG.projectsVideos.project5),
    youtubeUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    meta: { Client: 'OP Artist', Year: '2023', Role: 'Direction & Editing' },
  },
  {
    id: '6',
    title: 'Timeline I',
    tag: 'Director Cut',
    description: 'A comprehensive montage showing the flow of time and rhythm in storytelling through juxtaposition of contrasting settings.',
    gradient: 'linear-gradient(160deg, #1a1510 0%, #0a0a0a 100%)',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Timeline l.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
  {
    id: '7',
    title: 'ELSEWEAR Official',
    tag: 'Brand Film',
    description: 'The official brand film for ELSEWEAR — a cinematic journey through identity, culture, and street-level fashion told through movement and light.',
    gradient: 'linear-gradient(160deg, #0e0e0e 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/ELSEWEAR OFFICIAL.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=ZSM3w1v-A_Y',
    meta: { Client: 'ELSEWEAR', Year: '2025', Role: 'Direction & Editing' },
  },
  {
    id: '8',
    title: 'Lenitanicole',
    tag: 'Lifestyle Film',
    description: 'A soft, editorial lifestyle film following the daily rhythms and personal aesthetic of Lenitanicole — intimate, warm, and unhurried.',
    gradient: 'linear-gradient(160deg, #1a1208 0%, #0d0d0d 100%)',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Lenitanicole.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    meta: { Client: 'Lenitanicole', Year: '2025', Role: 'Cinematography & Color' },
  },
  {
    id: '9',
    title: 'Miguel Fashion BTS',
    tag: 'Behind The Scenes',
    description: 'An immersive behind-the-scenes look at the Miguel fashion shoot — capturing the energy between takes, the creative process, and raw unscripted moments.',
    gradient: 'linear-gradient(160deg, #12100a 0%, #1c1a16 100%)',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Miguel Fashion BTS .mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=aJOTlE1K90k',
    meta: { Client: 'Miguel', Year: '2025', Role: 'BTS Direction' },
  },
  {
    id: '10',
    title: 'Official',
    tag: 'Cinematic Film',
    description: 'A sweeping cinematic production — bold visuals, deliberate pacing, and an uncompromising aesthetic that sets a new bar for NoIntro storytelling.',
    gradient: 'linear-gradient(160deg, #0a0a0a 0%, #141414 100%)',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/OFFICIAL.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=pSUydWEqKwE',
    meta: { Client: 'NoIntro Studios', Year: '2025', Role: 'Full Production' },
  },
  {
    id: '11',
    title: 'OPPO AV',
    tag: 'Tech Commercial',
    description: 'A sleek, product-driven commercial for OPPO — precision shot composition, clean lines, and a fast-cut rhythm built to highlight innovation in every frame.',
    gradient: 'linear-gradient(160deg, #0a0f1a 0%, #0d1220 100%)',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/OPPO AV.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
    meta: { Client: 'OPPO', Year: '2024', Role: 'DP & Post Production' },
  },
  {
    id: '12',
    title: 'Pullman',
    tag: 'Hotel Campaign',
    description: 'A luxury hotel campaign for Pullman — capturing the elegance of hospitality through architectural cinematography, warm palettes, and a refined atmosphere.',
    gradient: 'linear-gradient(160deg, #1a1508 0%, #12100a 100%)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Pullman.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=9DXEM9_eTpI',
    meta: { Client: 'Pullman Hotels', Year: '2024', Role: 'Creative Direction' },
  },
  {
    id: '13',
    title: 'Real Shit Final',
    tag: 'Documentary',
    description: 'An unfiltered, gritty documentary short — no scripts, no retakes. Just truth, texture, and the kind of raw energy that cameras rarely catch.',
    gradient: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1500099817043-86d46000d58f?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Real Shit Final.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=_GuOjXYl5ew',
    meta: { Client: 'Independent', Year: '2025', Role: 'Director & Editor' },
  },
  {
    id: '14',
    title: 'Rolex',
    tag: 'Luxury Commercial',
    description: `A prestige commercial crafted for Rolex — macro craftsmanship shots, sweeping wrist cinematics, and a timeless color grade that honors the brand's legacy.`,
    gradient: 'linear-gradient(160deg, #1a1500 0%, #0f0e00 100%)',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/Rolex.mp4'),
    youtubeUrl: 'https://www.youtube.com/watch?v=Aq2Jr5mMFZI',
    meta: { Client: 'Rolex', Year: '2025', Role: 'DP & Color Grading' },
  },
  {
    id: '15',
    title: 'Untitled Cut I',
    tag: 'Experimental',
    description: 'An experimental short form piece exploring rhythm, silence, and visual contrast — a personal study in pacing and mood without narrative constraint.',
    gradient: 'linear-gradient(160deg, #0a0a12 0%, #0f0f18 100%)',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/copy_62C9D9FC-6C61-400B-B759-F0A07563FBB0.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
  {
    id: '16',
    title: 'Untitled Cut II',
    tag: 'Experimental',
    description: 'A second chapter in the personal experimental series — longer form, more layered, with evolving texture and a contemplative visual language.',
    gradient: 'linear-gradient(160deg, #10100a 0%, #18180f 100%)',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/copy_E32481B9-937B-4204-AE04-1300D5F8C03B.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=0KSOMA3QBU0',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
  {
    id: '17',
    title: 'Untitled Cut III',
    tag: 'Experimental',
    description: 'The third installment of the experimental cut series — abstract, meditative, and built around instinct rather than structure.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image: 'https://images.unsplash.com/photo-1601224994398-c31e39d50b3f?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/copy_EC14B96A-27E7-40F5-8C82-034B47276044.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
  {
    id: '18',
    title: 'Untitled Cut IV',
    tag: 'Experimental',
    description: 'A bold, immersive experimental piece that leans into discomfort and beauty simultaneously — frames that refuse to be ignored.',
    gradient: 'linear-gradient(160deg, #0a120a 0%, #0f170f 100%)',
    image: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?q=80&w=1200&auto=format&fit=crop',
    video: videoUrl('/videos/fa0f4cfccca3454fb648d918b6df8b65.mov'),
    youtubeUrl: 'https://www.youtube.com/watch?v=wDchsz8nmbo',
    meta: { Client: 'Personal Work', Year: '2026', Role: 'Director' },
  },
];
