import { createElement, type ReactNode } from 'react';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import { AlertCircle, ArrowUpRight, LoaderCircle } from 'lucide-react';
export function Button({
  children,
  variant = 'filled',
  ...props
}: {
  children: ReactNode;
  variant?: 'filled' | 'filled-tonal' | 'outlined' | 'text';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  'aria-label'?: string;
}) {
  return createElement(`md-${variant}-button`, { type: 'button', ...props }, children);
}
export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  return (
    <div className={`notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <AlertCircle size={20} />
      <div>{children}</div>
    </div>
  );
}
export function Loading() {
  return (
    <div className="loading" role="status">
      <LoaderCircle className="spin" /> 正在连接 I++ Club…
    </div>
  );
}
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight size={18} />
      <span className="sr-only">（新窗口打开）</span>
    </a>
  );
}
export async function api<T>(path: string, body?: unknown, method = body === undefined ? 'GET' : 'POST'): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({ error: '服务器响应异常' }));
  if (!response.ok) throw new Error(data.error || '请求失败');
  return data as T;
}
export const message = (error: unknown) => (error instanceof Error ? error.message : '操作失败，请重试');
export const date = (value: string | number) =>
  new Date(value).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
