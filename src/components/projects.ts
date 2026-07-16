// Typed project data for the Anti Gravity portfolio marquee section.
// The `meta` field is an open key-value record for editorial metadata (client, year, role, etc.).

export interface Project {
  id: string;
  title: string;
  /** Short display tag shown above the title on hover (e.g. "Nike Commercial") */
  tag: string;
  description: string;
  /** Optional local video file path or CDN URL for the full popup video */
  video?: string;
  /** Arbitrary key-value editorial metadata (client, year, role, location …) */
  meta: Record<string, string>;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Blangywood Festival',
    tag: 'Production',
    description: 'Immersive cinematic project 1.',
    video: '/stream/0f448e8a322f4468c78be9fdd71400fd/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '2',
    title: 'Urban Dreams',
    tag: 'Production',
    description: 'Immersive cinematic project 2.',
    video: '/stream/4eda17f5419d7436840cdaba01a9bb3f/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '3',
    title: 'Neon Nights',
    tag: 'Production',
    description: 'Immersive cinematic project 3.',
    video: '/stream/4ec71e95a4599ce1a81bbf8cddf4bb4c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '4',
    title: 'Digital Horizon',
    tag: 'Production',
    description: 'Immersive cinematic project 4.',
    video: '/stream/eafac79a7926ee280dc41aa3042bc79c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '5',
    title: 'Blangywood Aftermovie',
    tag: 'Production',
    description: 'Immersive cinematic project 5.',
    video: '/stream/8a880115df3625b89cb547dcd906562d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '6',
    title: 'Electric Pulse',
    tag: 'Production',
    description: 'Immersive cinematic project 6.',
    video: '/stream/a3f2d6d0bd4b759b34f16097bfaf28ae/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '9',
    title: 'Velocity',
    tag: 'Production',
    description: 'Immersive cinematic project 9.',
    video: '/stream/9d73892ed8fd1e85d4d0e2ef88b5d481/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '11',
    title: 'Signal Lost',
    tag: 'Production',
    description: 'Immersive cinematic project 11.',
    video: '/stream/aee1d4dc6ea9848bd3e9d6143e085b0d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '12',
    title: 'Rewind',
    tag: 'Production',
    description: 'Immersive cinematic project 12.',
    video: '/stream/6faefb22578a9839b1fd3a91f59a8e40/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '13',
    title: 'Parallel',
    tag: 'Production',
    description: 'Immersive cinematic project 13.',
    video: '/stream/eea565d7662a5e2e0d5180ab43c70aee/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '15',
    title: 'Gravity',
    tag: 'Production',
    description: 'Immersive cinematic project 15.',
    video: '/stream/ac1302ea4830029fd219cb9a5fcbd47d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '16',
    title: 'Echo',
    tag: 'Production',
    description: 'Immersive cinematic project 16.',
    video: '/stream/3e50a42f7c267c11af6d66b45d98f523/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '18',
    title: 'Phantom',
    tag: 'Production',
    description: 'Immersive cinematic project 18.',
    video: '/stream/79b7afbc39385335779bc00980b82901/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '19',
    title: 'Vortex',
    tag: 'Production',
    description: 'Immersive cinematic project 19.',
    video: '/stream/d0a24e99833cb7ed4f385f05daffd440/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
];
