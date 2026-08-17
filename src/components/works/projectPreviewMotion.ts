export interface PreviewBounds {
  left: number;
  width: number;
}

export interface ProjectVisibilityChange {
  id: string;
  isIntersecting: boolean;
  intersectionRatio: number;
}

export const MUNAN_DEMO_STATES = ['discover', 'create', 'share'] as const;

export type MunanDemoState = (typeof MUNAN_DEMO_STATES)[number];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getPreviewIndexFromPointer(bounds: PreviewBounds, clientX: number, itemCount: number) {
  if (bounds.width <= 0 || itemCount <= 0) return 0;
  const progress = clamp((clientX - bounds.left) / bounds.width, 0, 1);
  return Math.min(itemCount - 1, Math.floor(progress * itemCount));
}

export function stepPreviewIndex(current: number, step: number, itemCount: number) {
  if (itemCount <= 0) return 0;
  return ((current + step) % itemCount + itemCount) % itemCount;
}

export function shouldAutoAdvancePreview(
  active: boolean,
  interacting: boolean,
  reducedMotion: boolean,
  failed: boolean,
  pageVisible = true,
) {
  return active && pageVisible && !interacting && !reducedMotion && !failed;
}

export function updateVisibleProjectIds(
  current: ReadonlySet<string>,
  changes: ProjectVisibilityChange[],
  threshold = 0.25,
) {
  const next = new Set(current);
  changes.forEach(({ id, isIntersecting, intersectionRatio }) => {
    if (isIntersecting && intersectionRatio >= threshold) next.add(id);
    else next.delete(id);
  });
  return next;
}
