'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from './projects';
import ErrorBoundary from './ErrorBoundary';
import {
  CARD_OFFSETS,
  CARD_LOAD_RADIUS,
  CARD_PLAY_RADIUS,
  WHEEL_SENSITIVITY,
  IDLE_THRESHOLD_MS,
  AUTO_DRIFT_SPEED,
  DRAG_SENSITIVITY_DESKTOP,
  DRAG_SENSITIVITY_MOBILE,
  DRAG_THRESHOLD_PX,
  SCROLL_LERP_FACTOR,
  MESH_LERP_FACTOR,
  MESH_INSTANT_THRESHOLD,
  CARD_SPREAD_X_DESKTOP,
  CARD_SPREAD_X_MOBILE,
  CARD_DRIFT_Y_DESKTOP,
  CARD_DRIFT_Y_MOBILE,
  MOBILE_VIEWPORT_BREAKPOINT,
  LIST_GAP_DESKTOP_PX,
  LIST_GAP_MOBILE_PX,
  LIST_BREAKPOINT_PX,
  LIST_FOCUS_ACTIVE_THRESHOLD,
  LIST_FOCUS_NEAR_THRESHOLD,
  CARD_LONG_SIDE_LANDSCAPE,
  CARD_LONG_SIDE_PORTRAIT,
  CARD_SCALE_FALLOFF,
  CARD_SCALE_MIN,
  CARD_HOVER_SCALE,
} from '@/config/constants';

import { initHlsVideo } from '@/hooks/useHlsVideo';
import type Hls from 'hls.js';

interface BradyShowcaseProps {
  projects: Project[];
  onCardClick: (project: Project) => void;
  viewMode: 'grid' | 'list';
}

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
  const hlsRef = useRef<Hls | null>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [videoError, setVideoError] = useState(false);
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

    const animId = requestAnimationFrame(() => {
      setTexture(tex);
    });

    return () => {
      cancelAnimationFrame(animId);
      tex.dispose();
    };
  }, [project.tag, project.title]);


  // Lazy video loader — preload=none until the card is close to center.
  // This prevents all 18 video files being read from disk simultaneously on mount.
  const videoSrc = project.video;
  const videoLoadStarted = useRef(false);

  useEffect(() => {
    if (!videoSrc) return;

    let active = true;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';

    if (!videoSrc.includes('.m3u8')) {
      const separator = videoSrc.includes('?') ? '&' : '?';
      video.src = `${videoSrc}${separator}cv=1`;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }

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

    // Surface stream errors as a visible fallback texture instead of silent swallow
    const onError = () => {
      if (!active) return;
      setVideoError(true);
    };
    video.addEventListener('error', onError);

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
      video.removeEventListener('error', onError);
      try {
        video.pause();
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
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
  }, [videoSrc]);

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
    const shouldPlay = dist <= CARD_PLAY_RADIUS;
    const shouldLoad = dist <= CARD_LOAD_RADIUS;

    // Lazy-load: trigger disk read only when card is close to center view
    if (videoRef.current && shouldLoad && !videoLoadStarted.current) {
      videoLoadStarted.current = true;
      const video = videoRef.current;
      video.preload = 'auto';
      if (videoSrc) {
        hlsRef.current = initHlsVideo(video, videoSrc);
      }
    }

    // Play active video, pause others — errors are surfaced via the 'error' event listener
    if (videoRef.current && !videoError) {
      if (shouldPlay) {
        if (videoRef.current.paused) videoRef.current.play().catch((err: unknown) => {
          console.warn('[BradyShowcase] play() failed:', err);
          setVideoError(true);
        });
      } else {
        if (!videoRef.current.paused) videoRef.current.pause();
      }
    }

    const offset = CARD_OFFSETS[index % CARD_OFFSETS.length];

    // Responsive position coefficients
    const isMobile = state.viewport.width < MOBILE_VIEWPORT_BREAKPOINT;
    const spreadX = isMobile ? CARD_SPREAD_X_MOBILE : CARD_SPREAD_X_DESKTOP;
    const driftY  = isMobile ? CARD_DRIFT_Y_MOBILE  : CARD_DRIFT_Y_DESKTOP;

    const targetX = offset.x + rel * spreadX;
    const targetY = offset.y + rel * driftY + Math.sin(t * 0.8 + index * 1.3) * 0.04;
    const targetZ = offset.z - dist * 0.8;

    const targetRX = offset.rx;
    const targetRY = offset.ry + rel * 0.05;
    const targetRZ = offset.rz;

    // active focus scaling
    const activeScale = hovered ? CARD_HOVER_SCALE : 1.0;
    const targetScale = Math.max(CARD_SCALE_MIN, 1 - dist * CARD_SCALE_FALLOFF) * activeScale;

    // Skip lerp for distant cards — cheap instant set
    if (dist > MESH_INSTANT_THRESHOLD) {
      meshRef.current.position.set(targetX, targetY, targetZ);
      meshRef.current.rotation.set(targetRX, targetRY, targetRZ);
      meshRef.current.scale.setScalar(targetScale);
      return;
    }

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, MESH_LERP_FACTOR);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, MESH_LERP_FACTOR);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, MESH_LERP_FACTOR);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRX, MESH_LERP_FACTOR);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRY, MESH_LERP_FACTOR);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRZ, MESH_LERP_FACTOR);

    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, MESH_LERP_FACTOR));

    // Material texture swap logic (only runs when dist <= MESH_INSTANT_THRESHOLD)
    if (materialRef.current) {
      const isVideoReady = !videoError && videoRef.current && videoRef.current.readyState >= 2;
      const activeTexture = (shouldPlay && isVideoReady && videoTextureRef.current) ? videoTextureRef.current : texture;
      if (materialRef.current.map !== activeTexture) {
        materialRef.current.map = activeTexture;
        materialRef.current.needsUpdate = true;
      }
    }
  });

  // Normalize by the LONG side so portrait and landscape cards have similar visual weight:
  //   landscape (aspect ≥ 1): long side = width  → cardW = CARD_LONG_SIDE_LANDSCAPE, cardH = / aspect
  //   portrait  (aspect < 1): long side = height → cardH = CARD_LONG_SIDE_PORTRAIT,  cardW = * aspect
  const cardW = videoAspect >= 1 ? CARD_LONG_SIDE_LANDSCAPE : CARD_LONG_SIDE_PORTRAIT * videoAspect;
  const cardH = videoAspect >= 1 ? CARD_LONG_SIDE_LANDSCAPE / videoAspect : CARD_LONG_SIDE_PORTRAIT;

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
        targetScroll.current += e.deltaY * WHEEL_SENSITIVITY;
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
      const isIdle = (Date.now() - lastWheelTime.current > IDLE_THRESHOLD_MS) && !isDraggingRef.current && !isHoveringGrid;
      if (isIdle) {
        targetScroll.current += AUTO_DRIFT_SPEED;
      }

      // Smooth lerp
      const diff = targetScroll.current - scroll.current;
      scroll.current += diff * SCROLL_LERP_FACTOR;

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
        const gap = window.innerWidth < LIST_BREAKPOINT_PX ? LIST_GAP_MOBILE_PX : LIST_GAP_DESKTOP_PX;

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
          if (dist < LIST_FOCUS_ACTIVE_THRESHOLD) {
            item.classList.add('active');
            item.classList.remove('near', 'far');
          } else if (dist < LIST_FOCUS_NEAR_THRESHOLD) {
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

    // Only start drag if pointer moved more than DRAG_THRESHOLD_PX (avoids eating tap clicks)
    if (dist > DRAG_THRESHOLD_PX) {
      isDraggingRef.current = true;
      // Convert drag pixel displacement to scroll units
      const sensitivity = window.innerWidth < 768 ? DRAG_SENSITIVITY_MOBILE : DRAG_SENSITIVITY_DESKTOP;
      const scrollDelta = -(deltaX / window.innerWidth) * sensitivity;
      targetScroll.current = pointerDownRef.current.scrollVal + scrollDelta;
    }
  };

  const handlePointerUp = () => {
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
          font-family: var(--font-primary), sans-serif;
          font-weight: 300;
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
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
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

    </div>
  );
}
