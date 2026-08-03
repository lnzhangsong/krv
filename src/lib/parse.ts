// 构建期工具：解析 chunks 原文，按【】切出「康德原文句 + 邓晓芒讲解」对
export type SentenceRole = '定义' | '论证' | '反驳' | '结论' | '过渡' | '例子' | '引用';

export interface Sentence {
  start: number;
  orig: string;
  exp: string;
  chunkId: string;
  role: SentenceRole;
  section?: string;
}

export interface ParseOptions {
  origMax?: number;
  expMax?: number;
  section?: string;
}

// 依据讲解文本（邓晓芒的话）中的信号词推断该句在论证中的功能
const ROLE_RULES: { role: SentenceRole; keys: string[] }[] = [
  { role: '反驳', keys: ['反驳', '不是', '误读', '反对', '批判', '纠正', '错误', '误会', '不能', '质疑'] },
  { role: '结论', keys: ['所以', '因此', '于是', '由此可见', '归结', '结论', '总之', '意味着', '就表明', '这就是'] },
  { role: '定义', keys: ['定义', '叫作', '叫做', '所谓', '界定', '指', '即', '意思是', '称为', '就是'] },
  { role: '例子', keys: ['例如', '比如', '举例', '类比', '就像', '设想', '假如', '如'] },
  { role: '过渡', keys: ['前面', '下面', '接下来', '我们看', '我们先', '这一节', '上一节', '下一节', '现在', '过渡', '接着'] },
];

export function guessRole(exp: string): SentenceRole {
  for (const { role, keys } of ROLE_RULES) {
    if (keys.some((k) => exp.includes(k))) return role;
  }
  return '论证';
}

export function parseSentences(text: string, chunkId: string, start: number, opts: ParseOptions = {}): Sentence[] {
  const { origMax = 260, expMax = 420 } = opts;
  const t = text.replace(/\s*\n\s*/g, ' ').trim();
  const out: Sentence[] = [];
  const re = /【([^】]*)】/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const orig = m[1].trim();
    if (!orig) continue;
    const after = m.index + m[0].length;
    const next = t.indexOf('【', after);
    const end = next === -1 ? t.length : next;
    let exp = t.slice(after, end).trim();
    // 讲解以逗号/分号/句号开头时去掉粘连
    exp = exp.replace(/^[,，:：;；。\s]+/, '');
    if (!exp) continue;
    out.push({
      start,
      orig: orig.length > origMax ? orig.slice(0, origMax) + '…' : orig,
      exp: exp.length > expMax ? exp.slice(0, expMax) + '…' : exp,
      chunkId,
      role: guessRole(exp),
      section: opts.section,
    });
  }
  return out;
}
