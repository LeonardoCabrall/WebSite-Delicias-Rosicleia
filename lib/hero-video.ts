export const HERO_VIDEO = {
  src: '/brand/batatas-douradas.mp4',
  poster: '/brand/video-poster.webp',
  width: 1080,
  height: 1920,
  focus: { x: 540 / 1080, y: 1370 / 1920 },
} as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function getVideoFrame(width: number, height: number) {
  const ratio = HERO_VIDEO.width / HERO_VIDEO.height;
  const mobile = width <= 767;
  const frameHeight = mobile
    ? Math.min(height * 0.53, (width * 0.9) / ratio)
    : Math.min(height, (width * 0.46) / ratio);
  const frameWidth = frameHeight * ratio;
  return {
    width: frameWidth,
    height: frameHeight,
    left: (width - frameWidth) * (mobile ? 0.82 : 0.96),
    top: mobile ? height * 0.34 : (height - frameHeight) / 2,
  };
}

export function getApronCamera(
  width: number,
  height: number,
  progress: number,
) {
  const frame = getVideoFrame(width, height);
  const t = clamp(progress);
  const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  const endScale = Math.min(
    64,
    Math.max(1, width / (frame.width * 0.18), height / (frame.height * 0.045)),
  );
  const scale = Math.exp(Math.log(endScale) * eased);
  const blend = endScale === 1 ? 0 : (1 / scale - 1) / (1 / endScale - 1);
  const focusX = frame.left + frame.width * HERO_VIDEO.focus.x;
  const focusY = frame.top + frame.height * HERO_VIDEO.focus.y;
  const centerX = width / 2 + (focusX - width / 2) * blend;
  const centerY = height / 2 + (focusY - height / 2) * blend;
  return {
    scale,
    x: width / 2 - scale * centerX,
    y: height / 2 - scale * centerY,
  };
}
