import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

/** Configuration only: request headers must still match an allowed origin exactly. */
export function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.hostname.includes('*')
  ) {
    throw new Error('来源必须是明确的 HTTP(S) 协议、主机和端口，不含路径、通配符或账号密码');
  }
  return url.origin;
}
export function trustedOrigins(origin: string, production: boolean, development: string[] = []) {
  return new Set([normalizeOrigin(origin), ...(production ? [] : development.map(normalizeOrigin))]);
}
const developmentConfig = z.object({ allowedOrigins: z.array(z.string().min(1)).max(12) }).strict();
/** Local, explicit opt-in only. Never read or apply development exceptions in production. */
export function loadDevelopmentOrigins(production: boolean, root = process.cwd()): string[] {
  if (production) return [];
  const path = resolve(root, 'dev.local.json');
  if (!existsSync(path)) return [];
  try {
    return developmentConfig.parse(JSON.parse(readFileSync(path, 'utf8'))).allowedOrigins.map(normalizeOrigin);
  } catch (error) {
    throw new Error(`dev.local.json 来源配置无效：${error instanceof Error ? error.message : String(error)}`);
  }
}
