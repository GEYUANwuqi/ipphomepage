import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import type { Plugin } from 'vite';
import { eventsFileSchema, peopleFileSchema, projectsFileSchema } from '../shared/content.ts';

export function validateContent(root: string) {
  const load = (file: string) => {
    try { return JSON.parse(readFileSync(resolve(root, 'src/content', file), 'utf8')); }
    catch (error) { throw new Error(`${file}: 无法读取 JSON：${error instanceof Error ? error.message : error}`); }
  };
  const parse = <T>(file: string, schema: { parse: (input: unknown) => T }): T => {
    try { return schema.parse(load(file)); }
    catch (error) { throw new Error(`${file}: ${error instanceof Error ? error.message : error}`); }
  };
  const people = parse('people.json', peopleFileSchema).people;
  const projects = parse('projects.json', projectsFileSchema).projects;
  const events = parse('events.json', eventsFileSchema).events;
  const publicRoot = realpathSync(resolve(root, 'public'));
  for (const item of [...people, ...projects, ...events]) {
    const image = 'avatar' in item ? item.avatar : item.cover;
    if (!image) continue;
    const candidate = resolve(publicRoot, `.${image}`);
    if (!existsSync(candidate)) throw new Error(`${item.id}: 图片不存在：${image}`);
    const path = realpathSync(candidate), fromRoot = relative(publicRoot, path);
    if (fromRoot.startsWith(`..${sep}`) || fromRoot === '..' || isAbsolute(fromRoot) || !statSync(path).isFile()) {
      throw new Error(`${item.id}: 图片越出 public 目录或不是文件：${image}`);
    }
  }
  return { people, projects, events };
}

export function contentValidationPlugin(): Plugin {
  let root: string;
  return {
    name: 'ipp-content-validation',
    configResolved(config) { root = config.root; },
    buildStart() { validateContent(root); },
    load(id) {
      const key = (['people', 'projects', 'events'] as const).find(key => id === resolve(root, `src/content/${key}.json`));
      // Ship the schema's normalized output, not the unvalidated raw JSON/default omissions.
      if (key) return JSON.stringify({ [key]: validateContent(root)[key] });
    },
    configureServer(server) {
      // Missing-image fixes also invalidate the data module, clearing Vite's error overlay.
      server.watcher.add(resolve(root, 'public/images'));
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(resolve(root, 'public/images') + sep)) return;
        try {
          validateContent(root);
          const contentModule = server.moduleGraph.getModuleById(resolve(root, 'src/content/index.ts'));
          if (contentModule) server.moduleGraph.invalidateModule(contentModule);
          server.ws.send({ type: 'full-reload' });
        } catch (error) { server.ws.send({ type: 'error', err: { message: String(error), stack: '' } }); }
      });
    },
    handleHotUpdate(context) {
      if (context.file.startsWith(resolve(root, 'src/content') + sep) && context.file.endsWith('.json')) validateContent(root);
    },
  };
}
