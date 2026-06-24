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
        capLevelToPlayerSize: false,
        defaultAudioCodec: 'mp4a.40.2', // Optimization
      });
      hls = hlsInstance;
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        hlsInstance.currentLevel = hlsInstance.levels.length - 1; // Force highest quality manifest resolution
        if (onParsed) onParsed();
      });
    }
  } else {
    video.src = videoUrl;
    if (onParsed) onParsed();
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
