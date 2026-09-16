import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, HeartHandshake, Megaphone, MessagesSquare, Scale } from 'lucide-react';
import { PawMark } from '../components/Mascot';
// The consensus notice is fixed editorial copy, not content-managed data.
const steps = [
  { order: '第一次', action: '民主提醒' },
  { order: '第二次', action: '通讯频道临时管制' },
  { order: '第三次', action: '强制接受民主再教育' },
  { order: '情节严重', action: '永久调离超级 ipp 社区' },
];
export function Consensus() {
  return <div className="page narrow consensus-page">
    <div className="breadcrumb"><Link to="/">首页</Link><ChevronRight size={16} />社区共识</div>
    <header className="consensus-hero">
      <p className="eyebrow muted"><Megaphone size={15} aria-hidden="true" />SUPER IPP 通讯</p>
      <h1>关于进一步规范交流语言风尚、<br />捍卫文明交流秩序的通知</h1>
      <p className="consensus-issuer">群管理部 · 真理部 · 民主交流秩序联合委员会</p>
    </header>
    <article className="consensus-body">
      <p className="consensus-salutation">各位 ipp 公民、管理员以及临时获得发言许可的人员：</p>
      <p className="consensus-lead">近期，群内时常出现过度压抑、引人不适的不符合超级 ipp 社区精神的现象。经群管理部、真理部及民主交流秩序联合委员会研究决定，即日起请全体成员遵守以下规范：</p>
      <section className="consensus-article" aria-labelledby="consensus-article-one">
        <span className="consensus-mark"><MessagesSquare size={22} /></span>
        <div>
          <h2 id="consensus-article-one">坚持文明交流，三思压抑用语</h2>
          <p>本群并不强制要求讨论学术与技术问题，轻松交流是 ipp 的核心追求。但请牢记：你可以随意质疑管理员的技术品味，但是轻松交流的氛围绝不是恶俗言论的借口。每一位公民都需要为自己的每一句话带来的后果负责。</p>
        </div>
      </section>
      <section className="consensus-article" aria-labelledby="consensus-article-two">
        <span className="consensus-mark"><Scale size={22} /></span>
        <div>
          <h2 id="consensus-article-two">鼓励友善交流，宣扬平等风尚</h2>
          <p>超级 ipp 中，每一位公民在维护交流风气上都肩负着同等重量的责任。发表对于聊天氛围的感受、提出对不良氛围的质疑有利于超级 ipp 社区向胜利、民主、自由迸发。即使是管理员违规，超级 ipp 公民也有义务弹劾管理员，维护超级 ipp 社区的文明有序。</p>
        </div>
      </section>
      <p>加入本群即视为赞同并承诺遵守超级 ipp 社区的社区精神，并愿意承担违反规则所带来的一切后果。对于违反超级 ipp 交流群语言风尚的人员，将视情况采取：</p>
      <ol className="consensus-steps">{steps.map(step => <li key={step.order}><span>{step.order}</span><strong>{step.action}</strong></li>)}</ol>
      <p className="consensus-note"><HeartHandshake size={19} aria-hidden="true" />管理不是抑制民主交流。管理是为了让每一位超级 ipp 公民都能更加自由、更加有序、更加民主的发言。</p>
      <p className="consensus-slogan">为了自由！为了民主！为了超级 ipp！<PawMark /></p>
    </article>
    <div className="consensus-footer"><p>问卷会随机抽取共识相关题目，答完即可获得社区素质证书。</p><Link className="link-button" to="/assessment">去做素质问卷 <ArrowRight size={18} /></Link></div>
  </div>;
}
