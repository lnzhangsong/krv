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

// ===== 论证地图：全书论证链，帮助读者理解每一章在整体论证中的位置 =====
export interface ArgumentStep {
  label: string;
  question: string;
  answer: string;
  link?: string;
}

export interface ArgumentMap {
  chain: ArgumentStep[]; // 全书五步（总问题 + 四部）
  chapterIdx: number; // 当前章在 chain 中的位置
  prev?: string;
  next?: string;
}

export const CHAIN: ArgumentStep[] = [
  {
    label: '总问题',
    question: '先天综合判断如何可能？',
    answer: '数学、自然科学何以既扩展知识又必然普遍；形而上学能否成为科学。',
  },
  {
    label: '感性论',
    question: '数学如何可能？',
    answer: '空间与时间是先天直观形式：几何研究空间、算术研究时间，故数学对一切经验对象必然有效。',
    link: '/aesthetic/',
  },
  {
    label: '分析论',
    question: '自然科学（知识）如何可能？',
    answer: '知性以 12 范畴把直观杂多联结成对象；先验演绎证明范畴适用于一切可能经验，回击休谟。',
    link: '/analytic/',
  },
  {
    label: '辩证论',
    question: '形而上学为何失败？',
    answer: '理性追求无条件总体必生先验幻相：谬误推理、二律背反、上帝证明皆因把范畴超验使用。',
    link: '/dialectic/',
  },
  {
    label: '方法论',
    question: '未来形而上学如何建立？',
    answer: '训练、法规、建筑术、历史四步：认识划界、实践立界，交棒给道德哲学。',
    link: '/method/',
  },
];

export const CHAPTER_CHAIN_IDX: Record<string, number> = {
  aesthetic: 1,
  analytic: 2,
  dialectic: 3,
  method: 4,
};
