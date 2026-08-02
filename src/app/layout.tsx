import type { Metadata, Viewport } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import Preloader from '@/components/Preloader';
import ErrorBoundary from '@/components/ErrorBoundary';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.nointroproductions.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'NOINTRO Productions | Creative Marketing & Video Production Agency',
    template: '%s | NOINTRO Productions',
  },
  description:
    'NoIntro Productions is a premier creative marketing agency & video production studio based in Paris, France. We craft cinematic brand films, visual identities, high-impact commercials, and digital growth strategies for visionary brands worldwide.',
  keywords: [
    'Creative Marketing Agency',
    'Video Production Studio',
    'Cinematic Brand Films',
    'Commercial Production',
    'Visual Identity Design',
    'Digital Strategy',
    'Paris Creative Studio',
    'NoIntro Productions',
    'Motion Design & VFX',
  ],
  authors: [{ name: 'NoIntro Productions', url: baseUrl }],
  creator: 'NoIntro Productions',
  publisher: 'NoIntro Productions',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'NOINTRO Productions | Creative Marketing & Video Production Agency',
    description:
      'NoIntro Productions is a premier creative marketing agency & video production studio crafting bold visual identities, cinematic brand films, and high-impact digital campaigns.',
    url: baseUrl,
    siteName: 'NoIntro Productions',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/icon.png`,
        width: 1200,
        height: 630,
        alt: 'NoIntro Productions Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOINTRO Productions | Creative Marketing & Video Production Agency',
    description:
      'Cinematic portfolio of NoIntro Productions, a creative agency crafting bold visual designs, video productions, and digital strategy.',
    images: [`${baseUrl}/icon.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'NoIntro Productions',
      url: baseUrl,
      logo: `${baseUrl}/icon.png`,
      email: 'hello@nointro.agency',
      telephone: '+33 6 62 60 64 82',
      sameAs: [
        'https://instagram.com/nointro.agency',
        'https://tiktok.com/@nointro.agency',
        'https://linkedin.com/company/nointro-agency',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'NoIntro Productions',
      publisher: { '@id': `${baseUrl}/#organization` },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#localbusiness`,
      name: 'NoIntro Productions',
      image: `${baseUrl}/icon.png`,
      url: baseUrl,
      telephone: '+33 6 62 60 64 82',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        'addressLocality': 'Paris',
        'addressCountry': 'FR',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-secondary bg-black text-white min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Preloader />

        <ErrorBoundary>
          <SmoothScroll>
            <PageTransition>
              <main className="flex-grow flex flex-col">
                {children}
              </main>
            </PageTransition>
          </SmoothScroll>
        </ErrorBoundary>
      </body>
    </html>
  );
}