import { z } from 'zod';

const text = (max: number) => z.string().trim().min(1).max(max);
const id = text(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id 只能使用小写英文、数字和连字符');
const url = text(2048).url().refine(value => {
  try { const parsed = new URL(value); return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password; } catch { return false; }
}, '链接必须是无账号密码的 http(s) 地址');
const localImage = text(300).regex(/^\/images\/(people|projects|events)\/.+\.(png|jpe?g|webp|avif|svg)$/i, '图片必须位于 /images/people、projects 或 events 下')
  .refine(value => !/[\\%?#\u0000-\u001f]/.test(value) && !value.slice(1).split('/').some(part => part === '.' || part === '..' || !part), '图片路径不允许越界或特殊 URL 字符');
export const linkSchema = z.object({ label: text(40), url }).strict();
const links = z.array(linkSchema).max(30).default([]);
export const personSchema = z.object({
  id, name: text(80), avatar: localImage, description: text(3000), title: text(80),
  year: z.number().int().min(1900).max(2100), group: z.enum(['core', 'supporter']),
  featured: z.boolean().default(false), links,
}).strict();
export const projectSchema = z.object({
  id, name: text(100), summary: text(1000), category: z.enum(['engine', 'language', 'framework', 'game']),
  relationship: text(200), tags: z.array(text(30)).max(8), featured: z.boolean().default(false),
  cover: localImage.optional(), coverAlt: text(200).optional(),
  illustration: z.enum(['engine', 'code', 'story', 'game']).optional(),
  links, licenseNote: text(600), sourceUrl: url,
}).strict().refine(p => !!p.coverAlt || !p.cover, '提供封面时必须填写 coverAlt');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式为 YYYY-MM-DD').refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, '日期不存在');
export const eventSchema = z.object({
  id, name: text(100), summary: text(2000),
  status: z.enum(['upcoming', 'ongoing', 'completed']),
  role: z.enum(['host', 'cohost', 'organizer', 'support']),
  startDate: isoDate, endDate: isoDate.optional(), location: text(120).optional(),
  cover: localImage.optional(), coverAlt: text(200).optional(), links,
}).strict().superRefine((event, ctx) => {
  if (event.endDate && event.endDate < event.startDate) ctx.addIssue({ code: 'custom', message: '结束日期不能早于开始日期' });
  if (event.cover && !event.coverAlt) ctx.addIssue({ code: 'custom', message: '提供封面时必须填写 coverAlt' });
});
function unique<T extends { id: string }>(items: T[], ctx: z.RefinementCtx) {
  const seen = new Set<string>();
  items.forEach((item, i) => { if (seen.has(item.id)) ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `重复 id：${item.id}` }); seen.add(item.id); });
}
export const peopleFileSchema = z.object({ people: z.array(personSchema).superRefine(unique) }).strict();
export const projectsFileSchema = z.object({ projects: z.array(projectSchema).superRefine(unique) }).strict();
export const eventsFileSchema = z.object({ events: z.array(eventSchema).superRefine(unique) }).strict();
export type Person = z.infer<typeof personSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ClubEvent = z.infer<typeof eventSchema>;
export type ContentLink = z.infer<typeof linkSchema>;
