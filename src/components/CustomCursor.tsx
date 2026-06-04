'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Cache GSAP quickTo setters dynamically to avoid capturing null on mount
  const quickToRef = useRef<{
    setDotX: (v: number) => void;
    setDotY: (v: number) => void;
    setFollowerX: (v: number) => void;
    setFollowerY: (v: number) => void;
  } | null>(null);

  useEffect(() => {
    // Only on fine-pointer desktop devices
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Use setTimeout to avoid synchronous setState inside useEffect
    const visibilityTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const initSetters = (dot: HTMLElement, follower: HTMLElement) => {
      if (quickToRef.current) return;
      quickToRef.current = {
        setDotX: gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power3.out' }),
        setDotY: gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power3.out' }),
        setFollowerX: gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' }),
        setFollowerY: gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' }),
      };

      // Center starting positions
      gsap.set(dot, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
      gsap.set(follower, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dot = dotRef.current;
      const follower = followerRef.current;
      if (!dot || !follower) return;

      initSetters(dot, follower);

      if (quickToRef.current) {
        quickToRef.current.setDotX(e.clientX);
        quickToRef.current.setDotY(e.clientY);
        quickToRef.current.setFollowerX(e.clientX);
        quickToRef.current.setFollowerY(e.clientY);
      }
    };

    const handleMouseEnter = () => {
      const dot = dotRef.current;
      const follower = followerRef.current;
      if (!dot || !follower) return;
      gsap.to([dot, follower], { opacity: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      const dot = dotRef.current;
      const follower = followerRef.current;
      if (!dot || !follower) return;
      gsap.to([dot, follower], { opacity: 0, duration: 0.2 });
    };

    // Global listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // WeakMap to store listeners for elements without polluting DOM elements with 'any' properties
    const listenerMap = new WeakMap<Element, { enter: () => void; leave: () => void }>();

    // Dynamic Hover states
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, select, input, textarea, [data-cursor]');
      
      interactives.forEach((el) => {
        // Prevent adding multiple listeners
        if (el.getAttribute('data-cursor-attached')) return;
        el.setAttribute('data-cursor-attached', 'true');

        const cursorType = el.getAttribute('data-cursor');

        const onEnter = () => {
          const dot = dotRef.current;
          const follower = followerRef.current;
          if (!dot || !follower) return;

          gsap.to(follower, {
            scale: 2.2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#ffffff',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
          });

          if (cursorType === 'view') {
            setCursorText('VIEW');
          }
        };

        const onLeave = () => {
          const dot = dotRef.current;
          const follower = followerRef.current;
          if (!dot || !follower) return;

          gsap.to(follower, {
            scale: 1,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: 0.2,
          });
          setCursorText('');
        };

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        
        // Save listeners for clean up
        listenerMap.set(el, { enter: onEnter, leave: onLeave });
      });
    };

    // Initial attach
    addHoverListeners();

    // Use MutationObserver to watch for dynamically added elements (like routes changing)
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(visibilityTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();

      // Clean up event listeners on elements
      const interactives = document.querySelectorAll('[data-cursor-attached]');
      interactives.forEach((el) => {
        const stored = listenerMap.get(el);
        if (stored) {
          el.removeEventListener('mouseenter', stored.enter);
          el.removeEventListener('mouseleave', stored.leave);
        }
        el.removeAttribute('data-cursor-attached');
      });

      // Clear setters cache
      quickToRef.current = null;
    };
  }, []);

  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      <div ref={dotRef} className="custom-cursor" style={{ opacity: 0 }} />
      <div ref={followerRef} className="custom-cursor-follower" style={{ opacity: 0 }}>
        {cursorText}
      </div>
    </div>
  );
}
