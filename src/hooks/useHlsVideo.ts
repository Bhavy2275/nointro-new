import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface UseHlsVideoOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  crossOrigin?: string;
  onMetadataLoaded?: (video: HTMLVideoElement) => void;
}

/** Maximum video height (px) we ever want to load — caps at 1080p to avoid lag. */
const MAX_VIDEO_HEIGHT = 1080;

/**
 * Shared utility function to initialize HLS or native streaming on a video element.
 * Safe to call from both standard React lifecycles (hooks) and imperative animation loops (R3F useFrame).
 */
export function initHlsVideo(video: HTMLVideoElement, videoUrl: string, onParsed?: () => void): Hls | null {
  let hls: Hls | null = null;

  if (videoUrl.includes('.m3u8')) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      if (onParsed) onParsed();
    } else if (Hls.isSupported()) {
      const hlsInstance = new Hls({
        // Do NOT cap to player size — videos render as WebGL textures whose
        // pixel dimensions can be tiny, causing HLS to lock into low quality.
        capLevelToPlayerSize: false,
        enableWorker: true,
        // Start at the highest quality level immediately instead of ramping up.
        startLevel: -1,
        // Seed the ABR bandwidth estimator at 10 Mbps so the first quality
        // selection is high rather than conservative.
        abrEwmaDefaultEstimate: 10_000_000,
        // Larger buffers reduce quality drops during playback and prevent
        // re-buffering when scrolling back to a card.
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        backBufferLength: 60,
        // Keep higher buffer before switching quality down — avoids flickering
        // between quality levels on minor bandwidth dips.
        maxBufferSize: 30 * 1024 * 1024,
        // Don't downgrade quality for short stalls — maintain high quality.
        abrBandwidthUpFactor: 0.7,
        abrBandwidthDownFactor: 0.5,
      });
      hls = hlsInstance;
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
        // Find the highest level whose height is within the 1080p cap.
        // levels are sorted lowest → highest by HLS.js.
        const levels = data.levels;
        let capLevel = levels.length - 1; // default: top level
        for (let i = levels.length - 1; i >= 0; i--) {
          if (levels[i].height <= MAX_VIDEO_HEIGHT) {
            capLevel = i;
            break;
          }
        }
        // autoLevelCapping prevents ABR from ever going above this level.
        hlsInstance.autoLevelCapping = capLevel;
        // Start immediately at the capped level instead of ramping up.
        hlsInstance.currentLevel = capLevel;
        if (onParsed) onParsed();
      });
    }
  } else {
    video.src = videoUrl;
    // Do NOT call onParsed() here — BradyShowcase manages readiness via canplay
  }

  return hls;
}

/**
 * Custom React hook that manages standard and HLS video streaming lifecycle for JSX video components.
 */
export function useHlsVideo(videoUrl: string | undefined, options: UseHlsVideoOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const { autoplay, muted, loop, playsInline, crossOrigin, onMetadataLoaded } = options;

  // Use ref for callback to avoid re-triggering the main effect on every render if the callback isn't memoized.
  const onMetadataLoadedRef = useRef(onMetadataLoaded);
  useEffect(() => {
    onMetadataLoadedRef.current = onMetadataLoaded;
  }, [onMetadataLoaded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hls: Hls | null = null;

    const onMeta = () => {
      if (onMetadataLoadedRef.current) {
        onMetadataLoadedRef.current(video);
      }
    };
    video.addEventListener('loadedmetadata', onMeta);

    // Apply properties to programmatically created videos
    if (crossOrigin) video.crossOrigin = crossOrigin;
    if (loop !== undefined) video.loop = loop;
    if (playsInline !== undefined) video.playsInline = playsInline;

    hls = initHlsVideo(video, videoUrl);
    hlsRef.current = hls;

    if (muted !== undefined) {
      video.muted = muted;
    }

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      } else {
        video.src = '';
        video.load();
      }
    };
  }, [videoUrl, muted, crossOrigin, loop, playsInline]);

  // Manage play/pause dynamically based on the autoplay prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (autoplay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoUrl, autoplay]);

  return { videoRef, hlsRef };
}
