import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sharedSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(true),
});

const posterKeySchema = z.enum([
  'munan-gallery',
  'mz-icon-design',
  'mz-crayon-illustrations',
  'mz-minimal-zine',
]);

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    draft: z.boolean().default(true),
    order: z.number().int().nonnegative().default(0),
    projectUrl: z.url().optional(),
    linkLabel: z.string().min(1).optional(),
    posterKey: posterKeySchema.optional(),
    previewAlt: z.string().min(1).optional(),
    externalOnly: z.boolean().default(true),
  }).superRefine((data, context) => {
    if (data.draft) return;

    if (!data.projectUrl) {
      context.addIssue({ code: 'custom', path: ['projectUrl'], message: '公开作品必须提供真实产品地址。' });
    }
    if (!data.posterKey) {
      context.addIssue({ code: 'custom', path: ['posterKey'], message: '公开作品必须提供项目海报。' });
    }
    if (!data.previewAlt) {
      context.addIssue({ code: 'custom', path: ['previewAlt'], message: '公开作品必须描述项目海报。' });
    }
  }),
});

const openSource = defineCollection({
  loader: glob({ base: './src/content/open-source', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    kind: z.enum(['skill', 'open-source']),
    repoUrl: z.url(),
    linkLabel: z.string().min(1).default('查看 GitHub'),
    order: z.number().int().nonnegative().default(0),
    posterKey: posterKeySchema,
    previewAlt: z.string().min(1),
    draft: z.boolean().default(true),
  }),
});

const bookmarks = defineCollection({
  loader: glob({ base: './src/content/bookmarks', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1).optional(),
    url: z.url(),
    order: z.number().int().nonnegative().default(0),
    draft: z.boolean().default(true),
  }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: sharedSchema.extend({
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { works, openSource, bookmarks, notes };
