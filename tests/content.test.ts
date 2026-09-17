import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { eventSchema, peopleFileSchema, personSchema, projectSchema } from '../shared/content.ts';
import { validateContent } from '../scripts/content-validation.ts';
import { makeMockPeople } from '../src/dev/mockPeople.ts';
import { buildPalette, THEME_PRESETS } from '../src/theme/palette.ts';
const person = {
  id: 'sample-person',
  name: '样例',
  avatar: '/images/people/avatar.svg',
  description: '一段介绍',
  title: '支持者',
  year: 2025,
  group: 'supporter'
};
const event = {
  id: 'sample-event',
  name: '测试数据，不是真实赛事',
  summary: '用于校验的数据',
  role: 'organizer',
  status: 'completed',
  startDate: '2024-02-29'
};

test('people contract supports defaults and rejects incorrect years, groups, links and paths', () => {
  assert.deepEqual(personSchema.parse(person).links, []);
  assert.equal(personSchema.parse(person).featured, false);
  assert.equal(personSchema.parse(person).lead, false);
  assert.equal(peopleFileSchema.safeParse({ people: [{ ...person, lead: true }] }).success, true);
  assert.equal(
    peopleFileSchema.safeParse({
      people: [
        { ...person, lead: true },
        { ...person, id: 'other-person', lead: true }
      ]
    }).success,
    false
  );
  for (const changes of [
    { year: '2025' },
    { year: 2025.5 },
    { year: 12 },
    { group: 'president' },
    { avatar: '/images/people/../private.png' },
    { avatar: '/images/people/%2e%2e/private.png' },
    { avatar: 'https://example.com/avatar.png' },
    { avatar: '/images/people/\\foo.svg' },
    { links: [{ label: '不安全', url: 'javascript:alert(1)' }] },
    { links: [{ label: '密码', url: 'https://user:password@example.com' }] }
  ])
    assert.equal(personSchema.safeParse({ ...person, ...changes }).success, false, JSON.stringify(changes));
  assert.equal(peopleFileSchema.safeParse({ people: [person, person] }).success, false);
  assert.equal(personSchema.safeParse({ ...person, typo: 'not accepted' }).success, false);
});
test('event dates and explicit involvement/status are validated without invented schedules', () => {
  assert.equal(eventSchema.parse(event).role, 'organizer');
  for (const changes of [
    { startDate: '2025-02-29' },
    { endDate: '2024-02-28' },
    { startDate: '2025-13-01' },
    { status: 'draft' },
    { role: 'owner' }
  ])
    assert.equal(eventSchema.safeParse({ ...event, ...changes }).success, false);
  assert.equal(
    eventSchema.safeParse({ ...event, links: [{ label: '作品集', url: 'https://example.com/results' }] }).success,
    true
  );
  assert.equal(eventSchema.safeParse({ ...event, cover: '/images/events/banner.webp' }).success, false);
});
test('project covers require alt text and do not infer open-source asset permissions', () => {
  const p = {
    id: 'project',
    name: '项目',
    summary: '简介',
    category: 'game',
    relationship: '技术支持',
    tags: [],
    licenseNote: '素材独立授权',
    sourceUrl: 'https://example.com',
    cover: '/images/projects/cover.png'
  };
  assert.equal(projectSchema.safeParse(p).success, false);
  assert.equal(projectSchema.safeParse({ ...p, coverAlt: '项目截图' }).success, true);
});
test('content validator rejects missing assets and symlinks outside public; normalizes valid files', () => {
  const root = mkdtempSync(join(tmpdir(), 'ipp-content-unit-'));
  try {
    mkdirSync(join(root, 'src/content'), { recursive: true });
    mkdirSync(join(root, 'public/images/people'), { recursive: true });
    writeFileSync(join(root, 'src/content/people.json'), JSON.stringify({ people: [{ ...person, name: ' 样例 ' }] }));
    writeFileSync(join(root, 'src/content/projects.json'), '{"projects":[]}');
    writeFileSync(join(root, 'src/content/events.json'), '{"events":[]}');
    assert.throws(() => validateContent(root), /图片不存在/);
    const avatar = join(root, 'public/images/people/avatar.svg');
    writeFileSync(avatar, '<svg xmlns="http://www.w3.org/2000/svg"/>');
    assert.equal(validateContent(root).people[0].name, '样例');
    writeFileSync(join(root, 'outside.svg'), '<svg/>');
    rmSync(avatar);
    symlinkSync(join(root, 'outside.svg'), avatar);
    assert.throws(() => validateContent(root), /越出 public/);
    writeFileSync(join(root, 'src/content/people.json'), '{broken');
    assert.throws(() => validateContent(root), /people.json/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('development directory is deterministic and includes all layout edge cases', () => {
  const people = makeMockPeople();
  assert.equal(people.length, 12);
  assert.deepEqual(people, makeMockPeople());
  assert.ok(people.some(p => p.links.length === 0));
  assert.ok(people.some(p => p.links.length > 3));
  assert.equal(new Set(people.map(p => p.id)).size, 12);
  assert.equal(people.filter(p => p.featured).length, 4);
  assert.equal(people.filter(p => p.lead).length, 1);
  assert.equal(people[0].lead, true);
  assert.ok(people.every(p => p.avatar.startsWith('data:image/svg+xml,')));
  assert.ok(people.some(p => p.group === 'supporter'));
});
test('all decorative art colors are mode-invariant while M3 surfaces still adapt', () => {
  for (const seed of [...THEME_PRESETS.map(p => p.seed), '#000000', '#ffffff']) {
    const light = buildPalette(seed, false),
      dark = buildPalette(seed, true);
    for (const key of Object.keys(light).filter(k => k.startsWith('--art-')))
      assert.equal(light[key], dark[key], `${seed}/${key}`);
    assert.notEqual(light['--md-sys-color-surface'], dark['--md-sys-color-surface']);
  }
});
