import sharp from 'sharp';
import QRCode from 'qrcode';
import type { Result } from '../shared/types.ts';
const escape = (s: string) => s.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);
export async function certificatePng(result: Result, origin: string) {
  const url = result.certificateId ? `${origin}/verify/${result.certificateId}` : `${origin}/assessment`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 180, color: { dark: '#302546', light: '#ffffff' } });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <rect width="1600" height="1100" fill="#f8f5ff"/><rect x="32" y="32" width="1536" height="1036" rx="32" fill="none" stroke="#c9b8e8" stroke-width="2"/>
  <circle cx="1480" cy="50" r="330" fill="#e9dfff"/><circle cx="55" cy="1060" r="230" fill="#d4eee2"/>
  <g font-family="Noto Sans CJK SC, Noto Sans, sans-serif" fill="#302546">
  <text x="105" y="150" font-size="58" font-weight="800">I++</text><text x="235" y="150" font-size="28" letter-spacing="5">CLUB</text>
  <text x="105" y="230" font-size="22" letter-spacing="5" fill="#6750a4">GROW TOGETHER, ONE PLUS AT A TIME.</text>
  <text x="800" y="390" text-anchor="middle" font-size="62" font-weight="700">${result.demo ? '演示问卷 · 体验纪念' : '素质审核通过证书'}</text>
  <text x="800" y="465" text-anchor="middle" font-size="24" fill="#665c72">${result.demo ? 'DEMO · NOT A VALID CERTIFICATE' : 'CERTIFICATE OF ASSESSMENT'}</text>
  <text x="800" y="600" text-anchor="middle" font-size="54" font-weight="700">${escape(result.displayName)}</text>
  <text x="800" y="684" text-anchor="middle" font-size="27">已完成 I++ Club 社区规则问卷，得分 ${result.score} / 100</text>
  <text x="800" y="734" text-anchor="middle" font-size="23" fill="#665c72">通过标准 ${result.passScore} 分 · 规则版本 v${result.version} · ${escape(result.issuedAt.slice(0, 10))}</text>
  <text x="105" y="900" font-size="19">${result.demo ? '演示结果不具备正式认证效力' : `证书编号：${escape(result.certificateId!)}`}</text>
  <text x="105" y="944" font-size="20" fill="#665c72">仅证明本次问卷达标；昵称由答题者自填，不构成实名或人格认证。</text>
  <text x="105" y="990" font-size="18" fill="#665c72">${result.demo ? '正式审核尚未签发此证书。' : '请扫描二维码核对当前有效状态，以在线验真结果为准。'}</text>
  </g><image href="${qr}" x="1295" y="825" width="180" height="180"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
