'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';

export default function TermsPage() {
  useEffect(() => {
    gsap.fromTo('.terms-reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 }
    );
  }, []);

  return (
    <section className="bg-black pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 w-full text-white select-none">
      <div className="max-w-[800px] mx-auto flex flex-col gap-12">
        {/* Title */}
        <div className="terms-reveal flex flex-col gap-4 border-b border-white/10 pb-8">
          <span className="font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
            LEGAL INFORMATION
          </span>
          <h1 className="font-primary font-black text-4xl md:text-5xl tracking-tight uppercase leading-none">
            Terms of Service
          </h1>
          <p className="font-secondary text-[10px] text-white/40 uppercase tracking-widest mt-1">
            Last Updated: June 20, 2026
          </p>
        </div>

        {/* Content */}
        <div className="terms-reveal flex flex-col gap-8 font-secondary text-sm text-white/70 leading-relaxed">
          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the services provided by NoIntro (&quot;Agency,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including our website at nointro.agency, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              2. Intellectual Property Rights
            </h2>
            <p>
              All content, visual assets, videos, code, custom materials, and designs displayed or produced on this website are the intellectual property of NoIntro or our respective clients. Unauthorized copying, downloading, distribution, or reproduction of any asset is strictly prohibited without explicit written consent.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              3. Scope of Production Services
            </h2>
            <p>
              NoIntro provides cinematic brand creation, video production, aerial photography, commercial campaign management, and digital marketing consulting. Specific service agreements, project budgets, and delivery timelines are subject to individual written production contracts and creative briefs.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              4. Disclaimer of Warranties
            </h2>
            <p>
              This website and its interactive components (including our 3D visual labs and animations) are provided on an &quot;as is&quot; basis. While we strive to maintain top-tier digital experiences, we do not guarantee uninterrupted access or full hardware compatibility across all legacy browsers or devices.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-primary font-black text-lg text-white uppercase tracking-wider">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of France, without giving effect to any principles of conflicts of law. Any legal proceedings arising out of these terms shall be subject to the exclusive jurisdiction of the courts of Paris, France.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
