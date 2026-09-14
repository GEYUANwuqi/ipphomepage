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
    <div className="art-caption"><span className="status-dot" /> IDEAS IN PROGRESS</div>
    <div className="art-tile tile-purple"><span>i</span><span className="tile-dot" /><CatSignature className="hero-cat-mark" /></div>
    <div className="art-tile tile-green">+</div><div className="art-tile tile-peach">+</div>
    <div className="art-spark">✳</div><div className="art-code"><Code2 size={29} /><span>Hello, possibilities.</span></div>
    <div className="art-note"><span>好奇心，没有终点。</span><MoveUpRight size={22} /></div>
    <div className="art-dot dot-one" /><div className="art-dot dot-two" /><div className="art-cross">+</div>
  </div>;
}
export function Home() {
  const { people, isDemo } = usePeople();
  const featuredPeople = people.filter(p => p.featured).slice(0, 4);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  return <div className="home page">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> HELLO, WORLD. 我们是 I++ CLUB</div>
        <h1 id="hero-title" aria-label="让好奇心，不断加一。">{['让好奇心，', '不断加一。'].map((line, row) => <span key={line} className="title-line" aria-hidden="true">{[...line].map((letter, i) => <span key={i} className={`title-letter ${letter === '。' ? 'title-period' : ''}`} style={{ '--letter-index': row * 6 + i } as CSSProperties}>{letter}</span>)}</span>)}</h1>
        <p className="hero-description">不止于代码，更关于创造与连接。<br />在这里，分享一次探索，遇见一种可能，<br className="desktop-break" />和一群有趣的人，一起变得更好。</p>
        <div className="hero-actions"><a className="link-button" href="#explore">探索我们的空间 <ArrowRight size={19} /></a><Link className="text-link" to="/assessment">从一份问卷开始 <ArrowUpRight size={18} /></Link></div>
        <div className="hero-footnote"><span className="mini-symbol">✳</span><span>保持开放。保持热爱。保持 <strong>++</strong>。</span></div>
      </div><PlusArt />
    </section>
    <section id="explore" className="explore-section" aria-labelledby="explore-title">
      <div className="section-heading"><div><div className="eyebrow muted">OUR LITTLE UNIVERSE</div><h2 id="explore-title">从这里，连接更多<span className="heading-star">✳</span></h2></div><p>三个入口，无数种可能。</p></div>
      <div className="service-grid">
        <a className="service-card blog-card" href="https://ippclub.org/" target="_blank" rel="noopener noreferrer"><div className="card-top"><span className="service-icon"><BookOpen /></span><span className="card-number">01 / READ</span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration book-art" aria-hidden="true"><div className="book-page"><span /><span /><span /><b>ideas_</b></div><div className="book-back" /><span className="book-star">✳</span></div><h3>社团博客</h3><p>把探索写下来，让灵感有迹可循。<br />技术实践、折腾记录与不设限的想法。</p><div className="card-bottom"><span>去读点有意思的</span><ArrowRight size={20} /></div><span className="sr-only">（新窗口打开）</span></a>
        <a className="service-card blogroll-card" href="https://ippclub.org/blogroll/" target="_blank" rel="noopener noreferrer"><div className="card-top"><span className="service-icon"><Compass /></span><span className="card-number">02 / CONNECT</span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration connection-art" aria-hidden="true"><div className="connect-line" /><span className="bubble bubble-one"><Code2 size={30} /></span><span className="bubble bubble-two">hello!</span><span className="bubble bubble-three">✳</span><span className="bubble bubble-four">↗</span></div><h3>Blogroll · 友邻星球</h3><p>跳出算法推荐，跟随真实的好奇心。<br />去串个门，发现独立而鲜活的声音。</p><div className="card-bottom"><span>遇见我们的朋友</span><ArrowRight size={20} /></div><span className="sr-only">（新窗口打开）</span></a>
        <Link className="service-card quiz-card" to="/assessment"><div className="card-top"><span className="service-icon"><Fingerprint /></span><span className="card-number">03 / GROW</span><ArrowUpRight className="card-arrow" /></div><div className="service-illustration certificate-art" aria-hidden="true"><div className="mini-certificate"><span>I++ CLUB</span><i /><i /><div className="mini-seal"><Check size={25} /></div></div><span className="certificate-spark">✧</span></div><h3>素质问卷</h3><p>从尊重、协作与安全出发。<br />完成随机问卷，了解我们的社区共识。</p><div className="card-bottom"><span>开启一次自我探索</span><ArrowRight size={20} /></div></Link>
      </div>
    </section>
    <section className="home-projects" aria-labelledby="home-projects-title"><div className="section-heading"><div><div className="eyebrow muted">MADE OF IDEAS, BUILT TOGETHER</div><h2 id="home-projects-title">想法不止一面，作品也是。</h2></div><Link className="text-link" to="/projects">进入项目工坊 <ArrowRight size={18} /></Link></div><div className="home-project-grid">{featuredProjects.map((p, i) => <ProjectCard key={p.id} project={p} featured={i === 0} compact />)}</div></section>
    {!!featuredPeople.length && <section className="home-people" aria-labelledby="home-people-title"><div className="section-heading"><div><div className="eyebrow muted">MEET THE PEOPLE BEHIND THE PLUS</div><h2 id="home-people-title">翻开一本，认识一位伙伴。<PawMark /></h2></div><Link className="text-link" to="/people">查看完整书架 <ArrowRight size={18} /></Link></div>{isDemo && <DemoPeopleNotice />}<div className="people-grid featured-people-grid">{featuredPeople.map(p => <PersonBook key={p.id} person={p} />)}</div><p className="home-people-note">还有一路同行的支持者，让每一个 +1 成为可能。<Link to="/people">认识大家 →</Link></p></section>}
    <section className="home-events" aria-labelledby="home-events-title"><span className="event-teaser-icon"><Trophy size={30} /></span><div><div className="eyebrow muted">OUR NEXT CHAPTER</div><h2 id="home-events-title">把创作，带到更大的现场。</h2><p>{events.length ? `赛事展台已收录 ${events.length} 场赛事，记录每一次共同创造。` : '赛事展台已预留，目前暂无已公布赛事。让未来的开源创作，有一个相聚的地方。'}</p></div><Link className="link-button" to="/events">查看赛事展台 <ArrowRight size={18} /></Link></section>
    <section className="home-values" aria-labelledby="home-values-title"><HeartHandshake size={25} /><div><h2 id="home-values-title">好奇是起点，尊重是默契。</h2><p>无需无所不知，只需愿意探索、乐于分享，也尊重彼此的边界。</p></div><Link className="text-link" to="/assessment">了解社区共识 <ArrowRight size={18} /></Link></section>
  </div>;
}
