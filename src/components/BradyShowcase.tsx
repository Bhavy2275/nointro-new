'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CARD_EXPAND_LERP,
  CARD_OFFSCREEN_X,
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
import Hls from 'hls.js';
import Ferrofluid from './Ferrofluid';

interface BradyShowcaseProps {
  projects: Project[];
  viewMode: 'grid' | 'list';
}

// ── Expanded info overlay ─────────────────────────────────────────────────────

function ExpandedInfoOverlay({
  project,
  onCollapse,
}: {
  project: Project;
  onCollapse: () => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Intercept wheel & touch events at the container level so they never
  // reach Lenis's window listener. Lenis calls preventDefault() even when
  // stopped, which blocks native overflow scroll. stopPropagation here
  // prevents Lenis from ever seeing the event.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const stopProp = (e: Event) => e.stopPropagation();
    el.addEventListener('wheel', stopProp, { passive: true });
    el.addEventListener('touchstart', stopProp, { passive: true });
    el.addEventListener('touchmove', stopProp, { passive: true });
    return () => {
      el.removeEventListener('wheel', stopProp);
      el.removeEventListener('touchstart', stopProp);
      el.removeEventListener('touchmove', stopProp);
    };
  }, []);

  // Escape key to collapse
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCollapse(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCollapse]);

  return (
    <>
      {/* Scrollable info overlay */}
      <div
        ref={scrollContainerRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* ── First viewport — clicking here collapses, scrolling reveals info ── */}
        <div
          onClick={onCollapse}
          style={{
            height: '100dvh',
            position: 'relative',
            cursor: 'default',
          }}
        >


          {/* Scroll hint — bottom of first viewport */}
          <div
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
              }}
            >
              More Info
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'bounce-down 1.4s ease-in-out infinite' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* ── Info panel — slides up when user scrolls ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(8,8,8,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 6vw, 4rem) 5rem',
            minHeight: '50dvh',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Tag */}
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 700,
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '0.25rem 0.75rem',
              marginBottom: '1rem',
            }}
          >
            {project.tag}
          </span>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
            }}
          >
            {project.title}
          </h2>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
              letterSpacing: '0.02em',
              marginBottom: '2rem',
              maxWidth: '60ch',
            }}
          >
            {project.description}
          </p>

          {/* Metadata grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {Object.entries(project.meta).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase',
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.8)',
                    textTransform: 'uppercase',
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bounce keyframe */}
      <style>{`
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0);   opacity: 0.4; }
          50%       { transform: translateY(6px); opacity: 0.85; }
        }
      `}</style>
    </>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function Card({
  project,
  index,
  total,
  scrollRef,
  isExpanded,
  anyExpanded,
  onExpand,
  onCollapse,
  onHoverChange,
}: {
  project: Project;
  index: number;
  total: number;
  scrollRef: React.MutableRefObject<number>;
  isExpanded: boolean;
  anyExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
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
  const [videoAspect, setVideoAspect] = useState<number>(16 / 9);

  // Load logo as fallback alt texture for the card
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let active = true;
    let loadedTex: THREE.Texture | null = null;
    loader.load('/final_nointro.png', (tex) => {
      if (!active) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      loadedTex = tex;
      setTexture(tex);
    });
    return () => {
      active = false;
      if (loadedTex) {
        loadedTex.dispose();
      }
    };
  }, []);

  // Lazy video loader
  const videoSrc = project.video;
  const videoLoadStarted = useRef(false);
  // Trigger state to kick off HLS loading from a useEffect (not useFrame)
  const [hlsLoadTrigger, setHlsLoadTrigger] = useState(false);
  // Ref-based trigger so useFrame can request HLS init without calling setState
  const hlsLoadTriggerRef = useRef(false);
  // True once HLS manifest is parsed (or native src is set) — gates play() calls
  const hlsReadyRef = useRef(false);
  // In-flight play() promise — prevents overlapping play/pause AbortError storms
  const pendingPlayRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!videoSrc) return;
    let active = true;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true; video.loop = true; video.playsInline = true;
    video.preload = 'none'; video.setAttribute('decoding', 'async');
    videoRef.current = video;
    videoLoadStarted.current = false;
    hlsLoadTriggerRef.current = false;
    hlsReadyRef.current = false;
    pendingPlayRef.current = null;
    setVideoError(false);
    setHlsLoadTrigger(false);

    const onMeta = () => {
      if (!active) return;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoAspect(video.videoWidth / video.videoHeight);
      }
    };
    video.addEventListener('loadedmetadata', onMeta);

    // When the video stalls (e.g. buffer depleted after being paused a long time),
    // force HLS to resume loading so it recovers automatically.
    const onWaiting = () => {
      if (!active) return;
      if (hlsRef.current) {
        try { hlsRef.current.startLoad(); } catch {}
      }
    };
    video.addEventListener('waiting', onWaiting);

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
    if (active) { videoTextureRef.current = tex; }

    return () => {
      active = false;
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('waiting', onWaiting);
      try {
        video.pause();
        if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
        video.src = ''; video.load();
      } catch (err) { console.warn('Video cleanup failed:', err); }
      if (tex) { try { tex.dispose(); } catch {} }
      videoTextureRef.current = null; videoRef.current = null;
      videoLoadStarted.current = false;
    };
  }, [videoSrc]);

  // HLS initialisation effect — runs when hlsLoadTrigger flips to true
  useEffect(() => {
    if (!hlsLoadTrigger || !videoSrc || !videoRef.current) return;
    const video = videoRef.current;
    let active = true;

    const hls = initHlsVideo(video, videoSrc);
    hlsRef.current = hls;

    if (hls) {
      // Mark ready once manifest is parsed so useFrame can safely call play()
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (active) hlsReadyRef.current = true;
      });

      // Attach error recovery directly to the HLS instance
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!active) return;
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to restart the stream on network failure
              try { hls.startLoad(); } catch {}
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              try { hls.recoverMediaError(); } catch {}
              break;
            default:
              // Unrecoverable — show placeholder
              setVideoError(true);
          }
        }
        // Non-fatal errors: HLS.js retries internally, no action needed
      });
    } else {
      // Native HLS (Safari): src is set directly, mark ready on canplay
      const onCanPlay = () => { if (active) hlsReadyRef.current = true; };
      video.addEventListener('canplay', onCanPlay);
      return () => {
        active = false;
        video.removeEventListener('canplay', onCanPlay);
      };
    }

    return () => {
      active = false;
      // HLS instance cleanup is handled by the videoSrc effect above
    };
  }, [hlsLoadTrigger, videoSrc]);

  const cardW = videoAspect >= 1 ? CARD_LONG_SIDE_LANDSCAPE : CARD_LONG_SIDE_PORTRAIT * videoAspect;
  const cardH = videoAspect >= 1 ? CARD_LONG_SIDE_LANDSCAPE / videoAspect : CARD_LONG_SIDE_PORTRAIT;

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = state.clock.getElapsedTime();
    const scrollVal = scrollRef.current;
    const raw = index - scrollVal;
    const wrapped = ((raw % total) + total) % total;
    const rel = wrapped < total / 2 ? wrapped : wrapped - total;
    const dist = Math.abs(rel);

    // ── EXPANDED: this card grows to fill the screen ────────────────────────
    if (isExpanded) {
      const vpW = state.viewport.width;
      const vpH = state.viewport.height;
      const fillScale = Math.min(vpW / cardW, vpH / cardH);

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, CARD_EXPAND_LERP);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, CARD_EXPAND_LERP);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0.5, CARD_EXPAND_LERP);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, CARD_EXPAND_LERP);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, CARD_EXPAND_LERP);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, CARD_EXPAND_LERP);
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, fillScale, CARD_EXPAND_LERP);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, fillScale, CARD_EXPAND_LERP);
      meshRef.current.scale.z = 1;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1, CARD_EXPAND_LERP);

      // Ensure video is loaded + playing
      if (videoRef.current) {
        if (!videoLoadStarted.current && videoSrc) {
          videoLoadStarted.current = true;
          videoRef.current.preload = 'auto';
          if (!hlsLoadTriggerRef.current) {
            hlsLoadTriggerRef.current = true;
            setHlsLoadTrigger(true);
          }
        }
        // Only play once HLS has parsed its manifest (src is actually attached)
        if (hlsReadyRef.current && videoRef.current.paused && !pendingPlayRef.current) {
          pendingPlayRef.current = videoRef.current.play()
            .catch(() => {})
            .finally(() => { pendingPlayRef.current = null; });
        }
      }

      const isVideoReady = videoRef.current && videoRef.current.readyState >= 2;
      const activeTexture = (isVideoReady && videoTextureRef.current) ? videoTextureRef.current : texture;
      if (materialRef.current.map !== activeTexture) {
        materialRef.current.map = activeTexture;
        materialRef.current.needsUpdate = true;
      }
      materialRef.current.color.set(activeTexture ? '#ffffff' : '#141414');
      return;
    }

    // ── HIDDEN: another card is expanded — slide off and fade out ───────────
    if (anyExpanded) {
      const offX = rel >= 0 ? CARD_OFFSCREEN_X : -CARD_OFFSCREEN_X;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, offX, CARD_EXPAND_LERP);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, CARD_EXPAND_LERP);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, CARD_EXPAND_LERP);
      // Pause safely — wait for any in-flight play() before pausing
      if (videoRef.current && !videoRef.current.paused) {
        if (pendingPlayRef.current) {
          pendingPlayRef.current.then(() => videoRef.current?.pause()).catch(() => {});
          pendingPlayRef.current = null;
        } else {
          videoRef.current.pause();
        }
      }
      return;
    }

    // ── NORMAL: standard carousel behaviour ─────────────────────────────────
    // Restore opacity as card collapses back
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 1.0, MESH_LERP_FACTOR);

    const shouldPlay = dist <= CARD_PLAY_RADIUS;
    const shouldLoad = dist <= CARD_LOAD_RADIUS;

    if (videoRef.current && shouldLoad && !videoLoadStarted.current) {
      videoLoadStarted.current = true;
      videoRef.current.preload = 'auto';
      if (videoSrc && !hlsLoadTriggerRef.current) {
        hlsLoadTriggerRef.current = true;
        setHlsLoadTrigger(true);
      }
    }

    if (videoRef.current && videoLoadStarted.current) {
      if (shouldPlay) {
        // Only attempt play() when HLS is ready and no play is already in-flight
        if (hlsReadyRef.current && videoRef.current.paused && !pendingPlayRef.current) {
          pendingPlayRef.current = videoRef.current.play()
            .catch(() => {})
            .finally(() => { pendingPlayRef.current = null; });
        }
      } else {
        // Cancel any in-flight play before pausing
        if (pendingPlayRef.current) {
          pendingPlayRef.current.then(() => videoRef.current?.pause()).catch(() => {});
          pendingPlayRef.current = null;
        } else if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    }

    const offset = CARD_OFFSETS[index % CARD_OFFSETS.length];
    const isMobile = state.viewport.width < MOBILE_VIEWPORT_BREAKPOINT;
    const spreadX = isMobile ? CARD_SPREAD_X_MOBILE : CARD_SPREAD_X_DESKTOP;
    const driftY  = isMobile ? CARD_DRIFT_Y_MOBILE  : CARD_DRIFT_Y_DESKTOP;

    const targetX = offset.x + rel * spreadX;
    const targetY = offset.y + rel * driftY + Math.sin(t * 0.8 + index * 1.3) * 0.04;
    const targetZ = offset.z - dist * 0.8;
    const targetRX = offset.rx;
    const targetRY = offset.ry + rel * 0.05;
    const targetRZ = offset.rz;
    const activeScale = hovered ? CARD_HOVER_SCALE : 1.0;
    const targetScale = Math.max(CARD_SCALE_MIN, 1 - dist * CARD_SCALE_FALLOFF) * activeScale;

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
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, MESH_LERP_FACTOR);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, MESH_LERP_FACTOR);
    meshRef.current.scale.z = 1;

    if (materialRef.current) {
      // Show the video texture whenever it has data (even when paused between
      // play-radius visits) — only fall back to the canvas placeholder when
      // the video has no decoded frames yet.
      const isVideoReady = videoRef.current && videoRef.current.readyState >= 2;
      const activeTexture = (isVideoReady && videoTextureRef.current) ? videoTextureRef.current : texture;
      if (materialRef.current.map !== activeTexture) {
        materialRef.current.map = activeTexture;
        materialRef.current.needsUpdate = true;
      }
      materialRef.current.color.set(activeTexture ? '#ffffff' : '#141414');
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        if (isExpanded) { onCollapse(); } else { onExpand(); }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!anyExpanded) { setHovered(true); onHoverChange(true); }
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
        color="#141414"
        map={texture}
        transparent
        opacity={1.0}
        toneMapped={false}
      />
    </mesh>
  );
}

// ── GridScene ─────────────────────────────────────────────────────────────────

function GridScene({
  projects,
  scrollRef,
  expandedId,
  onExpand,
  onCollapse,
  onHoverChange,
}: {
  projects: Project[];
  scrollRef: React.MutableRefObject<number>;
  expandedId: string | null;
  onExpand: (id: string) => void;
  onCollapse: () => void;
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
            isExpanded={expandedId === project.id}
            anyExpanded={expandedId !== null}
            onExpand={() => onExpand(project.id)}
            onCollapse={onCollapse}
            onHoverChange={onHoverChange}
          />
        ))}
      </group>
    </>
  );
}

// ── BradyShowcase (root) ──────────────────────────────────────────────────────

export default function BradyShowcase({ projects, viewMode }: BradyShowcaseProps) {
  const [mounted, setMounted] = useState(false);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const targetScroll = useRef(0);
  const lastActiveIndex = useRef(0);
  const isDraggingRef = useRef(false);
  const lastWheelTime = useRef(0);
  const pointerDownRef = useRef<{ x: number; y: number; scrollVal: number } | null>(null);

  const expandedProject = expandedId ? projects.find((p) => p.id === expandedId) ?? null : null;

  const handleExpand = useCallback((id: string) => { setExpandedId(id); }, []);
  const handleCollapse = useCallback(() => { setExpandedId(null); }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Wheel scroll — disabled when a card is expanded
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const handleWheel = (e: WheelEvent) => {
      if (expandedId) return;
      lastWheelTime.current = Date.now();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        targetScroll.current += e.deltaY * WHEEL_SENSITIVITY;
      }
    };
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => { container.removeEventListener('wheel', handleWheel); };
  }, [mounted, expandedId]);

  // Reset on project change
  useEffect(() => {
    scroll.current = 0;
    targetScroll.current = 0;
    lastActiveIndex.current = 0;
  }, [projects]);

  // Main animation tick
  useEffect(() => {
    if (!mounted) return;
    let frameId: number;
    const tick = () => {
      const n = projects.length;
      if (n === 0) { frameId = requestAnimationFrame(tick); return; }

      if (!expandedId) {
        const isIdle = (Date.now() - lastWheelTime.current > IDLE_THRESHOLD_MS)
          && !isDraggingRef.current && !isHoveringGrid;
        if (isIdle) { targetScroll.current += AUTO_DRIFT_SPEED; }
      }

      const diff = targetScroll.current - scroll.current;
      scroll.current += diff * SCROLL_LERP_FACTOR;

      while (targetScroll.current >= n) {
        targetScroll.current -= n; scroll.current -= n;
        if (pointerDownRef.current) pointerDownRef.current.scrollVal -= n;
      }
      while (targetScroll.current < 0) {
        targetScroll.current += n; scroll.current += n;
        if (pointerDownRef.current) pointerDownRef.current.scrollVal += n;
      }

      if (viewMode === 'list' && listContainerRef.current) {
        const items = listContainerRef.current.children;
        const totalItems = n;
        const gap = window.innerWidth < LIST_BREAKPOINT_PX ? LIST_GAP_MOBILE_PX : LIST_GAP_DESKTOP_PX;
        for (let i = 0; i < totalItems; i++) {
          const item = items[i] as HTMLElement;
          if (!item) continue;
          const rawRel = i - scroll.current;
          const wrappedRel = ((rawRel % totalItems) + totalItems) % totalItems;
          const rel = wrappedRel < totalItems / 2 ? wrappedRel : wrappedRel - totalItems;
          const dist = Math.abs(rel);
          item.style.transform = `translate(-50%, calc(-50% + ${rel * gap}px))`;
          if (dist < LIST_FOCUS_ACTIVE_THRESHOLD) {
            item.classList.add('active'); item.classList.remove('near', 'far');
          } else if (dist < LIST_FOCUS_NEAR_THRESHOLD) {
            item.classList.add('near'); item.classList.remove('active', 'far');
          } else {
            item.classList.add('far'); item.classList.remove('active', 'near');
          }
        }
      }

      const activeIdx = ((Math.round(scroll.current) % n) + n) % n;
      if (activeIdx !== lastActiveIndex.current) { lastActiveIndex.current = activeIdx; }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [mounted, projects.length, viewMode, isHoveringGrid, expandedId]);

  // Pointer drag — disabled when a card is expanded
  const handlePointerDown = (e: React.PointerEvent) => {
    if (expandedId) return;
    pointerDownRef.current = { x: e.clientX, y: e.clientY, scrollVal: targetScroll.current };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current || expandedId) return;
    const deltaX = e.clientX - pointerDownRef.current.x;
    const deltaY = e.clientY - pointerDownRef.current.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist > DRAG_THRESHOLD_PX) {
      isDraggingRef.current = true;
      const sensitivity = window.innerWidth < LIST_BREAKPOINT_PX
        ? DRAG_SENSITIVITY_MOBILE
        : DRAG_SENSITIVITY_DESKTOP;
      targetScroll.current = pointerDownRef.current.scrollVal
        + -(deltaX / window.innerWidth) * sensitivity;
    }
  };

  const handlePointerUp = () => {
    pointerDownRef.current = null;
    setTimeout(() => { isDraggingRef.current = false; }, 50);
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
      {/* Background WebGL fluid effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Ferrofluid
          colors={['#ffffff', '#ffffff', '#ffffff']}
          backgroundColor="#0a0a0a"
          speed={0.5}
          scale={1.6}
          turbulence={1.0}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2.0}
          flowDirection="down"
          opacity={1.0}
          mouseInteraction={true}
          mouseStrength={1.0}
          mouseRadius={0.35}
          mouseDampening={0.15}
        />
      </div>
      <style>{`
        .list-item {
          position: absolute; left: 50%; top: 50%;
          font-family: var(--font-primary), sans-serif;
          font-weight: 300;
          font-size: clamp(1.6rem, 5.5vw, 4.2rem);
          text-transform: uppercase; color: white;
          transition: letter-spacing 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
                      opacity 0.5s cubic-bezier(0.22, 0.61, 0.36, 1),
                      font-size 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
          white-space: nowrap;
        }
        .list-item.active { opacity: 1; letter-spacing: 0.15em; font-weight: 200; }
        .list-item.near   { opacity: 0.45; letter-spacing: 0.04em; }
        .list-item.far    { opacity: 0.12; letter-spacing: 0em; }
      `}</style>

      {/* Grid View */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out z-10 ${
          viewMode === 'grid' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        data-cursor={isHoveringGrid && !expandedId ? 'view' : undefined}
        aria-label="Project carousel - interactive 3D showcase"
      >
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
            {projects.length > 0 && (
              <GridScene
                projects={projects}
                scrollRef={scroll}
                expandedId={expandedId}
                onExpand={handleExpand}
                onCollapse={handleCollapse}
                onHoverChange={setIsHoveringGrid}
              />
            )}
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* List View */}
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
            onClick={() => handleExpand(project.id)}
            className="list-item"
            data-cursor="view"
            tabIndex={viewMode === 'list' ? 0 : -1}
          >
            {project.title}
          </button>
        ))}
      </div>

      {/* Expanded info overlay */}
      {expandedProject && (
        <ExpandedInfoOverlay
          project={expandedProject}
          onCollapse={handleCollapse}
        />
      )}
    </div>
  );
}
