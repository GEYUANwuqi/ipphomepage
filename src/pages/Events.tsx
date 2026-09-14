import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flag, MapPin, Trophy } from 'lucide-react';
import type { ClubEvent } from '../../shared/content';
import { events, eventRoles, eventStatuses } from '../content';
import { ExternalLink } from '../ui';
import { PawMark } from '../components/Mascot';
export function eventDate(date: string) { const [year, month, day] = date.split('-'); return `${year}.${month}.${day}`; }
function EventCard({ event }: { event: ClubEvent }) {
  const [failed, setFailed] = useState(false);
  return <article className="event-card surface-card"><div className="event-date"><CalendarDays size={22} /><strong>{event.startDate.slice(0, 4)}</strong><span>{event.startDate.slice(5).replace('-', '.')}</span></div><div className="event-copy"><div className="event-labels"><span className="chip">{eventStatuses[event.status]}</span><span>IppClub · {eventRoles[event.role]}</span></div><h2>{event.name}</h2><p>{event.summary}</p><div className="event-facts"><span><CalendarDays size={16} />{eventDate(event.startDate)}{event.endDate && event.endDate !== event.startDate && ` — ${eventDate(event.endDate)}`}</span>{event.location && <span><MapPin size={16} />{event.location}</span>}</div><div className="project-links">{event.links.map((link, i) => <ExternalLink key={`${link.url}-${i}`} href={link.url}>{link.label}</ExternalLink>)}</div></div>{event.cover && !failed && <img className="event-cover" src={event.cover} alt={event.coverAlt ?? ''} loading="lazy" onError={() => setFailed(true)} />}</article>;
}
export function Events() {
  const [status, setStatus] = useState('all');
  const visible = events.filter(e => status === 'all' || e.status === status).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return <div className="page events-page"><div className="collection-hero"><div><div className="eyebrow muted">A PLACE FOR OUR NEXT CHALLENGE</div><h1>把创作，<br />带到更大的现场。</h1><p>记录社团主办、承办与参与支持的赛事，<br />也为未来的开源游戏创作，留一块展示空间。</p></div><div className="event-hero-art" aria-hidden="true"><span className="event-pennant"><Flag size={52} /></span><span className="event-paw"><PawMark /></span><span className="event-plus">++</span></div></div>
    {events.length ? <><div className="filter-chips event-filters" role="group" aria-label="赛事状态"><button aria-pressed={status === 'all'} onClick={() => setStatus('all')}>全部赛事</button>{Object.entries(eventStatuses).map(([value, label]) => <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}</div><p className="collection-count" role="status">已收录 {visible.length} 场赛事</p><div key={status} className="event-list swap-collection">{visible.map(e => <EventCard key={e.id} event={e} />)}</div>{!visible.length && <div className="collection-empty"><Trophy size={36} /><h2>这个分类还没有赛事。</h2><p>可以切换到“全部赛事”查看其他记录。</p></div>}</> : <section className="events-empty surface-card"><div className="empty-ticket" aria-hidden="true"><span>I++ / NEXT CHAPTER</span><Trophy size={46} /><div /><p>留给下一次共同创造</p></div><div><span className="chip">赛事展台已预留</span><h2>第一场，留给未来。</h2><p><strong>目前暂无已公布赛事。</strong><br />确定举办信息后，这里将展示赛事介绍、时间、社团参与身份及相关链接。没有报名开放或倒计时，也不把设想当作已经发生的活动。</p><Link className="text-link" to="/projects">先逛逛项目工坊 <ArrowRight size={18} /></Link></div></section>}
    <div className="events-about"><h2>灵感可以从很小的地方开始。</h2><p>在下一次活动消息到来之前，你可以从一份开源示例、一段游戏对话，或者一个自己的小项目开始。</p><ExternalLink className="text-link" href="https://github.com/IppClub/Dora-Example">探索 Dora SSR 示例</ExternalLink></div>
  </div>;
}
