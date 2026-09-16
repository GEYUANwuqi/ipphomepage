import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Search, ShieldCheck, ShieldX } from 'lucide-react';
import type { Certificate } from '../../shared/types';
import { api, Button, date, Loading, message, Notice } from '../ui';
export function Verify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(id ?? '');
  const [record, setRecord] = useState<Certificate | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setRecord(null); setError(''); setInput(id ?? '');
    if (id) {
      setLoading(true);
      api<Certificate>(`/certificates/${encodeURIComponent(id)}`).then(r => { if (!cancelled) setRecord(r); }).catch(e => { if (!cancelled) setError(message(e)); }).finally(() => { if (!cancelled) setLoading(false); });
    } else setLoading(false);
    return () => { cancelled = true; };
  }, [id, refresh]);
  function search() {
    const value = input.trim();
    setRecord(null);
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) { setError('请输入图片上的完整证书编号（UUID 格式），不是答题记录编号。'); return; }
    if (value.toLowerCase() === id) setRefresh(n => n + 1);
    else navigate(`/verify/${value.toLowerCase()}`);
  }
  return <div className="page verify-page narrow"><div className="result-heading"><span className="page-symbol mint"><ShieldCheck size={30} /></span><h1>证书验真</h1><p>输入证书编号，或扫描证书上的二维码，核对 I++ Club 签发的审核记录。</p></div><section className="surface-card verify-card"><form onSubmit={e => { e.preventDefault(); search(); }}><label className="field">证书编号<input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={input} onChange={e => setInput(e.target.value)} maxLength={36} required autoCapitalize="none" spellCheck={false} /></label><Button onClick={search} disabled={loading} className="full-button"><Search size={18} />查询证书</Button></form>{loading && <Loading />}{error && <Notice tone="error">{error}</Notice>}{record && <div className="verification-result"><div className={`verification-status ${record.revoked ? 'revoked' : ''}`}>{record.revoked ? <ShieldX size={32} /> : <BadgeCheck size={32} />}<div><h2>{record.revoked ? '证书已撤销' : '有效 · 已通过审核'}</h2><p>{record.revoked ? '这份证书不再有效，请勿作为审核通过凭据使用。' : '该记录确由本系统签发，当前未被撤销。'}</p></div></div><dl className="detail-list"><div><dt>答题昵称（自填）</dt><dd>{record.displayName}</dd></div><div><dt>问卷得分</dt><dd>{record.score} / 100</dd></div><div><dt>签发时间</dt><dd>{date(record.issuedAt)}</dd></div><div><dt>规则版本</dt><dd>v{record.version}</dd></div><div><dt>证书编号</dt><dd className="mono">{record.id}</dd></div></dl></div>}</section><p className="verification-note">验真不等于身份核验。证书仅证明某次问卷达标，不能证明持有人就是答题者，也不构成人格评价或自动入社资格。演示纪念图片无法查询。</p><Link className="text-link centered" to="/assessment">了解素质问卷 <ArrowRight size={18} /></Link></div>;
}
