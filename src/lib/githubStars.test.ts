import { describe, expect, it, vi } from 'vitest';
import { getGitHubStarCounts, parseGitHubRepository } from './githubStars';

const repoUrl = 'https://github.com/MuziGeek/mz-icon-design';

describe('GitHub Stars', () => {
  it('parses a public GitHub repository URL', () => {
    expect(parseGitHubRepository(`${repoUrl}.git`)).toEqual({
      owner: 'MuziGeek',
      repo: 'mz-icon-design',
      slug: 'MuziGeek/mz-icon-design',
    });
    expect(parseGitHubRepository('https://example.com/repository')).toBeNull();
  });

  it('uses a successful GitHub response', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ stargazers_count: 12 }), { status: 200 }));
    const result = await getGitHubStarCounts([repoUrl], { fetchImpl, fallback: {} });

    expect(result[repoUrl]).toBe(12);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('preserves a real zero star count', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ stargazers_count: 0 }), { status: 200 }));
    const result = await getGitHubStarCounts([repoUrl], { fetchImpl, fallback: { 'MuziGeek/mz-icon-design': 7 } });

    expect(result[repoUrl]).toBe(0);
  });

  it('falls back when GitHub is unavailable or rate limited', async () => {
    const fallback = { 'MuziGeek/mz-icon-design': 5 };
    const unavailable = vi.fn(async () => { throw new Error('offline'); });
    const rateLimited = vi.fn(async () => new Response(null, { status: 403 }));

    await expect(getGitHubStarCounts([repoUrl], { fetchImpl: unavailable, fallback })).resolves.toEqual({ [repoUrl]: 5 });
    await expect(getGitHubStarCounts([repoUrl], { fetchImpl: rateLimited, fallback })).resolves.toEqual({ [repoUrl]: 5 });
  });

  it('aborts a slow request and uses the cached count', async () => {
    const slowRequest = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    }));

    await expect(getGitHubStarCounts([repoUrl], {
      fetchImpl: slowRequest,
      fallback: { 'MuziGeek/mz-icon-design': 4 },
      timeoutMs: 5,
    })).resolves.toEqual({ [repoUrl]: 4 });
  });
});
