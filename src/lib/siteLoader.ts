export const SITE_LOADER_SESSION_KEY = 'muzi-loader-seen:v1';
export const SITE_LOADER_MAX_WAIT_MS = 4_000;
export const SITE_LOADER_EXIT_MS = 240;

export const SITE_LOADER_FRAMES = [
  { id: 'neutral', duration: 320 },
  { id: 'blink', duration: 110 },
  { id: 'curious', duration: 280 },
  { id: 'side-eye', duration: 320 },
  { id: 'surprised', duration: 220 },
  { id: 'smile', duration: 420 },
  { id: 'wink-tongue', duration: 260 },
  { id: 'cool-shades', duration: 360 },
] as const;

export type SiteLoaderFrameId = (typeof SITE_LOADER_FRAMES)[number]['id'];

export const SITE_LOADER_CYCLE_MS = SITE_LOADER_FRAMES.reduce(
  (total, frame) => total + frame.duration,
  0,
);

export function getNextSiteLoaderFrame(index: number, frameCount: number = SITE_LOADER_FRAMES.length) {
  if (!Number.isFinite(index) || frameCount < 1) return 0;
  return (Math.max(0, Math.trunc(index)) + 1) % frameCount;
}

export function shouldAnimateSiteLoader({
  prefersReducedMotion,
  saveData,
  spriteReady,
}: {
  prefersReducedMotion: boolean;
  saveData: boolean;
  spriteReady: boolean;
}) {
  return spriteReady && !prefersReducedMotion && !saveData;
}

export function shouldExitSiteLoaderAtBoundary({
  pageReady,
  completedCycle,
}: {
  pageReady: boolean;
  completedCycle: boolean;
}) {
  return pageReady && completedCycle;
}
