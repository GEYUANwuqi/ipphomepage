import { ArrowRight, ArrowUpRight, BookOpen, Check, Code2, Compass, Fingerprint, HeartHandshake, MoveUpRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useArtParallax } from '../motion';
import { CatSignature, PawMark } from '../components/Mascot';
import { ProjectCard } from '../components/ProjectCard';
import { PersonBook } from '../components/PersonBook';
import { DemoPeopleNotice, usePeople } from '../content/PeopleProvider';
import { events, projects } from '../content';
function PlusArt() {
  const parallax = useArtParallax();
  return <div className="hero-art" aria-hidden="true" {...parallax}>
    <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
    <div className="art-tile tile-purple"><span>i</span><span className="tile-dot" /><CatSignature className="hero-cat-mark" /></div>
    <div className="art-tile tile-green">+</div><div className="art-tile tile-peach">+</div>
    <div className="art-spark">✳</div><div className="art-code"><Code2 size={29} /></div>
    <div className="art-note"><MoveUpRight size={22} /></div>
    <div className="art-dot dot-one" /><div className="art-dot dot-two" /><div className="art-cross">+</div>
  </div>;
}
export function Home() {
  const { people, isDemo } = usePeople();
  const featuredPeople = people.filter(p => p.featured).slice(0, 4);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  return <div className="home page">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><h1 id="hero-title" aria-label="让好奇心，不断加一。">{['让好奇心，', '不断加一。'].map((line, row) => <span key={line} className="title-line" aria-hidden="true">{[...line].map((letter, i) => <span key={i} className={`title-letter ${letter === '。' ? 'title-period' : ''}`} style={{ '--letter-index': row * 6 + i } as CSSProperties}>{letter}</span>)}</span>)}</h1>
        <p className="hero-description">我们做游戏引擎、编程语言和开源工具，也写博客。</p>
        <div className="hero-actions"><a className="link-button" href="#explore">探索我们的空间 <ArrowRight size={19} /></a><Link className="text-link" to="/assessment">从一份问卷开始 <ArrowUpRight size={18} /></Link></div>
        </div><PlusArt />
    </section>
    <section id="explore" className="explore-section">
      <div className="service-grid">
        <a className="service-card blog-card" href="https://ippclub.org/" target="_blank" rel="noopener noreferrer"><div className="card-top"><span className="service-icon"><BookOpen /></span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration book-art" aria-hidden="true"><div className="book-page"><span /><span /><span /><b>ideas_</b></div><div className="book-back" /><span className="book-star">✳</span></div><h3>社团博客</h3><p>技术实践、折腾记录与不设限的想法。</p><span className="sr-only">（新窗口打开）</span></a>
        <a className="service-card blogroll-card" href="https://ippclub.org/blogroll/" target="_blank" rel="noopener noreferrer"><div className="card-top"><span className="service-icon"><Compass /></span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration connection-art" aria-hidden="true"><div className="connect-line" /><span className="bubble bubble-one"><Code2 size={30} /></span><span className="bubble bubble-two">hello!</span><span className="bubble bubble-three">✳</span><span className="bubble bubble-four">↗</span></div><h3>Blogroll · 友邻星球</h3><p>一份友链列表，通往独立而鲜活的博客。</p><span className="sr-only">（新窗口打开）</span></a>
        <Link className="service-card quiz-card" to="/assessment"><div className="card-top"><span className="service-icon"><Fingerprint /></span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration certificate-art" aria-hidden="true"><div className="mini-certificate"><span>I++ CLUB</span><i /><i /><div className="mini-seal"><Check size={25} /></div></div><span className="certificate-spark">✧</span></div><h3>素质问卷</h3><p>随机抽题，答完了解社区共识与行为准则。</p></Link>
      </div>
    </section>
    <section className="home-projects" aria-labelledby="home-projects-title"><div className="section-heading"><div><h2 id="home-projects-title">我们做的项目</h2></div><Link className="text-link" to="/projects">进入项目工坊 <ArrowRight size={18} /></Link></div><div className="home-project-grid">{featuredProjects.map((p, i) => <ProjectCard key={p.id} project={p} featured={i === 0} compact />)}</div></section>
    {!!featuredPeople.length && <section className="home-people" aria-labelledby="home-people-title"><div className="section-heading"><div><h2 id="home-people-title">成员与支持者<PawMark /></h2></div><Link className="text-link" to="/people">查看全部成员 <ArrowRight size={18} /></Link></div>{isDemo && <DemoPeopleNotice />}<div className="people-grid featured-people-grid">{featuredPeople.map(p => <PersonBook key={p.id} person={p} />)}</div></section>}
    <section className="home-events" aria-labelledby="home-events-title"><span className="event-teaser-icon"><Trophy size={30} /></span><div><h2 id="home-events-title">赛事</h2><p>{events.length ? `赛事展台已收录 ${events.length} 场赛事。` : '赛事展台已预留，还没有已公布的赛事。'}</p></div><Link className="link-button" to="/events">查看赛事展台 <ArrowRight size={18} /></Link></section>
    <section className="home-values" aria-labelledby="home-values-title"><HeartHandshake size={25} /><div><h2 id="home-values-title">社区共识</h2><p>尊重不同观点、保护个人信息、善意协作。</p></div><Link className="text-link" to="/assessment">了解社区共识 <ArrowRight size={18} /></Link></section>
  </div>;
}
