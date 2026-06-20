import type { Metadata } from 'next';
import { Montserrat, Inter, Fraunces } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import PageTransition from '@/components/PageTransition';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '900'],
  variable: '--font-fraunces',
  display: 'swap',
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
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="font-secondary bg-black text-white min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {/* Cinematic Preloader count-up overlay */}
        <Preloader />
        
        {/* Custom dot + follower cursor */}
        <CustomCursor />
        
        {/* Smooth scroll container */}
        <SmoothScroll>
          {/* Wipe Transition wrapper */}
          <PageTransition>
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </PageTransition>
          
          {/* Footer Navigation */}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
