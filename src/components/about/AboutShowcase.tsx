import { ArrowLeftIcon, ArrowUpRightIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ABOUT_SECTIONS, type AboutSection } from './aboutContent';
import { ABOUT_CARD_MOTION, getAboutCardRoll, getAboutSpotlight } from './aboutMotion';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function AboutDialog({ section, onClose }: { section: AboutSection; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="about-dialog__backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="about-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`about-dialog-title-${section.id}`}
        aria-describedby={`about-dialog-intro-${section.id}`}
        onKeyDown={onKeyDown}
      >
        <header className="about-dialog__header">
          <div>
            <span className="about-dialog__eyebrow">{section.eyebrow}</span>
            <h2 id={`about-dialog-title-${section.id}`}>{section.title}</h2>
          </div>
          <button ref={closeRef} className="about-dialog__close" type="button" onClick={onClose} aria-label="关闭详情弹窗">
            <XIcon size={22} weight="bold" aria-hidden="true" />
          </button>
        </header>

        <div className="about-dialog__body">
          <div className="about-dialog__copy">
            <p id={`about-dialog-intro-${section.id}`} className="about-dialog__lead">{section.dialogIntro}</p>
            {section.dialogBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ul className="about-dialog__highlights" aria-label="本节要点">
              {section.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
          <figure className="about-dialog__art">
            <img src={section.artSrc} alt={section.artAlt} />
          </figure>
        </div>

        <footer className="about-dialog__footer">
          <button className="about-dialog__secondary" type="button" onClick={onClose}>
            <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
            关闭
          </button>
          <a className="about-dialog__primary" href={section.primaryHref}>
            {section.primaryLabel}
            <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  );
}

export default function AboutShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState<AboutSection | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-about-card]'));
    const cleanupSpotlights: Array<() => void> = [];
    let cancelled = false;
    let revertMedia: (() => void) | undefined;

    cards.forEach((card) => {
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;

      const reset = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        card.style.setProperty('--about-spot-x', '50%');
        card.style.setProperty('--about-spot-y', '50%');
      };

      const render = () => {
        frame = 0;
        const spotlight = getAboutSpotlight(card.getBoundingClientRect(), pointerX, pointerY);
        card.style.setProperty('--about-spot-x', `${spotlight.x.toFixed(2)}%`);
        card.style.setProperty('--about-spot-y', `${spotlight.y.toFixed(2)}%`);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!finePointer.matches || reducedMotion.matches) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      };

      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', reset);
      card.addEventListener('pointercancel', reset);
      window.addEventListener('blur', reset);
      cleanupSpotlights.push(() => {
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', reset);
        card.removeEventListener('pointercancel', reset);
        window.removeEventListener('blur', reset);
        reset();
      });
    });

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !rootRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const reveals = gsap.utils.toArray<HTMLElement>('.about-card__reveal', root);
      if (reducedMotion.matches) {
        gsap.set(reveals, { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(reveals, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(reveals, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: batch.length > 1 ? 0.11 : 0,
            ease: 'power3.out',
            overwrite: true,
          }),
        });
      }

      const media = gsap.matchMedia();
      revertMedia = () => media.revert();
      media.add(
        {
          desktop: '(min-width: 56rem)',
          finePointer: '(hover: hover) and (pointer: fine)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const conditions = context.conditions as Record<string, boolean>;
          if (!conditions.desktop || !conditions.finePointer || !conditions.motion) return;

          const triggers = cards.map((card) => {
            gsap.set(card, { transformPerspective: ABOUT_CARD_MOTION.perspective, backfaceVisibility: 'hidden' });
            return ScrollTrigger.create({
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: ABOUT_CARD_MOTION.scrub,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                const roll = getAboutCardRoll(progress);
                gsap.set(card, {
                  rotationX: roll.rotateX,
                  y: roll.translateY,
                  opacity: roll.opacity,
                  transformOrigin: `50% ${roll.originY}%`,
                });
              },
            });
          });

          return () => {
            triggers.forEach((trigger) => trigger.kill());
            gsap.set(cards, { clearProps: 'transform,transformOrigin,opacity,backfaceVisibility' });
          };
        },
      );
      ScrollTrigger.refresh();
    }).catch(() => undefined);

    return () => {
      cancelled = true;
      cleanupSpotlights.forEach((cleanup) => cleanup());
      revertMedia?.();
    };
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    const previousOverflow = document.body.style.overflow;
    const inertSiblings = Array.from(document.body.children).filter(
      (element) => !element.classList.contains('about-dialog__backdrop'),
    );
    const previouslyInert = inertSiblings.map((element) => element.hasAttribute('inert'));
    document.body.style.overflow = 'hidden';
    inertSiblings.forEach((element) => element.setAttribute('inert', ''));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSection(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      inertSiblings.forEach((element, index) => {
        if (!previouslyInert[index]) element.removeAttribute('inert');
      });
      window.removeEventListener('keydown', onKeyDown);
      requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [activeSection]);

  const openSection = (section: AboutSection, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setActiveSection(section);
  };

  return (
    <div className="about-showcase" ref={rootRef}>
      {ABOUT_SECTIONS.map((section) => (
        <div className="about-card-hitbox" data-about-card key={section.id}>
          <div className="about-card__reveal">
            <button
              className="about-card"
              type="button"
              aria-haspopup="dialog"
              aria-label={`${section.title}。${section.summary}打开详情`}
              onClick={(event) => openSection(section, event.currentTarget)}
            >
              <span className="about-card__spotlight" aria-hidden="true" />
              <span className="about-card__number" aria-hidden="true">{section.number}</span>
              <span className="about-card__copy">
                <span className="about-card__eyebrow">{section.eyebrow}</span>
                <strong className="about-card__title">{section.title}</strong>
                <span className="about-card__summary">{section.summary}</span>
                <span className="about-card__meta">{section.meta}</span>
              </span>
              <span className="about-card__art" aria-hidden="true">
                <img src={section.artSrc} alt="" loading="lazy" decoding="async" draggable={false} />
              </span>
              <span className="about-card__open" aria-hidden="true">
                <ArrowUpRightIcon size={18} weight="bold" />
              </span>
            </button>
          </div>
        </div>
      ))}
      {activeSection && typeof document !== 'undefined' && createPortal(
        <AboutDialog section={activeSection} onClose={() => setActiveSection(null)} />,
        document.body,
      )}
    </div>
  );
}
