import { describe, expect, it } from 'vitest';
import {
  getProjectCardRoll,
  PROJECT_CARD_ROLL,
  PROJECT_CARD_ROLL_REST,
} from './projectCardMotion';

describe('project card scroll roll', () => {
  it('rests at the viewport center', () => {
    expect(getProjectCardRoll(0.5)).toEqual(PROJECT_CARD_ROLL_REST);
  });

  it('maps the lower and upper edges to symmetrical roll states', () => {
    expect(getProjectCardRoll(0)).toEqual({
      rotateX: -PROJECT_CARD_ROLL.maxRotateX,
      translateY: PROJECT_CARD_ROLL.maxTranslateY,
      opacity: PROJECT_CARD_ROLL.edgeOpacity,
      originY: PROJECT_CARD_ROLL.lowerOriginY,
    });
    expect(getProjectCardRoll(1)).toEqual({
      rotateX: PROJECT_CARD_ROLL.maxRotateX,
      translateY: -PROJECT_CARD_ROLL.maxTranslateY,
      opacity: PROJECT_CARD_ROLL.edgeOpacity,
      originY: PROJECT_CARD_ROLL.upperOriginY,
    });
  });

  it('clamps progress beyond the viewport range', () => {
    expect(getProjectCardRoll(-2)).toEqual(getProjectCardRoll(0));
    expect(getProjectCardRoll(3)).toEqual(getProjectCardRoll(1));
  });

  it('returns a static state when motion is disabled or progress is invalid', () => {
    expect(getProjectCardRoll(0.2, false)).toEqual(PROJECT_CARD_ROLL_REST);
    expect(getProjectCardRoll(Number.NaN)).toEqual(PROJECT_CARD_ROLL_REST);
  });
});
