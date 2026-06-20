'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';

export default function PrivacyPage() {
  useEffect(() => {
    gsap.fromTo('.privacy-reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 }
    );
  }, []);

  return (
    <section className="bg-black pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 w-full text-white select-none">
      <div className="max-w-[800px] mx-auto flex flex-col gap-12">
        {/* Title */}
        <div className="privacy-reveal flex flex-col gap-4 border-b border-white/10 pb-8">
          <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
            LEGAL INFORMATION
          </span>
          <h1 className="font-primary font-black text-4xl md:text-5xl tracking-tight uppercase leading-none">
            Privacy Policy
          </h1>
          <p className="font-secondary text-[10px] text-white/40 uppercase tracking-widest mt-1">
            Last Updated: June 20, 2026
          </p>
        </div>

        {/* Content */}
        <div className="privacy-reveal flex flex-col gap-8 font-secondary text-sm text-white/70 leading-relaxed">
          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              1. Information We Collect
            </h2>
            <p>
              We collect information directly from you when you submit a project overview through our contact form or reach out to us via email or WhatsApp. This information may include your name, email address, phone number, company name, and details regarding your brand campaign.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              2. How We Use Your Information
            </h2>
            <p>
              We use the collected information exclusively to communicate with you about your projects, provide service proposals, initiate WhatsApp creative briefs, and improve our website performance. We do not sell, rent, or lease your personal information to third parties.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              3. Data Retention and Safety
            </h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to safeguard your submissions. Your contact records are stored securely and are only retained for as long as necessary to complete our creative production work or satisfy legal requirements.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              4. Cookies and Analytical Tools
            </h2>
            <p>
              Our website uses basic, non-intrusive cookies and browser storage tokens to cache visual preloader states, maintain interactive WebGL and 3D canvas viewport ratios, and track basic anonymous user counts. You can configure your browser to reject cookies, though some interactive visual features may behave differently.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              5. Your Rights (GDPR)
            </h2>
            <p>
              If you reside in the European Union or are governed by the GDPR, you have the right to request access to, correction of, or complete erasure of the personal contact details you submitted through our contact form. To exercise these rights, please email us directly at hello@nointro.agency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
