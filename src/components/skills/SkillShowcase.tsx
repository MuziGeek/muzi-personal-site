import { useEffect, useRef } from 'react';
import type { ProjectPosterKey } from '../works/ProjectPoster';
import { getSkillCardRoll, getSkillCardSpotlight, SKILL_CARD_MOTION } from './skillCardMotion';

export interface SkillProject {
  id: string;
  title: string;
  summary: string;
  repoUrl: string;
  linkLabel: string;
  posterKey: ProjectPosterKey;
  previewAlt: string;
  starCount: number | null;
}

interface SkillShowcaseProps {
  skills: SkillProject[];
}

const SKILL_ART: Partial<Record<ProjectPosterKey, { src: string; width: number; height: number }>> = {
  'mz-icon-design': { src: '/images/skills/mz-icon-design-cutout.webp', width: 1024, height: 1024 },
  'mz-crayon-illustrations': { src: '/images/skills/mz-crayon-illustrations-cutout.webp', width: 1024, height: 1024 },
  'mz-minimal-zine': { src: '/images/skills/mz-minimal-zine-cutout.webp', width: 1024, height: 1024 },
  'build-personal-story-site': { src: '/images/skills/build-personal-story-site-cutout.webp', width: 1024, height: 1024 },
};

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubStar({ count }: { count: number | null }) {
  if (count === null || count <= 0) return null;
  const label = `${count} GitHub Stars`;

  return (
    <span className="skill-card__stars" aria-label={label}>
      <svg className="skill-card__star-icon" viewBox="-4 -4 26 26" aria-hidden="true">
        <path className="skill-card__star-shadow" d="M9.1 1.6 11.2 6.1l5 .7-3.7 3.5 1 5-4.4-2.5-4.5 2.4 1-4.9-3.8-3.5 5.1-.6 2.2-4.6Z" />
        <path className="skill-card__star-core" d="M9.1 1.6 11.2 6.1l5 .7-3.7 3.5 1 5-4.4-2.5-4.5 2.4 1-4.9-3.8-3.5 5.1-.6 2.2-4.6Z" />
      </svg>
      <span>{count ?? '—'}</span>
    </span>
  );
}

export default function SkillShowcase({ skills }: SkillShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-skill-card]'));
    const cleanups: Array<() => void> = [];
    let cancelled = false;
    let revertRollMedia: (() => void) | undefined;

    cards.forEach((card) => {
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;

      const resetSpotlight = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        card.style.setProperty('--skill-spot-x', '50%');
        card.style.setProperty('--skill-spot-y', '50%');
      };

      const renderSpotlight = () => {
        frame = 0;
        const spotlight = getSkillCardSpotlight(card.getBoundingClientRect(), pointerX, pointerY);
        card.style.setProperty('--skill-spot-x', `${spotlight.x.toFixed(2)}%`);
        card.style.setProperty('--skill-spot-y', `${spotlight.y.toFixed(2)}%`);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!finePointer.matches || reducedMotion.matches) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(renderSpotlight);
      };

      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', resetSpotlight);
      card.addEventListener('pointercancel', resetSpotlight);
      window.addEventListener('blur', resetSpotlight);
      finePointer.addEventListener('change', resetSpotlight);
      reducedMotion.addEventListener('change', resetSpotlight);

      cleanups.push(() => {
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', resetSpotlight);
        card.removeEventListener('pointercancel', resetSpotlight);
        window.removeEventListener('blur', resetSpotlight);
        finePointer.removeEventListener('change', resetSpotlight);
        reducedMotion.removeEventListener('change', resetSpotlight);
        resetSpotlight();
      });
    });

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();
      revertRollMedia = () => media.revert();
      media.add(
        {
          canRoll: '(min-width: 48rem) and (hover: hover) and (pointer: fine)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { canRoll, reduceMotion } = context.conditions as { canRoll: boolean; reduceMotion: boolean };
          if (!canRoll || reduceMotion) return;

          const triggers = cards.map((card) => {
            gsap.set(card, {
              transformPerspective: SKILL_CARD_MOTION.perspective,
              transformOrigin: '50% 96%',
              backfaceVisibility: 'hidden',
            });

            return ScrollTrigger.create({
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: SKILL_CARD_MOTION.rollScrub,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                const roll = getSkillCardRoll(progress);
                gsap.set(card, { rotationX: roll.rotationX, y: roll.y, opacity: roll.opacity });
              },
            });
          });

          return () => {
            triggers.forEach((trigger) => trigger.kill());
            gsap.set(cards, { clearProps: 'transform,opacity,transformOrigin,backfaceVisibility' });
          };
        },
      );
      ScrollTrigger.refresh();
    }).catch(() => undefined);

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
      revertRollMedia?.();
    };
  }, []);

  return (
    <div className="skill-showcase" ref={rootRef}>
      {skills.map((skill, index) => {
        const artwork = SKILL_ART[skill.posterKey];
        if (!artwork) return null;
        const descriptionId = `skill-preview-${index}`;

        return (
          <a
            key={skill.id}
            className="skill-card"
            href={skill.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            data-skill-card
            aria-describedby={descriptionId}
          >
            <span className="skill-card__surface" data-skill-surface>
              <span className="skill-card__spotlight" aria-hidden="true" />
              <span className="skill-card__copy">
                <span className="skill-card__heading">
                  <strong>{skill.title}</strong>
                  <GitHubStar count={skill.starCount} />
                  <span className="skill-card__arrow" aria-hidden="true"><ExternalArrow /></span>
                </span>
                <span className="skill-card__summary">{skill.summary}</span>
              </span>
              <span className="skill-card__art" data-skill-art aria-hidden="true">
                <img src={artwork.src} width={artwork.width} height={artwork.height} alt="" loading="lazy" decoding="async" draggable={false} />
              </span>
              <span id={descriptionId} className="sr-only">{skill.previewAlt} {skill.linkLabel}，在新标签页打开。</span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
