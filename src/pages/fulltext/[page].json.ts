// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = true;

const PAGE = 15;

export function getStaticPaths() {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const total = (db.prepare('SELECT COUNT(*) AS c FROM chunks').get() as { c: number }).c;
  db.close();
  const n = Math.max(1, Math.ceil(total / PAGE));
  return Array.from({ length: n }, (_, i) => ({ params: { page: String(i + 1) } }));
}

// 每页 15 段；prevChapter 为上一页最后一段的章节，用于判断本页首段是否新章节开头
export const GET: APIRoute = ({ params }) => {
  const p = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const lo = (p - 1) * PAGE;
  const chunks = db
    .prepare('SELECT id, seq, chapter, text FROM chunks ORDER BY seq LIMIT ? OFFSET ?')
    .all(PAGE, lo) as { id: string; seq: number; chapter: string; text: string }[];
  let prevChapter = '';
  if (lo > 0) {
    const prev = db.prepare('SELECT chapter FROM chunks ORDER BY seq LIMIT 1 OFFSET ?').get(lo - 1) as
      | { chapter: string }
      | undefined;
    if (prev) prevChapter = prev.chapter;
  }
  db.close();
  return new Response(JSON.stringify({ page: p, prevChapter, chunks }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
