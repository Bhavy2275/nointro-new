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
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/0f448e8a322f4468c78be9fdd71400fd/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '2',
    title: 'Urban Dreams',
    tag: 'Production',
    description: 'Immersive cinematic project 2.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/4eda17f5419d7436840cdaba01a9bb3f/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '3',
    title: 'Neon Nights',
    tag: 'Production',
    description: 'Immersive cinematic project 3.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/4ec71e95a4599ce1a81bbf8cddf4bb4c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '4',
    title: 'Digital Horizon',
    tag: 'Production',
    description: 'Immersive cinematic project 4.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/eafac79a7926ee280dc41aa3042bc79c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '5',
    title: 'Blangywood Aftermovie',
    tag: 'Production',
    description: 'Immersive cinematic project 5.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/8a880115df3625b89cb547dcd906562d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '6',
    title: 'Electric Pulse',
    tag: 'Production',
    description: 'Immersive cinematic project 6.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/a3f2d6d0bd4b759b34f16097bfaf28ae/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '7',
    title: 'Motion Study',
    tag: 'Production',
    description: 'Immersive cinematic project 7.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/7339a3300b913f0519fb51ef9c63114a/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '8',
    title: 'City Lights',
    tag: 'Production',
    description: 'Immersive cinematic project 8.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/06312e2fca5227a2d66f85910dbd0a5e/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '9',
    title: 'Velocity',
    tag: 'Production',
    description: 'Immersive cinematic project 9.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/9d73892ed8fd1e85d4d0e2ef88b5d481/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '10',
    title: 'Midnight Run',
    tag: 'Production',
    description: 'Immersive cinematic project 10.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/906870775d3a268a2439be2517660d2d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '11',
    title: 'Signal Lost',
    tag: 'Production',
    description: 'Immersive cinematic project 11.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/aee1d4dc6ea9848bd3e9d6143e085b0d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '12',
    title: 'Rewind',
    tag: 'Production',
    description: 'Immersive cinematic project 12.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/6faefb22578a9839b1fd3a91f59a8e40/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '13',
    title: 'Parallel',
    tag: 'Production',
    description: 'Immersive cinematic project 13.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/eea565d7662a5e2e0d5180ab43c70aee/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '14',
    title: 'Drift',
    tag: 'Production',
    description: 'Immersive cinematic project 14.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/3f8d5d3a0cf622544a8b68466aba68b7/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '15',
    title: 'Gravity',
    tag: 'Production',
    description: 'Immersive cinematic project 15.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/ac1302ea4830029fd219cb9a5fcbd47d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '16',
    title: 'Echo',
    tag: 'Production',
    description: 'Immersive cinematic project 16.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/3e50a42f7c267c11af6d66b45d98f523/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '17',
    title: 'Spectrum',
    tag: 'Production',
    description: 'Immersive cinematic project 17.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/1e506a18a62840da4eb615f9973b51ec/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '18',
    title: 'Phantom',
    tag: 'Production',
    description: 'Immersive cinematic project 18.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/79b7afbc39385335779bc00980b82901/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '19',
    title: 'Vortex',
    tag: 'Production',
    description: 'Immersive cinematic project 19.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/d0a24e99833cb7ed4f385f05daffd440/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '20',
    title: 'Apex',
    tag: 'Production',
    description: 'Immersive cinematic project 20.',
    video: 'https://customer-6amjhasmm5fjjw52.cloudflarestream.com/064bfcf1524dd40391153b7936643fca/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
];
