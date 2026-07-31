// 构建期工具：解析 chunks 原文，按【】切出「康德原文句 + 邓晓芒讲解」对
export interface Sentence {
  start: number;
  orig: string;
  exp: string;
  chunkId: string;
}

export interface ParseOptions {
  origMax?: number;
  expMax?: number;
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
    });
  }
  return out;
}
