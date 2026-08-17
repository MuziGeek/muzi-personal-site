import { useEffect, useRef, useState } from 'react';
import { getMzSpotIcon } from '../../lib/mz-icons';
import {
  getChapterIndex,
  getStoryLayer,
  MAIN_VIDEO_DURATION,
  progressToTime,
  STORY_CHAPTERS,
  type StoryLayer,
} from './story';

const POSTER = '/images/scrollytelling/main-poster.webp';

interface VideoSourcesProps {
  name: 'intro-loop' | 'main' | 'outro-loop';
}

function VideoSources({ name }: VideoSourcesProps) {
  return (
    <>
      <source media="(max-width: 767px)" src={`/videos/${name}-mobile.mp4`} type="video/mp4" />
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </>
  );
}

export default function ScrollytellingHome() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const outroRef = useRef<HTMLVideoElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeLayer, setActiveLayer] = useState<StoryLayer>('intro');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  const staticMode = prefersReducedMotion || mediaFailed;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const videos = [introRef.current, mainRef.current, outroRef.current];
    const pauseAll = () => videos.forEach((video) => video?.pause());
    let cancelled = false;
    let waitingVideo: HTMLVideoElement | null = null;
    let readinessListener: (() => void) | null = null;
    let seekListener: (() => void) | null = null;
    let reprimeTimer = 0;

    if (staticMode) {
      pauseAll();
      return;
    }

    pauseAll();
    const outroVideo = outroRef.current;
    if (
      activeLayer !== 'outro' &&
      outroVideo &&
      outroVideo.readyState >= 2 &&
      outroVideo.currentTime > 0.05
    ) {
      reprimeTimer = window.setTimeout(() => {
        if (cancelled) return;
        outroVideo.pause();
        outroVideo.currentTime = 0.001;
      }, 112);
    }

    const activeVideo =
      activeLayer === 'intro'
        ? introRef.current
        : activeLayer === 'outro'
          ? outroRef.current
          : null;

    if (activeVideo) {
      waitingVideo = activeVideo;
      const playVideo = () => {
        if (cancelled) return;
        void activeVideo.play().catch(() => {
          // The poster and accessible copy remain available if playback is denied.
        });
      };

      const preparePlayback = () => {
        if (cancelled) return;

        const startTime = activeLayer === 'outro' ? 0.001 : 0;
        if (Math.abs(activeVideo.currentTime - startTime) <= 0.05) {
          playVideo();
          return;
        }

        seekListener = playVideo;
        activeVideo.addEventListener('seeked', seekListener, { once: true });
        activeVideo.currentTime = startTime;
      };

      readinessListener = preparePlayback;
      if (activeVideo.readyState >= 2) preparePlayback();
      else activeVideo.addEventListener('loadeddata', readinessListener, { once: true });
    }

    return () => {
      cancelled = true;
      if (waitingVideo && readinessListener) {
        waitingVideo.removeEventListener('loadeddata', readinessListener);
      }
      if (waitingVideo && seekListener) waitingVideo.removeEventListener('seeked', seekListener);
      window.clearTimeout(reprimeTimer);
    };
  }, [activeLayer, staticMode]);

  useEffect(() => {
    if (staticMode || !rootRef.current || !mainRef.current) return;

    let cancelled = false;
    let removeScrollTrigger: (() => void) | undefined;
    let frameId = 0;
    let targetTime = 0;
    let smoothedTime = mainRef.current.currentTime || 0;
    let previousFrameTime = performance.now();
    let previousSeekTime = 0;
    let chapterIndex = 0;
    let layer: StoryLayer = 'intro';
    let outroPreloaded = false;
    let removeOutroPrime: (() => void) | undefined;

    const updateVideoTime = (now: number) => {
      const video = mainRef.current;
      const elapsed = Math.min(now - previousFrameTime, 64);
      previousFrameTime = now;
      const blend = 1 - Math.exp(-elapsed * 0.018);
      smoothedTime += (targetTime - smoothedTime) * blend;

      if (video && now - previousSeekTime >= 33 && Math.abs(video.currentTime - smoothedTime) > 0.012) {
        video.currentTime = smoothedTime;
        previousSeekTime = now;
      }

      frameId = window.requestAnimationFrame(updateVideoTime);
    };

    frameId = window.requestAnimationFrame(updateVideoTime);

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const duration =
            mainRef.current?.duration && Number.isFinite(mainRef.current.duration)
              ? mainRef.current.duration
              : MAIN_VIDEO_DURATION;
          targetTime = progressToTime(self.progress, duration);

          const nextChapter = getChapterIndex(targetTime);
          if (nextChapter !== chapterIndex) {
            chapterIndex = nextChapter;
            setActiveChapter(nextChapter);
          }

          const nextLayer = getStoryLayer(self.progress);
          if (nextLayer !== layer) {
            if (nextLayer === 'outro' || layer === 'outro') {
              const finalFrameTime = Math.max(0, duration - 0.001);
              targetTime = finalFrameTime;
              smoothedTime = finalFrameTime;
              if (mainRef.current) mainRef.current.currentTime = finalFrameTime;
            }

            layer = nextLayer;
            setActiveLayer(nextLayer);
          }

          if (!outroPreloaded && self.progress >= 0.8) {
            outroPreloaded = true;
            const outroVideo = outroRef.current;
            if (outroVideo) {
              const primeFirstFrame = () => {
                outroVideo.pause();
                outroVideo.currentTime = 0.001;
              };

              outroVideo.preload = 'auto';
              outroVideo.addEventListener('loadeddata', primeFirstFrame, { once: true });
              removeOutroPrime = () => outroVideo.removeEventListener('loadeddata', primeFirstFrame);
              outroVideo.load();
            }
          }
        },
      });

      removeScrollTrigger = () => trigger.kill();
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      removeScrollTrigger?.();
      removeOutroPrime?.();
      window.cancelAnimationFrame(frameId);
    };
  }, [staticMode]);

  return (
    <section
      ref={rootRef}
      className="scrollytelling"
      data-layer={activeLayer}
      data-chapter={STORY_CHAPTERS[activeChapter]?.id}
      data-static={staticMode ? '' : undefined}
      aria-label="Muzi 个人网站滚动叙事"
    >
      <div className="story-stage">
        <img className="story-poster" src={POSTER} alt="" aria-hidden="true" />

        <div className="story-media" aria-hidden="true">
          <video
            ref={introRef}
            className="story-video story-video--intro"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={POSTER}
            tabIndex={-1}
          >
            <VideoSources name="intro-loop" />
          </video>
          <video
            ref={mainRef}
            className="story-video story-video--main"
            muted
            playsInline
            preload="auto"
            poster={POSTER}
            tabIndex={-1}
            onError={() => setMediaFailed(true)}
          >
            <VideoSources name="main" />
          </video>
          <video
            ref={outroRef}
            className="story-video story-video--outro"
            loop
            muted
            playsInline
            preload="metadata"
            poster={POSTER}
            tabIndex={-1}
          >
            <VideoSources name="outro-loop" />
          </video>
        </div>

        <header className="story-header">
          <a className="story-wordmark" href="/" aria-label="Muzi 首页">Muzi</a>
          <nav className="story-nav" aria-label="主要导航">
            <a href="/works/">Works</a>
            <a href="/notes/">Notes</a>
            <a href="/about/">About</a>
          </nav>
        </header>

        <div className="story-copy-deck" aria-live="polite">
          {STORY_CHAPTERS.map((chapter, index) => {
            const isActive = index === activeChapter;
            const Heading = index === 0 ? 'h1' : 'h2';
            const icon = chapter.iconKey ? getMzSpotIcon(chapter.iconKey) : null;

            return (
              <article
                key={chapter.id}
                className={`story-copy story-copy--${chapter.alignment}${isActive ? ' is-active' : ''}`}
                aria-hidden={!isActive}
              >
                <Heading>{chapter.title}</Heading>
                <p>{chapter.copy}</p>
                {chapter.href && chapter.linkLabel && (
                  <a className="story-copy__link" href={chapter.href} tabIndex={isActive ? 0 : -1}>
                    {icon && (
                      <img
                        className="story-copy__link-icon"
                        src={icon.src}
                        width={icon.width}
                        height={icon.height}
                        alt=""
                        aria-hidden="true"
                      />
                    )}
                    <span className="story-copy__link-text">
                      {chapter.linkLabel}<span aria-hidden="true">→</span>
                    </span>
                  </a>
                )}
              </article>
            );
          })}
        </div>

        <nav className="story-route-rail" aria-label="站内内容">
          <a href="/works/">Works</a>
          <a href="/notes/">Notes</a>
          <a href="/about/">About</a>
        </nav>
      </div>

      <div className="story-static" aria-hidden={!staticMode}>
        <div className="story-static__hero">
          <img src={POSTER} alt="木子站在暖白色背景中" />
          <div>
            <p className="story-static__wordmark">Muzi</p>
            <p>作品、笔记，以及持续发生的创作。</p>
          </div>
        </div>
        <div className="story-static__chapters">
          {STORY_CHAPTERS.map((chapter, index) => {
            const Heading = index === 0 ? 'h1' : 'h2';
            const icon = chapter.iconKey ? getMzSpotIcon(chapter.iconKey) : null;
            return (
              <article key={chapter.id}>
                <Heading>{chapter.title}</Heading>
                <p>{chapter.copy}</p>
                {chapter.href && chapter.linkLabel && (
                  <a className="story-static__link" href={chapter.href}>
                    {icon && (
                      <img
                        className="story-static__link-icon"
                        src={icon.src}
                        width={icon.width}
                        height={icon.height}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="story-static__link-text">
                      {chapter.linkLabel}<span aria-hidden="true">→</span>
                    </span>
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
