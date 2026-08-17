import type { BookDirection, BookState, CatMode } from './types';

export const PAGE_COUNT = 7;

export const initialBookState: BookState = {
  currentIndex: 0,
  targetIndex: null,
  direction: null,
  phase: 'closed',
  catMode: 'idle',
};

export type BookAction =
  | { type: 'OPEN'; index?: number }
  | { type: 'BEGIN'; targetIndex: number; direction: BookDirection }
  | { type: 'FLIP' }
  | { type: 'COMMIT' }
  | { type: 'SETTLE' }
  | { type: 'SET_CAT'; mode: CatMode }
  | { type: 'JUMP'; index: number };

export function clampPageIndex(index: number, pageCount = PAGE_COUNT) {
  return Math.max(0, Math.min(pageCount - 1, index));
}

export function clampTracking(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

export function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case 'OPEN':
      if (state.phase !== 'closed') return state;
      return { ...state, currentIndex: clampPageIndex(action.index ?? 0), phase: 'idle', catMode: 'tracking' };
    case 'JUMP':
      if (state.phase !== 'closed' && state.phase !== 'idle') return state;
      return {
        ...state,
        currentIndex: clampPageIndex(action.index),
        phase: 'idle',
        targetIndex: null,
        direction: null,
        catMode: 'tracking',
      };
    case 'BEGIN':
      if (state.phase !== 'idle' || action.targetIndex === state.currentIndex) return state;
      return { ...state, targetIndex: clampPageIndex(action.targetIndex), direction: action.direction, phase: 'preparing', catMode: 'crouch' };
    case 'FLIP':
      return state.phase === 'preparing' ? { ...state, phase: 'flipping' } : state;
    case 'COMMIT':
      if (state.targetIndex === null) return state;
      return { ...state, currentIndex: state.targetIndex, phase: 'settling', catMode: 'occluded' };
    case 'SETTLE':
      return { ...state, targetIndex: null, direction: null, phase: 'idle', catMode: 'tracking' };
    case 'SET_CAT':
      return { ...state, catMode: action.mode };
    default:
      return state;
  }
}
