// Client-side runtime (React-free). Language is route-based; this handles theme toggle + mobile menu.
type Theme = 'system' | 'light' | 'dark';

const THEME_KEY = 'khiproteam-theme';

function applyTheme(theme: Theme) {
  const sysPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  html.setAttribute('data-system-pref', sysPref);
  html.setAttribute('data-actual-theme', theme === 'system' ? sysPref : theme);
}

function currentTheme(): Theme {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system';
}

function toggleTheme() {
  const order: Theme[] = ['system', 'light', 'dark'];
  const next = order[(order.indexOf(currentTheme()) + 1) % order.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggles = document.querySelectorAll<HTMLElement>('[data-menu-toggle]');
  if (!menu) return;
  const overlay = menu.querySelector<HTMLElement>('[data-menu-overlay]');
  const panel = menu.querySelector<HTMLElement>('[data-menu-panel]');

  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    overlay?.classList.toggle('opacity-100', open);
    overlay?.classList.toggle('pointer-events-auto', open);
    panel?.classList.toggle('max-h-[70vh]', open);
    panel?.classList.toggle('overflow-y-auto', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggles.forEach((b) => b.setAttribute('aria-expanded', String(open)));
  };

  toggles.forEach((b) => b.addEventListener('click', () => setOpen(menu.hidden)));
  overlay?.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll<HTMLElement>('[data-menu-close]').forEach((a) =>
    a.addEventListener('click', () => setOpen(false)),
  );
}

document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', toggleTheme),
);
initMenu();
