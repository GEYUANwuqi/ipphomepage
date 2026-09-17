import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server/app.ts';
const dir = mkdtempSync(join(tmpdir(), 'ipp-browser-'));
const { app, db } = createApp({
  dbPath: join(dir, 'test.sqlite'),
  adminPassword: 'browser-test-only-password',
  origin: 'http://localhost:5173',
  disableRateLimit: true
});
const server = app.listen(3001, '0.0.0.0');
function close() {
  server.close(() => {
    db.close();
    rmSync(dir, { recursive: true, force: true });
    process.exit(0);
  });
}
process.on('SIGTERM', close);
process.on('SIGINT', close);
