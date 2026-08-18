import type { MzSpotIconKey } from '../../lib/mz-icons';

export type StoryAlignment = 'left' | 'right';

export type StoryLayer = 'intro' | 'main' | 'outro';

export interface StoryChapter {
  id: string;
  title: string;
  copy: string;
  startTime: number;
  endTime: number;
  alignment: StoryAlignment;
  iconKey?: MzSpotIconKey;
  href?: string;
  linkLabel?: string;
}

export const MAIN_VIDEO_DURATION = 18;
export const INTRO_EXIT_PROGRESS = 0.005;
export const MAIN_END_HOLD_PROGRESS = 0.975;
export const OUTRO_ENTRY_PROGRESS = 0.995;

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'home',
    title: '你好，我是 Muzi。',
    copy: '这里收集作品、笔记，以及持续发生的创作。',
    startTime: 0,
    endTime: 1.5,
    alignment: 'left',
    iconKey: 'about',
    href: '/about/',
    linkLabel: '认识 Muzi',
  },
  {
    id: 'hello',
    title: '很高兴遇见你。',
    copy: '继续往下，看看我正在做的事情。',
    startTime: 1.5,
    endTime: 3.75,
    alignment: 'right',
  },
  {
    id: 'works',
    title: '先看作品。',
    copy: '这里放着一些正在生长的项目与实践。',
    startTime: 3.75,
    endTime: 5.75,
    alignment: 'left',
    iconKey: 'works',
    href: '/works/',
    linkLabel: '查看 Works',
  },
  {
    id: 'projects',
    title: '把想法摊开来看。',
    copy: '公开的 Skills、工具与开源实践，都在这里继续生长。',
    startTime: 5.75,
    endTime: 8.75,
    alignment: 'right',
    iconKey: 'openSource',
    href: '/open-source/',
    linkLabel: '查看 Open Source',
  },
  {
    id: 'observe',
    title: '观察，收集，再出发。',
    copy: '收藏值得反复回看的工具、项目与网站。',
    startTime: 8.75,
    endTime: 12.25,
    alignment: 'left',
    iconKey: 'bookmarks',
    href: '/bookmarks/',
    linkLabel: '浏览 Bookmarks',
  },
  {
    id: 'notes',
    title: '把思考留下来。',
    copy: '记录日常、学习，以及那些还没想完的问题。',
    startTime: 12.25,
    endTime: 15.5,
    alignment: 'right',
    iconKey: 'notes',
    href: '/notes/',
    linkLabel: '阅读 Notes',
  },
  {
    id: 'end',
    title: '谢谢你读到这里。',
    copy: '这本个人手册，会在下一次创作发生时继续更新。',
    startTime: 15.5,
    endTime: MAIN_VIDEO_DURATION,
    alignment: 'left',
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function getStoryScrollProgress({
  scrollY,
  storyTop,
  storyHeight,
  viewportHeight,
}: {
  scrollY: number;
  storyTop: number;
  storyHeight: number;
  viewportHeight: number;
}) {
  if (![scrollY, storyTop, storyHeight, viewportHeight].every(Number.isFinite)) return 0;

  const scrollableDistance = Math.max(0, storyHeight - viewportHeight);
  if (scrollableDistance === 0) return 0;

  return clamp((scrollY - storyTop) / scrollableDistance, 0, 1);
}

export function progressToTime(progress: number, duration = MAIN_VIDEO_DURATION) {
  const normalizedProgress = clamp(progress, 0, MAIN_END_HOLD_PROGRESS) / MAIN_END_HOLD_PROGRESS;
  return normalizedProgress * duration;
}

export function getStoryLayer(progress: number): StoryLayer {
  const normalizedProgress = clamp(progress, 0, 1);
  if (normalizedProgress <= INTRO_EXIT_PROGRESS) return 'intro';
  if (normalizedProgress >= OUTRO_ENTRY_PROGRESS) return 'outro';
  return 'main';
}

export function getChapterIndex(time: number, chapters = STORY_CHAPTERS) {
  const normalizedTime = clamp(time, 0, MAIN_VIDEO_DURATION);
  const index = chapters.findIndex(
    (chapter, chapterIndex) =>
      normalizedTime >= chapter.startTime &&
      (normalizedTime < chapter.endTime || chapterIndex === chapters.length - 1),
  );

  return index === -1 ? chapters.length - 1 : index;
}
