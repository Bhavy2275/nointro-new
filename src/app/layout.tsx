import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import Preloader from '@/components/Preloader';

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

export const metadata: Metadata = {
  title: 'NOINTRO | Creative Marketing Agency',
  description: 'Cinematic portfolio of NoIntro, a creative agency crafting bold visual designs, video productions, and digital strategy.',
  openGraph: {
    title: 'NOINTRO | Creative Marketing Agency',
    description: 'Cinematic portfolio of NoIntro, a creative agency crafting bold visual designs, video productions, and digital strategy.',
    type: 'website',
  },
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
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (args[0] && typeof args[0] === 'string') {
                    const msg = args[0];
                    if (
                      msg.includes('THREE.Clock') || 
                      msg.includes('preloaded') || 
                      msg.includes('DevTools') ||
                      msg.includes('React DevTools')
                    ) {
                      return;
                    }
                  }
                  originalWarn.apply(console, args);
                };
              })();
            `
          }}
        />
      </head>
      <body className="font-secondary bg-black text-white min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {/* Cinematic Preloader count-up overlay */}
        <Preloader />

        {/* Smooth scroll container */}
        <SmoothScroll>
          {/* Wipe Transition wrapper */}
          <PageTransition>
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
