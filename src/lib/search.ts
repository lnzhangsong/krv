import lunr from 'lunr';
import { commentDB } from './commentDB';

export interface SearchDoc {
  id: string;
  title: string;
  url: string;
  content: string;
}

const baseDocs: SearchDoc[] = [
  { id: 'home', title: '总览 V4', url: '/', content: '哥白尼革命 先天综合判断 批判法庭 纯粹理性批判 导读 法国大革命 牛顿 卢梭 唯理论 经验论 休谟 独断怀疑' },
  { id: 'aesthetic', title: '先验感性论 16条', url: '/aesthetic/', content: '空间时间 先验感性论 形而上学阐明 先验阐明 纯直观 经验实在先验观念性 物自体触动 反驳观念论 VR头显' },
  { id: 'analytic', title: '先验分析论 48条', url: '/analytic/', content: '范畴表 判断表 量质关系模态 12范畴 三重综合 领会再生认定 想象力 统觉 我思 判断 图型 时间规定 原理体系 公理类比公设 因果律' },
  { id: 'dialectic', title: '先验辩证论 30条', url: '/dialectic/', content: '谬误推理 实体单纯人格观念 二律背反 世界有限无限 单纯可分 自由自然因果 必然存在 数学皆假力学皆真 本体论存在不是谓词 宇宙论自然神学 调节性' },
  { id: 'method', title: '方法论 13条', url: '/method/', content: '训练 定义公理证明假设 法规 意见知识信仰 至善德福 建筑术体系 历史独断怀疑批判' },
  { id: 'deng', title: '邓晓芒句读全库 110+', url: '/deng/', content: '邓晓芒句读 200万字 全量实验室 精读 同情的理解 体系性 反向论证' },
  { id: 'glossary', title: '术语库', url: '/glossary/', content: '先天先验超验 现象物自体 统觉 图型 二律背反 调节构成 先验唯心经验实在' },
  { id: 'sqlite', title: 'SQLite 全库', url: '/sqlite/', content: 'kant.db FTS5 全文检索 2380页 794段 116条 目录 SQL 控制台' },
  { id: 'deng-full', title: '私有全本阅览室', url: '/deng-full/', content: '邓晓芒 2381页 PDF pdf.js 全文检索 跳页 句读联动' },
  { id: 'full', title: '完全内容版 116条', url: '/full/', content: '116条句读完全可见 打印 SEO 序言 导言 感性论 分析论 辩证论 方法论' },
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

let idx: lunr.Index;
let allDocs: SearchDoc[] = [];

export function buildIndex() {
  allDocs = getDocs();
  idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 12 });
    this.field('content');
    this.pipeline.remove(lunr.stemmer);
    allDocs.forEach((d) => this.add(d));
  });
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

export function search(query: string, limit = 15): SearchHit[] {
  if (!idx) buildIndex();
  const q = query.trim();
  if (!q) return [];
  try {
    const tokens = q.split('').join(' ');
    const results = idx.search(tokens + ' ' + q);
    const seen = new Set<string>();
    const uniq: SearchHit[] = [];
    results.forEach((r) => {
      const doc = allDocs.find((d) => d.id === r.ref);
      if (!doc) return;
      if (seen.has(doc.url)) return;
      seen.add(doc.url);
      uniq.push({ doc, score: r.score });
    });
    return uniq.slice(0, limit);
  } catch {
    return [];
  }
}

export { allDocs };
