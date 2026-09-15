import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Fingerprint, Gamepad2, Home as HomeIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { Home } from './pages/Home';
import { Assessment } from './pages/Assessment';
import { Verify } from './pages/Verify';
import { Admin } from './pages/Admin';
import { People } from './pages/People';
import { Projects } from './pages/Projects';
import { Events } from './pages/Events';
import { PeopleProvider } from './content/PeopleProvider';
import { PawMark } from './components/Mascot';
import { ExternalLink } from './ui';
import { ThemeControls } from './theme/ThemeControls';
import { applyPreferences, readPreferences } from './theme/preferences';
import { usePageMotion } from './motion';
import '@fontsource/noto-serif-sc/600.css';
import './styles.css';
import './motion.css';
import './theme/theme.css';
import './community.css';
applyPreferences(readPreferences(), false);
function App() {
  const main = useRef<HTMLElement>(null);
  const location = useLocation();
  usePageMotion(main, location.pathname);
  useEffect(() => { document.title = `${location.pathname.startsWith('/assessment') ? '素质问卷' : location.pathname.startsWith('/verify') ? '证书验真' : location.pathname.startsWith('/admin') ? '社团管理' : location.pathname.startsWith('/people') ? '成员书架' : location.pathname.startsWith('/projects') ? '项目工坊' : location.pathname.startsWith('/events') ? '赛事展台' : '让好奇心，不断加一'} · I++ Club`; }, [location.pathname]);
  return <>
    <a className="skip-link" href="#main">跳到主要内容</a>
    <header className="site-header">
      <Link to="/" className="brand" aria-label="I++ Club 首页"><span className="brand-mark">i<span>++</span></span><span>I++ Club</span></Link>
      <nav className="main-nav" aria-label="主导航"><NavLink to="/" end><HomeIcon size={21} aria-hidden="true" /><span>首页</span></NavLink><NavLink to="/projects"><Gamepad2 size={21} aria-hidden="true" /><span>项目工坊</span></NavLink><NavLink to="/people"><BookOpen size={21} aria-hidden="true" /><span>成员书架</span></NavLink><NavLink to="/assessment"><Fingerprint size={21} aria-hidden="true" /><span>素质问卷</span></NavLink><NavLink to="/verify"><ShieldCheck size={21} aria-hidden="true" /><span>证书验真</span></NavLink></nav>
      <div className="header-actions"><ExternalLink href="https://ippclub.org/" className="header-blog">社团博客</ExternalLink><ThemeControls /></div>
    </header>
    <main id="main" ref={main} tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/people" element={<People />} /><Route path="/projects" element={<Projects />} /><Route path="/events" element={<Events />} /><Route path="/assessment" element={<Assessment />} /><Route path="/assessment/:id" element={<Assessment />} /><Route path="/verify" element={<Verify />} /><Route path="/verify/:id" element={<Verify />} /><Route path="/admin" element={<Admin />} /><Route path="*" element={<section className="page narrow empty"><Sparkles size={40} /><h1>页面不存在</h1><p>这个地址没有对应的页面。</p><Link className="link-button" to="/">返回首页 <ArrowUpRight size={18} /></Link></section>} /></Routes></main>
    <footer className="site-footer"><div><Link className="footer-brand" to="/">I++ Club</Link></div><div className="footer-links"><ExternalLink href="https://github.com/IppClub">GitHub</ExternalLink><ExternalLink href="https://ippclub.org/">博客</ExternalLink><ExternalLink href="https://ippclub.org/blogroll/">Blogroll</ExternalLink><Link to="/people">成员书架</Link><Link to="/events">赛事展台</Link><Link to="/admin">社团管理</Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} I++ Club</span><span>iplusplus.club <PawMark className="footer-paw" /></span></div></footer>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><PeopleProvider><App /></PeopleProvider></BrowserRouter></React.StrictMode>);
