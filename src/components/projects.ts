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
  /** Optional local video file path or CDN URL for the full popup video */
  video?: string;
  /** Optional low-resolution, silent loop video path for the 3D card preview */
  previewVideo?: string;
  /** Optional YouTube video URL for the Watch on YouTube CTA */
  youtubeUrl?: string;
  /** Arbitrary key-value editorial metadata (client, year, role, location …) */
  meta: Record<string, string>;
}

export const projects: Project[] = [
  {
    id: '1',
    title: '1',
    tag: 'Production',
    description: 'Immersive cinematic project 1.',
    gradient: 'linear-gradient(160deg, #1a1a2e 0%, #0a0a0a 100%)',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/0f448e8a322f4468c78be9fdd71400fd/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '2',
    title: '2',
    tag: 'Production',
    description: 'Immersive cinematic project 2.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/4eda17f5419d7436840cdaba01a9bb3f/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '3',
    title: '3',
    tag: 'Production',
    description: 'Immersive cinematic project 3.',
    gradient: 'linear-gradient(160deg, #111111 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/4ec71e95a4599ce1a81bbf8cddf4bb4c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '4',
    title: '4',
    tag: 'Production',
    description: 'Immersive cinematic project 4.',
    gradient: 'linear-gradient(160deg, #0d1117 0%, #161b22 100%)',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/eafac79a7926ee280dc41aa3042bc79c/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '5',
    title: '5',
    tag: 'Production',
    description: 'Immersive cinematic project 5.',
    gradient: 'linear-gradient(160deg, #0a0a1a 0%, #12121a 100%)',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/8a880115df3625b89cb547dcd906562d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '6',
    title: '6',
    tag: 'Production',
    description: 'Immersive cinematic project 6.',
    gradient: 'linear-gradient(160deg, #1a1510 0%, #0a0a0a 100%)',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/a3f2d6d0bd4b759b34f16097bfaf28ae/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '7',
    title: '7',
    tag: 'Production',
    description: 'Immersive cinematic project 7.',
    gradient: 'linear-gradient(160deg, #0e0e0e 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/7339a3300b913f0519fb51ef9c63114a/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '8',
    title: '8',
    tag: 'Production',
    description: 'Immersive cinematic project 8.',
    gradient: 'linear-gradient(160deg, #1a1208 0%, #0d0d0d 100%)',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/06312e2fca5227a2d66f85910dbd0a5e/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '9',
    title: '9',
    tag: 'Production',
    description: 'Immersive cinematic project 9.',
    gradient: 'linear-gradient(160deg, #12100a 0%, #1c1a16 100%)',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/9d73892ed8fd1e85d4d0e2ef88b5d481/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '10',
    title: '10',
    tag: 'Production',
    description: 'Immersive cinematic project 10.',
    gradient: 'linear-gradient(160deg, #0a0a0a 0%, #141414 100%)',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/906870775d3a268a2439be2517660d2d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '11',
    title: '11',
    tag: 'Production',
    description: 'Immersive cinematic project 11.',
    gradient: 'linear-gradient(160deg, #0a0f1a 0%, #0d1220 100%)',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/aee1d4dc6ea9848bd3e9d6143e085b0d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '12',
    title: '12',
    tag: 'Production',
    description: 'Immersive cinematic project 12.',
    gradient: 'linear-gradient(160deg, #1a1508 0%, #12100a 100%)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/6faefb22578a9839b1fd3a91f59a8e40/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '13',
    title: '13',
    tag: 'Production',
    description: 'Immersive cinematic project 13.',
    gradient: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 100%)',
    image: 'https://images.unsplash.com/photo-1500099817043-86d46000d58f?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/eea565d7662a5e2e0d5180ab43c70aee/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '14',
    title: '14',
    tag: 'Production',
    description: 'Immersive cinematic project 14.',
    gradient: 'linear-gradient(160deg, #1a1500 0%, #0f0e00 100%)',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/3f8d5d3a0cf622544a8b68466aba68b7/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '15',
    title: '15',
    tag: 'Production',
    description: 'Immersive cinematic project 15.',
    gradient: 'linear-gradient(160deg, #0a0a12 0%, #0f0f18 100%)',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/ac1302ea4830029fd219cb9a5fcbd47d/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '16',
    title: '16',
    tag: 'Production',
    description: 'Immersive cinematic project 16.',
    gradient: 'linear-gradient(160deg, #10100a 0%, #18180f 100%)',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/3e50a42f7c267c11af6d66b45d98f523/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '17',
    title: '17',
    tag: 'Production',
    description: 'Immersive cinematic project 17.',
    gradient: 'linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)',
    image: 'https://images.unsplash.com/photo-1601224994398-c31e39d50b3f?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/1e506a18a62840da4eb615f9973b51ec/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '18',
    title: '18',
    tag: 'Production',
    description: 'Immersive cinematic project 18.',
    gradient: 'linear-gradient(160deg, #0a120a 0%, #0f170f 100%)',
    image: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/79b7afbc39385335779bc00980b82901/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '19',
    title: '19',
    tag: 'Production',
    description: 'Immersive cinematic project 19.',
    gradient: 'linear-gradient(160deg, #1a0a0a 0%, #0d0505 100%)',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/d0a24e99833cb7ed4f385f05daffd440/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
  {
    id: '20',
    title: '20',
    tag: 'Production',
    description: 'Immersive cinematic project 20.',
    gradient: 'linear-gradient(160deg, #0a1a1a 0%, #050d0d 100%)',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
    video: 'https://stream.nointroproductions.com/064bfcf1524dd40391153b7936643fca/manifest/video.m3u8',
    meta: { Client: 'NoIntro', Year: '2026', Role: 'Production' },
  },
];
