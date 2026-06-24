import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '22icqgouubbjklkh.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'customer-6amjhasmm5fjjw52.cloudflarestream.com',
      },
      {
        protocol: 'https',
        hostname: 'videodelivery.net',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws: wss: https://customer-6amjhasmm5fjjw52.cloudflarestream.com https://api.resend.com; img-src 'self' data: https://images.unsplash.com https://customer-6amjhasmm5fjjw52.cloudflarestream.com https://videodelivery.net; media-src 'self' blob: data: https://customer-6amjhasmm5fjjw52.cloudflarestream.com https://videodelivery.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://customer-6amjhasmm5fjjw52.cloudflarestream.com https://videodelivery.net; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
