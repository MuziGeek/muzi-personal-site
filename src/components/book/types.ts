export type BookDirection = 'next' | 'prev';

export type BookPhase = 'closed' | 'idle' | 'preparing' | 'flipping' | 'settling';

export type CatMode =
  | 'idle'
  | 'tracking'
  | 'crouch'
  | 'runningOut'
  | 'occluded'
  | 'runningIn'
  | 'landing'
  | 'settle';

export interface BookPage {
  id: string;
  kind: 'cover' | 'contents' | 'about' | 'works' | 'systems' | 'notes' | 'back';
  title: string;
  hash?: string;
  ariaLabel: string;
}

export interface BookEntry {
  id: string;
  title: string;
  summary: string;
  href: string;
}

export interface CreativeBookProps {
  works: BookEntry[];
  notes: BookEntry[];
}

export interface BookState {
  currentIndex: number;
  targetIndex: number | null;
  direction: BookDirection | null;
  phase: BookPhase;
  catMode: CatMode;
}
