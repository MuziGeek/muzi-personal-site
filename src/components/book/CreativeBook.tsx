import { useCallback, useEffect, useReducer, useRef } from 'react';
import { gsap } from 'gsap';
import '../../styles/creative-book.css';
import CatCompanion from './CatCompanion';
import { bookReducer, initialBookState } from './bookMachine';
import type { BookDirection, BookPage, CreativeBookProps } from './types';
import YarnCursor from './YarnCursor';

const pages: BookPage[] = [
  { id: 'cover', kind: 'cover', title: 'Muzi Creative Book', ariaLabel: '封面' },
  { id: 'contents', kind: 'contents', title: 'Contents', hash: 'contents', ariaLabel: '目录' },
  { id: 'about', kind: 'about', title: 'About', hash: 'about', ariaLabel: '关于 Muzi' },
  { id: 'works', kind: 'works', title: 'Works', hash: 'works', ariaLabel: '作品' },
  { id: 'systems', kind: 'systems', title: 'Design Systems', hash: 'systems', ariaLabel: '设计系统' },
  { id: 'notes', kind: 'notes', title: 'Notes', hash: 'notes', ariaLabel: '笔记' },
  { id: 'back', kind: 'back', title: 'Back Cover', hash: 'back', ariaLabel: '封底' },
];

const hashToIndex = new Map(pages.flatMap((page, index) => (page.hash ? [[page.hash, index] as const] : [])));

export default function CreativeBook({ works, notes }: CreativeBookProps) {
  const [state, dispatch] = useReducer(bookReducer, initialBookState);
  const stateRef = useRef(state);
  const bookRef = useRef<HTMLElement>(null);
  const currentPaperRef = useRef<HTMLElement>(null);
  const catMotionRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const lockedRef = useRef(false);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => {
    const targetIndex = hashToIndex.get(window.location.hash.slice(1));
    if (targetIndex !== undefined) dispatch({ type: 'JUMP', index: targetIndex });
  }, []);
  useEffect(() => () => contextRef.current?.revert(), []);

  const openBook = useCallback(() => {
    if (stateRef.current.phase === 'closed') dispatch({ type: 'OPEN' });
  }, []);

  const completeReducedMotion = useCallback((targetIndex: number, direction: BookDirection) => {
    dispatch({ type: 'BEGIN', targetIndex, direction });
    window.setTimeout(() => {
      dispatch({ type: 'COMMIT' });
      const target = pages[targetIndex];
      window.history.replaceState(null, '', target.hash ? `#${target.hash}` : window.location.pathname);
      window.setTimeout(() => dispatch({ type: 'SETTLE' }), 180);
    }, 1);
  }, []);

  const runTransition = useCallback((targetIndex: number) => {
    const current = stateRef.current;
    if (current.phase !== 'idle' || lockedRef.current || targetIndex === current.currentIndex) return;
    const direction: BookDirection = targetIndex > current.currentIndex ? 'next' : 'prev';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completeReducedMotion(targetIndex, direction);
      return;
    }

    lockedRef.current = true;
    dispatch({ type: 'BEGIN', targetIndex, direction });
    contextRef.current?.revert();
    contextRef.current = gsap.context(() => {
      const paper = currentPaperRef.current;
      const cat = catMotionRef.current;
      if (!paper || !cat) return;
      const travelOut = direction === 'next' ? -43 : 43;
      const travelIn = direction === 'next' ? -34 : 34;
      const turn = direction === 'next' ? -180 : 180;
      gsap.set(paper, { transformPerspective: 2200, transformOrigin: direction === 'next' ? '0% 50%' : '100% 50%', force3D: true });
      gsap.timeline({
        onComplete: () => {
          dispatch({ type: 'SETTLE' });
          lockedRef.current = false;
          gsap.set([paper, cat], { clearProps: 'transform,opacity' });
        },
      })
        .call(() => dispatch({ type: 'SET_CAT', mode: 'crouch' }), [], 0)
        .to(cat, { y: 7, scaleX: 1.06, scaleY: 0.94, duration: 0.18, ease: 'power2.in' }, 0)
        .call(() => dispatch({ type: 'SET_CAT', mode: 'runningOut' }), [], 0.18)
        .to(cat, { x: `${travelOut}vw`, y: -3, scaleX: 1, scaleY: 1, duration: 0.44, ease: 'power2.in' }, 0.18)
        .call(() => dispatch({ type: 'FLIP' }), [], 0.38)
        .to(paper, { rotateY: turn * 0.54, scaleX: 0.975, duration: 0.42, ease: 'power1.in' }, 0.38)
        .to(paper, { rotateY: turn, scaleX: 1, duration: 0.42, ease: 'power2.out' }, 0.8)
        .call(() => dispatch({ type: 'SET_CAT', mode: 'occluded' }), [], 0.58)
        .call(() => {
          dispatch({ type: 'COMMIT' });
          const target = pages[targetIndex];
          window.history.replaceState(null, '', target.hash ? `#${target.hash}` : window.location.pathname);
          gsap.set(cat, { x: `${travelIn}vw`, y: -3, opacity: 0, scaleX: 1, scaleY: 1 });
        }, [], 0.98)
        .call(() => dispatch({ type: 'SET_CAT', mode: 'runningIn' }), [], 1.04)
        .to(cat, { x: 0, y: 0, opacity: 1, duration: 0.48, ease: 'power2.out' }, 1.04)
        .set(paper, { rotateY: 0, opacity: 0 }, 1.32)
        .to(paper, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 1.42)
        .call(() => dispatch({ type: 'SET_CAT', mode: 'landing' }), [], 1.52)
        .to(cat, { y: 3, scaleX: 1.04, scaleY: 0.96, duration: 0.1, ease: 'power1.in' }, 1.52)
        .to(cat, { y: 0, scaleX: 1, scaleY: 1, duration: 0.2, ease: 'back.out(2)' }, 1.62)
        .call(() => dispatch({ type: 'SET_CAT', mode: 'settle' }), [], 1.76);
    }, bookRef);
  }, [completeReducedMotion]);

  useEffect(() => {
    const onHashChange = () => {
      const targetIndex = hashToIndex.get(window.location.hash.slice(1));
      if (targetIndex === undefined || targetIndex === stateRef.current.currentIndex) return;
      if (stateRef.current.phase === 'closed') dispatch({ type: 'JUMP', index: targetIndex });
      else runTransition(targetIndex);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [runTransition]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (stateRef.current.phase === 'closed' && event.key === 'Enter') { event.preventDefault(); openBook(); return; }
      if (stateRef.current.phase !== 'idle') return;
      if (event.key === 'ArrowRight') { event.preventDefault(); runTransition(Math.min(pages.length - 1, stateRef.current.currentIndex + 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); runTransition(Math.max(0, stateRef.current.currentIndex - 1)); }
      if (event.key === 'Escape') { event.preventDefault(); runTransition(1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openBook, runTransition]);

  const currentPage = pages[state.currentIndex];
  const targetPage = pages[state.targetIndex ?? state.currentIndex];
  const previousPage = pages[Math.max(0, state.currentIndex - 1)];
  const isOpen = state.phase !== 'closed';
  const isTurning = ['preparing', 'flipping', 'settling'].includes(state.phase);
  const canGoPrevious = isOpen && state.currentIndex > 0 && state.phase === 'idle';
  const canGoNext = isOpen && state.currentIndex < pages.length - 1 && state.phase === 'idle';

  const entries = (items: CreativeBookProps['works'], empty: string) => items.length ? <ul className="book-page__entries">{items.slice(0, 3).map((entry) => <li key={entry.id}><a href={entry.href}>{entry.title}<span>{entry.summary}</span></a></li>)}</ul> : <p className="book-page__empty">{empty}</p>;

  const contentsControl = (page: BookPage, mobile: boolean) => {
    const label = <><span>{String(pages.indexOf(page) + 1).padStart(2, '0')}</span>{page.title}<i aria-hidden="true">↗</i></>;
    if (mobile) return <a href={`#${page.hash ?? page.id}`}>{label}</a>;
    return <button type="button" onClick={() => runTransition(pages.indexOf(page))} data-cursor-interactive>{label}</button>;
  };

  const renderContents = (page: BookPage, mobile = false) => {
    const headingId = `${mobile ? 'mobile-' : ''}book-heading-${page.id}`;
    const Heading = 'h2';
    return <article className={`book-page book-page--${page.kind}`} aria-labelledby={headingId}>
      <p className="book-page__number" aria-hidden="true">{String(pages.indexOf(page) + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</p>
      {page.kind === 'cover' && <><Heading id={headingId}>Muzi <em>Creative Book</em></Heading><p className="book-page__intro">作品、笔记与仍在发生的创作过程。</p>{!mobile && <button className="book-button" type="button" onClick={openBook} data-cursor-interactive>Open the book <span aria-hidden="true">↗</span></button>}{mobile && <p className="book-page__note">向下翻阅</p>}</>}
      {page.kind === 'contents' && <><Heading id={headingId}>Contents</Heading><ol className="book-contents">{pages.slice(2).map((item) => <li key={item.id}>{contentsControl(item, mobile)}</li>)}</ol></>}
      {page.kind === 'about' && <><Heading id={headingId}>About</Heading><p className="book-page__lead">Hi, I&apos;m Muzi.</p><p>这里记录作品、技术笔记，以及一些个人思考。它像一本持续被补写的创作手册。</p><a className="book-page__link" href="/about/">阅读 About <span aria-hidden="true">→</span></a></>}
      {page.kind === 'works' && <><Heading id={headingId}>Works</Heading><p className="book-page__lead">一些正在生长的项目与实践。</p>{entries(works, '作品正在整理中。')}<a className="book-page__link" href="/works/">查看全部作品 <span aria-hidden="true">→</span></a></>}
      {page.kind === 'systems' && <><Heading id={headingId}>Design Systems</Heading><p className="book-page__lead">让创作可以被持续使用的视觉语言。</p><div className="book-page__scribble" aria-hidden="true"><span>paper</span><span>type</span><span>motion</span></div><p className="book-page__empty">相关内容正在整理中。</p></>}
      {page.kind === 'notes' && <><Heading id={headingId}>Notes</Heading><p className="book-page__lead">把阅读、构建和思考留下来。</p>{entries(notes, '笔记正在整理中。')}<a className="book-page__link" href="/notes/">查看全部笔记 <span aria-hidden="true">→</span></a></>}
      {page.kind === 'back' && <><Heading id={headingId}>Thanks for reading.</Heading><p className="book-page__lead">这本书会在下一次创作发生时继续增加新的页码。</p><nav className="book-page__routes" aria-label="站内内容"><a href="/works/">Works</a><a href="/notes/">Notes</a><a href="/about/">About</a></nav></>}
    </article>;
  };

  const renderVisualPage = (page: BookPage, className: string) => <div className={`book-visual-page ${className} book-visual-page--${page.kind}`} aria-hidden="true"><span>{String(pages.indexOf(page) + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</span><div>{page.kind === 'cover' ? <>Muzi <em>Creative Book</em></> : page.title}</div></div>;

  return <section ref={bookRef} className="creative-book" data-phase={state.phase} aria-label="Muzi Creative Book">
    <h1 className="sr-only">Muzi Creative Book</h1>
    <YarnCursor />
    <p className="sr-only" aria-live="polite">{isOpen ? `第 ${state.currentIndex + 1} 页，共 ${pages.length} 页：${currentPage.ariaLabel}` : 'Muzi Creative Book 封面。按 Enter 打开。'}</p>
    <div className="book-shell">
      <div className={`book-stage ${isTurning ? 'book-stage--turning' : ''}`} data-direction={state.direction ?? undefined} data-cat-mode={state.catMode}>
        <div className="book-coverboard book-coverboard--left" aria-hidden="true" />
        <div className="book-coverboard book-coverboard--right" aria-hidden="true" />
        <div className="book-page-stack book-page-stack--left" aria-hidden="true" />
        <div className="book-page-stack book-page-stack--right" aria-hidden="true" />
        <div className="book-paper book-paper--left" aria-hidden="true">{renderVisualPage(previousPage, 'book-visual-page--previous')}</div>
        <div className="book-paper book-paper--target" aria-hidden={!isTurning}>{renderVisualPage(targetPage, 'book-visual-page--target')}</div>
        <article ref={currentPaperRef} className="book-paper book-paper--current" aria-hidden={!isOpen && currentPage.kind !== 'cover'}>{renderContents(currentPage)}</article>
        <div ref={catMotionRef} className="book-stage__cat"><CatCompanion mode={state.catMode} direction={state.direction} /></div>
        <div className="book-spine" aria-hidden="true" />
      </div>
      <div className="book-navigation" aria-label="书本翻页控制"><button type="button" onClick={() => runTransition(state.currentIndex - 1)} disabled={!canGoPrevious} aria-label="上一页" data-cursor-interactive>← <span>上一页</span></button><button type="button" onClick={() => runTransition(state.currentIndex + 1)} disabled={!canGoNext} aria-label="下一页" data-cursor-interactive><span>下一页</span> →</button></div>
    </div>
    <div className="book-mobile-scroll">{pages.map((page) => <div key={page.id} id={page.hash ?? 'book-cover'} className="book-mobile-scroll__chapter">{renderContents(page, true)}</div>)}</div>
    <p className="book-hint">{isOpen ? '← → 翻页 · Esc 返回目录' : '按 Enter 或点击打开'}</p>
  </section>;
}
