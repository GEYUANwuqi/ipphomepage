import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium, expect } from '@playwright/test';
import { createApp } from '../server/app.ts';
import { contentValidationPlugin, validateContent } from '../scripts/content-validation.ts';

function assertNoMocks(dist: string) {
  for (const file of readdirSync(dist, { recursive: true }) as string[]) {
    if (!/\.(js|json|svg|html|css)$/.test(file)) continue;
    const text = readFileSync(join(dist, file), 'utf8');
    assert.ok(
      !text.includes('IPP_DEV_PEOPLE_ONLY') && !text.includes('dev-person-') && !text.includes('示例 · 星屿'),
      `Development data leaked into ${file}`
    );
    assert.ok(!file.includes('mockPeople'), `Development module leaked: ${file}`);
  }
}
async function listen(app: express.Express) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close: () => new Promise<void>(resolve => server.close(() => resolve()))
  };
}
assertNoMocks(resolve('dist'));
const published = validateContent(process.cwd());
const browser = await chromium.launch();
const production = createApp({
  dbPath: ':memory:',
  production: true,
  origin: 'https://iplusplus.club',
  adminPassword: 'isolated-production-test-password'
});
const server = await listen(production.app);
const fixtureRoot = mkdtempSync(join(tmpdir(), 'ipp-production-fixture-'));
try {
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    (window as any).cspErrors = [];
    document.addEventListener('securitypolicyviolation', e => (window as any).cspErrors.push(e.violatedDirective));
  });
  for (const path of ['/', '/people', '/projects', '/events']) {
    assert.equal((await page.goto(server.url + path))?.status(), 200);
    await expect(page.locator('main h1')).toBeVisible();
    const expectedPeople =
      path === '/'
        ? published.people.filter(p => p.featured).slice(0, 4).length
        : path === '/people'
          ? published.people.length
          : 0;
    await expect(page.locator('.person-book')).toHaveCount(expectedPeople);
    await expect(page.locator('.demo-people-notice')).toHaveCount(0);
    assert.deepEqual(await page.evaluate(() => (window as any).cspErrors), []);
  }
  if (!published.events.length) await expect(page.getByText('目前暂无已公布赛事。', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '切换深色模式' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition', 'reveal');
  assert.deepEqual(await page.evaluate(() => (window as any).cspErrors), []);
  await page.close();
  assert.deepEqual(errors, []);

  // Only an isolated temporary copy gets fictional records. The real public content stays empty.
  cpSync('src', join(fixtureRoot, 'src'), { recursive: true });
  cpSync('shared', join(fixtureRoot, 'shared'), { recursive: true });
  cpSync('public', join(fixtureRoot, 'public'), { recursive: true });
  cpSync('index.html', join(fixtureRoot, 'index.html'));
  symlinkSync(resolve('node_modules'), join(fixtureRoot, 'node_modules'), 'dir');
  mkdirSync(join(fixtureRoot, 'public/images/people'), { recursive: true });
  writeFileSync(
    join(fixtureRoot, 'public/images/people/fixture.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c9bddf"/></svg>'
  );
  writeFileSync(
    join(fixtureRoot, 'src/content/people.json'),
    JSON.stringify({
      people: [
        {
          id: 'production-fixture',
          name: '生产夹具伙伴',
          avatar: '/images/people/fixture.svg',
          description: '仅用于自动化测试，不是真实成员。',
          title: '测试身份',
          year: 2025,
          group: 'supporter',
          featured: true,
          links: [{ label: '测试链接', url: 'https://example.com' }]
        },
        {
          id: 'fixture-long-profile',
          name: 'N'.repeat(80),
          avatar: '/images/people/fixture.svg',
          description: 'D'.repeat(3000),
          title: 'T'.repeat(80),
          year: 2026,
          group: 'core',
          links: Array.from({ length: 4 }, (_, i) => ({
            label: 'Bookmark'.repeat(5),
            url: `https://example.com/long-${i}`
          }))
        }
      ]
    })
  );
  writeFileSync(
    join(fixtureRoot, 'src/content/events.json'),
    JSON.stringify({
      events: [
        {
          id: 'fixture-past',
          name: '承办样例（仅测试）',
          summary: '仅在临时构建中验证赛事显示。',
          role: 'organizer',
          status: 'completed',
          startDate: '2025-05-01',
          endDate: '2025-05-03',
          location: '测试场地',
          links: [{ label: '作品归档', url: 'https://example.com/results' }]
        },
        {
          id: 'fixture-next',
          name: '联合主办样例（仅测试）',
          summary: '未在真实网站发布的测试记录。',
          role: 'cohost',
          status: 'upcoming',
          startDate: '2030-06-01'
        }
      ]
    })
  );
  await build({
    root: fixtureRoot,
    configFile: false,
    plugins: [contentValidationPlugin(), react()],
    logLevel: 'error'
  });
  assertNoMocks(join(fixtureRoot, 'dist'));
  const fixtureApp = express();
  fixtureApp.use(express.static(join(fixtureRoot, 'dist')));
  fixtureApp.get('/{*path}', (_req, res) => res.sendFile(join(fixtureRoot, 'dist/index.html'), { dotfiles: 'allow' })); // TMP may sit under a dot directory, which sendFile rejects by default.
  const fixture = await listen(fixtureApp);
  try {
    const page = await browser.newPage();
    await page.goto(fixture.url + '/');
    await expect(page.getByRole('heading', { name: '生产夹具伙伴' })).toBeVisible();
    await page.goto(fixture.url + '/people');
    await expect(page.locator('.person-book')).toHaveCount(2);
    await expect(page.locator('.demo-people-notice')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: '支持者', exact: true })).toBeVisible();
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Long member fields overflow at ${width}`
      );
      const longBook = page.locator('[data-person-id="fixture-long-profile"]');
      const bounds = await longBook.evaluate(book => ({
        bottom: book.getBoundingClientRect().bottom,
        bookmarks: book.querySelector('.person-bookmarks')!.getBoundingClientRect().bottom
      }));
      assert.ok(bounds.bookmarks <= bounds.bottom, 'Long bookmark labels overflow the book vertically');
      await expect(longBook.locator('.person-bookmark')).toHaveCount(4);
    }
    await page.goto(fixture.url + '/events');
    await expect(page.locator('.event-card')).toHaveCount(2);
    await expect(page.getByText('IppClub · 承办', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /作品归档/ })).toHaveAttribute('href', 'https://example.com/results');
    await page.getByRole('button', { name: '即将开始', exact: true }).click();
    await expect(page.locator('.event-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: '联合主办样例（仅测试）' })).toBeVisible();
    await page.getByRole('button', { name: '进行中', exact: true }).click();
    await expect(page.getByRole('heading', { name: '这个分类还没有赛事。' })).toBeVisible();
    await page.close();
  } finally {
    await fixture.close();
  }
  console.log(
    'Production content passed: no dev mocks; empty states; production CSP/theme; JSON-only member/avatar addition; event listing, dates, roles, links and filters.'
  );
} finally {
  await browser.close();
  await server.close();
  production.db.close();
  rmSync(fixtureRoot, { recursive: true, force: true });
}
