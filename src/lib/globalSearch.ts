import { search } from './search';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(text: string, q: string): string {
  const i = text.indexOf(q);
  if (i === -1) return esc(text);
  const before = esc(text.slice(0, i));
  const hit = esc(text.slice(i, i + q.length));
  const after = esc(text.slice(i + q.length));
  return `${before}<mark>${hit}</mark>${after}`;
}

function wireSearch(): void {
  const input = document.getElementById('globalSearch') as HTMLInputElement | null;
  const box = document.getElementById('searchResults');
  if (!input || !box) return;

  let timer: number | undefined;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    const q = input.value.trim();
    if (!q) {
      box.style.display = 'none';
      box.innerHTML = '';
      return;
    }
    timer = window.setTimeout(async () => {
      box.innerHTML = '<div style="padding:14px;font-size:12px;color:var(--color-muted)">检索中…</div>';
      box.style.display = 'block';
      const hits = await search(q, 15);
      if (hits.length === 0) {
        box.innerHTML =
          '<div style="padding:14px;font-size:12px;color:var(--color-muted)">无结果，试试：统觉 / 存在不是谓词 / 二律背反 / 因果律</div>';
        box.style.display = 'block';
        return;
      }
      box.innerHTML = hits
        .map(
          ({ doc, snippet }) => `
          <a href="${esc(doc.url)}" class="search-item">
            <div class="search-item-title">${esc(doc.title)}</div>
            <div class="search-item-desc">${snippet ? highlight(snippet, q) : esc(doc.content.slice(0, 120))}</div>
            <div class="search-item-url mono">${esc(doc.url)}</div>
          </a>`
        )
        .join('');
      box.style.display = 'block';
    }, 120);
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest('#searchWrap')) box.style.display = 'none';
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', wireSearch);
}
