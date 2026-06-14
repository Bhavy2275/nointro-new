'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from './projects';

interface BradyShowcaseProps {
  projects: Project[];
  onCardClick: (project: Project) => void;
  viewMode: 'grid' | 'list';
}

const OFFSETS = [
  { x: 0.1, y: -0.05, z: 0, rx: 0.02, ry: -0.04, rz: 0.03 },
  { x: -0.15, y: 0.08, z: -0.1, rx: -0.03, ry: 0.05, rz: -0.02 },
  { x: 0.05, y: 0.12, z: 0.1, rx: 0.04, ry: -0.02, rz: 0.01 },
  { x: -0.08, y: -0.1, z: -0.05, rx: -0.02, ry: 0.03, rz: -0.04 },
  { x: 0.12, y: 0.02, z: 0.05, rx: 0.01, ry: -0.03, rz: 0.02 },
];

function Card({
  project,
  index,
  total,
  scrollRef,
  onClick,
  onHoverChange,
}: {
  project: Project;
  index: number;
  total: number;
  scrollRef: React.MutableRefObject<number>;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  // Resilient texture loader with proper cleanup
  useEffect(() => {
    let active = true;
    let loadedTex: THREE.Texture | null = null;

    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (tex) => {
        if (!active) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedTex = tex;
        setTexture(tex);
        setLoadFailed(false);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load texture for "${project.title}":`, err);
        if (active) {
          setLoadFailed(true);
        }
      }
    );

    return () => {
      active = false;
      if (loadedTex) {
        loadedTex.dispose();
      }
    };
  }, [project.image, project.title]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    const scrollVal = scrollRef.current;

    // Circular wrapping rel position in range [-total/2, total/2)
    let rel = index - scrollVal;
    rel = ((rel + total / 2) % total);
    if (rel < 0) rel += total;
    rel -= total / 2;

    const dist = Math.abs(rel);
    const offset = OFFSETS[index % OFFSETS.length];

    // Responsive position coefficients
    const isMobile = state.viewport.width < 8;
    const spreadX = isMobile ? 1.1 : 1.7;
    const driftY = isMobile ? -0.2 : -0.32;

    const targetX = offset.x + rel * spreadX;
    const targetY = offset.y + rel * driftY + Math.sin(t * 0.8 + index * 1.3) * 0.04;
    const targetZ = offset.z - dist * 0.8;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

    const targetRX = offset.rx;
    const targetRY = offset.ry + rel * 0.05;
    const targetRZ = offset.rz;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRY, 0.08);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRZ, 0.08);

    // active focus scaling
    const activeScale = hovered ? 1.05 : 1.0;
    const targetScale = Math.max(0.72, 1 - dist * 0.12) * activeScale;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08));
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverChange(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHoverChange(false);
      }}
    >
      <planeGeometry args={[2.2, 3]} />
      {texture ? (
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      ) : (
        <meshBasicMaterial
          color="#141414"
          transparent
          opacity={0.85}
        />
      )}
    </mesh>
  );
}

function GridScene({
  projects,
  scrollRef,
  onCardClick,
  onHoverChange,
}: {
  projects: Project[];
  scrollRef: React.MutableRefObject<number>;
  onCardClick: (p: Project) => void;
  onHoverChange: (h: boolean) => void;
}) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <group position={[0, 0, 0]}>
        {projects.map((project, idx) => (
          <Card
            key={project.id}
            project={project}
            index={idx}
            total={projects.length}
            scrollRef={scrollRef}
            onClick={() => onCardClick(project)}
            onHoverChange={onHoverChange}
          />
        ))}
      </group>
    </>
  );
}

export default function BradyShowcase({ projects, onCardClick, viewMode }: BradyShowcaseProps) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  // Shared scroll values
  const scroll = useRef(0);
  const targetScroll = useRef(0);
  const lastActiveIndex = useRef(0);
  const isDraggingRef = useRef(false);

  // Drag interaction values
  const pointerDownRef = useRef<{ x: number; y: number; scrollVal: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Set up ScrollTrigger pinning
  useEffect(() => {
    if (!mounted || !containerRef.current || projects.length === 0) return;

    // Pinning the showcase section for smooth, scroll-driven rotation
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=2500',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        if (isDraggingRef.current) return;
        // Map 0 -> 1 progress to two full project listing loops
        targetScroll.current = self.progress * (projects.length * 2);
      },
    });

    scrollTriggerInstance.current = trigger;

    return () => {
      trigger.kill();
    };
  }, [mounted, projects.length]);

  // Reset scroll state on category change
  useEffect(() => {
    scroll.current = 0;
    targetScroll.current = 0;
    lastActiveIndex.current = 0;
    setActiveIndex(0);
    if (scrollTriggerInstance.current) {
      scrollTriggerInstance.current.scroll(scrollTriggerInstance.current.start);
    }
  }, [projects]);

  // Main lerping animation tick
  useEffect(() => {
    if (!mounted) return;
    let frameId: number;

    const tick = () => {
      const n = projects.length;
      if (n === 0) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      // Smooth lerp
      const diff = targetScroll.current - scroll.current;
      scroll.current += diff * 0.08;

      // Wrap scroll values seamlessly
      if (targetScroll.current >= n) {
        targetScroll.current -= n;
        scroll.current -= n;
      } else if (targetScroll.current < 0) {
        targetScroll.current += n;
        scroll.current += n;
      }

      // Update DOM list positions directly
      if (viewMode === 'list' && listContainerRef.current) {
        const items = listContainerRef.current.children;
        const totalItems = items.length;
        const gap = window.innerWidth < 768 ? 52 : 72;

        for (let i = 0; i < totalItems; i++) {
          const item = items[i] as HTMLElement;

          let rel = i - scroll.current;
          rel = ((rel + totalItems / 2) % totalItems);
          if (rel < 0) rel += totalItems;
          rel -= totalItems / 2;

          const dist = Math.abs(rel);
          const y = rel * gap;

          item.style.transform = `translate(-50%, calc(-50% + ${y}px))`;

          // Add visual focus states
          if (dist < 0.5) {
            item.classList.add('active');
            item.classList.remove('near', 'far');
          } else if (dist < 1.5) {
            item.classList.add('near');
            item.classList.remove('active', 'far');
          } else {
            item.classList.add('far');
            item.classList.remove('active', 'near');
          }
        }
      }

      // Update active index state on change
      const activeIdx = Math.round(scroll.current) % n;
      const normalizedIdx = activeIdx < 0 ? activeIdx + n : activeIdx;
      if (normalizedIdx !== lastActiveIndex.current) {
        lastActiveIndex.current = normalizedIdx;
        setActiveIndex(normalizedIdx);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [mounted, projects.length, viewMode]);

  // Pointer drag gestures to manually spin the carousel
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollVal: targetScroll.current,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;
    const deltaX = e.clientX - pointerDownRef.current.x;
    
    // Convert drag pixel displacement to scroll units
    const sensitivity = window.innerWidth < 768 ? 2.5 : 1.8;
    const scrollDelta = -(deltaX / window.innerWidth) * sensitivity;
    targetScroll.current = pointerDownRef.current.scrollVal + scrollDelta;

    // Sync window scrollbar to keep GSAP and layout matches
    const numProjects = projects.length;
    if (numProjects > 0 && scrollTriggerInstance.current) {
      const trigger = scrollTriggerInstance.current;
      const maxScroll = numProjects * 2;
      let normalized = targetScroll.current % maxScroll;
      if (normalized < 0) normalized += maxScroll;

      const progress = normalized / maxScroll;
      const targetY = trigger.start + progress * (trigger.end - trigger.start);

      isDraggingRef.current = true;
      window.scrollTo(0, targetY);
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 10);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerDownRef.current) {
      pointerDownRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="font-primary font-bold text-xs tracking-widest text-white/40 uppercase animate-pulse">
          Loading Showcase...
        </span>
      </div>
    );
  }

  // Double list to allow smooth, continuous infinite circular wrapping
  const doubledProjects = [...projects, ...projects];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden select-none"
    >
      {/* Stylesheet for list view typography focus and custom easing transitions */}
      <style>{`
        .list-item {
          position: absolute;
          left: 50%;
          top: 50%;
          font-family: var(--font-fraunces), serif;
          font-weight: 100;
          font-size: clamp(1.6rem, 5.5vw, 4.2rem);
          text-transform: uppercase;
          color: white;
          transition: letter-spacing 0.5s cubic-bezier(0.22, 0.61, 0.36, 1), 
                      opacity 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
                      font-size 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
          white-space: nowrap;
          cursor: none;
        }
        .list-item.active {
          opacity: 1;
          letter-spacing: 0.15em;
          font-weight: 200;
        }
        .list-item.near {
          opacity: 0.45;
          letter-spacing: 0.04em;
        }
        .list-item.far {
          opacity: 0.12;
          letter-spacing: 0em;
        }
      `}</style>

      {/* Grid View Container */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out z-10 ${
          viewMode === 'grid' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        data-cursor={isHoveringGrid ? 'view' : undefined}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
          {projects.length > 0 && (
            <GridScene
              projects={projects}
              scrollRef={scroll}
              onCardClick={onCardClick}
              onHoverChange={setIsHoveringGrid}
            />
          )}
        </Canvas>
      </div>

      {/* List View Container */}
      <div
        ref={listContainerRef}
        className={`absolute inset-0 transition-opacity duration-700 ease-out z-20 ${
          viewMode === 'list' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {doubledProjects.map((project, idx) => (
          <button
            key={`list-${project.id}-${idx}`}
            onClick={() => onCardClick(project)}
            className="list-item"
            data-cursor="view"
            tabIndex={viewMode === 'list' ? 0 : -1}
          >
            {project.title}
          </button>
        ))}
      </div>

      {/* Bottom overlay displaying project metadata for the currently active/centered project */}
      {projects.length > 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30 pointer-events-none text-center">
          <span className="font-primary font-bold text-[9px] tracking-[0.3em] uppercase text-white/50 animate-fade">
            {projects[activeIndex]?.tag}
          </span>
          <h3 className="font-primary font-black text-xs tracking-[0.2em] uppercase text-white">
            {projects[activeIndex]?.title}
          </h3>
        </div>
      )}
    </div>
  );
}
