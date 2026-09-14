import { buildPalette, DEFAULT_SEED, normalizeSeed } from './palette';

export interface ThemePreferences { dark: boolean; seed: string; }
export function readPreferences(): ThemePreferences {
  let mode: string | null = null;
  let seed: string | null = null;
  try { mode = localStorage.getItem('ipp-theme'); seed = localStorage.getItem('ipp-seed'); } catch { /* Private browsing may deny storage. */ }
  return { dark: mode === 'dark' || (mode !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches), seed: normalizeSeed(seed) ?? DEFAULT_SEED };
}

const styles = new Map<string, string>();
function paletteCss(seed: string) {
  if (!styles.has(seed)) {
    const declarations = (dark: boolean) => Object.entries(buildPalette(seed, dark)).map(([key, value]) => `${key}:${value}`).join(';');
    // Both modes are present, so CSS media/debug tools and browser snapshots see complete schemes.
    styles.set(seed, `:root,:root[data-theme="light"]{${declarations(false)}}:root[data-theme="dark"]{${declarations(true)}}`);
    if (styles.size > 16) styles.delete(styles.keys().next().value!);
  }
  return styles.get(seed)!;
}

export function applyPreferences(theme: ThemePreferences, persist = true) {
  let style = document.getElementById('ipp-dynamic-palette');
  if (!style) { style = document.createElement('style'); style.id = 'ipp-dynamic-palette'; document.head.append(style); }
  if (style.dataset.seed !== theme.seed) { style.textContent = paletteCss(theme.seed); style.dataset.seed = theme.seed; }
  document.documentElement.dataset.theme = theme.dark ? 'dark' : 'light';
  document.documentElement.dataset.seed = theme.seed;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface').trim());
  if (persist) {
    try { localStorage.setItem('ipp-theme', theme.dark ? 'dark' : 'light'); localStorage.setItem('ipp-seed', theme.seed); } catch { /* The in-memory theme still works. */ }
  }
}
