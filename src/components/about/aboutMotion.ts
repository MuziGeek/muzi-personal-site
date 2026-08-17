export const ABOUT_CARD_MOTION = Object.freeze({
  perspective: 900,
  maxRotateX: 14,
  maxTranslateY: 6,
  edgeOpacity: 0.9,
  scrub: 0.6,
});

export interface AboutCardBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AboutCardRollVector {
  rotateX: number;
  translateY: number;
  opacity: number;
  originY: number;
}

export const ABOUT_CARD_ROLL_REST: AboutCardRollVector = Object.freeze({
  rotateX: 0,
  translateY: 0,
  opacity: 1,
  originY: 50,
});

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const withoutNegativeZero = (value: number) => (Object.is(value, -0) ? 0 : value);

export function getAboutCardRoll(progress: number, motionEnabled = true): AboutCardRollVector {
  if (!motionEnabled || !Number.isFinite(progress)) return ABOUT_CARD_ROLL_REST;

  const normalized = clamp(progress, 0, 1) * 2 - 1;
  const edgeDistance = Math.abs(normalized);

  return {
    rotateX: withoutNegativeZero(normalized * ABOUT_CARD_MOTION.maxRotateX),
    translateY: withoutNegativeZero(-normalized * ABOUT_CARD_MOTION.maxTranslateY),
    opacity: 1 - edgeDistance * (1 - ABOUT_CARD_MOTION.edgeOpacity),
    originY: 50 + normalized * 46,
  };
}

export function getAboutSpotlight(bounds: AboutCardBounds, clientX: number, clientY: number) {
  if (bounds.width <= 0 || bounds.height <= 0) return { x: 50, y: 50 };

  return {
    x: clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100),
    y: clamp(((clientY - bounds.top) / bounds.height) * 100, 0, 100),
  };
}

export function getWrappedFocusIndex(current: number, direction: -1 | 1, length: number) {
  if (length <= 0) return -1;
  return (current + direction + length) % length;
}
