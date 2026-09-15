import 'dotenv/config';
import { createApp } from './app.ts';
import { loadDevelopmentOrigins } from './origin.ts';
const production = process.env.NODE_ENV === 'production';
const developmentOrigins = loadDevelopmentOrigins(production);
const { app, db } = createApp({ production, developmentOrigins });
if (developmentOrigins.length) console.info('显式开发来源已启用（生产环境忽略）：', developmentOrigins.join(', '));
const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, process.env.HOST ?? '0.0.0.0', () => console.log(`I++ Club API listening on :${port}`));
function shutdown() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
