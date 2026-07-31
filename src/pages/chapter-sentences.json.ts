// @ts-nocheck  node:sqlite 为构建期 Node 内置模块，由 Astro 处理
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { parseSentences } from '../lib/parse';
import { CHAPTERS } from '../lib/chapters';

export const prerender = true;

interface ChunkRow { id: string; seq: number; chapter: string; text: string }

export const GET: APIRoute = () => {
  const db = new DatabaseSync(path.join(process.cwd(), 'data/kant.db'));
  const rows = db.prepare('SELECT id, seq, chapter, text FROM chunks ORDER BY seq').all() as ChunkRow[];
  db.close();
  const out = CHAPTERS.map((ch) => {
    const list = rows
      .filter((r) => r.seq >= ch.lo && r.seq <= ch.hi)
      .flatMap((r) => parseSentences(r.text, r.id, r.seq));
    return { key: ch.key, title: ch.title, lo: ch.lo, hi: ch.hi, count: list.length, sentences: list };
  });
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
