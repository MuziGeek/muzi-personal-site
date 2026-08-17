import { describe, expect, it } from 'vitest';
import {
  getPreviewIndexFromPointer,
  MUNAN_DEMO_STATES,
  shouldAutoAdvancePreview,
  stepPreviewIndex,
  updateVisibleProjectIds,
} from './projectPreviewMotion';

describe('project preview motion', () => {
  it('keeps the Munan feature relay in its narrative order', () => {
    expect(MUNAN_DEMO_STATES).toEqual(['discover', 'create', 'share']);
  });

  it('maps and clamps pointer positions to preview frames', () => {
    const bounds = { left: 100, width: 400 };
    expect(getPreviewIndexFromPointer(bounds, 100, 3)).toBe(0);
    expect(getPreviewIndexFromPointer(bounds, 299, 3)).toBe(1);
    expect(getPreviewIndexFromPointer(bounds, 500, 3)).toBe(2);
    expect(getPreviewIndexFromPointer(bounds, -100, 3)).toBe(0);
    expect(getPreviewIndexFromPointer(bounds, 900, 3)).toBe(2);
  });

  it('wraps rapid forward and reverse steps', () => {
    expect(stepPreviewIndex(0, -1, 3)).toBe(2);
    expect(stepPreviewIndex(2, 1, 3)).toBe(0);
    expect(stepPreviewIndex(1, -5, 3)).toBe(2);
  });

  it('keeps every sufficiently visible project active', () => {
    const active = updateVisibleProjectIds(new Set(), [
      { id: 'one', isIntersecting: true, intersectionRatio: 0.72 },
      { id: 'two', isIntersecting: true, intersectionRatio: 0.42 },
      { id: 'three', isIntersecting: true, intersectionRatio: 0.1 },
    ]);
    expect([...active]).toEqual(['one', 'two']);
  });

  it('removes only the project that leaves the viewport', () => {
    const active = updateVisibleProjectIds(new Set(['one', 'two']), [
      { id: 'one', isIntersecting: false, intersectionRatio: 0 },
    ]);
    expect([...active]).toEqual(['two']);
  });

  it('stops automatic playback for interaction, reduced motion, failures, and hidden pages', () => {
    expect(shouldAutoAdvancePreview(true, false, false, false)).toBe(true);
    expect(shouldAutoAdvancePreview(true, true, false, false)).toBe(false);
    expect(shouldAutoAdvancePreview(true, false, true, false)).toBe(false);
    expect(shouldAutoAdvancePreview(true, false, false, true)).toBe(false);
    expect(shouldAutoAdvancePreview(false, false, false, false)).toBe(false);
    expect(shouldAutoAdvancePreview(true, false, false, false, false)).toBe(false);
  });

  it('resumes automatic playback after interaction ends', () => {
    expect(shouldAutoAdvancePreview(true, true, false, false)).toBe(false);
    expect(shouldAutoAdvancePreview(true, false, false, false)).toBe(true);
  });
});
