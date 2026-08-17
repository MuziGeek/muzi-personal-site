import { describe, expect, it } from 'vitest';
import { ABOUT_CARD_MOTION, ABOUT_CARD_ROLL_REST, getAboutCardRoll, getAboutSpotlight, getWrappedFocusIndex } from './aboutMotion';

describe('about card motion', () => {
  it('rests at the center of the viewport journey', () => {
    expect(getAboutCardRoll(0.5)).toEqual(ABOUT_CARD_ROLL_REST);
  });

  it('clamps both roll edges', () => {
    expect(getAboutCardRoll(-2)).toEqual({
      rotateX: -ABOUT_CARD_MOTION.maxRotateX,
      translateY: ABOUT_CARD_MOTION.maxTranslateY,
      opacity: ABOUT_CARD_MOTION.edgeOpacity,
      originY: 4,
    });
    expect(getAboutCardRoll(3)).toEqual({
      rotateX: ABOUT_CARD_MOTION.maxRotateX,
      translateY: -ABOUT_CARD_MOTION.maxTranslateY,
      opacity: ABOUT_CARD_MOTION.edgeOpacity,
      originY: 96,
    });
  });

  it('returns the static result when motion is disabled', () => {
    expect(getAboutCardRoll(0, false)).toEqual(ABOUT_CARD_ROLL_REST);
    expect(getAboutCardRoll(Number.NaN)).toEqual(ABOUT_CARD_ROLL_REST);
  });

  it('normalizes and clamps the pointer spotlight', () => {
    const bounds = { left: 100, top: 50, width: 400, height: 200 };
    expect(getAboutSpotlight(bounds, 300, 150)).toEqual({ x: 50, y: 50 });
    expect(getAboutSpotlight(bounds, -500, 900)).toEqual({ x: 0, y: 100 });
  });
});

describe('dialog focus wrapping', () => {
  it('wraps forwards and backwards', () => {
    expect(getWrappedFocusIndex(2, 1, 3)).toBe(0);
    expect(getWrappedFocusIndex(0, -1, 3)).toBe(2);
    expect(getWrappedFocusIndex(0, 1, 0)).toBe(-1);
  });
});
