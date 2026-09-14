import peopleFile from './people.json';
import projectFile from './projects.json';
import eventFile from './events.json';
import type { ClubEvent, Person, Project } from '../../shared/content';
// Content is validated by Vite in development and before every production build.
export const realPeople = (peopleFile.people as Person[]).map(person => ({ ...person, links: person.links ?? [], featured: person.featured ?? false }));
export const projects = (projectFile.projects as Project[]).map(project => ({ ...project, links: project.links ?? [], featured: project.featured ?? false }));
export const events = (eventFile.events as ClubEvent[]).map(event => ({ ...event, links: event.links ?? [] }));
export const projectCategories = { engine: '游戏引擎', language: '语言工具', framework: '创作框架', game: '游戏作品' };
export const eventStatuses = { upcoming: '即将开始', ongoing: '进行中', completed: '已结束' };
export const eventRoles = { host: '主办', cohost: '联合主办', organizer: '承办', support: '支持' };
