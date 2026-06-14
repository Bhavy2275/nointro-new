'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'Video Production', href: '/services?id=production' },
      { label: 'Commercial & Ad', href: '/services?id=commercial' },
      { label: 'Lifestyle Photo & Video', href: '/services?id=lifestyle' },
      { label: 'Social Strategy', href: '/services?id=strategy' },
      { label: 'Aerial & Drone', href: '/services?id=drone' }
    ]
  },
  {
    label: 'Work',
    href: '/work',
    dropdown: [
      { label: 'Creative Clips', href: '/work?category=creative' },
      { label: 'Corporate & Brand', href: '/work?category=corporate' },
      { label: 'Lifestyle & Fashion', href: '/work?category=lifestyle' },
      { label: 'Events Showcase', href: '/work?category=events' }
    ]
  },
  { label: 'About', href: '/about' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const handleSmoothAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const lenis = (window as unknown as { lenisInstance?: { scrollTo: (target: HTMLElement) => void } }).lenisInstance;
        if (lenis) {
          lenis.scrollTo(targetElement);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[990] flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          isScrolled ? 'h-16 liquid-glass scrolled' : 'h-20 liquid-glass'
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-primary font-black text-xl md:text-2xl tracking-[0.2em] text-white hover:opacity-80 transition-opacity"
        >
          NOINTRO
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative py-2 group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                onClick={(e) => handleSmoothAnchor(e, link.href)}
                className={`font-primary font-semibold text-xs tracking-[0.15em] uppercase text-white hover:text-white transition-colors flex items-center gap-1 py-1`}
              >
                {link.label}
                {link.dropdown && <ChevronDown size={12} className="opacity-60" />}
              </Link>

              {/* Hover Underline effect */}
              <span 
                className={`absolute left-0 w-full h-[1px] bg-white transform origin-center transition-transform duration-300 scale-x-0 ${pathname === link.href ? 'scale-x-100' : 'group-hover:scale-x-100'}`} 
                style={{ bottom: '-4px' }}
              />

              {/* Dropdown Menu */}
              {link.dropdown && activeDropdown === link.label && (
                <div className="absolute top-full left-0 w-64 p-4 flex flex-col gap-3 shadow-2xl transition-all duration-300 dropdown-glass">
                  {link.dropdown.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className="group flex flex-col justify-start text-left hover:bg-white/5 p-2.5 transition-all"
                    >
                      <span className="font-primary font-bold text-[10px] tracking-[0.15em] text-white uppercase group-hover:text-white">
                        {subItem.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="px-6 py-2.5 font-primary font-bold text-[10px] tracking-[0.2em] uppercase text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-105 pointer-events-auto"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none z-[992]"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-black z-[980] flex flex-col justify-between p-8 pt-28"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col gap-2">
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('/#')) {
                        handleSmoothAnchor(e, link.href);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="font-primary font-black text-3xl tracking-[0.1em] uppercase text-white hover:opacity-70 transition-opacity"
                  >
                    {link.label}
                  </Link>

                  {link.dropdown && (
                    <div className="flex flex-col pl-4 border-l border-white/10 gap-2 mt-1">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-secondary font-medium text-xs tracking-wider text-white/60 hover:text-white uppercase"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center border border-white/20 bg-white/5 backdrop-blur-sm py-4 font-primary font-bold text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black hover:border-white transition-all uppercase"
              >
                Get in Touch
              </Link>

              <div className="flex justify-between items-center text-white/40 text-[10px] tracking-widest font-secondary uppercase">
                <span>instagram</span>
                <span>tiktok</span>
                <span>linkedin</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
