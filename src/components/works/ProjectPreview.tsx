import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import ProjectPoster, { type ProjectPosterKey } from './ProjectPoster';
import {
  getPreviewIndexFromPointer,
  MUNAN_DEMO_STATES,
  shouldAutoAdvancePreview,
  stepPreviewIndex,
  type MunanDemoState,
} from './projectPreviewMotion';

interface ProjectPreviewProps {
  posterKey: ProjectPosterKey;
  active: boolean;
  previewAlt: string;
}

interface MunanMascotAsset {
  id: MunanDemoState;
  label: string;
  src: string;
}

const MUNAN_MASCOTS: MunanMascotAsset[] = [
  {
    id: 'discover',
    label: '寻找灵感',
    src: '/images/works/munan-picture/mascot-demo/discover.webp',
  },
  {
    id: 'create',
    label: '完成 AI 创作',
    src: '/images/works/munan-picture/mascot-demo/create.webp',
  },
  {
    id: 'share',
    label: '分享作品',
    src: '/images/works/munan-picture/mascot-demo/share.webp',
  },
];

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function usePageVisibility() {
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return pageVisible;
}

function MunanProductDemo({ active, previewAlt }: Pick<ProjectPreviewProps, 'active' | 'previewAlt'>) {
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const pageVisible = usePageVisibility();

  const clearResumeTimer = () => {
    if (!resumeTimer.current) return;
    clearTimeout(resumeTimer.current);
    resumeTimer.current = null;
  };

  const startInteraction = () => {
    clearResumeTimer();
    setInteracting(true);
  };

  const scheduleResume = () => {
    clearResumeTimer();
    setDragging(false);
    resumeTimer.current = setTimeout(() => setInteracting(false), 600);
  };

  useEffect(() => {
    if (!shouldAutoAdvancePreview(active, interacting, reducedMotion, failed, pageVisible)) return;
    const timer = window.setInterval(() => {
      setIndex((current) => stepPreviewIndex(current, 1, MUNAN_DEMO_STATES.length));
    }, 3200);
    return () => window.clearInterval(timer);
  }, [active, failed, interacting, pageVisible, reducedMotion]);

  useEffect(() => {
    if (reducedMotion && !interacting) setIndex(0);
  }, [interacting, reducedMotion]);

  useEffect(() => () => clearResumeTimer(), []);

  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && !dragging) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setIndex(getPreviewIndexFromPointer(bounds, event.clientX, MUNAN_DEMO_STATES.length));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startInteraction();
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.getBoundingClientRect();
    setIndex(getPreviewIndexFromPointer(bounds, event.clientX, MUNAN_DEMO_STATES.length));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    scheduleResume();
  };

  const currentState = MUNAN_MASCOTS[index];

  if (failed) {
    return (
      <div className="munan-demo munan-demo--fallback" role="img" aria-label={previewAlt}>
        <img
          className="munan-demo__fallback-image"
          src="/images/works/munan-picture/mascot-demo/fallback.webp"
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`munan-demo is-state-${index}${interacting ? ' is-interacting' : ''}`}
      role="group"
      aria-label={`木南图库交互预览：${previewAlt} 鼠标横向移动、触摸滑动或使用左右方向键可切换场景。`}
      tabIndex={0}
      data-preview-active={active ? 'true' : 'false'}
      data-demo-state={currentState.id}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') startInteraction();
      }}
      onPointerMove={updateFromPointer}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !dragging) scheduleResume();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={scheduleResume}
      onFocus={startInteraction}
      onBlur={scheduleResume}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        startInteraction();
        setIndex((current) => stepPreviewIndex(
          current,
          event.key === 'ArrowRight' ? 1 : -1,
          MUNAN_DEMO_STATES.length,
        ));
      }}
    >
      <div className="munan-demo__viewport" aria-hidden="true">
        <img
          className="munan-demo__brand-leaf"
          src="/images/works/munan-picture/munan-knit-leaf.svg"
          alt=""
          draggable={false}
        />
        {MUNAN_MASCOTS.map((mascot, mascotIndex) => (
          <div
            className={`munan-demo__mascot munan-demo__mascot--${mascot.id}${mascotIndex === index ? ' is-active' : ''}`}
            key={mascot.id}
          >
            <img
              className="munan-demo__mascot-image"
              src={mascot.src}
              alt=""
              loading={mascotIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              onError={() => setFailed(true)}
            />
          </div>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        当前场景：{currentState.label}，第 {index + 1} 幕，共 {MUNAN_DEMO_STATES.length} 幕。
      </span>
    </div>
  );
}

export default function ProjectPreview({ posterKey, active, previewAlt }: ProjectPreviewProps) {
  if (posterKey === 'munan-gallery') {
    return <MunanProductDemo active={active} previewAlt={previewAlt} />;
  }

  return <ProjectPoster posterKey={posterKey} active={active} />;
}
