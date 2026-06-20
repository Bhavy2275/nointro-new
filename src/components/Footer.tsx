'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AGENCY_CONFIG } from '@/config/agency';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <footer className="bg-black border-t border-white/10 text-white py-16 px-8 md:px-16 w-full select-none">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="font-primary font-black text-3xl md:text-4xl tracking-[0.1em] text-white hover:opacity-80 transition-opacity"
          >
            # NOINTRO
          </Link>
          <p className="font-secondary text-xs leading-relaxed text-white/50 max-w-[250px]">
            A creative marketing and video production agency crafting cinematic brands and high-performance digital experiences.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-primary font-bold text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Quick Links
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Featured Work', href: '/work' },
              { label: 'Our Services', href: '/services' },
              { label: 'About Agency', href: '/about' },
              { label: 'Get in Touch', href: '/contact' }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-primary font-normal text-xs text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="font-primary font-bold text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Contact
          </h4>
          <div className="flex flex-col gap-3 font-secondary text-xs text-white/70 leading-relaxed">
            <span>Based in {AGENCY_CONFIG.contact.location}</span>
            <span>Available Worldwide</span>
            <a
              href={`mailto:${AGENCY_CONFIG.contact.email}`}
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              {AGENCY_CONFIG.contact.email}
            </a>
          </div>
        </div>

        {/* Column 4: Socials */}
        <div className="flex flex-col gap-4">
          <h4 className="font-primary font-bold text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Follow Us
          </h4>
          <div className="flex flex-col gap-3">
            {AGENCY_CONFIG.socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-primary font-normal text-xs text-white/70 hover:text-white transition-colors"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/35 font-secondary text-[10px] tracking-wider uppercase">
        <div>© 2026 NoIntro. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
