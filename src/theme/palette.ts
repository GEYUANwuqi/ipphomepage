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

export function normalizeSeed(seed: unknown): string | null {
  return typeof seed === 'string' && /^#[a-f\d]{6}$/i.test(seed) ? seed.toLowerCase() : null;
}

/** Google's HCT Tonal Spot scheme, standard contrast. Never recolor by hue rotation. */
export function buildPalette(seed: string, dark: boolean): Record<string, string> {
  const source = argbFromHex(normalizeSeed(seed) ?? DEFAULT_SEED);
  const scheme = new SchemeTonalSpot(Hct.fromInt(source), dark, 0);
  const tokens: Record<string, string> = {};
  for (const role of roles) {
    const name = role.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    tokens[`--md-sys-color-${name}`] = hexFromArgb(scheme[role]);
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
