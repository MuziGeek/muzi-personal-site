import { describe, expect, it } from 'vitest';
import {
  getSkillCardRoll,
  getSkillCardSpotlight,
  SKILL_CARD_MOTION,
  SKILL_CARD_ROLL_REST,
} from './skillCardMotion';

const bounds = { left: 100, top: 50, width: 400, height: 300 };

describe('skill card motion', () => {
  it('keeps the scroll roll neutral at the viewport center', () => {
    expect(getSkillCardRoll(0.5)).toEqual(SKILL_CARD_ROLL_REST);
  });

  it('rolls symmetrically through the viewport', () => {
    expect(getSkillCardRoll(0)).toEqual({
      rotationX: SKILL_CARD_MOTION.maxRollRotateX,
      y: SKILL_CARD_MOTION.maxRollY,
      opacity: 1 - SKILL_CARD_MOTION.maxOpacityLoss,
    });
    expect(getSkillCardRoll(1)).toEqual({
      rotationX: -SKILL_CARD_MOTION.maxRollRotateX,
      y: -SKILL_CARD_MOTION.maxRollY,
      opacity: 1 - SKILL_CARD_MOTION.maxOpacityLoss,
    });
  });

  it('clamps roll progress beyond the viewport range', () => {
    expect(getSkillCardRoll(-3)).toEqual(getSkillCardRoll(0));
    expect(getSkillCardRoll(4)).toEqual(getSkillCardRoll(1));
  });

  it('returns a static card when motion is disabled', () => {
    expect(getSkillCardRoll(0, false)).toEqual(SKILL_CARD_ROLL_REST);
  });

  it('maps and clamps the pointer only for the spotlight', () => {
    expect(getSkillCardSpotlight(bounds, 300, 200)).toEqual({ x: 50, y: 50 });
    expect(getSkillCardSpotlight(bounds, -500, 900)).toEqual({ x: 0, y: 100 });
    expect(getSkillCardSpotlight({ ...bounds, width: 0 }, 300, 200)).toEqual({ x: 50, y: 50 });
  });
});
