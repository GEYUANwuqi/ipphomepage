import { argbFromHex, Blend, Hct, hexFromArgb, SchemeTonalSpot, TonalPalette } from '@material/material-color-utilities';

import { DEFAULT_SEED } from './presets';
export { DEFAULT_SEED, THEME_PRESETS } from './presets';

const roles = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground', 'surface', 'onSurface', 'surfaceDim', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'surfaceVariant', 'onSurfaceVariant', 'outline', 'outlineVariant', 'inverseSurface', 'inverseOnSurface',
  'shadow', 'scrim', 'surfaceTint',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
] as const;

const kebab = (role: string) => role.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/** HCT hue of warm printing paper. At low chroma every tone on this hue keeps R >= G >= B. */
const PAPER_HUE = 120;
/** How far the paper hue may drift toward the seed. 0.18 keeps it inside 88-152deg: never pink, never green. */
const PAPER_BLEND = 0.18;

/** Warm off-white neutral replacing the seed-tinted M3 one. Blend.harmonize is deliberately not used:
 *  it caps rotation at 15deg, so every seed collapses onto one of two hues. Blend.hctHue is continuous.
 *  Chroma tracks the seed too, so two seeds cannot quantize to the same off-white near tone 100. */
function paperPalette(source: number) {
  const anchor = Hct.from(PAPER_HUE, 30, 60).toInt();
  const hue = Hct.fromInt(Blend.hctHue(anchor, source, PAPER_BLEND)).hue;
  return TonalPalette.fromHueAndChroma(hue, 2.5 + Math.min(Hct.fromInt(source).chroma, 60) / 30);
}

/** Outline sits at 45 rather than M3's 50: tone 50 on the new surface only clears 4.5:1 by 4%. */
const PAPER_TONES = {
  light: {
    surface: 97.5, background: 97.5, surfaceBright: 99, surfaceDim: 87,
    surfaceContainerLowest: 100, surfaceContainerLow: 96, surfaceContainer: 94,
    surfaceContainerHigh: 92, surfaceContainerHighest: 90,
    onSurface: 10, onBackground: 10, onSurfaceVariant: 38, surfaceVariant: 90,
    outline: 45, outlineVariant: 80, inverseSurface: 22, inverseOnSurface: 96,
  },
  dark: {
    surface: 7, background: 7, surfaceBright: 26, surfaceDim: 6,
    surfaceContainerLowest: 4, surfaceContainerLow: 10, surfaceContainer: 12,
    surfaceContainerHigh: 17, surfaceContainerHighest: 22,
    onSurface: 92, onBackground: 92, onSurfaceVariant: 78, surfaceVariant: 32,
    outline: 62, outlineVariant: 38, inverseSurface: 92, inverseOnSurface: 22,
  },
} as const;

export function normalizeSeed(seed: unknown): string | null {
  return typeof seed === 'string' && /^#[a-f\d]{6}$/i.test(seed) ? seed.toLowerCase() : null;
}

/** Google's HCT Tonal Spot scheme, standard contrast. Never recolor by hue rotation. */
export function buildPalette(seed: string, dark: boolean): Record<string, string> {
  const source = argbFromHex(normalizeSeed(seed) ?? DEFAULT_SEED);
  const scheme = new SchemeTonalSpot(Hct.fromInt(source), dark, 0);
  const tokens: Record<string, string> = {};
  for (const role of roles) tokens[`--md-sys-color-${kebab(role)}`] = hexFromArgb(scheme[role]);
  // Warm paper replaces the seed-tinted M3 neutral. Accent and illustration colors stay untouched.
  const paper = paperPalette(source);
  for (const [role, tone] of Object.entries(PAPER_TONES[dark ? 'dark' : 'light'])) {
    tokens[`--md-sys-color-${kebab(role)}`] = hexFromArgb(paper.tone(tone));
  }
  tokens['--lavender'] = hexFromArgb(scheme.primaryContainer);
  tokens['--on-lavender'] = hexFromArgb(scheme.onPrimaryContainer);
  // Preserve the semantic identity of green/sunset accents while harmonizing them to the seed.
  for (const [name, color] of [['mint', '#47785b'], ['peach', '#b66b37']]) {
    const accent = new SchemeTonalSpot(Hct.fromInt(Blend.harmonize(argbFromHex(color), source)), dark, 0);
    tokens[`--${name}`] = hexFromArgb(accent.primaryContainer);
    tokens[`--on-${name}`] = hexFromArgb(accent.onPrimaryContainer);
    tokens[`--${name}-ink`] = hexFromArgb(accent.primary);
    // Low-chroma fixed-tone illustrations retain their identity across light/dark modes.
    const fixed = TonalPalette.fromHueAndChroma(accent.primaryPalette.hue, 18);
    tokens[`--art-${name}`] = hexFromArgb(fixed.tone(88));
    tokens[`--art-on-${name}`] = hexFromArgb(fixed.tone(25));
    tokens[`--art-${name}-shadow`] = hexFromArgb(fixed.tone(75));
  }
  tokens['--art-primary'] = hexFromArgb(scheme.primaryPalette.tone(80));
  tokens['--art-on-primary'] = hexFromArgb(scheme.primaryPalette.tone(25));
  tokens['--art-primary-shadow'] = hexFromArgb(scheme.primaryPalette.tone(70));
  tokens['--art-paper'] = hexFromArgb(scheme.primaryPalette.tone(98));
  return tokens;
}
