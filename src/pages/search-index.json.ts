// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const prerender = true;

interface ChunkRow { id: string; start: number; end: number; text: string }

const clean = (t: string) =>
  t.replace(/\s*\n\s*/g, ' ').replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2').trim();

export const GET: APIRoute = () => {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const rows = db.prepare('SELECT id, start_page AS start, end_page AS end, text FROM chunks').all() as ChunkRow[];
  db.close();
  const chunks = rows.map((c) => ({ ...c, text: clean(c.text) }));
  return new Response(JSON.stringify({ total: chunks.length, chunks }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
