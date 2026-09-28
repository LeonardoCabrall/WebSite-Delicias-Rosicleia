'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play, RotateCcw } from 'lucide-react';

import { HERO_VIDEO, getApronCamera, getVideoFrame } from '@/lib/hero-video';

type Phase = 'idle' | 'playing' | 'paused' | 'ready' | 'error';

export function VideoPortal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const actionRef = useRef<() => void>(() => {});
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const root = rootRef.current!;
    const video = videoRef.current!;
    const camera = cameraRef.current!;
    const frame = frameRef.current!;
    const hero = root.closest<HTMLElement>('.parallax__header') ?? root;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let visible = false;
    let userPaused = false;
    let manuallyStarted = false;
    let currentPhase: Phase = 'idle';
    const progress = { value: 0 };
    let width = 1;
    let height = 1;
    let zoomStartY = 0;
    let scrollFrame = 0;

    const updatePhase = (next: Phase) => {
      currentPhase = next;
      if (!disposed) setPhase(next);
    };
    const paint = () => {
      const pose = getApronCamera(
        width,
        height,
        motion.matches ? 0 : progress.value,
      );
      camera.style.transform = `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`;
    };
    const resize = () => {
      width = Math.max(1, root.clientWidth);
      height = Math.max(1, root.clientHeight);
      const bounds = getVideoFrame(width, height);
      Object.assign(frame.style, {
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
      });
      paint();
    };
    const play = () => {
      void video.play().catch(() => {
        if (!disposed && !video.error) updatePhase('paused');
      });
    };
    const syncVisibility = () => {
      const canRun = visible && !document.hidden && !userPaused;
      if (currentPhase === 'ready' || currentPhase === 'error') return;
      if (canRun && (!motion.matches || manuallyStarted)) play();
      else video.pause();
    };
    const updateZoom = () => {
      scrollFrame = 0;
      if (!video.ended || motion.matches) return;

      const travel = Math.max(1, hero.clientHeight * 0.58);
      progress.value = Math.min(
        1,
        Math.max(0, (window.scrollY - zoomStartY) / travel),
      );
      paint();
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateZoom);
    };
    const onPlaying = () => updatePhase('playing');
    const onPause = () => {
      if (!video.ended && currentPhase === 'playing') updatePhase('paused');
    };
    const onEnded = () => {
      zoomStartY = window.scrollY;
      progress.value = 0;
      paint();
      updatePhase('ready');
    };
    const onError = () => {
      updatePhase('error');
    };
    const onMotionChange = () => {
      if (motion.matches) {
        video.pause();
        manuallyStarted = false;
        progress.value = 0;
        paint();
        updatePhase(video.ended ? 'ready' : 'paused');
      } else syncVisibility();
    };

    actionRef.current = () => {
      if (currentPhase === 'playing') {
        userPaused = true;
        video.pause();
      } else {
        userPaused = false;
        manuallyStarted = true;
        if (currentPhase === 'ready') {
          progress.value = 0;
          paint();
          video.currentTime = 0;
          zoomStartY = window.scrollY;
        }
        play();
      }
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);
    motion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncVisibility();
      },
      { threshold: 0.15 },
    );
    observer.observe(root);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    return () => {
      disposed = true;
      actionRef.current = () => {};
      cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', syncVisibility);
      window.removeEventListener('scroll', onScroll);
      motion.removeEventListener('change', onMotionChange);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.pause();
    };
  }, []);

  const active = phase === 'playing';
  const label =
    phase === 'ready'
      ? 'Rever vídeo'
      : active
        ? 'Pausar vídeo'
        : 'Reproduzir vídeo';

  return (
    <div className="video-portal" ref={rootRef} data-video-phase={phase}>
      <svg
        aria-hidden="true"
        className="video-portal__filter-definitions"
        focusable="false"
      >
        <filter id="video-white-key" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 2.7"
          />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 1 1" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div className="video-portal__camera" ref={cameraRef} aria-hidden="true">
        <div className="video-portal__frame" ref={frameRef}>
          <Image
            src={HERO_VIDEO.poster}
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 90vw, 46vw"
            className="video-portal__poster"
          />
          <video
            ref={videoRef}
            src={HERO_VIDEO.src}
            poster={HERO_VIDEO.poster}
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            disablePictureInPicture
            className="video-portal__video"
          />
        </div>
      </div>
      <div className="video-portal__controls">
        {phase === 'error' ? (
          <p role="status">
            Vídeo indisponível. O cardápio continua acessível.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => actionRef.current()}
            aria-label={label}
          >
            {phase === 'ready' ? (
              <RotateCcw aria-hidden="true" />
            ) : active ? (
              <Pause aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}
            <span>{label}</span>
          </button>
        )}
      </div>
    </div>
  );
}
