# KRV V5 · 康德《纯粹理性批判》句读导读站

邓晓芒句读精读 + 7594 段全文直读 + 全站检索的静态学习站点。数据全部本地内置/懒加载，无后端，构建后可直接部署到任意静态托管。

- 全文：7594 段（约 183 万字），语义分段、书式排版
- 句读：217 条手工精选（原文位置 + 邓晓芒讲解 + 学习提示）
- 术语：分类速查 + 原文中悬浮释义（同类对照）
- 结构：全书论证树（总问题 → 四大部 → 各步论证 → 概念）

## 功能

- **全文直读**（`/quanwen/`）：分页浏览（每页 15 段）、字号/行距调节、章节跳转、段号跳转、阅读位置记忆
- **学习闭环**：段落收藏（书签 ★）、批注、选中文字高亮（CSS Custom Highlight API），全部保存在本地 `localStorage`
- **句读全库**（`/deng/`）：217 条精选句读，按序言/导言/四大部浏览
- **术语库**（`/glossary/`）：全文术语分类速查；阅读原文时悬停/点按 `.term` 即显示定义与同类对照
- **知识结构网**（`/map/`）：全书论证树可视化
- **全站搜索**：懒加载 `/search-index.json`，支持整词、双字组合、单字组合匹配
- **深色模式**：手动切换 + 跟随系统，`localStorage` 记忆，首帧渲染前恢复主题（无闪烁）
- **响应式**：移动端导航、阅读工具栏自适应

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | [Astro](https://astro.build) 7（静态生成，零前端框架组件，交互用原生 `<script>`） |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite` 插件） |
| 语言 | TypeScript |
| 数据 | `node:sqlite`（构建期读取 `data/kant.db`） |
| 字体 | LXGW WenKai（`cdn.jsdelivr.net`）+ Noto Serif SC / Inter / JetBrains Mono（Google Fonts），`font-display: swap` |

> 需要 Node.js ≥ 22.5（`node:sqlite` 为 Node 内置模块）。

## 快速开始

```bash
npm install
npm run dev        # 本地开发：http://localhost:4321
npm run build      # 静态构建，输出 dist/
npm run preview    # 预览构建产物
npm run check      # astro check 类型检查
```

## 项目结构

```
data/
  kant.db                 SQLite 全文数据库（chunks 表，7594 段）
scripts/
  build-db-from-epub.mjs  从邓晓芒句读 epub 重建 data/kant.db
public/
  fonts/                  静态资源（字体等，可选）
src/
  layouts/Base.astro      全站布局：导航、主题、术语悬浮、搜索入口
  components/PageHead.astro
  lib/
    glossary.ts           术语库（数据 + 原文 wrapTerms 处理）
    commentDB.ts          217 条句读精选
    knowledge.ts          知识结构网数据
    search.ts             全站搜索逻辑（懒加载索引）
    globalSearch.ts       顶部搜索框交互
    reading.ts            阅读偏好/书签/批注/高亮的本地存储
  pages/
    index.astro           首页
    quanwen/index.astro   全文直读（7594 段）
    deng/index.astro      句读全库（217 条）
    glossary/index.astro  术语库
    map/index.astro       知识结构网
    aesthetic/ analytic/ dialectic/ method/   四大部导读
    search-index.json.ts  全站检索索引（构建时生成）
astro.config.mjs          Astro + Tailwind v4 配置
```

## 数据

- 全文数据来自 `data/kant.db`（单表 `chunks`：`id, seq, chapter, text`），构建期由各页面通过 `node:sqlite` 读取；如需从 epub 重新生成，运行 `node scripts/build-db-from-epub.mjs <epub路径>`。
- 句读精选（217 条）与术语库以 TypeScript 模块内置于 `src/lib/`，构建期内嵌进页面。
- 全局搜索索引 `/search-index.json` 在构建时生成（约 6MB，gzip 后 ~1.7MB），客户端懒加载。

## 部署

产物为纯静态文件（`dist/`），可部署到 GitHub Pages、Netlify、Vercel、nginx 等任意静态托管。

- 建议开启 gzip/brotli 压缩：`quanwen` 页运行时会 `fetch('/search-index.json')`（未压缩约 6MB）。
- 页面切换为 MPA（多页应用），导航即整页刷新。

## 性能与实现要点

- **全文页轻量化**：`/quanwen/` 的 HTML 仅约 80KB——7594 段全文**不内嵌**，改为客户端懒加载 `/search-index.json` 再分页渲染（SSR 首屏 15 段先行显示）。
- **暗色模式无闪烁**：主题恢复脚本放在 `<head>` 最前，首帧渲染前同步设置 `data-theme`。
- **文字立即显示**：不隐藏文字等待 webfont（`font-display: swap` 自动切换），全文页翻页不等字体。
- **翻页防卡顿**：全文页数据未就绪时操作会提示"全文加载中"，就绪后恢复位置静默定位（不高亮闪烁）。

## 已知问题

- `npm run check` 会报 `node:sqlite` / `node:path` / `process` 的类型缺失错误（项目未安装 `@types/node`），不影响构建；可 `npm i -D @types/node` 消除。
