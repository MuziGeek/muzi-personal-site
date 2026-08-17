import { describe, expect, it } from 'vitest';
import {
  getNextSiteLoaderFrame,
  shouldAnimateSiteLoader,
  shouldExitSiteLoaderAtBoundary,
  SITE_LOADER_CYCLE_MS,
  SITE_LOADER_FRAMES,
} from './siteLoader';

describe('site loader timing', () => {
  it('keeps the restrained-to-playful frame order and timing', () => {
    expect(SITE_LOADER_FRAMES.map((frame) => frame.id)).toEqual([
      'neutral',
      'blink',
      'curious',
      'side-eye',
      'surprised',
      'smile',
      'wink-tongue',
      'cool-shades',
    ]);
    expect(SITE_LOADER_CYCLE_MS).toBe(2_290);
    expect(SITE_LOADER_FRAMES.find((frame) => frame.id === 'blink')?.duration).toBe(110);
    expect(SITE_LOADER_FRAMES.find((frame) => frame.id === 'smile')?.duration).toBe(420);
  });

  it('advances and wraps without leaving the sprite range', () => {
    expect(getNextSiteLoaderFrame(0)).toBe(1);
    expect(getNextSiteLoaderFrame(SITE_LOADER_FRAMES.length - 1)).toBe(0);
    expect(getNextSiteLoaderFrame(Number.NaN)).toBe(0);
    expect(getNextSiteLoaderFrame(2, 0)).toBe(0);
  });

  it('disables the expression loop for reduced motion and save-data', () => {
    expect(
      shouldAnimateSiteLoader({ prefersReducedMotion: false, saveData: false, spriteReady: true }),
    ).toBe(true);
    expect(
      shouldAnimateSiteLoader({ prefersReducedMotion: true, saveData: false, spriteReady: true }),
    ).toBe(false);
    expect(
      shouldAnimateSiteLoader({ prefersReducedMotion: false, saveData: true, spriteReady: true }),
    ).toBe(false);
    expect(
      shouldAnimateSiteLoader({ prefersReducedMotion: false, saveData: false, spriteReady: false }),
    ).toBe(false);
  });

  it('waits for both page readiness and a complete cycle', () => {
    expect(shouldExitSiteLoaderAtBoundary({ pageReady: true, completedCycle: true })).toBe(true);
    expect(shouldExitSiteLoaderAtBoundary({ pageReady: true, completedCycle: false })).toBe(false);
    expect(shouldExitSiteLoaderAtBoundary({ pageReady: false, completedCycle: true })).toBe(false);
  });
});
