export const MZ_SPOT_ICONS = {
  about: {
    src: '/images/sections/about.webp',
    width: 256,
    height: 256,
  },
  works: {
    src: '/images/sections/works.webp',
    width: 256,
    height: 256,
  },
  openSource: {
    src: '/images/sections/open-source.webp?v=2',
    width: 256,
    height: 256,
  },
  bookmarks: {
    src: '/images/sections/bookmarks.webp?v=2',
    width: 256,
    height: 256,
  },
  notes: {
    src: '/images/sections/notes.webp',
    width: 256,
    height: 256,
  },
} as const;

export type MzSpotIconKey = keyof typeof MZ_SPOT_ICONS;

export function getMzSpotIcon(key: MzSpotIconKey) {
  return MZ_SPOT_ICONS[key];
}
