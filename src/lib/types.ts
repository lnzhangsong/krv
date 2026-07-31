export interface Judou {
  ref: string;
  original: string;
  deng: string;
  tip: string;
}

export type CommentDB = Record<string, Judou>;
