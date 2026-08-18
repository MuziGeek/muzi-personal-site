import { useEffect, useRef, useState } from 'react';
import { getMzSpotIcon } from '../../lib/mz-icons';
import {
  getChapterIndex,
  getStoryScrollProgress,
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
  const posterRef = useRef<HTMLImageElement>(null);
  const introRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const outroRef = useRef<HTMLVideoElement>(null);
  const criticalReadyRef = useRef(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeLayer, setActiveLayer] = useState<StoryLayer>('intro');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  const staticMode = prefersReducedMotion || mediaFailed;

  useEffect(() => {
    let cancelled = false;
    const media = staticMode ? posterRef.current : introRef.current;

    const notifyCriticalReady = () => {
      if (cancelled || criticalReadyRef.current) return;
      criticalReadyRef.current = true;
      window.dispatchEvent(new CustomEvent('muzi:critical-ready'));
    };

    if (!media) {
      notifyCriticalReady();
      return;
    }

    if (media instanceof HTMLVideoElement) {
      if (media.readyState >= 2) notifyCriticalReady();
      else media.addEventListener('loadeddata', notifyCriticalReady, { once: true });
    } else if (media.complete) notifyCriticalReady();
    else {
      media.addEventListener('load', notifyCriticalReady, { once: true });
      media.addEventListener('error', notifyCriticalReady, { once: true });
    }

    return () => {
      cancelled = true;
      media.removeEventListener('loadeddata', notifyCriticalReady);
      media.removeEventListener('load', notifyCriticalReady);
      media.removeEventListener('error', notifyCriticalReady);
    };
  }, [staticMode]);

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

    const playVideo = () => {
      if (cancelled || document.hidden || !activeVideo) return;
      void activeVideo.play().catch(() => {
        // The poster and accessible copy remain available if playback is denied.
      });
    };

    if (activeVideo) {
      waitingVideo = activeVideo;
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

    const handlePageHide = () => pauseAll();
    const handlePageShow = () => playVideo();
    const handleVisibilityChange = () => {
      if (document.hidden) pauseAll();
      else playVideo();
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      if (waitingVideo && readinessListener) {
        waitingVideo.removeEventListener('loadeddata', readinessListener);
      }
      if (waitingVideo && seekListener) waitingVideo.removeEventListener('seeked', seekListener);
      window.clearTimeout(reprimeTimer);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeLayer, staticMode]);

  useEffect(() => {
    if (staticMode || !rootRef.current || !mainRef.current) return;

    const root = rootRef.current;
    const mainVideo = mainRef.current;
    let cancelled = false;
    let videoFrameId = 0;
    let scrollFrameId = 0;
    let settleFrameId = 0;
    let settleConfirmFrameId = 0;
    let targetTime = mainVideo.currentTime || 0;
    let smoothedTime = targetTime;
    let previousFrameTime = performance.now();
    let previousSeekTime = 0;
    let chapterIndex = 0;
    let layer: StoryLayer = 'intro';
    let outroPreloaded = false;
    let removeOutroPrime: (() => void) | undefined;
    let snapOnNextSync = false;

    const canSeekMainVideo = () => mainVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

    const getMainDuration = () =>
      mainVideo.duration && Number.isFinite(mainVideo.duration)
        ? mainVideo.duration
        : MAIN_VIDEO_DURATION;

    const getScrollProgress = () => {
      const storyTop = window.scrollY + root.getBoundingClientRect().top;
      return getStoryScrollProgress({
        scrollY: window.scrollY,
        storyTop,
        storyHeight: root.offsetHeight,
        viewportHeight: window.innerHeight,
      });
    };

    const snapMainVideo = () => {
      if (!canSeekMainVideo()) return;
      smoothedTime = targetTime;
      if (Math.abs(mainVideo.currentTime - targetTime) > 0.012) {
        mainVideo.currentTime = targetTime;
        previousSeekTime = performance.now();
      }
    };

    const preloadOutro = () => {
      if (outroPreloaded) return;
      outroPreloaded = true;
      const outroVideo = outroRef.current;
      if (!outroVideo) return;

      const primeFirstFrame = () => {
        outroVideo.pause();
        outroVideo.currentTime = 0.001;
      };

      outroVideo.preload = 'auto';
      if (outroVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) primeFirstFrame();
      else {
        outroVideo.addEventListener('loadeddata', primeFirstFrame, { once: true });
        removeOutroPrime = () => outroVideo.removeEventListener('loadeddata', primeFirstFrame);
        outroVideo.load();
      }
    };

    const syncFromScroll = (snapMedia = false) => {
      const progress = getScrollProgress();
      const duration = getMainDuration();
      targetTime = progressToTime(progress, duration);

      const nextChapter = getChapterIndex(targetTime);
      if (nextChapter !== chapterIndex) {
        chapterIndex = nextChapter;
        setActiveChapter(nextChapter);
      }

      const nextLayer = getStoryLayer(progress);
      if (nextLayer === 'outro') targetTime = Math.max(0, duration - 0.001);
      if (nextLayer !== layer) {
        layer = nextLayer;
        setActiveLayer(nextLayer);
      }

      if (progress >= 0.8) preloadOutro();
      if (snapMedia) snapMainVideo();
    };

    const scheduleScrollSync = (snapMedia = false) => {
      snapOnNextSync ||= snapMedia;
      if (scrollFrameId) return;
      scrollFrameId = window.requestAnimationFrame(() => {
        scrollFrameId = 0;
        const shouldSnap = snapOnNextSync;
        snapOnNextSync = false;
        syncFromScroll(shouldSnap);
      });
    };

    const scheduleSettledSync = () => {
      window.cancelAnimationFrame(settleFrameId);
      window.cancelAnimationFrame(settleConfirmFrameId);
      settleFrameId = window.requestAnimationFrame(() => {
        settleFrameId = 0;
        settleConfirmFrameId = window.requestAnimationFrame(() => {
          settleConfirmFrameId = 0;
          scheduleScrollSync(true);
        });
      });
    };

    const updateVideoTime = (now: number) => {
      videoFrameId = 0;
      if (cancelled || document.hidden) return;
      const elapsed = Math.min(now - previousFrameTime, 64);
      previousFrameTime = now;
      const blend = 1 - Math.exp(-elapsed * 0.018);
      smoothedTime += (targetTime - smoothedTime) * blend;

      if (
        canSeekMainVideo() &&
        !mainVideo.seeking &&
        now - previousSeekTime >= 33 &&
        Math.abs(mainVideo.currentTime - smoothedTime) > 0.012
      ) {
        mainVideo.currentTime = smoothedTime;
        previousSeekTime = now;
      }

      videoFrameId = window.requestAnimationFrame(updateVideoTime);
    };

    const startVideoLoop = () => {
      if (cancelled || document.hidden || videoFrameId) return;
      previousFrameTime = performance.now();
      videoFrameId = window.requestAnimationFrame(updateVideoTime);
    };

    const stopVideoLoop = () => {
      window.cancelAnimationFrame(videoFrameId);
      videoFrameId = 0;
    };

    const handleScroll = () => scheduleScrollSync();
    const handleResize = () => {
      scheduleScrollSync(true);
      scheduleSettledSync();
    };
    const handlePageHide = () => stopVideoLoop();
    const handlePageShow = () => {
      scheduleScrollSync(true);
      scheduleSettledSync();
      startVideoLoop();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopVideoLoop();
      else {
        scheduleScrollSync(true);
        scheduleSettledSync();
        startVideoLoop();
      }
    };
    const handleMainLoadedData = () => syncFromScroll(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    mainVideo.addEventListener('loadeddata', handleMainLoadedData);

    syncFromScroll(true);
    scheduleSettledSync();
    startVideoLoop();

    return () => {
      cancelled = true;
      removeOutroPrime?.();
      stopVideoLoop();
      window.cancelAnimationFrame(scrollFrameId);
      window.cancelAnimationFrame(settleFrameId);
      window.cancelAnimationFrame(settleConfirmFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mainVideo.removeEventListener('loadeddata', handleMainLoadedData);
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
        <img ref={posterRef} className="story-poster" src={POSTER} alt="" aria-hidden="true" />

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
            onError={() => setMediaFailed(true)}
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
