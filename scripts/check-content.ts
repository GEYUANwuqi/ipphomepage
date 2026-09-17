import { validateContent } from './content-validation.ts';
const content = validateContent(process.cwd());
console.log(
  `内容校验通过：${content.people.length} 位成员，${content.projects.length} 个项目，${content.events.length} 场赛事。`
);
