export type ProjectPosterKey =
  | 'munan-gallery'
  | 'mz-icon-design'
  | 'mz-crayon-illustrations'
  | 'mz-minimal-zine'
  | 'build-personal-story-site';

interface ProjectPosterProps {
  posterKey: ProjectPosterKey;
  active: boolean;
}

const imageProps = {
  loading: 'lazy' as const,
  decoding: 'async' as const,
  draggable: false,
  alt: '',
};

function MunanGalleryPoster() {
  return (
    <div className="project-poster__scene poster-munan">
      <img {...imageProps} src="/images/works/munan-picture/home.webp" width="1280" height="800" />
    </div>
  );
}

function IconDesignPoster() {
  return (
    <div className="project-poster__scene poster-icons">
      <img
        className="poster-icons__sheet poster-icons__sheet--crayon"
        {...imageProps}
        src="/images/works/mz-icon-design/crayon-contact-sheet.webp"
        width="900"
        height="200"
      />
      <img
        className="poster-icons__sheet poster-icons__sheet--block"
        {...imageProps}
        src="/images/works/mz-icon-design/block-contact-sheet.webp"
        width="900"
        height="900"
      />
    </div>
  );
}

function CrayonPoster() {
  return (
    <div className="project-poster__scene poster-crayon">
      <img {...imageProps} src="/images/works/mz-crayon-illustrations/action-index.webp" width="1100" height="1306" />
    </div>
  );
}

function MinimalZinePoster() {
  return (
    <div className="project-poster__scene poster-zine">
      <img
        className="poster-zine__source"
        {...imageProps}
        src="/images/works/mz-minimal-zine/source-reading-corner.webp"
        width="900"
        height="1501"
      />
      <div className="poster-zine__reveal">
        <img {...imageProps} src="/images/works/mz-minimal-zine/visual-islands.webp" width="900" height="1501" />
      </div>
    </div>
  );
}

function PersonalStorySitePoster() {
  return (
    <div className="project-poster__scene">
      <img
        {...imageProps}
        src="/images/skills/build-personal-story-site.webp"
        width="1024"
        height="1024"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

export default function ProjectPoster({ posterKey, active }: ProjectPosterProps) {
  const poster = {
    'munan-gallery': <MunanGalleryPoster />,
    'mz-icon-design': <IconDesignPoster />,
    'mz-crayon-illustrations': <CrayonPoster />,
    'mz-minimal-zine': <MinimalZinePoster />,
    'build-personal-story-site': <PersonalStorySitePoster />,
  }[posterKey];

  return (
    <div className={`project-poster${active ? ' is-active' : ''}`} data-poster={posterKey} aria-hidden="true">
      {poster}
    </div>
  );
}
