import {
  ArrowRightIcon,
  BookOpenTextIcon,
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  TelevisionSimpleIcon,
  TiktokLogoIcon,
  XLogoIcon,
} from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { ABOUT_CONTACTS, getAboutContactLinkAttributes, type AboutContactIcon } from './aboutContactData';

const CONTACT_ICONS = {
  github: GithubLogoIcon,
  x: XLogoIcon,
  email: EnvelopeSimpleIcon,
  bilibili: TelevisionSimpleIcon,
  xiaohongshu: BookOpenTextIcon,
  douyin: TiktokLogoIcon,
} satisfies Record<AboutContactIcon, typeof GithubLogoIcon>;

export default function AboutContacts() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-contact-row]'));
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (reducedMotion.matches) {
        gsap.set(rows, { autoAlpha: 1, y: 0 });
        cleanup = () => gsap.set(rows, { clearProps: 'opacity,visibility,transform' });
        return;
      }

      gsap.set(rows, { autoAlpha: 0, y: 16 });
      const batch = ScrollTrigger.batch(rows, {
        start: 'top 92%',
        once: true,
        onEnter: (items) => gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: items.length > 1 ? 0.07 : 0,
          ease: 'power3.out',
          overwrite: true,
        }),
      });

      cleanup = () => {
        batch.forEach((trigger) => trigger.kill());
        gsap.set(rows, { clearProps: 'opacity,visibility,transform' });
      };
      ScrollTrigger.refresh();
    }).catch(() => undefined);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="about-contacts__list" ref={rootRef}>
      {ABOUT_CONTACTS.map((contact) => {
        const Icon = CONTACT_ICONS[contact.iconKey];
        const linkAttributes = getAboutContactLinkAttributes(contact);
        const accessibleLabel = contact.external
          ? `${contact.platform}，${contact.value}，在新标签页打开`
          : `发送邮件至 ${contact.value}`;

        return (
          <a
            className={`about-contact about-contact--${contact.iconKey}`}
            data-contact-row
            href={contact.href}
            {...linkAttributes}
            aria-label={accessibleLabel}
            key={contact.id}
          >
            <span className="about-contact__icon" aria-hidden="true">
              <Icon size={19} weight="bold" />
            </span>
            <span className="about-contact__index" aria-hidden="true">{contact.id}</span>
            <strong className="about-contact__name">{contact.platform}</strong>
            <span className="about-contact__value">{contact.value}</span>
            <span className="about-contact__arrow" aria-hidden="true">
              <ArrowRightIcon size={20} weight="bold" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
