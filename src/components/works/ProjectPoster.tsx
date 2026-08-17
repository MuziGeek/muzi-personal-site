export type ProjectPosterKey =
  | 'munan-gallery'
  | 'mz-icon-design'
  | 'mz-crayon-illustrations'
  | 'mz-minimal-zine';

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
      <img {...imageProps} src="/images/works/munan-picture/home.webp" />
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
      />
      <img
        className="poster-icons__sheet poster-icons__sheet--block"
        {...imageProps}
        src="/images/works/mz-icon-design/block-contact-sheet.webp"
      />
    </div>
  );
}

function CrayonPoster() {
  return (
    <div className="project-poster__scene poster-crayon">
      <img {...imageProps} src="/images/works/mz-crayon-illustrations/action-index.webp" />
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
      />
      <div className="poster-zine__reveal">
        <img {...imageProps} src="/images/works/mz-minimal-zine/visual-islands.webp" />
      </div>
    </div>
  );
}

export default function ProjectPoster({ posterKey, active }: ProjectPosterProps) {
  const poster = {
    'munan-gallery': <MunanGalleryPoster />,
    'mz-icon-design': <IconDesignPoster />,
    'mz-crayon-illustrations': <CrayonPoster />,
    'mz-minimal-zine': <MinimalZinePoster />,
  }[posterKey];

  return (
    <div className={`project-poster${active ? ' is-active' : ''}`} data-poster={posterKey} aria-hidden="true">
      {poster}
    </div>
  );
}
