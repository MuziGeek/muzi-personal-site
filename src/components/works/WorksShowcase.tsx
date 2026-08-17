import { useEffect, useRef, useState } from 'react';
import ProjectPreview from './ProjectPreview';
import type { ProjectPosterKey } from './ProjectPoster';
import { getProjectCardRoll, PROJECT_CARD_ROLL } from './projectCardMotion';
import { updateVisibleProjectIds } from './projectPreviewMotion';

export interface WorksProject {
  id: string;
  title: string;
  summary: string;
  projectUrl: string;
  linkLabel: string;
  posterKey: ProjectPosterKey;
  previewAlt: string;
}

interface WorksShowcaseProps {
  projects: WorksProject[];
  variant?: 'archive' | 'featured';
}

interface GsapMatchMediaContext {
  conditions?: Record<string, boolean>;
}

interface GsapMatchMedia {
  add(
    conditions: Record<string, string>,
    callback: (context: GsapMatchMediaContext) => void | (() => void),
  ): unknown;
  revert(): void;
}

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectCard({ project, index, active }: { project: WorksProject; index: number; active: boolean }) {
  const titleId = `project-title-${project.id}`;
  const reverse = index % 2 === 1;

  return (
    <div
      className={`works-card-hitbox${reverse ? ' works-card-hitbox--reverse' : ''}${active ? ' is-active' : ''}`}
      data-project-id={project.id}
    >
      <div className="works-card__reveal">
        <article className="works-card" aria-labelledby={titleId}>
          <span className="works-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className="works-card__preview">
            <ProjectPreview posterKey={project.posterKey} active={active} previewAlt={project.previewAlt} />
          </div>
          <div className="works-card__content">
            <h2 id={titleId}>
              {project.posterKey === 'munan-gallery' && (
                <img className="works-card__brand-mark" src="/images/works/munan-picture/munan-knit-leaf.svg" alt="" />
              )}
              <a className="works-card__title-link" href={project.projectUrl} target="_blank" rel="noreferrer noopener">
                {project.title}
              </a>
            </h2>
            <p>{project.summary}</p>
            <a className="works-card__cta" href={project.projectUrl} target="_blank" rel="noreferrer noopener">
              {project.linkLabel}
              <ExternalArrow />
              <span className="sr-only">（在新标签页打开）</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function WorksShowcase({ projects, variant = 'archive' }: WorksShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const hitboxes = Array.from(root.querySelectorAll<HTMLElement>('[data-project-id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((current) => updateVisibleProjectIds(current, entries.map((entry) => ({
          id: (entry.target as HTMLElement).dataset.projectId ?? '',
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
        })).filter(({ id }) => Boolean(id))));
      },
      { rootMargin: '-8% 0px -12%', threshold: [0, 0.25, 0.5, 0.72] },
    );
    hitboxes.forEach((hitbox) => observer.observe(hitbox));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let context: { revert: () => void } | undefined;
    let media: GsapMatchMedia | undefined;
    let cancelled = false;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !rootRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      const root = rootRef.current;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const reveals = gsap.utils.toArray<HTMLElement>('.works-card__reveal', root);
      const hitboxes = gsap.utils.toArray<HTMLElement>('.works-card-hitbox', root);

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        if (reducedMotion) {
          gsap.set(reveals, { autoAlpha: 1, y: 0 });
        } else {
          gsap.set(reveals, { autoAlpha: 0, y: 24 });
          ScrollTrigger.batch(reveals, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: batch.length > 1 ? 0.11 : 0,
                ease: 'power3.out',
                overwrite: true,
              });
            },
          });
        }

        media = gsap.matchMedia() as GsapMatchMedia;
        media.add(
          {
            desktop: '(min-width: 56rem)',
            finePointer: '(hover: hover) and (pointer: fine)',
            motion: '(prefers-reduced-motion: no-preference)',
          },
          (matchContext) => {
            const conditions = matchContext.conditions;
            if (!conditions?.desktop || !conditions.finePointer || !conditions.motion) return;

            hitboxes.forEach((hitbox) => {
              gsap.set(hitbox, { transformPerspective: PROJECT_CARD_ROLL.perspective });
              ScrollTrigger.create({
                trigger: hitbox,
                start: 'top bottom',
                end: 'bottom top',
                scrub: PROJECT_CARD_ROLL.scrub,
                onUpdate: ({ progress }) => {
                  const roll = getProjectCardRoll(progress);
                  gsap.set(hitbox, {
                    rotationX: roll.rotateX,
                    y: roll.translateY,
                    opacity: roll.opacity,
                    transformOrigin: `50% ${roll.originY}%`,
                  });
                },
              });
            });

            return () => gsap.set(hitboxes, { clearProps: 'transform,transformOrigin,opacity' });
          },
        );
      }, root);
    });

    return () => {
      cancelled = true;
      media?.revert();
      context?.revert();
    };
  }, []);

  return (
    <div className={`works-showcase works-showcase--${variant}`} ref={rootRef}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} active={visibleIds.has(project.id)} />
      ))}
    </div>
  );
}
