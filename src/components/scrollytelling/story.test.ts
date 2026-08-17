import { describe, expect, it } from 'vitest';
import {
  getChapterIndex,
  getStoryLayer,
  MAIN_END_HOLD_PROGRESS,
  MAIN_VIDEO_DURATION,
  OUTRO_ENTRY_PROGRESS,
  progressToTime,
  STORY_CHAPTERS,
} from './story';

describe('scrollytelling timeline', () => {
  it('reaches the final main-video frame before the outro transition', () => {
    expect(progressToTime(0)).toBe(0);
    expect(progressToTime(MAIN_END_HOLD_PROGRESS)).toBe(MAIN_VIDEO_DURATION);
    expect(progressToTime(OUTRO_ENTRY_PROGRESS)).toBe(MAIN_VIDEO_DURATION);
    expect(progressToTime(1)).toBe(MAIN_VIDEO_DURATION);
  });

  it('selects the correct video layer in both transition zones', () => {
    expect(getStoryLayer(0)).toBe('intro');
    expect(getStoryLayer(0.5)).toBe('main');
    expect(getStoryLayer(0.98)).toBe('main');
    expect(getStoryLayer(OUTRO_ENTRY_PROGRESS)).toBe('outro');
  });

  it('uses the observed action boundaries instead of equal divisions', () => {
    expect(getChapterIndex(0)).toBe(0);
    expect(getChapterIndex(1.5)).toBe(1);
    expect(getChapterIndex(3.75)).toBe(2);
    expect(getChapterIndex(5.75)).toBe(3);
    expect(getChapterIndex(8.75)).toBe(4);
    expect(getChapterIndex(12.25)).toBe(5);
    expect(getChapterIndex(15.5)).toBe(6);
    expect(getChapterIndex(18)).toBe(STORY_CHAPTERS.length - 1);
  });

  it('uses one MZ spot icon for every public route chapter', () => {
    expect(
      STORY_CHAPTERS.filter((chapter) => chapter.iconKey).map(({ id, iconKey }) => ({ id, iconKey })),
    ).toEqual([
      { id: 'works', iconKey: 'works' },
      { id: 'projects', iconKey: 'openSource' },
      { id: 'observe', iconKey: 'bookmarks' },
      { id: 'notes', iconKey: 'notes' },
      { id: 'end', iconKey: 'about' },
    ]);
  });

  it('connects the four content chapters to their public pages', () => {
    expect(
      STORY_CHAPTERS.filter((chapter) => ['works', 'projects', 'observe', 'notes'].includes(chapter.id))
        .map(({ id, href }) => ({ id, href })),
    ).toEqual([
      { id: 'works', href: '/works/' },
      { id: 'projects', href: '/open-source/' },
      { id: 'observe', href: '/bookmarks/' },
      { id: 'notes', href: '/notes/' },
    ]);
  });
});
