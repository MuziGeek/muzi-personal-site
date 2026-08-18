import { describe, expect, it } from 'vitest';
import {
  getChapterIndex,
  getStoryScrollProgress,
  getStoryLayer,
  MAIN_END_HOLD_PROGRESS,
  MAIN_VIDEO_DURATION,
  OUTRO_ENTRY_PROGRESS,
  progressToTime,
  STORY_CHAPTERS,
} from './story';

describe('scrollytelling timeline', () => {
  it('maps the story scroll range to normalized progress', () => {
    const metrics = { storyTop: 100, storyHeight: 7_000, viewportHeight: 1_000 };

    expect(getStoryScrollProgress({ ...metrics, scrollY: 100 })).toBe(0);
    expect(getStoryScrollProgress({ ...metrics, scrollY: 3_100 })).toBe(0.5);
    expect(getStoryScrollProgress({ ...metrics, scrollY: 6_100 })).toBe(1);
  });

  it('clamps restored scroll positions and responds to viewport changes', () => {
    const metrics = { storyTop: 200, storyHeight: 7_000 };

    expect(getStoryScrollProgress({ ...metrics, viewportHeight: 1_000, scrollY: -400 })).toBe(0);
    expect(getStoryScrollProgress({ ...metrics, viewportHeight: 1_000, scrollY: 9_000 })).toBe(1);
    expect(getStoryScrollProgress({ ...metrics, viewportHeight: 1_000, scrollY: 3_200 })).toBe(0.5);
    expect(getStoryScrollProgress({ ...metrics, viewportHeight: 500, scrollY: 3_200 })).toBeCloseTo(3_000 / 6_500);
    expect(getStoryScrollProgress({ storyTop: 0, storyHeight: 800, viewportHeight: 800, scrollY: 200 })).toBe(0);
  });

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
      { id: 'home', iconKey: 'about' },
      { id: 'works', iconKey: 'works' },
      { id: 'projects', iconKey: 'openSource' },
      { id: 'observe', iconKey: 'bookmarks' },
      { id: 'notes', iconKey: 'notes' },
    ]);
  });

  it('introduces the About page in the first chapter instead of the closing chapter', () => {
    expect(STORY_CHAPTERS[0]).toMatchObject({ href: '/about/', linkLabel: '认识 Muzi' });
    expect(STORY_CHAPTERS.at(-1)).not.toHaveProperty('href');
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
