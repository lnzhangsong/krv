import { buildIndex, search } from '../lib/search';

function wireSearch(): void {
  buildIndex();
  const input = document.getElementById('globalSearch') as HTMLInputElement | null;
  const box = document.getElementById('searchResults');
  if (!input || !box) return;
  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) {
      box.style.display = 'none';
      box.innerHTML = '';
      return;
    }
    const hits = search(q, 15);
    if (hits.length === 0) {
      box.innerHTML =
        '<div style="padding:12px;color:var(--muted)">无结果，试试：统觉 存在不是谓词 二律背反 因果律</div>';
      box.style.display = 'block';
      return;
    }
    box.innerHTML = hits
      .map(
        ({ doc }) => `
        <a href="${doc.url}" style="display:block;padding:10px 14px;border-bottom:1px solid var(--line);text-align:left">
          <div style="font-weight:700;font-size:13px">${doc.title}</div>
          <div style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${doc.content.slice(0, 120)}</div>
          <div style="font-size:10px;color:var(--accent2)" class="mono">${doc.url}</div>
        </a>`
      )
      .join('');
    box.style.display = 'block';
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest('#searchWrap')) box.style.display = 'none';
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', wireSearch);
}
