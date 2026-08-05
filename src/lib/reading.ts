// 学习闭环的本地存储工具（仅客户端使用）
// 阅读位置 / 高亮 / 批注 / 书签 / 主题 / 阅读偏好

export interface Note {
  seq: number; // 段落号（0 基）
  text: string; // 关联的原文摘录
  note: string; // 批注内容
  ts: number;
}

export interface Hl {
  seq: number;
  text: string;
  ts: number;
}

export interface Bookmark {
  seq: number;
  chapter: string;
  text: string;
  ts: number;
}

function read<T>(key: string, fb: T): T {
  try {
    const r = localStorage.getItem(key);
    return r ? (JSON.parse(r) as T) : fb;
  } catch {
    return fb;
  }
}

function write(key: string, v: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export const POS_KEY = 'krv-read-pos';
export const HLS_KEY = 'krv-hl';
export const NOTES_KEY = 'krv-notes';
export const BMS_KEY = 'krv-bm';
export const THEME_KEY = 'krv-theme';
export const FS_KEY = 'krv-fulltext-fs';
export const LH_KEY = 'krv-fulltext-lh';

export const loadPos = (): number => read<number>(POS_KEY, -1);
export const savePos = (seq: number) => write(POS_KEY, seq);
export const clearPos = () => write(POS_KEY, -1);

export const loadHls = (): Hl[] => read<Hl[]>(HLS_KEY, []);
export const saveHls = (v: Hl[]) => write(HLS_KEY, v);

export const loadNotes = (): Note[] => read<Note[]>(NOTES_KEY, []);
export const saveNotes = (v: Note[]) => write(NOTES_KEY, v);

export const loadBms = (): Bookmark[] => read<Bookmark[]>(BMS_KEY, []);
export const saveBms = (v: Bookmark[]) => write(BMS_KEY, v);

export const loadTheme = (): string | null => {
  const t = localStorage.getItem(THEME_KEY);
  if (t === 'dark' || t === 'light') return t;
  return null;
};
export const saveTheme = (t: 'dark' | 'light') => write(THEME_KEY, t);

/**
 * 在容器内查找指定文本并返回其 Range（跨文本节点），找不到返回 null。
 * 用于把"高亮"施加到选中文本上（CSS Custom Highlight API）。
 */
export function findRange(root: Node, needle: string): Range | null {
  const texts: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) texts.push(n as Text);
  let offset = 0;
  let hay = '';
  const starts: number[] = [];
  for (const t of texts) {
    starts.push(offset);
    const s = t.textContent ?? '';
    hay += s;
    offset += s.length;
  }
  const pos = hay.indexOf(needle);
  if (pos === -1 || needle.length === 0) return null;
  let i1 = texts.length - 1;
  for (let i = texts.length - 1; i >= 0; i--) if (starts[i] <= pos) { i1 = i; break; }
  const end = pos + needle.length;
  let i2 = i1;
  for (let i = texts.length - 1; i >= 0; i--) if (starts[i] < end) { i2 = i; break; }
  const range = document.createRange();
  range.setStart(texts[i1], Math.min(texts[i1].textContent?.length ?? 0, pos - starts[i1]));
  range.setEnd(texts[i2], Math.min(texts[i2].textContent?.length ?? 0, end - starts[i2]));
  return range;
}
