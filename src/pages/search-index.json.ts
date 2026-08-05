// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = true;

interface ChunkRow { id: string; seq: number; chapter: string; text: string }

const clean = (t: string) =>
  t.replace(/\s*\n\s*/g, ' ').replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2').trim();

export const GET: APIRoute = () => {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const rows = db.prepare('SELECT id, seq, chapter, text FROM chunks ORDER BY seq').all() as ChunkRow[];
  db.close();
  const chunks = rows.map((c) => ({ seq: c.seq, chapter: c.chapter, text: clean(c.text) }));
  return new Response(JSON.stringify({ total: chunks.length, chunks }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
