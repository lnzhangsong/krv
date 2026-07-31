import { commentDB } from './commentDB';

let readingOn = false;

export function initReader(): void {
  const toggle = document.getElementById('toggleReading');
  const drawer = document.getElementById('drawer');
  const close = document.getElementById('closeDrawer');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    readingOn = !readingOn;
    document.body.classList.toggle('reading-on', readingOn);
    toggle.classList.toggle('on', readingOn);
    toggle.innerHTML = readingOn ? '● 精读：点击高亮句' : '○ 开启逐句精读模式';
  });
  close?.addEventListener('click', () => drawer?.classList.remove('open'));
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const el = target.closest('.readable') as HTMLElement | null;
    if (!el) return;
    if (!readingOn && !el.closest('#drawer') && !document.body.classList.contains('reading-on')) {
      return;
    }
    showEntry(el.dataset.key);
  });
}

export function showEntry(key?: string): void {
  const drawer = document.getElementById('drawer');
  if (!key || !drawer) return;
  const data = commentDB[key];
  if (!data) return;
  document.querySelectorAll('.readable.active').forEach((n) => n.classList.remove('active'));
  const el = document.querySelector(`[data-key="${key}"]`);
  el?.classList.add('active');
  document.getElementById('drawerRef')!.textContent = data.ref;
  document.getElementById('drawerOrig')!.textContent = '「' + data.original + '」';
  document.getElementById('drawerDeng')!.textContent = data.deng;
  document.getElementById('drawerTip')!.textContent = data.tip;
  drawer.classList.add('open');
}

export function setReadingOn(on: boolean): void {
  readingOn = on;
  document.body.classList.toggle('reading-on', on);
}
