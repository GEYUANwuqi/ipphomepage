import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import type { Attempt, Question } from '../shared/types';
const origin = 'http://localhost:5173';
async function adminContext(request: APIRequestContext) {
  const login = await request.post('/api/admin/login', { headers: { Origin: origin }, data: { password: 'browser-test-only-password' } }); expect(login.ok()).toBeTruthy();
  return request;
}
async function setMode(request: APIRequestContext, enabled: boolean) {
  await adminContext(request);
  expect((await request.put('/api/admin/settings', { headers: { Origin: origin }, data: { enabled, questionCount: 14, passScore: 80, reviewed: true } })).ok()).toBeTruthy();
}
async function complete(page: Page, questions: Question[], formal: boolean) {
  await page.goto('/assessment');
  await page.getByLabel('证书昵称', { exact: false }).fill('好奇心测试员');
  await page.getByRole('checkbox').check();
  const created = page.waitForResponse(r => r.url().endsWith('/api/attempts') && r.request().method() === 'POST');
  await page.getByRole('button', { name: formal ? '开始正式问卷' : '开始演示问卷' }).click();
  const a: Attempt = await (await created).json();
  expect(a.questions.some(q => 'correct' in q || 'explanation' in q)).toBeFalsy();
  await expect(page.locator('.question-panel')).toBeVisible();
  for (let i = 0; i < a.questions.length; i++) {
    const q = a.questions[i], known = questions.find(item => item.id === q.id)!;
    if (q.points) for (const correct of known.correct) await page.locator('.answer-option').nth(correct).click();
    else if (q.type === 'text') await page.getByRole('textbox', { name: '你的想法' }).fill('一起完善文档，帮助后来的人。');
    else await page.locator('.scale-options label').nth(4).click();
    if (i < a.questions.length - 1) {
      await page.getByRole('button', { name: '下一题', exact: true }).click();
      if (i === 0) expect(await page.locator('.question-body').evaluate(e => getComputedStyle(e).animationName)).toBe('surface-switch');
    }
  }
  await page.getByRole('button', { name: '提交并查看结果' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '确认提交', exact: true }).click();
  await expect(page.getByRole('heading', { name: '这一次成长，值得记录。' })).toBeVisible();
  return a;
}
test('layout at narrow and tablet widths and accessible light/dark entry pages', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Width matrix is run once');
  for (const width of [320, 375, 600, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/assessment', '/verify', '/admin']) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      const overflow = await page.evaluate(() => ({ ok: document.documentElement.scrollWidth <= innerWidth, elements: [...document.querySelectorAll('main *, footer *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map(e => `${e.tagName}.${e.className}: ${Math.round(e.getBoundingClientRect().right)}`) }));
      expect(overflow.ok, `${route} overflows at ${width}px: ${overflow.elements.join(', ')}`).toBeTruthy();
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/assessment', '/verify', '/admin']) {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical'), `${route} ${theme}`).toEqual([]);
    }
  }
});
test('homepage navigation, theme persistence and responsive layout', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /让好奇心，\s*不断加一。/ })).toBeVisible();
  await expect(page.locator('.blog-card')).toHaveAttribute('href', 'https://ippclub.org/');
  await expect(page.locator('.blogroll-card')).toHaveAttribute('href', 'https://ippclub.org/blogroll/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: info.outputPath('homepage-light.png'), fullPage: true });
  await page.getByRole('button', { name: '切换深色模式' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: info.outputPath('homepage-dark.png'), fullPage: true });
  await page.locator('.quiz-card').click();
  await expect(page.getByRole('heading', { name: /好的社区，\s*从彼此理解开始。/ })).toBeVisible();
  expect(errors).toEqual([]);
});
test('demo all five question types, server scoring, PNG download and reload', async ({ page, request }, info) => {
  await setMode(request, false);
  const questions: Question[] = (await (await request.get('/api/admin')).json()).questions;
  const a = await complete(page, questions, false);
  await expect(page.getByRole('heading', { name: '演示结果 · 已通过' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: info.outputPath('demo-result.png'), fullPage: true });
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载演示纪念图片' }).click();
  const file = await downloaded; expect(file.suggestedFilename()).toContain('DEMO');
  const png = await readFile((await file.path())!); expect([...png.subarray(0, 8)]).toEqual([137,80,78,71,13,10,26,10]);
  await file.saveAs(info.outputPath('certificate-demo.png'));
  await page.reload(); await expect(page.getByRole('heading', { name: '演示结果 · 已通过' })).toBeVisible();
  const result = (await (await page.request.get(`/api/attempts/${a.id}`)).json()).result;
  expect(result.score).toBe(100); expect(result.certificateId).toBeNull();
});
test('formal certificate public verification and revocation', async ({ page, request }, info) => {
  await setMode(request, true);
  const questions: Question[] = (await (await request.get('/api/admin')).json()).questions;
  await complete(page, questions, true);
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载证书 PNG' }).click();
  await (await downloaded).saveAs(info.outputPath('certificate-formal.png'));
  await page.getByRole('link', { name: '查看公开验真' }).click();
  await expect(page.getByRole('heading', { name: '有效 · 已通过审核' })).toBeVisible();
  await page.screenshot({ path: info.outputPath('verification.png'), fullPage: true });
  const id = page.url().split('/').pop();
  await request.post(`/api/admin/certificates/${id}/revoke`, { headers: { Origin: origin }, data: {} });
  await page.reload(); await expect(page.getByRole('heading', { name: '证书已撤销' })).toBeVisible();
});
test('admin UI CRUD, publish safeguard and logout', async ({ page, request }, info) => {
  await setMode(request, false);
  await page.goto('/admin');
  await page.getByLabel('管理密码').fill('browser-test-only-password');
  await page.getByRole('button', { name: '安全登录' }).click();
  await expect(page.getByRole('heading', { name: '让共识，有条不紊。' })).toBeVisible();
  await page.getByRole('button', { name: '添加题目', exact: true }).click();
  await page.getByRole('combobox', { name: '题型', exact: true }).selectOption('text');
  await page.getByLabel('题目内容').fill('浏览器测试：你想分享什么？');
  await page.getByRole('button', { name: '保存题目' }).click();
  await expect(page.getByRole('heading', { name: '浏览器测试：你想分享什么？' })).toBeVisible();
  await page.getByRole('button', { name: '编辑：浏览器测试：你想分享什么？' }).click();
  await page.getByLabel('题目内容').fill('浏览器测试：修改后的题目');
  await page.getByRole('button', { name: '保存题目' }).click();
  await page.getByRole('button', { name: '删除：浏览器测试：修改后的题目' }).click();
  await page.getByRole('button', { name: '确认操作' }).click();
  await expect(page.getByRole('heading', { name: '浏览器测试：修改后的题目' })).toHaveCount(0);
  await page.getByRole('button', { name: '审核设置', exact: true }).click();
  await page.getByRole('switch').check();
  await expect(page.getByRole('button', { name: '保存设置' })).toBeDisabled();
  await page.getByRole('checkbox', { name: /我代表社团确认/ }).check();
  await page.getByRole('button', { name: '保存设置' }).click();
  await expect(page.getByText('审核设置已保存', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: info.outputPath('admin-settings.png'), fullPage: true });
  await page.getByRole('button', { name: '退出登录' }).click();
  await expect(page.getByRole('heading', { name: '管理员登录', exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
test('draft survives refresh and invalid verification has useful feedback', async ({ page, request }) => {
  await setMode(request, false);
  await page.goto('/assessment');
  await page.getByLabel('证书昵称', { exact: false }).fill('进度测试');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '开始演示问卷' }).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  // Find a scored question without depending on the randomized order.
  const a: Attempt = await (await page.request.get(`/api/attempts/${page.url().split('/').pop()}`)).json();
  const index = a.questions.findIndex(q => q.points > 0);
  await page.locator('.question-dots button').nth(index).click();
  await page.locator('.answer-option').first().click();
  await expect(page.getByText('答案已保存', { exact: true })).toBeVisible();
  await page.reload();
  await page.locator('.question-dots button').nth(index).click();
  await expect(page.locator('.answer-option input').first()).toBeChecked();
  await page.goto('/verify');
  await page.getByLabel('证书编号', { exact: true }).fill('not-a-certificate');
  await page.getByRole('button', { name: '查询证书' }).click();
  await expect(page.getByRole('alert')).toContainText('完整证书编号');
  await page.getByLabel('证书编号', { exact: true }).fill('00000000-0000-0000-0000-000000000000');
  await page.getByRole('button', { name: '查询证书' }).click();
  await expect(page.getByRole('alert')).toContainText('未找到该证书');
});
