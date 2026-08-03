export interface ChapterDef {
  key: string;
  title: string;
  lo: number;
  hi: number;
}

// 基于 epub 语义分段的四大部边界（seq 段号）
export const CHAPTERS: ChapterDef[] = [
  { key: 'aesthetic', title: '先验感性论', lo: 687, hi: 1333 },
  { key: 'analytic', title: '先验分析论', lo: 1334, hi: 4308 },
  { key: 'dialectic', title: '先验辩证论', lo: 4309, hi: 6187 },
  { key: 'method', title: '先验方法论', lo: 6188, hi: 7593 },
];

export const SEQ_COUNT = 7594;
