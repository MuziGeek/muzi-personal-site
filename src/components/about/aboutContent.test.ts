import { describe, expect, it } from 'vitest';
import { ABOUT_SECTIONS } from './aboutContent';

describe('about chapter content', () => {
  it('keeps the three public chapters complete and unique', () => {
    expect(ABOUT_SECTIONS).toHaveLength(3);
    expect(ABOUT_SECTIONS.map(({ id }) => id)).toEqual(['identity', 'making', 'method']);
    expect(new Set(ABOUT_SECTIONS.map(({ number }) => number)).size).toBe(3);
  });

  it('provides an image, dialog copy, and destination for every chapter', () => {
    ABOUT_SECTIONS.forEach((section) => {
      expect(section.artSrc).toMatch(/^\/images\/about\/.+\.webp$/);
      expect(section.artAlt.length).toBeGreaterThan(8);
      expect(section.dialogBody.length).toBeGreaterThanOrEqual(2);
      expect(section.primaryHref).toMatch(/^\//);
    });
  });
});
