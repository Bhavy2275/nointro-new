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
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* ── Contact panel — slides up above the strip ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          maxHeight: open ? '260px' : '0px',
          transition: 'max-height 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem 2.5rem',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.3s ease 0.1s',
          }}
        >
          {CONTACTS.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target={c.id === 'email' || c.id === 'phone' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                textDecoration: 'none',
                color: 'inherit',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '2px',
                transition: 'border-color 0.2s, background 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>{c.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                }}
              >
                {c.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.75)',
                  wordBreak: 'break-all',
                }}
              >
                {c.value}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── The strip itself ── */}
      <div
        style={{
          background: '#0d0d0d',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — brand name */}
        <span
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          Nointro
        </span>

        {/* Right — contact button */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 700,
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            padding: '0.55rem 1.4rem',
            border: '1px solid rgba(255,255,255,0.25)',
            background: open ? '#ffffff' : 'transparent',
            color: open ? '#000000' : 'rgba(255,255,255,0.75)',
            cursor: 'pointer',
            transition: 'background 0.25s, color 0.25s, border-color 0.25s',
            borderRadius: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={(e) => {
            if (!open) {
              (e.currentTarget as HTMLElement).style.background = '#ffffff';
              (e.currentTarget as HTMLElement).style.color = '#000000';
              (e.currentTarget as HTMLElement).style.borderColor = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!open) {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
            }
          }}
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
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
