'use client';

import React, { useState, useEffect, use } from 'react';
import { gsap } from 'gsap';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ContactPage(props: PageProps) {
  // Unwrap Next.js 15+ dynamic route/search parameters promises
  use(props.params);
  use(props.searchParams);

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Entrance animations
    gsap.fromTo('.contact-el',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1 }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="bg-black pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 w-full text-white select-none">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        
        {/* Left Column: Details & WhatsApp */}
        <div className="flex flex-col justify-between gap-12">
          
          <div className="flex flex-col gap-6">
            <span className="contact-el font-primary font-bold text-xs tracking-[0.25em] text-white/50 uppercase">
              GET IN TOUCH
            </span>
            <h1 className="contact-el font-primary font-black text-4xl md:text-6xl tracking-tight uppercase leading-none">
              Let&apos;s Create Something Bold.
            </h1>
            <p className="contact-el font-secondary text-sm md:text-base text-white/60 leading-relaxed max-w-[450px]">
              Ready to make some noise? Drop us a line using the form, or reach out directly via WhatsApp for urgent campaign launches.
            </p>
          </div>

          <div className="flex flex-col gap-6 contact-el">
            {/* Contact details */}
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-4 text-white/70">
                <Mail size={16} />
                <a href="mailto:hello@nointro.agency" className="font-secondary text-xs uppercase tracking-wider hover:text-white transition-colors">
                  hello@nointro.agency
                </a>
              </div>

              <div className="flex items-center gap-4 text-white/70">
                <Phone size={16} />
                <a href="tel:+33662606482" className="font-secondary text-xs uppercase tracking-wider hover:text-white transition-colors">
                  +33 6 62 60 64 82
                </a>
              </div>

              <div className="flex items-center gap-4 text-white/70">
                <MapPin size={16} />
                <span className="font-secondary text-xs uppercase tracking-wider">
                  Paris, France // Available Internationally
                </span>
              </div>

            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/33662606482"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              className="mt-6 flex items-center justify-center gap-3 bg-neutral-900 border border-white/20 hover:border-white px-8 py-4 font-primary font-bold text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300 uppercase w-full md:max-w-sm"
            >
              <MessageSquare size={16} />
              <span>Chat via WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-el flex flex-col justify-center bg-neutral-950 border border-white/10 p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
              <span className="font-primary font-black text-xl md:text-2xl uppercase tracking-widest text-white animate-pulse">
                Message Received
              </span>
              <p className="font-secondary text-xs text-white/50 max-w-[280px]">
                Thank you. We will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-primary font-bold text-[9px] tracking-[0.2em] uppercase text-white/40">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  placeholder="JOHN DOE"
                  className="bg-black border border-white/15 px-4 py-3 font-secondary text-xs uppercase tracking-wider text-white focus:outline-none focus:border-white placeholder-white/25 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-primary font-bold text-[9px] tracking-[0.2em] uppercase text-white/40">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                  placeholder="JOHN@EXAMPLE.COM"
                  className="bg-black border border-white/15 px-4 py-3 font-secondary text-xs uppercase tracking-wider text-white focus:outline-none focus:border-white placeholder-white/25 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-primary font-bold text-[9px] tracking-[0.2em] uppercase text-white/40">
                  Brief Project Overview
                </label>
                <textarea
                  id="message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="TELL US ABOUT YOUR PROJECT..."
                  className="bg-black border border-white/15 px-4 py-3 font-secondary text-xs uppercase tracking-wider text-white focus:outline-none focus:border-white placeholder-white/25 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                data-cursor="view"
                className="mt-4 bg-white text-black font-primary font-black text-xs tracking-[0.25em] py-4 hover:bg-transparent hover:text-white border border-white transition-all duration-300 uppercase"
              >
                Send Message
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
