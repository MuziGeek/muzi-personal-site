import { useEffect, useRef } from 'react';

export default function YarnCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cursor = cursorRef.current;
    if (!finePointer.matches || reducedMotion.matches || !cursor) return;

    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    let frame = 0;
    let active = false;
    const place = (x: number, y: number) => cursor.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`);
    const deactivate = () => {
      active = false;
      delete document.documentElement.dataset.yarnCursor;
      cursor.removeAttribute('data-active');
    };
    const render = () => {
      position.x += (target.x - position.x) * 0.24;
      position.y += (target.y - position.y) * 0.24;
      if (active) place(position.x, position.y);
      frame = window.requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!active) {
        position.x = target.x;
        position.y = target.y;
        place(position.x, position.y);
        active = true;
        cursor.setAttribute('data-active', 'true');
        document.documentElement.dataset.yarnCursor = 'active';
      }
    };
    const onDown = () => cursor.setAttribute('data-pressed', 'true');
    const onUp = () => cursor.removeAttribute('data-pressed');
    const onOver = (event: PointerEvent) => {
      const interactive = (event.target as Element | null)?.closest('a, button, [data-cursor-interactive]');
      cursor.toggleAttribute('data-interactive', Boolean(interactive));
    };
    const onVisibility = () => { if (document.hidden) deactivate(); };
    const onMediaChange = () => { if (!finePointer.matches || reducedMotion.matches) deactivate(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', deactivate, { passive: true });
    window.addEventListener('blur', deactivate);
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    finePointer.addEventListener('change', onMediaChange);
    reducedMotion.addEventListener('change', onMediaChange);
    frame = window.requestAnimationFrame(render);
    return () => {
      deactivate();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', deactivate);
      window.removeEventListener('blur', deactivate);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('visibilitychange', onVisibility);
      finePointer.removeEventListener('change', onMediaChange);
      reducedMotion.removeEventListener('change', onMediaChange);
    };
  }, []);

  return <div ref={cursorRef} className="yarn-cursor" aria-hidden="true"><img src="/images/creative-book/yarn-cursor-v2.png" alt="" width="80" height="62" /></div>;
}
