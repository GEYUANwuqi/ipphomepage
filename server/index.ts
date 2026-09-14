import 'dotenv/config';
import { createApp } from './app.ts';
const { app, db } = createApp();
const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, process.env.HOST ?? '0.0.0.0', () => console.log(`I++ Club API listening on :${port}`));
function shutdown() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
