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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
      <head />
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