export const SKILL_CARD_MOTION = Object.freeze({
  perspective: 900,
  maxRollRotateX: 4.5,
  maxRollY: 10,
  maxOpacityLoss: 0.04,
  rollScrub: 0.6,
});

export interface SkillCardBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SkillCardRollVector {
  rotationX: number;
  y: number;
  opacity: number;
}

export const SKILL_CARD_ROLL_REST: SkillCardRollVector = Object.freeze({
  rotationX: 0,
  y: 0,
  opacity: 1,
});

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function withoutNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

export function getSkillCardSpotlight(bounds: SkillCardBounds, clientX: number, clientY: number) {
  if (bounds.width <= 0 || bounds.height <= 0) return { x: 50, y: 50 };

  return {
    x: clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100),
    y: clamp(((clientY - bounds.top) / bounds.height) * 100, 0, 100),
  };
}

export function getSkillCardRoll(progress: number, motionEnabled = true): SkillCardRollVector {
  if (!motionEnabled) return SKILL_CARD_ROLL_REST;

  const normalized = clamp((progress - 0.5) * 2, -1, 1);
  return {
    rotationX: withoutNegativeZero(-normalized * SKILL_CARD_MOTION.maxRollRotateX),
    y: withoutNegativeZero(-normalized * SKILL_CARD_MOTION.maxRollY),
    opacity: 1 - Math.abs(normalized) * SKILL_CARD_MOTION.maxOpacityLoss,
  };
}
