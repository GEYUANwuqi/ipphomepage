import test from 'node:test';
import assert from 'node:assert/strict';
import { argbFromHex, Contrast, lstarFromArgb } from '@material/material-color-utilities';
import { buildPalette, DEFAULT_SEED, normalizeSeed, THEME_PRESETS } from '../src/theme/palette.ts';
import { circleGeometry } from '../src/theme/reveal.ts';

test('theme input is normalized, invalid input cannot enter generated CSS', () => {
  assert.equal(normalizeSeed('#AABBCC'), '#aabbcc');
  for (const invalid of ['red', '#fff', '#12zz00', '#6750a4; color:red', '', null])
    assert.equal(normalizeSeed(invalid), null);
  assert.deepEqual(buildPalette('invalid', false), buildPalette(DEFAULT_SEED, false));
});
test('all presets and extreme custom seeds generate complete readable M3 light/dark pairs', () => {
  const pairs = [
    ['primary', 'on-primary'],
    ['primary-container', 'on-primary-container'],
    ['secondary', 'on-secondary'],
    ['secondary-container', 'on-secondary-container'],
    ['tertiary', 'on-tertiary'],
    ['tertiary-container', 'on-tertiary-container'],
    ['surface', 'on-surface'],
    ['surface-container', 'on-surface-variant'],
    ['error', 'on-error'],
    ['error-container', 'on-error-container']
  ];
  for (const seed of [
    ...THEME_PRESETS.map(p => p.seed),
    '#000000',
    '#ffffff',
    '#ffff00',
    '#00ff00',
    '#ff00ff',
    '#013141'
  ]) {
    for (const dark of [false, true]) {
      const colors = buildPalette(seed, dark);
      assert.ok(Object.keys(colors).length >= 50);
      Object.values(colors).forEach(color => assert.match(color, /^#[a-f\d]{6}$/));
      for (const [background, foreground] of pairs) {
        const contrast = Contrast.ratioOfTones(
          lstarFromArgb(argbFromHex(colors[`--md-sys-color-${background}`])),
          lstarFromArgb(argbFromHex(colors[`--md-sys-color-${foreground}`]))
        );
        assert.ok(contrast >= 4.5, `${seed} ${dark} ${background}: ${contrast}`);
      }
      for (const accent of ['mint', 'peach', 'lavender']) {
        assert.ok(
          Contrast.ratioOfTones(
            lstarFromArgb(argbFromHex(colors[`--${accent}`])),
            lstarFromArgb(argbFromHex(colors[`--on-${accent}`]))
          ) >= 4.5
        );
      }
    }
  }
  assert.notEqual(
    buildPalette(DEFAULT_SEED, false)['--md-sys-color-surface'],
    buildPalette('#008577', false)['--md-sys-color-surface']
  );
});
test('reveal circle is centered on the trigger and covers every viewport corner', () => {
  for (const [width, height] of [
    [320, 800],
    [1440, 900],
    [1920, 1080]
  ]) {
    for (const point of [
      { x: width - 40, y: 50 },
      { x: width / 2, y: height / 2 },
      { x: -100, y: height + 50 }
    ]) {
      const circle = circleGeometry(point, width, height);
      assert.ok(circle.x >= 0 && circle.x <= width && circle.y >= 0 && circle.y <= height);
      for (const [x, y] of [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height]
      ])
        assert.ok(Math.hypot(x - circle.x, y - circle.y) < circle.radius);
    }
  }
});

test('every preset gets a distinct warm off-white page', () => {
  const surfaces = THEME_PRESETS.map(preset => buildPalette(preset.seed, false)['--md-sys-color-surface']);
  assert.equal(new Set(surfaces).size, surfaces.length, `surfaces collided: ${surfaces}`);
  for (const hex of surfaces) {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    assert.ok(r >= g && g >= b, `${hex} is not warm`);
    assert.ok(r >= 240 && b >= 225, `${hex} is not an off-white`);
  }
});
