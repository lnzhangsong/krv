// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = true;

const PAGE = 15;

// 全文分片索引：页码 + 章节列表（全文阅读页客户端先加载这个轻量索引，再按页取数据）
export const GET: APIRoute = () => {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const rows = db.prepare('SELECT seq, chapter FROM chunks ORDER BY seq').all() as { seq: number; chapter: string }[];
  db.close();
  const chapters: { name: string; seq: number }[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (!seen.has(r.chapter)) {
      seen.add(r.chapter);
      chapters.push({ name: r.chapter, seq: r.seq });
    }
  }
  return new Response(
    JSON.stringify({ pageSize: PAGE, total: rows.length, pages: Math.ceil(rows.length / PAGE), chapters }),
    { headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
};
