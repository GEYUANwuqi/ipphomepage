import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { Check, Moon, Palette, Sparkles, Sun, X } from 'lucide-react';
import { Button } from '../ui';
import { buildPalette, DEFAULT_SEED, normalizeSeed, THEME_PRESETS } from './palette';
import { applyPreferences, readPreferences, type ThemePreferences } from './preferences';
import { elementCenter, revealTheme } from './reveal';

export function ThemeControls() {
  const [theme, setTheme] = useState(readPreferences);
  const [selectedSeed, setSelectedSeed] = useState(theme.seed);
  const requested = useRef(theme);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [custom, setCustom] = useState(theme.seed);
  const [error, setError] = useState('');
  const presets = useMemo(
    () => THEME_PRESETS.map(p => ({ ...p, colors: buildPalette(p.seed, theme.dark) })),
    [theme.dark]
  );

  function change(next: ThemePreferences, source: HTMLElement) {
    requested.current = next;
    setSelectedSeed(next.seed); // Native radio feedback is immediate, not delayed by snapshot readiness.
    void revealTheme(
      () =>
        flushSync(() => {
          applyPreferences(next);
          setTheme(next);
        }),
      elementCenter(source)
    );
  }
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key && !['ipp-theme', 'ipp-seed'].includes(event.key)) return;
      const next = readPreferences();
      requested.current = next;
      setSelectedSeed(next.seed);
      // Cancel an in-flight transition using the same coordinator; latest tab change wins.
      void revealTheme(
        () => {
          applyPreferences(next, false);
          setTheme(next);
        },
        { x: innerWidth / 2, y: 0 }
      );
    };
    addEventListener('storage', sync);
    return () => removeEventListener('storage', sync);
  }, []);
  function open() {
    setCustom(requested.current.seed);
    setError('');
    dialog.current?.showModal();
  }
  function applyCustom() {
    const seed = normalizeSeed(custom.trim());
    if (!seed) {
      setError('请输入完整的十六进制颜色，例如 #6750a4。');
      return;
    }
    setError('');
    change({ ...requested.current, seed }, document.getElementById('custom-color-preview')!);
  }
  const selectedName = THEME_PRESETS.find(p => p.seed === theme.seed)?.name ?? '自定义';
  return (
    <div className="theme-controls">
      <button
        ref={trigger}
        className="icon-button palette-toggle"
        onClick={open}
        aria-label="选择主题色"
        aria-haspopup="dialog"
        title="选择主题色"
      >
        <Palette size={21} />
        <span className="theme-indicator" />
      </button>
      <button
        className="icon-button mode-toggle"
        onClick={event => change({ ...requested.current, dark: !requested.current.dark }, event.currentTarget)}
        aria-label={theme.dark ? '切换浅色模式' : '切换深色模式'}
        title={theme.dark ? '切换浅色模式' : '切换深色模式'}
      >
        <span key={String(theme.dark)} className="mode-symbol">
          {theme.dark ? <Sun size={21} /> : <Moon size={21} />}
        </span>
      </button>
      <dialog
        ref={dialog}
        className="m3-dialog theme-dialog"
        aria-labelledby="theme-title"
        aria-describedby="theme-description"
        onClick={event => {
          if (event.target === dialog.current) {
            const r = dialog.current.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)
              dialog.current.close();
          }
        }}
      >
        <div className="card-top">
          <span className="theme-dialog-icon">
            <Palette size={25} />
          </span>
          <button className="icon-button" onClick={() => dialog.current?.close()} aria-label="关闭主题设置">
            <X size={21} />
          </button>
        </div>
        <h2 id="theme-title">主题设置</h2>
        <p id="theme-description">
          从一个颜色出发，生成完整的 Material 3 昼夜配色。不是简单换色，而是让整个空间一起呼应。
        </p>
        <fieldset className="theme-presets">
          <legend>预设主题色</legend>
          <div className="theme-swatch-grid">
            {presets.map(p => (
              <label
                key={p.seed}
                className={`theme-swatch ${selectedSeed === p.seed ? 'selected' : ''}`}
                style={
                  {
                    '--swatch-primary': p.colors['--md-sys-color-primary'],
                    '--swatch-secondary': p.colors['--md-sys-color-secondary-container'],
                    '--swatch-tertiary': p.colors['--md-sys-color-tertiary-container'],
                    '--swatch-on-primary': p.colors['--md-sys-color-on-primary']
                  } as CSSProperties
                }
              >
                <input
                  type="radio"
                  name="theme-seed"
                  value={p.seed}
                  checked={selectedSeed === p.seed}
                  onChange={event => {
                    setCustom(p.seed);
                    setError('');
                    change({ ...requested.current, seed: p.seed }, event.currentTarget.closest('label')!);
                  }}
                />
                <span className="swatch-colors" aria-hidden="true">
                  <span />
                  <span />
                  {selectedSeed === p.seed && <Check size={20} />}
                </span>
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <form
          className="custom-theme"
          onSubmit={event => {
            event.preventDefault();
            applyCustom();
          }}
        >
          <label className="custom-color-picker" id="custom-color-preview" title="打开系统颜色选择器">
            <span className="sr-only">自定义取色器</span>
            <input
              type="color"
              value={normalizeSeed(custom) ?? theme.seed}
              onChange={event => {
                setCustom(event.target.value);
                setError('');
              }}
            />
          </label>
          <label className="field custom-hex">
            自定义主题色
            <input
              value={custom}
              onChange={event => {
                setCustom(event.target.value);
                setError('');
              }}
              maxLength={7}
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={!!error}
              aria-describedby={error ? 'theme-error' : undefined}
              placeholder="#6750a4"
            />
          </label>
          <Button variant="filled-tonal" onClick={applyCustom}>
            应用
          </Button>
        </form>
        {error && (
          <p id="theme-error" className="theme-error" role="alert">
            {error}
          </p>
        )}
        <div className="theme-preview" aria-label="当前主题配色预览">
          <span className="preview-spark">
            <Sparkles size={22} />
          </span>
          <div>
            <strong>
              {selectedName} · {theme.dark ? '夜色' : '日光'}
            </strong>
            <span>尊重对比度，让每一种热爱都清晰。</span>
          </div>
          <span className="preview-dot" />
        </div>
        <p className="theme-help">偏好仅保存在此浏览器。证书图片保留社团统一样式。</p>
        <div className="dialog-actions">
          <Button
            variant="text"
            onClick={() => {
              setCustom(DEFAULT_SEED);
              setError('');
              change({ ...requested.current, seed: DEFAULT_SEED }, trigger.current!);
            }}
          >
            恢复默认色
          </Button>
          <Button onClick={() => dialog.current?.close()}>完成</Button>
        </div>
      </dialog>
    </div>
  );
}
