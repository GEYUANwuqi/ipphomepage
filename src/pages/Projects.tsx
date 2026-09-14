import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, Github, Trophy } from 'lucide-react';
import { projects, projectCategories } from '../content';
import { ProjectCard } from '../components/ProjectCard';
import { ExternalLink } from '../ui';
export function Projects() {
  const [category, setCategory] = useState('all');
  const visible = projects.filter(p => category === 'all' || p.category === category);
  return <div className="page projects-page"><div className="collection-hero"><div><div className="eyebrow muted">BUILT WITH CURIOSITY</div><h1>不只聊想法，<br />也把它做出来。</h1><p>从一门语言、一款引擎，到一个可以探索的游戏世界。<br />这里收录 IppClub 与相关社区的项目，让下一次创作有迹可循。</p></div><div className="project-hero-symbol" aria-hidden="true"><span>{'{'}<b>++</b>{'}'}</span><i>MAKE SOMETHING REAL.</i></div></div>
    <div className="collection-toolbar"><div className="filter-chips" role="group" aria-label="项目分类"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部项目</button>{Object.entries(projectCategories).map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div><ExternalLink className="text-link" href="https://github.com/IppClub"><Github size={17} />官方 GitHub</ExternalLink></div>
    <div key={category} className="project-gallery swap-collection">{visible.map(p => <ProjectCard key={p.id} project={p} featured={p.id === 'dora-ssr' && category === 'all'} />)}</div>{!visible.length && <p className="collection-empty">这一类项目暂未收录。</p>}
    <section className="creation-path" aria-labelledby="creation-title"><div><div className="eyebrow muted">YOUR NEXT FIRST STEP</div><h2 id="creation-title">从想法，到第一款游戏。</h2><p>不必等准备好一切。先让一个小小的场景动起来。</p></div><div className="creation-links"><ExternalLink href="https://dora-ssr.net/docs/tutorial/quick-start"><BookOpen size={20} /><span>01 / 阅读入门文档</span></ExternalLink><ExternalLink href="https://github.com/IppClub/Dora-Example"><Code2 size={20} /><span>02 / 动手修改示例</span></ExternalLink><Link to="/events"><Trophy size={20} /><span>03 / 关注赛事展台</span><ArrowRight size={18} /></Link></div></section>
    <p className="collection-footer-note">项目说明依据官方仓库整理，维护情况与许可细节以各项目仓库为准。示意封面不使用未经确认授权的游戏美术。</p>
  </div>;
}
