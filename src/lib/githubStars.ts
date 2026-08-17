import starCache from '../data/github-stars.json';

export interface GitHubRepository {
  owner: string;
  repo: string;
  slug: string;
}

export interface GitHubStarsOptions {
  fetchImpl?: typeof fetch;
  fallback?: Record<string, number>;
  timeoutMs?: number;
  token?: string;
}

type GitHubRepositoryResponse = {
  stargazers_count?: unknown;
};

export function parseGitHubRepository(repoUrl: string): GitHubRepository | null {
  try {
    const url = new URL(repoUrl);
    if (url.protocol !== 'https:' || !['github.com', 'www.github.com'].includes(url.hostname.toLowerCase())) {
      return null;
    }

    const [owner, rawRepo] = url.pathname.split('/').filter(Boolean);
    const repo = rawRepo?.replace(/\.git$/i, '');
    if (!owner || !repo) return null;

    return { owner, repo, slug: `${owner}/${repo}` };
  } catch {
    return null;
  }
}

function getFallbackCount(slug: string, fallback: Record<string, number>) {
  const count = fallback[slug];
  return Number.isInteger(count) && count >= 0 ? count : null;
}

async function fetchStarCount(
  repository: GitHubRepository,
  options: Required<Pick<GitHubStarsOptions, 'fetchImpl' | 'fallback' | 'timeoutMs'>> & Pick<GitHubStarsOptions, 'token'>,
) {
  const fallbackCount = getFallbackCount(repository.slug, options.fallback);
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'muzi-personal-site-build',
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await options.fetchImpl(
      `https://api.github.com/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.repo)}`,
      { headers, signal: controller.signal },
    );
    if (!response.ok) return fallbackCount;

    const data = await response.json() as GitHubRepositoryResponse;
    return Number.isInteger(data.stargazers_count) && Number(data.stargazers_count) >= 0
      ? Number(data.stargazers_count)
      : fallbackCount;
  } catch {
    return fallbackCount;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getGitHubStarCounts(repoUrls: string[], options: GitHubStarsOptions = {}) {
  const fallback = options.fallback ?? starCache.repositories;
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 4_000;
  const repositories = new Map<string, GitHubRepository>();

  repoUrls.forEach((repoUrl) => {
    const repository = parseGitHubRepository(repoUrl);
    if (repository) repositories.set(repository.slug, repository);
  });

  const countsBySlug = new Map(
    await Promise.all(
      Array.from(repositories.values(), async (repository) => [
        repository.slug,
        await fetchStarCount(repository, { fetchImpl, fallback, timeoutMs, token: options.token }),
      ] as const),
    ),
  );

  return Object.fromEntries(repoUrls.map((repoUrl) => {
    const repository = parseGitHubRepository(repoUrl);
    return [repoUrl, repository ? (countsBySlug.get(repository.slug) ?? null) : null];
  })) as Record<string, number | null>;
}
