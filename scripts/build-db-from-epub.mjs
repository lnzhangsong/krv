#!/usr/bin/env node
// 解析邓晓芒《纯粹理性批判》句读 epub，重建 data/kant.db 的 chunks 表
// 语义连续：按 h2 小节标题切分，剔除书前内容
// 用法：node scripts/build-db-from-epub.mjs <epub路径>
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';

const epubPath = process.argv[2];
if (!epubPath) {
  console.error('用法: node scripts/build-db-from-epub.mjs <epub路径>');
  process.exit(1);
}

// 1) 解压 epub 到临时目录
const tmp = join(tmpdir(), 'kant-epub-' + Date.now());
mkdirSync(tmp, { recursive: true });
try {
  execSync(`unzip -o -q "${epubPath}" -d "${tmp}"`, { stdio: 'inherit' });
} catch {
  console.error('解压失败，请确认是有效 epub');
  process.exit(1);
}

const opf = readFileSync(join(tmp, 'content.opf'), 'utf-8');
const items = Object.fromEntries(
  [...opf.matchAll(/<item\s+href="([^"]+)"[^>]*id="([^"]+)"/g)].map((m) => [m[2], m[1]])
);
const spine = [...opf.matchAll(/<itemref\s+idref="([^"]+)"/g)].map((m) => m[1]);

const clean = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s*\n\s*/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2')
    .trim();

// 书前内容（封面/版权/简介/贺词/自序）的标题特征
const FRONT_MATTER = /^(简介|作者简介|贺词|自序)$/;
const BODY_START = /^(第一版序|第二版序|导言)/;

const chunks = [];
let seq = 0;
let inBody = false;
let lastTitle = '';

// 版权/印刷信息段落特征
const META_LINE = /^(ISBN|CIP|开本|印张|字数|印数|邮购|人民东方|中国版本图书馆|KANGDE|责任编辑|封面设计|版式设计|责任校对|定价|①|2010年|2013年|(100706|\d{6}))|编辑部|北京朝阳门|句读\/邓晓芒著|I\.康…/;

for (const id of spine) {
  const href = items[id];
  if (!href || !/\.(html|xhtml)$/.test(href)) continue;
  let raw;
  try {
    raw = readFileSync(join(tmp, href), 'utf-8');
  } catch {
    continue;
  }
  const sections = [];

  // 提取文件内标题（全部 h1-h4）
  const heads = [...raw.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => clean(m[2]));

  // 按标题分段：收集段落，遇到新标题则更新
  const tokens = [...raw.matchAll(/<(h[1-4]|p|div|h5|h6)\b[^>]*>([\s\S]*?)<\/\1>/g)];
  let currentTitle = heads[0] || lastTitle;

  for (const tok of tokens) {
    const tag = tok[1];
    const text = clean(tok[2]);
    if (!text) continue;
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
      currentTitle = text;
    } else {
      let t = text.startsWith('未知 ') ? text.slice(3) : text;
      if (META_LINE.test(t)) continue; // 跳过版权/印刷信息
      sections.push({ title: currentTitle, text: t });
    }
  }
  lastTitle = currentTitle || lastTitle;

  // 剔除书前内容：正文从“第一版序”开始
  for (const sec of sections) {
    if (!inBody) {
      if (FRONT_MATTER.test(sec.title)) continue;
      if (BODY_START.test(sec.title)) inBody = true;
      else continue; // 未到正文前的版权/CIP 等
    }
    if (sec.text.length < 20) continue;
    chunks.push({ chapter: sec.title || '未分章', text: sec.text, seq: seq++ });
  }
  sections.length = 0;
}

// 3) 重建 SQLite
const outPath = new URL('../data/kant.db', import.meta.url).pathname;
rmSync(outPath, { force: true });
const db = new DatabaseSync(outPath);
db.exec(`
  CREATE TABLE chunks (
    id TEXT PRIMARY KEY,
    seq INTEGER,
    chapter TEXT,
    start_page INTEGER,
    end_page INTEGER,
    text TEXT
  );
  CREATE INDEX idx_chunks_seq ON chunks(seq);
`);
const ins = db.prepare('INSERT INTO chunks (id, seq, chapter, start_page, end_page, text) VALUES (?, ?, ?, ?, ?, ?)');
db.exec('BEGIN');
chunks.forEach((c, i) => {
  const page = i + 1;
  ins.run(`s${i + 1}`, c.seq, c.chapter, page, page, c.text);
});
db.exec('COMMIT');
db.close();

const totalChars = chunks.reduce((s, c) => s + c.text.length, 0);
console.log(`完成：${chunks.length} 段，共 ${totalChars.toLocaleString()} 字`);
const chapCount = new Set(chunks.map((c) => c.chapter)).size;
console.log('章节数:', chapCount);
const chapters = [...new Set(chunks.map((c) => c.chapter))];
console.log('前 6 章:', chapters.slice(0, 6).join(' | '));
console.log('末 3 章:', chapters.slice(-3).join(' | '));

rmSync(tmp, { recursive: true, force: true });
