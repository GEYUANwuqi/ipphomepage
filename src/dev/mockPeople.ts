import type { Person } from '../../shared/content';
/** IPP_DEV_PEOPLE_ONLY: unreachable from a production build. No remote avatar service. */
export function makeMockPeople(): Person[] {
  let seed = 202509;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const colors = ['#c9bde6', '#bcdcc9', '#f3d0b2', '#b9d5ec', '#e3bfd2', '#dcd5af'];
  const names = ['星屿', '青栈', '薄荷', '纸鸢', '拾光', '杏仁', '云序', '柚子', '月台', '小满', '远山', '长名字也有自己的一页'];
  const titles = ['社长（演示）', '前社长（演示）', '项目维护者', '技术分享者', '社区伙伴', '热心支持者'];
  const descriptions = [
    '喜欢把一个小小的想法做成可以运行的作品。正在探索游戏开发与开源协作。',
    '记录折腾过程，也乐于帮后来的人少走一点弯路。代码之外，喜欢散步和观察日常。',
    '在这里收藏有趣的问题，分享自己不太完美但真实的尝试。愿每一个人都能找到适合自己的起点。',
  ];
  return names.map((name, i) => {
    const color = colors[Math.floor(random() * colors.length)];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><metadata>IPP_DEV_PEOPLE_ONLY</metadata><rect width="96" height="96" rx="28" fill="${color}"/><path d="M23 62V25l17 11h16l17-11v37Q48 82 23 62" fill="#fff7ed"/><path d="M36 47v12m-6-6h12m18-6v12m-6-6h12" stroke="#514966" stroke-width="3" stroke-linecap="round"/><path d="m43 65 5 3 5-3" fill="none" stroke="#514966" stroke-width="2"/></svg>`;
    const count = [4, 2, 0, 1, 3, 5][i % 6];
    return {
      id: `dev-person-${String(i + 1).padStart(2, '0')}`, name: `示例 · ${name}`,
      avatar: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      description: i === 11 ? descriptions.join(' ') : descriptions[i % descriptions.length],
      title: titles[i % titles.length], year: 2022 + Math.floor(random() * 5),
      group: i < 8 ? 'core' : 'supporter', featured: i < 4,
      links: Array.from({ length: count }, (_, j) => ({ label: ['GitHub', '个人博客', '作品集', '知识笔记', '更多创作'][j], url: `https://example.com/demo/member-${i + 1}/link-${j + 1}` })),
    };
  });
}
