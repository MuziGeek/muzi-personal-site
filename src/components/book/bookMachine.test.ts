import { describe, expect, it } from 'vitest';
import { bookReducer, clampPageIndex, clampTracking, initialBookState } from './bookMachine';

describe('book machine', () => {
  it('opens from the cover into an idle, trackable state', () => {
    expect(bookReducer(initialBookState, { type: 'OPEN' })).toMatchObject({ phase: 'idle', currentIndex: 0, catMode: 'tracking' });
  });

  it('locks a second navigation request during a transition', () => {
    const open = bookReducer(initialBookState, { type: 'OPEN' });
    const first = bookReducer(open, { type: 'BEGIN', targetIndex: 1, direction: 'next' });
    expect(bookReducer(first, { type: 'BEGIN', targetIndex: 2, direction: 'next' })).toEqual(first);
  });

  it('commits a target page only after the flip is underway', () => {
    const open = bookReducer(initialBookState, { type: 'OPEN' });
    const preparing = bookReducer(open, { type: 'BEGIN', targetIndex: 4, direction: 'next' });
    const settling = bookReducer(bookReducer(preparing, { type: 'FLIP' }), { type: 'COMMIT' });
    expect(settling).toMatchObject({ currentIndex: 4, phase: 'settling', catMode: 'occluded' });
    expect(bookReducer(settling, { type: 'SETTLE' })).toMatchObject({ phase: 'idle', targetIndex: null, direction: null });
  });

  it('clamps page and cat tracking boundaries', () => {
    expect(clampPageIndex(-3)).toBe(0);
    expect(clampPageIndex(99)).toBe(6);
    expect(clampTracking(12, 5)).toBe(5);
    expect(clampTracking(-12, 5)).toBe(-5);
  });

  it('keeps previous-page direction and exposes explicit cat modes', () => {
    const open = bookReducer(initialBookState, { type: 'OPEN', index: 3 });
    const preparing = bookReducer(open, { type: 'BEGIN', targetIndex: 2, direction: 'prev' });
    expect(preparing.direction).toBe('prev');
    expect(bookReducer(preparing, { type: 'SET_CAT', mode: 'runningOut' }).catMode).toBe('runningOut');
  });

  it('opens a valid hash chapter without an animation and clamps invalid targets', () => {
    expect(bookReducer(initialBookState, { type: 'JUMP', index: 5 })).toMatchObject({ currentIndex: 5, phase: 'idle' });
    expect(bookReducer(initialBookState, { type: 'JUMP', index: 40 }).currentIndex).toBe(6);
  });
});
