'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from './projects';
import ErrorBoundary from './ErrorBoundary';

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
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  // Native video aspect ratio (width / height), defaults to 16/9 until video metadata loads
  const [videoAspect, setVideoAspect] = useState<number>(16 / 9);

  // Canvas text placeholder — dark card with project tag + title, no external image requests
  useEffect(() => {
    const W = 960, H = 540;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Dark gradient background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#111111');
    grad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle border
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Tag line
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.textAlign = 'center';
    ctx.fillText(project.tag.toUpperCase(), W / 2, H / 2 - 28);

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(project.title.toUpperCase(), W / 2, H / 2 + 28);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    return () => { tex.dispose(); };
  }, [project.tag, project.title]);


  // Lazy video loader — preload=none until the card is close to center.
  // This prevents all 18 video files being read from disk simultaneously on mount.
  const videoLoadStarted = useRef(false);

  useEffect(() => {
    if (!project.video) return;

    let active = true;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    const separator = project.video.includes('?') ? '&' : '?';
    video.src = `${project.video}${separator}cv=1`;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none'; // ← no disk I/O until card is near center
    video.setAttribute('decoding', 'async');
    videoRef.current = video;
    videoLoadStarted.current = false;

    // Detect native aspect ratio once metadata is available
    const onMeta = () => {
      if (!active) return;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoAspect(video.videoWidth / video.videoHeight);
      }
    };
    video.addEventListener('loadedmetadata', onMeta);

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    if (active) {
      videoTextureRef.current = tex;
    }

    return () => {
      active = false;
      video.removeEventListener('loadedmetadata', onMeta);
      try {
        video.pause();
        video.src = '';
        video.load();
      } catch (err) {
        console.warn('Video cleanup failed:', err);
      }
      if (tex) { try { tex.dispose(); } catch {} }
      videoTextureRef.current = null;
      videoRef.current = null;
      videoLoadStarted.current = false;
    };
  }, [project.video]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    const scrollVal = scrollRef.current;

    // Correct circular wrapping: always produce a value in [-total/2, total/2)
    // Using a two-step modulo that guarantees non-negative before centering
    const raw = index - scrollVal;
    const wrapped = ((raw % total) + total) % total; // always in [0, total)
    const rel = wrapped < total / 2 ? wrapped : wrapped - total; // re-center to [-total/2, total/2)

    const dist = Math.abs(rel);
    const shouldPlay = dist < 1.5;  // play center card + immediate left & right neighbors (3 videos concurrently)
    const shouldLoad = dist < 3;    // start buffering when 3 positions away

    // Lazy-load: trigger disk read only when card is close to center view
    if (videoRef.current && shouldLoad && !videoLoadStarted.current) {
      videoLoadStarted.current = true;
      videoRef.current.preload = 'auto';
      videoRef.current.load();
    }

    // Play active center + adjacent videos, pause others
    if (videoRef.current) {
      if (shouldPlay) {
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
      } else {
        if (!videoRef.current.paused) videoRef.current.pause();
      }
    }

    // Texture swap: video texture on playing cards, canvas text placeholder otherwise
    if (materialRef.current) {
      const activeTexture = (shouldPlay && videoTextureRef.current) ? videoTextureRef.current : texture;
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

    const lerpFactor = 0.12; // increased from 0.08 for snappier, less laggy motion
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, lerpFactor);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, lerpFactor);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, lerpFactor);

    const targetRX = offset.rx;
    const targetRY = offset.ry + rel * 0.05;
    const targetRZ = offset.rz;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRX, lerpFactor);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRY, lerpFactor);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRZ, lerpFactor);

    // active focus scaling
    const activeScale = hovered ? 1.08 : 1.0;
    const targetScale = Math.max(0.72, 1 - dist * 0.12) * activeScale;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, lerpFactor));
  });

  // Normalize by the LONG side so portrait and landscape cards have similar visual weight:
  //   landscape (aspect ≥ 1): long side = width  → cardW = 4.8,  cardH = 4.8 / aspect
  //   portrait  (aspect < 1): long side = height → cardH = 4.0,  cardW = 4.0 * aspect
  const cardW = videoAspect >= 1 ? 4.8 : 4.0 * videoAspect;
  const cardH = videoAspect >= 1 ? 4.8 / videoAspect : 4.0;

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
      <planeGeometry args={[cardW, cardH]} />
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

      // Smooth lerp — increased factor for snappier response
      const diff = targetScroll.current - scroll.current;
      scroll.current += diff * 0.12;

      // Wrap scroll values seamlessly
      while (targetScroll.current >= n) {
        targetScroll.current -= n;
        scroll.current -= n;
        if (pointerDownRef.current) {
          pointerDownRef.current.scrollVal -= n;
        }
      }
      while (targetScroll.current < 0) {
        targetScroll.current += n;
        scroll.current += n;
        if (pointerDownRef.current) {
          pointerDownRef.current.scrollVal += n;
        }
      }

      // Update DOM list positions directly
      if (viewMode === 'list' && listContainerRef.current) {
        const items = listContainerRef.current.children;
        const totalItems = n;
        const gap = window.innerWidth < 768 ? 52 : 72;

        for (let i = 0; i < totalItems; i++) {
          const item = items[i] as HTMLElement;
          if (!item) continue;

          // Correct circular wrapping (same fix as in useFrame)
          const rawRel = i - scroll.current;
          const wrappedRel = ((rawRel % totalItems) + totalItems) % totalItems;
          const rel = wrappedRel < totalItems / 2 ? wrappedRel : wrappedRel - totalItems;

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

      // Update active index — use double-modulo for correct fractional-scroll handling
      const activeIdx = ((Math.round(scroll.current) % n) + n) % n;
      if (activeIdx !== lastActiveIndex.current) {
        lastActiveIndex.current = activeIdx;
        setActiveIndex(activeIdx);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [mounted, projects.length, viewMode, isHoveringGrid]);

  // Pointer drag gestures to manually spin the carousel
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollVal: targetScroll.current,
    };
    // Don't capture pointer here — let Three.js mesh clicks through
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;
    const deltaX = e.clientX - pointerDownRef.current.x;
    const deltaY = e.clientY - pointerDownRef.current.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only start drag if pointer moved more than 6px (avoids eating tap clicks)
    if (dist > 6) {
      isDraggingRef.current = true;
      // Convert drag pixel displacement to scroll units
      const sensitivity = window.innerWidth < 768 ? 1.5 : 1.0;
      const scrollDelta = -(deltaX / window.innerWidth) * sensitivity;
      targetScroll.current = pointerDownRef.current.scrollVal + scrollDelta;
    }
  };

  const handlePointerUp = (_e: React.PointerEvent) => {
    pointerDownRef.current = null;
    // Small delay so isDragging stays true through the click event, then resets
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
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
        <ErrorBoundary>
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
        </ErrorBoundary>
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
        {projects.map((project, idx) => (
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
