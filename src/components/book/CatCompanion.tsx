import { useEffect, useRef } from 'react';
import { clampTracking } from './bookMachine';
import type { BookDirection, CatMode } from './types';

interface Props {
  mode: CatMode;
  direction: BookDirection | null;
}

export default function CatCompanion({ mode, direction }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLImageElement>(null);
  const headRef = useRef<HTMLImageElement>(null);
  const pupilsRef = useRef<HTMLImageElement>(null);
  const tailRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let frame = 0;
    const update = () => {
      const root = rootRef.current;
      if (root && (mode === 'idle' || mode === 'tracking' || mode === 'settle')) {
        const bounds = root.getBoundingClientRect();
        const dx = clampTracking((pointer.x - (bounds.left + bounds.width / 2)) / Math.max(bounds.width, 1), 1);
        const dy = clampTracking((pointer.y - (bounds.top + bounds.height * 0.28)) / Math.max(bounds.height, 1), 1);
        const turn = clampTracking(dx * 12, 12);
        const nod = clampTracking(dy * 6, 6);
        bodyRef.current?.style.setProperty('transform', `translate3d(${dx * 3}px, ${dy * 2}px, 0) rotate(${clampTracking(dx * 3, 3)}deg)`);
        headRef.current?.style.setProperty('transform', `translate3d(${dx * 5}px, ${nod * .7}px, 0) rotate(${turn}deg)`);
        pupilsRef.current?.style.setProperty('transform', `translate3d(${dx * 7}px, ${nod}px, 0)`);
        tailRef.current?.style.setProperty('transform', `rotate(${clampTracking(-dx * 10, 10)}deg)`);
      }
      frame = window.requestAnimationFrame(update);
    };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [mode]);

  return (
    <div ref={rootRef} className="cat-companion" data-mode={mode} data-direction={direction ?? undefined} aria-hidden="true">
      <div className="cat-companion__idle">
        <img className="cat-companion__shadow" src="/images/creative-book/cat-shadow.svg" alt="" />
        <img ref={tailRef} className="cat-companion__tail" src="/images/creative-book/cat-idle-tail-v2.png" alt="" />
        <img ref={bodyRef} className="cat-companion__body" src="/images/creative-book/cat-idle-body-v2.png" alt="" />
        <img ref={headRef} className="cat-companion__head" src="/images/creative-book/cat-idle-head-v2.png" alt="" />
        <img ref={pupilsRef} className="cat-companion__pupils" src="/images/creative-book/cat-pupils.svg" alt="" />
      </div>
      <div className="cat-companion__runner"><span /></div>
    </div>
  );
}
