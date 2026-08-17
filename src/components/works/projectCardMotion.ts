export const PROJECT_CARD_ROLL = Object.freeze({
  perspective: 900,
  maxRotateX: 14,
  maxTranslateY: 6,
  edgeOpacity: 0.9,
  centerOriginY: 50,
  lowerOriginY: 4,
  upperOriginY: 96,
  scrub: 0.6,
});

export interface ProjectCardRollVector {
  rotateX: number;
  translateY: number;
  opacity: number;
  originY: number;
}

export const PROJECT_CARD_ROLL_REST: ProjectCardRollVector = Object.freeze({
  rotateX: 0,
  translateY: 0,
  opacity: 1,
  originY: PROJECT_CARD_ROLL.centerOriginY,
});

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function withoutNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

export function getProjectCardRoll(progress: number, motionEnabled = true): ProjectCardRollVector {
  if (!motionEnabled || !Number.isFinite(progress)) return PROJECT_CARD_ROLL_REST;

  const normalized = clamp(progress, 0, 1) * 2 - 1;
  const edgeDistance = Math.abs(normalized);

  return {
    rotateX: withoutNegativeZero(normalized * PROJECT_CARD_ROLL.maxRotateX),
    translateY: withoutNegativeZero(-normalized * PROJECT_CARD_ROLL.maxTranslateY),
    opacity: 1 - edgeDistance * (1 - PROJECT_CARD_ROLL.edgeOpacity),
    originY: PROJECT_CARD_ROLL.centerOriginY + normalized * 46,
  };
}
