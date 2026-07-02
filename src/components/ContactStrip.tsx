'use client';

import React, { useState } from 'react';

const CONTACTS = [
  {
    id: 'email',
    label: 'Email',
    value: 'Deep.soni@nointroproductions.com',
    href: 'mailto:Deep.soni@nointroproductions.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+33 76 886 5169',
    href: 'tel:+33768865169',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.14a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@nointroproductions',
    href: 'https://www.instagram.com/nointroproductions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Deep Soni',
    href: 'https://www.linkedin.com/in/deep-soni-98ab15293?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function ContactStrip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* ── Contact panel — slides up above the strip ── */}
      <div
        className={`absolute bottom-full left-0 right-0 bg-[#0a0a0a] border-t border-white/10 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
          open ? 'max-h-[600px] md:max-h-[260px]' : 'max-h-0'
        }`}
      >
        <div
          className={`p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-300 delay-100 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {CONTACTS.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id === 'email' || c.id === 'phone' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 border border-white/5 hover:border-white/20 hover:bg-white/[0.03] rounded-sm transition-all duration-200 cursor-pointer text-inherit no-underline"
            >
              <span className="text-white/35">{c.icon}</span>
              <span className="font-secondary text-[9px] tracking-[0.25em] text-white/25 uppercase">
                {c.label}
              </span>
              <span className="font-primary font-semibold text-[11.5px] tracking-[0.04em] text-white/75 break-all">
                {c.value}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── The strip itself ── */}
      <div className="bg-[#0d0d0d] border-t border-white/10 px-6 md:px-16 h-14 flex items-center justify-between">
        {/* Left — brand name */}
        <span className="font-primary font-bold text-[10px] tracking-[0.28em] text-white/45 uppercase select-none">
          Nointro
        </span>

        {/* Right — contact button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`font-primary font-bold text-[9px] tracking-[0.28em] uppercase px-6 py-2 border transition-all duration-200 rounded-sm flex items-center gap-2 cursor-pointer ${
            open
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-white/75 border-white/25 hover:bg-white hover:text-black hover:border-white'
          }`}
        >
          Contact
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transform transition-transform duration-300 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
