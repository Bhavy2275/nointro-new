'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

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
      },
      undefined,
      (err) => {
        console.warn(`Failed to load texture for "${project.title}":`, err);
      }
    );

    return () => {
      active = false;
      if (loadedTex) {
        loadedTex.dispose();
      }
    };
  }, [project.image, project.title]);

  // Resilient video loader with proper cleanup
  useEffect(() => {
    if (!project.video) return;

    let active = true;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = project.video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata'; // Use 'metadata' to avoid loading the full video initially
    video.width = 1280;
    video.height = 720;
    video.setAttribute('decoding', 'async');
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    
    if (active) {
      setVideoTexture(tex);
    }

    return () => {
      active = false;
      video.pause();
      video.src = '';
      video.load();
      tex.dispose();
      videoRef.current = null;
    };
  }, [project.video]);

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
    const isCentered = dist < 0.5;

    // Only play video if card is centered
    if (videoRef.current) {
      if (isCentered) {
        if (videoRef.current.paused) {
          if (videoRef.current.preload !== 'auto') {
            videoRef.current.preload = 'auto';
          }
          videoRef.current.play().catch(() => {});
        }
      } else {
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    }

    // Dynamic texture swapping: show video texture only when centered, otherwise static image
    if (materialRef.current) {
      const activeTexture = (isCentered && videoTexture) ? videoTexture : texture;
      if (materialRef.current.map !== activeTexture) {
        materialRef.current.map = activeTexture;
        materialRef.current.needsUpdate = true;
      }
    }

    const offset = OFFSETS[index % OFFSETS.length];

    // Responsive position coefficients
    const isMobile = state.viewport.width < 8;
    const spreadX = isMobile ? 1.6 : 2.5;
    const driftY = isMobile ? -0.26 : -0.42;

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
    const activeScale = hovered ? 1.08 : 1.0;
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
      <planeGeometry args={[4.8, 2.7]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0.85}
        toneMapped={false}
      />
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

  // Shared scroll values
  const scroll = useRef(0);
  const targetScroll = useRef(0);
  const lastActiveIndex = useRef(0);
  const isDraggingRef = useRef(false);
  const lastWheelTime = useRef(0);

  // Drag interaction values
  const pointerDownRef = useRef<{ x: number; y: number; scrollVal: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Set up custom wheel listener for smooth scrolling and auto-drift
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      lastWheelTime.current = Date.now();

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // Only rotate the carousel if the Showcase is in viewport view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const wheelSensitivity = 0.0004;
        targetScroll.current += e.deltaY * wheelSensitivity;
      }
    };

    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [mounted]);

  // Reset scroll state on category change
  useEffect(() => {
    scroll.current = 0;
    targetScroll.current = 0;
    lastActiveIndex.current = 0;
    const timer = setTimeout(() => setActiveIndex(0), 0);
    return () => clearTimeout(timer);
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

      // Cinematic slow auto-drift when not actively scrolling/dragging/hovering
      const isIdle = (Date.now() - lastWheelTime.current > 1500) && !isDraggingRef.current && !isHoveringGrid;
      if (isIdle) {
        targetScroll.current += 0.0006;
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
  }, [mounted, projects.length, viewMode, isHoveringGrid]);

  // Pointer drag gestures to manually spin the carousel
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
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
    const sensitivity = window.innerWidth < 768 ? 1.5 : 1.0;
    const scrollDelta = -(deltaX / window.innerWidth) * sensitivity;
    targetScroll.current = pointerDownRef.current.scrollVal + scrollDelta;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerDownRef.current) {
      pointerDownRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
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
        style={{ touchAction: 'pan-y' }}
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
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setIsHoveringGrid(true)}
        onPointerOut={() => setIsHoveringGrid(false)}
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
