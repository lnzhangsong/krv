// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { parseSentences } from '../lib/parse';

export const prerender = true;

export const CHAPTERS: { key: string; title: string; lo: number; hi: number }[] = [
  { key: 'aesthetic', title: '先验感性论', lo: 269, hi: 499 },
  { key: 'analytic', title: '先验分析论', lo: 500, hi: 1345 },
  { key: 'dialectic', title: '先验辩证论', lo: 1346, hi: 1975 },
  { key: 'method', title: '先验方法论', lo: 1976, hi: 2381 },
];

interface ChunkRow { id: string; start_page: number; end_page: number; text: string }

export const GET: APIRoute = () => {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const rows = db.prepare('SELECT id, start_page, end_page, text FROM chunks').all() as ChunkRow[];
  db.close();
  const out = CHAPTERS.map((ch) => {
    const list = rows
      .filter((r) => r.start_page >= ch.lo && r.start_page <= ch.hi)
      .flatMap((r) => parseSentences(r.text, r.id, r.start_page));
    return { key: ch.key, title: ch.title, lo: ch.lo, hi: ch.hi, count: list.length, sentences: list };
  });
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
