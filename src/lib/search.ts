import { commentDB } from './commentDB';

export interface SearchDoc {
  id: string;
  title: string;
  url: string;
  content: string;
}

interface FulltextChunk {
  id: string;
  seq: number;
  chapter: string;
  start: number;
  end: number;
  text: string;
}

function bigrams(q: string): string[] {
  const c = Array.from(q);
  const out: string[] = [];
  for (let i = 0; i < c.length - 1; i++) out.push(c[i] + c[i + 1]);
  return out;
}

interface ChunkHit { c: FulltextChunk; idx: number; tight: number; tier: number }

function matchChunk(c: FulltextChunk, q: string, bg: string[], chars: string[]): ChunkHit | null {
  let idx = c.text.indexOf(q);
  if (idx !== -1) return { c, idx, tight: 0, tier: 3 };
  // 双字组合全部出现（AND）
  if (bg.length > 1) {
    const pos = bg.map((b) => c.text.indexOf(b));
    if (pos.every((p) => p !== -1)) {
      return { c, idx: Math.min(...pos), tight: Math.max(...pos) - Math.min(...pos), tier: 2 };
    }
  }
  // 单字全部出现（AND，最宽松）
  if (chars.length > 1) {
    const pos = chars.map((ch) => c.text.indexOf(ch));
    if (pos.every((p) => p !== -1)) {
      return { c, idx: Math.min(...pos), tight: Math.max(...pos) - Math.min(...pos), tier: 1 };
    }
  }
  return null;
}

const indexUrl = '/search-index.json';
let fulltext: FulltextChunk[] | null = null;
let fulltextLoading: Promise<FulltextChunk[]> | null = null;

function loadFulltext(): Promise<FulltextChunk[]> {
  if (fulltext) return Promise.resolve(fulltext);
  if (!fulltextLoading) {
    fulltextLoading = fetch(indexUrl)
      .then((r) => r.json())
      .then((data: { chunks: FulltextChunk[] }) => {
        fulltext = data.chunks;
        return fulltext;
      })
      .catch(() => {
        fulltext = [];
        return fulltext;
      });
  }
  return fulltextLoading;
}

const baseDocs: SearchDoc[] = [
  { id: 'home', title: '总览 V4', url: '/', content: '哥白尼革命 先天综合判断 批判法庭 纯粹理性批判 导读 法国大革命 牛顿 卢梭 唯理论 经验论 休谟 独断怀疑' },
  { id: 'aesthetic', title: '先验感性论 34条', url: '/aesthetic/', content: '空间时间 先验感性论 形而上学阐明 先验阐明 纯直观 经验实在先验观念性 物自体触动 反驳观念论 VR头显' },
  { id: 'analytic', title: '先验分析论 84条', url: '/analytic/', content: '范畴表 判断表 量质关系模态 12范畴 三重综合 领会再生认定 想象力 统觉 我思 判断 图型 时间规定 原理体系 公理类比公设 因果律' },
  { id: 'dialectic', title: '先验辩证论 54条', url: '/dialectic/', content: '谬误推理 实体单纯人格观念 二律背反 世界有限无限 单纯可分 自由自然因果 必然存在 数学皆假力学皆真 本体论存在不是谓词 宇宙论自然神学 调节性' },
  { id: 'method', title: '方法论 23条', url: '/method/', content: '训练 定义公理证明假设 法规 意见知识信仰 至善德福 建筑术体系 历史独断怀疑批判' },
  { id: 'deng', title: '邓晓芒句读全库 217条', url: '/deng/', content: '邓晓芒句读 217条精选 精读 同情的理解 体系性 反向论证' },
  { id: 'glossary', title: '术语库', url: '/glossary/', content: '先天先验超验 现象物自体 统觉 图型 二律背反 调节构成 先验唯心经验实在' },
  { id: 'quanwen', title: '全文直读 7594段', url: '/quanwen/', content: '康德纯粹理性批判 句读 全文 7594段 183万字 语义分段 书式排版 段号跳转' },
];

function getDocs(): SearchDoc[] {
  const dengDocs: SearchDoc[] = Object.entries(commentDB).map(([k, v]) => ({
    id: 'deng-' + k,
    title: '句读 ' + v.ref,
    url: '/deng/#' + k,
    content: v.original + ' ' + v.deng + ' ' + v.tip,
  }));
  return baseDocs.concat(dengDocs);
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
  snippet?: string;
}

const TITLE_PRIORITY = 12;

function scoreDoc(doc: SearchDoc, q: string): number {
  const title = doc.title;
  const content = doc.content;
  let s = 0;
  if (title.includes(q)) s += TITLE_PRIORITY * 10;
  if (content.includes(q)) s += 5;
  const cnt = content.split(q).length - 1;
  s += cnt * 2;
  return s;
}

export async function search(query: string, limit = 15): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];

  // 1) 站点导航与精选句读（本地小数据，无需下载全文）
  getDocs().forEach((doc) => {
    const s = scoreDoc(doc, q);
    if (s > 0) hits.push({ doc, score: s });
  });

  // 2) 全文 7594 段（懒加载 search-index.json）
  try {
    const chunks = await loadFulltext();
    const chars = Array.from(q.replace(/\s/g, ''));
    const bg = bigrams(q);
    chunks.forEach((c) => {
      const hit = matchChunk(c, q, bg, chars);
      if (!hit) return;
      const snippet = c.text.slice(Math.max(0, hit.idx - 30), hit.idx + q.length + 60);
      const tightBonus = hit.tier >= 2 && hit.tight <= 60 ? 6 : hit.tier >= 2 ? 3 : 0;
      hits.push({
        doc: {
          id: 'full-' + c.id,
          title: `${c.chapter || '全文'} · 段 ${c.seq + 1} · ${c.text.slice(0, 12)}…`,
          url: `/quanwen/#c${c.seq}`,
          content: c.text,
        },
        score: 18 + hit.tier * 3 + tightBonus + Math.min(4, Math.floor((c.text.split(q).length - 1) * 2)),
        snippet,
      });
    });
  } catch {
    // 全文索引加载失败时静默降级为站点内检索
  }

  const seen = new Set<string>();
  const uniq: SearchHit[] = [];
  hits
    .sort((a, b) => b.score - a.score)
    .forEach((h) => {
      if (seen.has(h.doc.url)) return;
      seen.add(h.doc.url);
      uniq.push(h);
    });
  return uniq.slice(0, limit);
}
